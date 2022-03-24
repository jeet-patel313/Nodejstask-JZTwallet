## JZTwallet is a node api programmed in nodejs
JZTwallet uses nodemailer in order to send email (i.e email verification mail, transaction success and failure email)
JZTwallet uses bcryptjs to save encrypted password in the mongodb database

### JZTwallet api routes

/auth/register/ -> to register non Admin user
/admin/register/ -> to register Admin user
/auth/login/ -> to login any user

/transfer/ -> to transfer funds accross users

/transfer/all -> only for admin users (shows all the transaction details)

/transfer/all/user@email.com -> allows admin users and user@email.com to view all transaction that includes that email address
