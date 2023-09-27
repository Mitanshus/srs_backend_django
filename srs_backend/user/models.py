import uuid
from django.db import models

from srs_backend import company, location

class Role(models.Model):
    id=models.UUIDField(default=uuid.uuid4,primary_key=True,auto_created=True)
    name=models.CharField(max_length=50)
# Create your models here.
class User(models.Model):
    id=models.UUIDField(primary_key=True,auto_created=True,editable=False,default=uuid.uuid4)
    first_name=models.CharField(null=False)
    last_name=models.CharField(null=False)
    email=models.EmailField(null=False,unique=True,max_length=254)
    password=models.CharField(null=False)
    primary_location=models.ForeignKey(to=location.models,on_delete=models.CASCADE)
    is_activated=models.BooleanField(default=False)
    min_days=models.IntegerField(null=True)
    max_days=models.IntegerField(null=True)
    role_id=models.ForeignKey(to=Role,on_delete=models.CASCADE)
    company_id=models.ForeignKey(to=company.models,on_delete=models.CASCADE)
    added_by=models.ForeignKey(to=Role,on_delete=models.CASCADE)
    is_forgot_password=models.BooleanField(default=False,null=True)
