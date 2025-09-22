from django.core.management.base import BaseCommand
from articulos.models import Usuario

class Command(BaseCommand):
    help = 'Crea usuarios admin y user por defecto si no existen.'

    def handle(self, *args, **options):
        if not Usuario.objects.filter(username='admin').exists():
            Usuario.objects.create(username='admin', password='admin', is_admin=True)
            self.stdout.write(self.style.SUCCESS('Usuario admin creado'))
        else:
            self.stdout.write('Usuario admin ya existe')
        if not Usuario.objects.filter(username='user').exists():
            Usuario.objects.create(username='user', password='user', is_admin=False)
            self.stdout.write(self.style.SUCCESS('Usuario user creado'))
        else:
            self.stdout.write('Usuario user ya existe')
