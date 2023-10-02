
from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("new_post", views.new_post, name="new_post"),
    path("edit_post/<int:id>", views.edit_post, name="edit_post"),
    path("all_posts/<int:page>", views.all_posts, name="all_posts"),
    path("get_user/<str:username>/<int:page>", views.get_user, name="get_user"),
    path("get_post/<int:post_id>", views.get_post, name="get_post"),
    path("follow_user/<str:username>", views.follow_user, name="follow_user"),
    path("get_follower_posts/<int:page>", views.get_follower_posts, name="get_follower_posts"),
    path("like_post", views.like_post, name="like_post"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register")
]
