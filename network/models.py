from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    pass


class Post(models.Model):
    user = models.ForeignKey("User", on_delete=models.CASCADE, related_name="author")
    body = models.TextField(blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    likes = models.ManyToManyField(User, related_name="likes", blank=True)

    def __str__(self):
        return f"#{self.id} Post has been posted by {self.user} at {self.timestamp.strftime('%b %d %Y, %I:%M %p')}"
    
    def serialize(self):
        # returning json data of the individual post
        return {
            "id": self.id,
            "user": self.user.username,
            "body": self.body,
            "timestamp": self.timestamp.strftime('%b %d %Y, %I:%M %p'),
        }
    
class Follow(models.Model):
    follower = models.ForeignKey("User", on_delete=models.CASCADE, related_name="follower")
    following = models.ForeignKey("User", on_delete=models.CASCADE, related_name="following")

class Like(models.Model):
    post = models.ForeignKey("Post", on_delete=models.CASCADE, related_name="liked_post")
    user = models.ForeignKey("User", on_delete=models.CASCADE, related_name="liked_user")
     