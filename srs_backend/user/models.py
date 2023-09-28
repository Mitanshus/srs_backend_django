import uuid
from django.db import models
from django.contrib.auth.models import AbstractUser

from company.models import Company 
from location.models import Locations

class Role(models.Model):
    id=models.UUIDField(default=uuid.uuid4,primary_key=True,auto_created=True)
    name=models.CharField(max_length=50)
# Create your models here.
class User(AbstractUser):
    id=models.UUIDField(primary_key=True,auto_created=True,editable=False,default=uuid.uuid4)
    first_name=models.CharField(null=False,max_length=54)
    last_name=models.CharField(null=False,max_length=54)
    email=models.EmailField(null=False,unique=True,max_length=54)
    
    primary_location=models.ForeignKey(to=Locations,on_delete=models.CASCADE)
    is_activated=models.BooleanField(default=False,)
    min_days=models.IntegerField(null=True,)
    max_days=models.IntegerField(null=True,)
    role_id=models.ForeignKey(Role,related_name='rolesId',on_delete=models.CASCADE)
    company_id=models.ForeignKey(to=Company,on_delete=models.CASCADE)
    added_by=models.ForeignKey(Role,related_name='addedBy',on_delete=models.CASCADE)
    is_forgot_password=models.BooleanField(default=False,null=True)
    username=None
    USERNAME_FIELD='email'
    REQUIRED_FIELDS=[]
    # objects=UserManager();
