
from django.urls import path
from .views import (
    ArticuloListCreateView,
    ArticuloRetrieveUpdateDestroyView,
    ArticuloBulkDeleteView,
    ArticuloBulkUpdateView,
    login_view,
    usuario_update_view
)

urlpatterns = [
    path('', ArticuloListCreateView.as_view(), name='articulo-list-create'),
    path('<int:pk>/', ArticuloRetrieveUpdateDestroyView.as_view(), name='articulo-detail'),
    path('bulk-delete/', ArticuloBulkDeleteView.as_view(), name='articulo-bulk-delete'),
    path('bulk-update/', ArticuloBulkUpdateView.as_view(), name='articulo-bulk-update'),
    path('login/', login_view, name='login'),
    path('usuario/', usuario_update_view, name='usuario-update'),
]