# JZTwallet

### JZTwallet info
This is a rest api programmed using nodejs.
JZTwallet uses nodemailer in order to send email (i.e email verification mail, transaction success and failure email).
JZTwallet uses bcryptjs to save encrypted password in the mongodb database.

### JZTwallet api routes

*/auth/register/ -> to register non Admin user
*/admin/register/ -> to register Admin user
*/auth/login/ -> to login any user

*/transfer/ -> to transfer funds accross users

*/transfer/all -> only for admin users (shows all the transaction details)

*/transfer/all/user@email.com -> allows admin users and user@email.com to view all transaction that includes that email address

## Prerequisites
~ You need to have nodejs installed in your machine. 
You will need to setup mongodb and postman if you wish to use JZTwallet api as intended

## How To Use
~ Fire up your default terminal and type the following commands.
```
git clone https://github.com/jeet-patel313/Nodejstask-JZTwallet.git
```
```
cd Nodejstask-JZTwallet
```
```
npm install 
```
```
create a .env and insert DB_CONNECT, TOKEN_SECRET, GMAIL_USER and GMAIL_PASS
```
```
npm start
```
