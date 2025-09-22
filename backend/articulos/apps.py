from django.apps import AppConfig

class ArticulosConfig(AppConfig):
    name = 'articulos'

    def ready(self):
        from .models import Usuario
        try:
            if not Usuario.objects.filter(username='admin').exists():
                Usuario.objects.create(username='admin', password='admin', is_admin=True)
        except Exception:
            pass
