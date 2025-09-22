

from rest_framework import viewsets, status, generics
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework.views import APIView
from .models import Articulo, Usuario
from .serializers import ArticuloSerializer

class ArticuloViewSet(viewsets.ModelViewSet):
	queryset = Articulo.objects.all()
	serializer_class = ArticuloSerializer


## Login
@api_view(['POST'])
def login_view(request):
	username = request.data.get('username')
	password = request.data.get('password')
	try:
		user = Usuario.objects.get(username=username, password=password)
		return Response({
			'success': True,
			'role': 'admin' if user.is_admin else 'user'
		})
	except Usuario.DoesNotExist:
		return Response({'success': False, 'error': 'Usuario o contraseña incorrectos'}, status=400)

class ArticuloListCreateView(generics.ListCreateAPIView):
	queryset = Articulo.objects.all()
	serializer_class = ArticuloSerializer

class ArticuloRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
	queryset = Articulo.objects.all()
	serializer_class = ArticuloSerializer

## Eliminación masiva
class ArticuloBulkDeleteView(APIView):
	def post(self, request):
		codigos = request.data.get('codigos', [])
		if not isinstance(codigos, list):
			return Response({'error': 'codigos debe ser una lista'}, status=status.HTTP_400_BAD_REQUEST)
		failed = []
		for codigo in codigos:
			try:
				articulo = Articulo.objects.get(codigo=codigo)
				articulo.delete()
			except Articulo.DoesNotExist:
				failed.append(codigo)
		if failed:
			return Response({'error': 'Algunos artículos no se pudieron eliminar', 'codigos': failed}, status=status.HTTP_400_BAD_REQUEST)
		return Response({'success': True})

## Edición masiva
class ArticuloBulkUpdateView(APIView):
	def post(self, request):
		updates = request.data.get('updates', [])
		if not isinstance(updates, list):
			return Response({'error': 'updates debe ser una lista'}, status=status.HTTP_400_BAD_REQUEST)
		failed = []
		for upd in updates:
			codigo = upd.get('codigo')
			try:
				articulo = Articulo.objects.get(codigo=codigo)
				serializer = ArticuloSerializer(articulo, data=upd, partial=True)
				if serializer.is_valid():
					serializer.save()
				else:
					failed.append({'codigo': codigo, 'errors': serializer.errors})
			except Articulo.DoesNotExist:
				failed.append({'codigo': codigo, 'errors': 'No existe'})
		if failed:
			return Response({'error': 'Algunos artículos no se pudieron actualizar', 'detalles': failed}, status=status.HTTP_400_BAD_REQUEST)
		return Response({'success': True})
