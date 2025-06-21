#!/usr/bin/env python
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.contrib.auth.models import User

# Set password for admin user
u = User.objects.get(username='admin')
u.set_password('admin')
u.save()
print('Password set successfully for admin user') 