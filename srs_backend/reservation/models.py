from django.db import models
import uuid
from user.models import User
from seat.models import Seat
# Create your models here.


class Reservation (models.Model):
    id = models.UUIDField(primary_key=True, auto_created=True,
                          editable=False, default=uuid.uuid4)
    user_id = models.ForeignKey(User, on_delete=models.CASCADE, null=False)
    seat_id = models.ForeignKey(Seat, on_delete=models.CASCADE, null=False)
    reservation_start_date = models.DateField(null=False)
    reservation_end_date = models.DateField(null=False)
    status = models.enums()
    approval_status = models.enums()
