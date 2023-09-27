from django.db import models
import uuid
from cabin.models import Cabin
# Create your models here.


class Seat(models.Model):
    id = models.UUIDField(primary_key=True, editable=False,
                          auto_created=True, default=uuid.uuid4)
    status = models.enums()
    cabin_id = models.ForeignKey(Cabin, on_delete=models.CASCADE, null=False)
    code = models.CharField(max_length=50, null=False)

    def __str__(self) -> str:
        return self.code
