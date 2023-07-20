from rest_framework import routers
from . import views
from django.urls import include, path
from .views import RecognizeView

router = routers.DefaultRouter()
router.register(r'picture', views.PicViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('api-auth/', include('rest_framework.urls', namespace='rest_framework')),
    path('recognize/', RecognizeView.as_view()),
]