# Generated by Django 5.0.7 on 2024-07-28 19:49

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Video',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('file', models.FileField(upload_to='videos/')),
                ('uploaded_at', models.DateTimeField(auto_now_add=True)),
                ('processed', models.BooleanField(default=False)),
                ('task_id', models.CharField(blank=True, max_length=255, null=True)),
            ],
        ),
    ]
