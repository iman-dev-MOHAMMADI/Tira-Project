from django.shortcuts import render
from django.conf import settings
import os


def get_portfolio_images():
    portfolio_dir = os.path.join(settings.STATICFILES_DIRS[0], 'images', 'portfolio')
    images = []
    if os.path.exists(portfolio_dir):
        for f in sorted(os.listdir(portfolio_dir)):
            if f.lower().endswith(('.png', '.jpg', '.jpeg', '.gif', '.webp')):
                images.append(f'images/portfolio/{f}')
    return images


def index(request):
    return render(request, 'pages/home.html')


def portfolio(request):
    images = get_portfolio_images()
    return render(request, 'pages/portfolio.html', {'portfolio_images': images})


def videos(request):
    return render(request, 'pages/videos.html')


def about(request):
    return render(request, 'pages/about.html')


def contact(request):
    return render(request, 'pages/contact.html')
