
from rest_framework import serializers
from .models import Articulo

class ArticuloSerializer(serializers.ModelSerializer):
	usuario_creador = serializers.CharField(source='usuario_creador.username', read_only=True)
	usuario_modificador = serializers.CharField(source='usuario_modificador.username', read_only=True)

	class Meta:
		model = Articulo
		fields = ['id', 'codigo', 'descripcion', 'precio', 'fecha_creacion', 'fecha_modificacion', 'usuario_creador', 'usuario_modificador']

	def validate_codigo(self, value):
		if not value:
			raise serializers.ValidationError('El campo código es obligatorio.')
	# Validar duplicados
		if self.instance:
			if value != self.instance.codigo and Articulo.objects.filter(codigo=value).exists():
				raise serializers.ValidationError('El código ya existe.')
		else:
			if Articulo.objects.filter(codigo=value).exists():
				raise serializers.ValidationError('El código ya existe.')
		return value

	def validate_descripcion(self, value):
		if not value:
			raise serializers.ValidationError('La descripción es obligatoria.')
		return value

	def validate_precio(self, value):
		if value is None:
			raise serializers.ValidationError('El precio es obligatorio.')
		try:
			float(value)
		except Exception:
			raise serializers.ValidationError('El precio debe ser un número.')
		if float(value) < 0:
			raise serializers.ValidationError('El precio debe ser positivo.')
		return value
