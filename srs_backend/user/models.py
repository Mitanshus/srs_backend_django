import uuid
from django.db import models

# Create your models here.
class User(models.Model):
    id:models.UUIDField(primary_key=True,auto_created=True,editable=False,default=uuid.uuid4)
    first_name:models.CharField(null=False)
    last_name:models.CharField(null=False)
    email:models.EmailField(null=False,unique=True,max_length=254)
    password:models.CharField(null=False)
    primary_location:models.
