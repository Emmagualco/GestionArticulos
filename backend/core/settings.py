DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'articulosdb',
        'USER': 'user',
        'PASSWORD': 'password',
        'HOST': 'db',  # nombre del servicio en docker-compose
        'PORT': '3306',
    }
}