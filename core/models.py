from django.db import models

class Project(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    tech_stack = models.CharField(max_length=200, blank=True)
    image = models.ImageField(upload_to='projects/') 
    github_url = models.URLField(blank=True)
    live_url = models.URLField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    tech_stack = models.CharField(max_length=200)

    def __str__(self):
        return self.title
    
    @property
    def tech_list(self):
        return [tech.strip() for tech in self.tech_stack.split(',')]