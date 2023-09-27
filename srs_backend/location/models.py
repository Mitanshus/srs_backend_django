import uuid
from django.db import models
from company.models import Company

class Locations(models.Model):
    id=models.UUIDField(primary_key=True,auto_created=True,null=False,default=uuid.uuid4)
    name=models.CharField(max_length=50)
    code=models.CharField(max_length=50)
    company_id=models.ForeignKey(to=Company,on_delete=models.CASCADE)
    min_days=models.IntegerField(null=False)
    max_days=models.IntegerField(null=False)
    max_pre_booking_time=models.IntegerField(null=False)
    max_duration=models.IntegerField(null=False)
