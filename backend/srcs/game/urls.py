from django.urls import path
from .views import GameView
from .views import HomeGameView

urlpatterns = [
    path('home_game', HomeGameView.home_page, name="home_game"),
    path('game', GameView.GameDetails, name="game"),
]
