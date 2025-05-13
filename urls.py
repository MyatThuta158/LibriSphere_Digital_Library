from django.urls import path
from .views import predict_new_members, predict_membership_subscriptions
urlpatterns=[
    # path('users',get_all_users,name='get_all_users'),
    path('predict/users', predict_new_members, name='predict_new_members'),
      path('predict/subscriber', predict_membership_subscriptions, name='predict_membership_subscriptions'),
]