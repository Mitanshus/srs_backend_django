import uuid
from django.db import models
from company.models import Company

class Locations(models.Model):
    id=models.UUIDField(primary_key=True,auto_created=True,null=False,default=uuid.uuid4)
    name=models.CharField(max_length=50)
    code=models.CharField(max_length=50)
    company_id=models.ForeignKey(to=Company,on_delete=models.CASCADE)
    min_days=models.IntegerField(null=True)
    max_days=models.IntegerField(null=True)
    max_pre_booking_time=models.IntegerField(null=True)
    max_duration=models.IntegerField(null=True),
    is_schedule_restricted=models.BooleanField(null=True,)
    def serialize(self):
        return {
            'id': str(self.id),
            'name': self.name,
            'code': self.code,
            'company_id': self.company_id.name,
            'min_days': str(self.min_days),
            'max_days':str(self.max_days),
            'max_pre_booking_time':str(self.max_pre_booking_time),
            'max_duration':str(self.max_duration)  ,
            'is_schedule_restricted':str(self.is_schedule_restricted)          
        }
