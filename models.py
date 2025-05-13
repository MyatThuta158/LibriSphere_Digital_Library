# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey and OneToOneField has `on_delete` set to the desired behavior
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from django.db import models


class Admins(models.Model):
    id = models.BigAutoField(primary_key=True)
    name = models.CharField(db_column='Name', max_length=255)  # Field name made lowercase.
    email = models.CharField(db_column='Email', max_length=255)  # Field name made lowercase.
    password = models.CharField(db_column='Password', max_length=255)  # Field name made lowercase.
    role = models.CharField(max_length=255)
    gender = models.CharField(db_column='Gender', max_length=255)  # Field name made lowercase.
    phonenumber = models.CharField(db_column='PhoneNumber', max_length=255)  # Field name made lowercase.
    profilepicture = models.CharField(db_column='ProfilePicture', max_length=255, blank=True, null=True)  # Field name made lowercase.
    created_at = models.DateTimeField(blank=True, null=True)
    updated_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'admins'


class Announcements(models.Model):
    id = models.BigAutoField(primary_key=True)
    title = models.CharField(max_length=255)
    description = models.TextField()
    admin = models.ForeignKey(Admins, models.DO_NOTHING)
    created_at = models.DateTimeField(blank=True, null=True)
    updated_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'announcements'


class Authors(models.Model):
    id = models.BigAutoField(primary_key=True)
    name = models.CharField(max_length=255)

    class Meta:
        managed = False
        db_table = 'authors'


class Cache(models.Model):
    key = models.CharField(primary_key=True, max_length=255)
    value = models.TextField()
    expiration = models.IntegerField()

    class Meta:
        managed = False
        db_table = 'cache'


class CacheLocks(models.Model):
    key = models.CharField(primary_key=True, max_length=255)
    owner = models.CharField(max_length=255)
    expiration = models.IntegerField()

    class Meta:
        managed = False
        db_table = 'cache_locks'


class Discussions(models.Model):
    id = models.BigAutoField(primary_key=True)
    userid = models.ForeignKey('Users', models.DO_NOTHING, db_column='UserId')  # Field name made lowercase.
    forumpostid = models.ForeignKey('ForumPosts', models.DO_NOTHING, db_column='ForumPostId')  # Field name made lowercase.
    content = models.TextField(db_column='Content')  # Field name made lowercase.
    notistatus = models.CharField(db_column='NotiStatus', max_length=255)  # Field name made lowercase.
    created_at = models.DateTimeField(blank=True, null=True)
    updated_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'discussions'


class ElectronicResources(models.Model):
    id = models.BigAutoField(primary_key=True)
    code = models.CharField(max_length=255)
    name = models.CharField(max_length=255)
    publish_date = models.CharField(max_length=255)
    resource_typeid = models.ForeignKey('ResourceFileTypes', models.DO_NOTHING, db_column='resource_typeId')  # Field name made lowercase.
    isbn = models.CharField(db_column='ISBN', max_length=255, blank=True, null=True)  # Field name made lowercase.
    cover_photo = models.TextField()
    file = models.TextField()
    description = models.TextField(db_column='Description')  # Field name made lowercase.
    memberviewcount = models.IntegerField(db_column='MemberViewCount')  # Field name made lowercase.
    author = models.ForeignKey(Authors, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'electronic_resources'


class FailedJobs(models.Model):
    id = models.BigAutoField(primary_key=True)
    uuid = models.CharField(unique=True, max_length=255)
    connection = models.TextField()
    queue = models.TextField()
    payload = models.TextField()
    exception = models.TextField()
    failed_at = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'failed_jobs'


class ForumPosts(models.Model):
    forumpostid = models.AutoField(db_column='ForumPostId', primary_key=True)  # Field name made lowercase.
    userid = models.IntegerField(db_column='UserId')  # Field name made lowercase.
    title = models.CharField(db_column='Title', max_length=255)  # Field name made lowercase.
    description = models.TextField(db_column='Description')  # Field name made lowercase.
    photo1 = models.CharField(db_column='Photo1', max_length=255, blank=True, null=True)  # Field name made lowercase.
    photo2 = models.CharField(db_column='Photo2', max_length=255, blank=True, null=True)  # Field name made lowercase.
    photo3 = models.CharField(db_column='Photo3', max_length=255, blank=True, null=True)  # Field name made lowercase.
    postviews = models.IntegerField(db_column='PostViews')  # Field name made lowercase.
    created_at = models.DateTimeField(blank=True, null=True)
    updated_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'forum_posts'


class GenreResources(models.Model):
    id = models.BigAutoField(primary_key=True)
    resources_id = models.BigIntegerField()
    genre = models.ForeignKey('Genres', models.DO_NOTHING)
    created_at = models.DateTimeField(blank=True, null=True)
    updated_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'genre_resources'


class Genres(models.Model):
    id = models.BigAutoField(primary_key=True)
    name = models.CharField(max_length=255)

    class Meta:
        managed = False
        db_table = 'genres'


class JobBatches(models.Model):
    id = models.CharField(primary_key=True, max_length=255)
    name = models.CharField(max_length=255)
    total_jobs = models.IntegerField()
    pending_jobs = models.IntegerField()
    failed_jobs = models.IntegerField()
    failed_job_ids = models.TextField()
    options = models.TextField(blank=True, null=True)
    cancelled_at = models.IntegerField(blank=True, null=True)
    created_at = models.IntegerField()
    finished_at = models.IntegerField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'job_batches'


class Jobs(models.Model):
    id = models.BigAutoField(primary_key=True)
    queue = models.CharField(max_length=255)
    payload = models.TextField()
    attempts = models.SmallIntegerField()
    reserved_at = models.IntegerField(blank=True, null=True)
    available_at = models.IntegerField()
    created_at = models.IntegerField()

    class Meta:
        managed = False
        db_table = 'jobs'


class MembershipPlans(models.Model):
    id = models.BigAutoField(primary_key=True)
    planname = models.CharField(db_column='PlanName', max_length=255)  # Field name made lowercase.
    duration = models.IntegerField(db_column='Duration')  # Field name made lowercase.
    price = models.DecimalField(db_column='Price', max_digits=8, decimal_places=2)  # Field name made lowercase.
    description = models.TextField(db_column='Description')  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'membership_plans'


class Migrations(models.Model):
    migration = models.CharField(max_length=255)
    batch = models.IntegerField()

    class Meta:
        managed = False
        db_table = 'migrations'


class ModelHasPermissions(models.Model):
    permission = models.OneToOneField('Permissions', models.DO_NOTHING, primary_key=True)  # The composite primary key (permission_id, model_id, model_type) found, that is not supported. The first column is selected.
    model_type = models.CharField(max_length=255)
    model_id = models.BigIntegerField()

    class Meta:
        managed = False
        db_table = 'model_has_permissions'
        unique_together = (('permission', 'model_id', 'model_type'),)


class ModelHasRoles(models.Model):
    role = models.OneToOneField('Roles', models.DO_NOTHING, primary_key=True)  # The composite primary key (role_id, model_id, model_type) found, that is not supported. The first column is selected.
    model_type = models.CharField(max_length=255)
    model_id = models.BigIntegerField()

    class Meta:
        managed = False
        db_table = 'model_has_roles'
        unique_together = (('role', 'model_id', 'model_type'),)


class Notifications(models.Model):
    id = models.UUIDField(primary_key=True)
    type = models.CharField(max_length=255)
    notifiable_type = models.CharField(max_length=255)
    notifiable_id = models.BigIntegerField()
    data = models.TextField()
    read_at = models.DateTimeField(blank=True, null=True)
    created_at = models.DateTimeField(blank=True, null=True)
    updated_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'notifications'


class PasswordResetTokens(models.Model):
    email = models.CharField(primary_key=True, max_length=255)
    token = models.CharField(max_length=255)
    created_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'password_reset_tokens'


class PaymentTypes(models.Model):
    id = models.BigAutoField(primary_key=True)
    paymenttypename = models.CharField(db_column='PaymentTypeName', max_length=255)  # Field name made lowercase.
    accountname = models.CharField(db_column='AccountName', max_length=255)  # Field name made lowercase.
    accountnumber = models.CharField(db_column='AccountNumber', max_length=255)  # Field name made lowercase.
    bankname = models.CharField(db_column='BankName', max_length=255)  # Field name made lowercase.
    banklogo = models.TextField(db_column='BankLogo')  # Field name made lowercase.
    qr_scan = models.TextField(db_column='QR_Scan')  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'payment_types'


class Permissions(models.Model):
    id = models.BigAutoField(primary_key=True)
    name = models.CharField(max_length=255)
    guard_name = models.CharField(max_length=255)
    created_at = models.DateTimeField(blank=True, null=True)
    updated_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'permissions'
        unique_together = (('name', 'guard_name'),)


class PersonalAccessTokens(models.Model):
    id = models.BigAutoField(primary_key=True)
    tokenable_type = models.CharField(max_length=255)
    tokenable_id = models.BigIntegerField()
    name = models.CharField(max_length=255)
    token = models.CharField(unique=True, max_length=64)
    abilities = models.TextField(blank=True, null=True)
    last_used_at = models.DateTimeField(blank=True, null=True)
    expires_at = models.DateTimeField(blank=True, null=True)
    created_at = models.DateTimeField(blank=True, null=True)
    updated_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'personal_access_tokens'


class RequestResources(models.Model):
    id = models.BigAutoField(primary_key=True)
    user_id = models.BigIntegerField()
    title = models.CharField(db_column='Title', max_length=255)  # Field name made lowercase.
    isbn = models.CharField(db_column='ISBN', max_length=255, blank=True, null=True)  # Field name made lowercase.
    author = models.CharField(db_column='Author', max_length=255, blank=True, null=True)  # Field name made lowercase.
    language = models.CharField(db_column='Language', max_length=255)  # Field name made lowercase.
    publishyear = models.CharField(db_column='PublishYear', max_length=255, blank=True, null=True)  # Field name made lowercase.
    resource_photo = models.TextField(db_column='Resource_Photo', blank=True, null=True)  # Field name made lowercase.
    admin_comment = models.TextField(db_column='Admin_Comment', blank=True, null=True)  # Field name made lowercase.
    notificationstatus = models.CharField(db_column='NotificationStatus', max_length=255)  # Field name made lowercase.
    created_at = models.DateTimeField(blank=True, null=True)
    updated_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'request_resources'


class ResourceFileTypes(models.Model):
    id = models.BigAutoField(primary_key=True)
    typename = models.CharField(db_column='TypeName', max_length=255)  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'resource_file_types'


class Reviews(models.Model):
    id = models.BigAutoField(primary_key=True)
    resource_id = models.BigIntegerField()
    user_id = models.BigIntegerField()
    reviewstar = models.IntegerField(db_column='ReviewStar')  # Field name made lowercase.
    reviewmessage = models.CharField(db_column='ReviewMessage', max_length=255)  # Field name made lowercase.
    created_at = models.DateTimeField(blank=True, null=True)
    updated_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'reviews'


class RoleHasPermissions(models.Model):
    permission = models.OneToOneField(Permissions, models.DO_NOTHING, primary_key=True)  # The composite primary key (permission_id, role_id) found, that is not supported. The first column is selected.
    role = models.ForeignKey('Roles', models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'role_has_permissions'
        unique_together = (('permission', 'role'),)


class Roles(models.Model):
    id = models.BigAutoField(primary_key=True)
    name = models.CharField(max_length=255)
    guard_name = models.CharField(max_length=255)
    created_at = models.DateTimeField(blank=True, null=True)
    updated_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'roles'
        unique_together = (('name', 'guard_name'),)


class Sessions(models.Model):
    id = models.CharField(primary_key=True, max_length=255)
    user_id = models.BigIntegerField(blank=True, null=True)
    ip_address = models.CharField(max_length=45, blank=True, null=True)
    user_agent = models.TextField(blank=True, null=True)
    payload = models.TextField()
    last_activity = models.IntegerField()

    class Meta:
        managed = False
        db_table = 'sessions'


class SubscriptionNotifications(models.Model):
    id = models.BigAutoField(primary_key=True)
    subscriptionid = models.BigIntegerField(db_column='SubscriptionId')  # Field name made lowercase.
    description = models.CharField(db_column='Description', max_length=255)  # Field name made lowercase.
    watchstatus = models.CharField(db_column='WatchStatus', max_length=255)  # Field name made lowercase.
    created_at = models.DateTimeField(blank=True, null=True)
    updated_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'subscription_notifications'


class Subscriptions(models.Model):
    id = models.BigAutoField(primary_key=True)
    admin = models.ForeignKey(Admins, models.DO_NOTHING, blank=True, null=True)
    membership_plans = models.ForeignKey(MembershipPlans, models.DO_NOTHING)
    payment_types = models.ForeignKey(PaymentTypes, models.DO_NOTHING)
    users = models.ForeignKey('Users', models.DO_NOTHING)
    paymentscreenshot = models.TextField(db_column='PaymentScreenShot')  # Field name made lowercase.
    paymentaccountname = models.CharField(db_column='PaymentAccountName', max_length=255)  # Field name made lowercase.
    paymentaccountnumber = models.CharField(db_column='PaymentAccountNumber', max_length=255)  # Field name made lowercase.
    paymentdate = models.CharField(db_column='PaymentDate', max_length=255)  # Field name made lowercase.
    memberstartdate = models.CharField(db_column='MemberstartDate', max_length=255)  # Field name made lowercase.
    memberenddate = models.CharField(db_column='MemberEndDate', max_length=255)  # Field name made lowercase.
    paymentstatus = models.CharField(db_column='PaymentStatus', max_length=255)  # Field name made lowercase.
    adminapproveddate = models.DateField(db_column='AdminApprovedDate')  # Field name made lowercase.
    subscriptionstatus = models.CharField(db_column='SubscriptionStatus', max_length=255)  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'subscriptions'


class UserPredictionInformation(models.Model):
    id = models.BigAutoField(primary_key=True)
    accuracy = models.CharField(db_column='Accuracy', max_length=255)  # Field name made lowercase.
    predicteddate = models.DateField(db_column='PredictedDate')  # Field name made lowercase.
    number_7daysreport = models.CharField(db_column='7DaysReport', max_length=255)  # Field name made lowercase. Field renamed because it wasn't a valid Python identifier.
    number_14daysreport = models.CharField(db_column='14DaysReport', max_length=255)  # Field name made lowercase. Field renamed because it wasn't a valid Python identifier.
    number_28daysreport = models.CharField(db_column='28DaysReport', max_length=255)  # Field name made lowercase. Field renamed because it wasn't a valid Python identifier.
    adminid = models.ForeignKey(Admins, models.DO_NOTHING, db_column='AdminId')  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'user_prediction_information'


class Users(models.Model):
    id = models.BigAutoField(primary_key=True)
    name = models.CharField(max_length=255)
    email = models.CharField(unique=True, max_length=255)
    phone_number = models.CharField(max_length=255)
    email_verified_at = models.DateTimeField(blank=True, null=True)
    password = models.CharField(max_length=255)
    dateofbirth = models.CharField(db_column='DateOfBirth', max_length=255)  # Field name made lowercase.
    role = models.CharField(max_length=255)
    gender = models.CharField(max_length=255)
    profilepic = models.TextField(db_column='ProfilePic', blank=True, null=True)  # Field name made lowercase.
    remember_token = models.CharField(max_length=100, blank=True, null=True)
    created_at = models.DateField()
    updated_at = models.DateField()

    class Meta:
        managed = False
        db_table = 'users'


class VoteTypes(models.Model):
    id = models.BigAutoField(primary_key=True)
    votetype = models.TextField(db_column='VoteType')  # Field name made lowercase.
    created_at = models.DateTimeField(blank=True, null=True)
    updated_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'vote_types'


class Votes(models.Model):
    id = models.BigAutoField(primary_key=True)
    user_id = models.BigIntegerField()
    forumpostid = models.ForeignKey(ForumPosts, models.DO_NOTHING, db_column='ForumPostId')  # Field name made lowercase.
    vote_type = models.ForeignKey(VoteTypes, models.DO_NOTHING)
    created_at = models.DateTimeField(blank=True, null=True)
    updated_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'votes'
        unique_together = (('user_id', 'forumpostid'),)
