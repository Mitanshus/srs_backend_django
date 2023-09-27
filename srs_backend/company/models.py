from django.db import models
import uuid
# Create your models here.


class Company (models.Model):
    id = models.UUIDField(primary_key=True, editable=False,
                          auto_created=True, default=uuid.uuid4)
    name = models.CharField(max_length=50, null=False)
    code = models.CharField(max_length=50, null=False)

    def __str__(self) -> str:
        return self.name
