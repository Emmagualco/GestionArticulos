
from django.db import models

class Usuario(models.Model):
	username = models.CharField(max_length=50, unique=True)
	password = models.CharField(max_length=128)
	is_admin = models.BooleanField(default=False)

	def __str__(self):
		return self.username

class Articulo(models.Model):
	codigo = models.CharField(max_length=50, unique=True)
	descripcion = models.CharField(max_length=255)
	precio = models.DecimalField(max_digits=10, decimal_places=2)
	fecha_creacion = models.DateTimeField(auto_now_add=True)
	fecha_modificacion = models.DateTimeField(auto_now=True)
	usuario_creador = models.ForeignKey(Usuario, related_name='articulos_creados', null=True, blank=True, on_delete=models.SET_NULL)
	usuario_modificador = models.ForeignKey(Usuario, related_name='articulos_modificados', null=True, blank=True, on_delete=models.SET_NULL)

	def __str__(self):
		return f"{self.codigo} - {self.descripcion}"
