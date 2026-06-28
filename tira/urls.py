from django.contrib.staticfiles.urls import staticfiles_urlpatterns
from django.urls import path, include

urlpatterns = [
    path('', include('main.urls')),
]

urlpatterns += staticfiles_urlpatterns()
