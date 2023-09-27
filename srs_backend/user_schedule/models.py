from django.db import models
import uuid
from user.models import User
from company.models import Company
# Create your models here.


class UserSchedule(models.Model):
    id = models.UUIDField(primary_key=True, editable=False,
                          auto_created=True, default=uuid.uuid4)
    user_id = models.ForeignKey(User, on_delete=models.CASCADE, null=False)
    company_id = models.ForeignKey(
        Company, on_delete=models.CASCADE, null=False)
    monday = models.BooleanField(default=False)
    tuesday = models.BooleanField(default=False)
    wednesday = models.BooleanField(default=False)
    thursday = models.BooleanField(default=False)
    friday = models.BooleanField(default=False)
    saturday = models.BooleanField(default=False)
    sunday = models.BooleanField(default=False)

    def __str__(self) -> str:
        return self.user_id.first_name + self.user_id.last_name
