from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.shortcuts import render
from django.urls import reverse
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt
from django.core.paginator import Paginator
import json

from .models import User, Post, Follow, Like


def index(request):

    return render(request, "network/index.html")


def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "network/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "network/login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "network/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "network/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "network/register.html")
    
@login_required
def new_post(request):
    if request.method == "POST":
        body = request.POST["body"]
        author = request.user
        new_post = Post(user=author, body=body)
        new_post.save()
        return HttpResponseRedirect(reverse(index))
    
@csrf_exempt
@login_required
def edit_post(request, id):
    if request.method == "PUT":
        post = Post.objects.get(pk=id, user=request.user)
        data = json.loads(request.body)
        post.body = data.get('content')
        post.save()
        return JsonResponse("Successfully edited the post", safe=False)

        
    

def all_posts(request, page):
    if request.method == 'GET':
        try:
            all_posts = Post.objects.all()
            all_posts = all_posts.order_by("-timestamp").all()

            paginator = Paginator(all_posts, 10)
            all_posts = paginator.get_page(page)
            total_pages = paginator.num_pages
            all_posts = [post.serialize() for post in all_posts]
        except:
            all_posts = []
            

        return JsonResponse({
            "allPosts": all_posts,
            "totalPages": total_pages
            }, safe=False)

def get_user(request, username, page):
    if request.method == 'GET':
        if username != "currentUser":
            user = User.objects.get(username=username)
            try:
                all_posts = Post.objects.filter(user=user)
                all_posts = all_posts.order_by("-timestamp").all()

                paginator = Paginator(all_posts, 10)
                all_posts = paginator.get_page(page)
                total_pages = paginator.num_pages
                all_posts = [post.serialize() for post in all_posts]
            except:
                all_posts = []

            followers = Follow.objects.filter(following=user)
            following = Follow.objects.filter(follower=user)

            if request.user == user:
                # Check if both users are same, if so set same_user to True
                same_user = True
                user_following = False

            else:
                # else set same_user to False
                same_user = False

                try:
                    # check if the requested by user is already following the requested user
                    Follow.objects.get(follower=request.user, following=user)
                    user_following = True

                except:
                    user_following = False

            return JsonResponse({
                'username': user.username,
                'all_posts': all_posts,
                'totalPages': total_pages,
                'followers': len(followers),
                'following': len(following),
                'same_user': same_user,
                'user_following': user_following
                }, safe=False)
        else:
            return JsonResponse(str(request.user), safe=False)
        
def get_post(request, post_id):
    if request.method == 'GET':
        post = Post.objects.get(pk=int(post_id))
        like_count = len(Like.objects.filter(post=post))

        try:
            Like.objects.get(post=post, user=request.user)
            already_liked = True
        except:
            already_liked = False
        return JsonResponse({
            "post_id": int(post.id),
            "like_count": like_count,
            "already_liked": already_liked
            }, safe=False)
    

@csrf_exempt 
def follow_user(request, username):
    
    following = username
    following = User.objects.get(username=following)
    follower = request.user
    follower = User.objects.get(username=follower)
    
    try: 
        follow_model = Follow.objects.get(follower=follower, following=following)
        follow_model.delete()
    except:
        follow_model  = Follow(follower=follower, following=following)
        follow_model.save()

    return HttpResponseRedirect(reverse(index))
    
@login_required
def get_follower_posts(request, page):
    try:
        following_users = Follow.objects.filter(follower=request.user)
        all_posts = Post.objects.all().order_by('-timestamp').all()
        new_all_posts = []
        for post in all_posts:
            for user in following_users:
                if post.user == user.following:
                    new_all_posts.append(post)


        all_posts = new_all_posts

        paginator = Paginator(all_posts, 10)
        all_posts = paginator.get_page(page)
        
        all_posts = [post.serialize() for post in all_posts]
        
        
        total_pages = paginator.num_pages

    except:
        all_posts = []

    
    return JsonResponse({
        "allPosts": all_posts,
        "totalPages": int(total_pages)
        }, safe=False)


def current_user(request):
    if request.method == 'GET':
        return JsonResponse(request.user, safe=False)


@csrf_exempt
def like_post(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        post_id = data.get('post_id')
        user = request.user
        user = User.objects.get(username=user)
        post = Post.objects.get(pk=int(post_id))
        like_count = len(Like.objects.filter(post=post))

        try:
            existing_like = Like.objects.get(user=user, post=post)
            existing_like.delete()
            return JsonResponse({
                "message": "Successfully unliked the post",
                "like_count": like_count - 1
                }, safe=False)
        except:
            new_like = Like(user=user, post=post)
            new_like.save()
            return JsonResponse({
                "message": "Successfully liked the post",
                "like_count": like_count + 1
                }, safe=False)

        
    
