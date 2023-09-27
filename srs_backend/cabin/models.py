from django.db import models
import uuid
from location.models import Locations
# Create your models here.


class Cabin (models.Model):
    id = models.UUIDField(primary_key=True, auto_created=True,
                          editable=False, default=uuid.uuid4)
    location_id = models.ForeignKey(
        Locations, on_delete=models.CASCADE, null=False)
    name = models.CharField(max_length=50, null=False)
    code = models.CharField(max_length=50, null=False)

    def __str__(self) -> str:
        return self.name
