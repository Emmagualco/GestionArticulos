from django.core.management.base import BaseCommand
from articulos.models import Articulo, Usuario

class Command(BaseCommand):
    help = 'Asigna un usuario existente como creador y modificador a todos los artículos que no lo tengan.'

    def add_arguments(self, parser):
        parser.add_argument('username', type=str, help='Nombre de usuario a asignar')

    def handle(self, *args, **options):
        username = options['username']
        try:
            usuario = Usuario.objects.get(username=username)
        except Usuario.DoesNotExist:
            self.stdout.write(self.style.ERROR(f'Usuario "{username}" no existe.'))
            return
        articulos = Articulo.objects.filter(usuario_creador__isnull=True) | Articulo.objects.filter(usuario_modificador__isnull=True)
        count = 0
        for articulo in articulos:
            if articulo.usuario_creador is None:
                articulo.usuario_creador = usuario
            if articulo.usuario_modificador is None:
                articulo.usuario_modificador = usuario
            articulo.save()
            count += 1
        self.stdout.write(self.style.SUCCESS(f'Se asignó el usuario "{username}" a {count} artículos.'))
