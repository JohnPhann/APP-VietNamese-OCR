from django.db import models

# Create your models here.
class Picture(models.Model):
   pic = models.ImageField(upload_to='uploads/%Y/%m')
   class Meta:
        db_table = 'picture'