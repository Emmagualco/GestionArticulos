from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Articulo
from .serializers import ArticuloSerializer
import pandas as pd
from io import BytesIO
from django.http import HttpResponse

class ArticuloViewSet(viewsets.ModelViewSet):
    queryset = Articulo.objects.all()
    serializer_class = ArticuloSerializer

    @action(detail=False, methods=['post'])
    def import_excel(self, request):
        """
        Espera un archivo Excel (form-data con 'file') o un JSON con los datos.
        """
        if 'file' in request.FILES:
            excel_file = request.FILES['file']
            df = pd.read_excel(excel_file)
        else:
            # Si viene desde el frontend como JSON
            df = pd.DataFrame(request.data.get('data', []))
        for _, row in df.iterrows():
            Articulo.objects.update_or_create(
                codigo=row['codigo'],
                defaults={
                    'descripcion': row['descripcion'],
                    'precio': row['precio'],
                }
            )
        return Response({"status": "importado"}, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=['get'])
    def export_excel(self, request):
        qs = Articulo.objects.all()
        data = ArticuloSerializer(qs, many=True).data
        df = pd.DataFrame(data)
        output = BytesIO()
        with pd.ExcelWriter(output, engine='openpyxl') as writer:
            df.to_excel(writer, index=False, sheet_name='Articulos')
        response = HttpResponse(
            output.getvalue(),
            content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        )
        response['Content-Disposition'] = 'attachment; filename=articulos.xlsx'
        return response