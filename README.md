# comp424-auth
Authentication system built for computer science class. The stack is nodejs, react, mongodb and express. The app is designed to allow the user to register and login in order to access the company private file.

Features:
* Account Registration
* Account Email Verification
* Google Recaptcha For Login/Registration Forms
* Login User
* File Redirecting
* Forgot Password
* Reset Password Email
* JWT Tokens
* Refresh Tokens
* Admin/User Roles
* Admin User CRUD Operations
* Gravatar used for profile pictures

Security Features:
* xss-clean used to protect against xss attacks
* express-mongo-sanatize used for database attacks
* Local storage used for anti CSRF
* dotenv used for hiding keys

Deployment:
* Digital ocean ubuntu server
* openSSH included
* iptables for firewall security
* suricata for intrusion detection system (IDS)
* NGINX used as a web server with proxy
* PM2 used as a process manager to run server and client using cuncurrently

Screenshots:
<img width="1433" alt="Screen Shot 2022-05-04 at 5 35 45 PM" src="https://user-images.githubusercontent.com/47337592/166848342-55cfa37b-fef8-40cb-b680-2eeef8291718.png">
<img width="1432" alt="Screen Shot 2022-05-04 at 5 35 58 PM" src="https://user-images.githubusercontent.com/47337592/166848355-c91eb4e9-eef2-497f-9346-9949c41c01f6.png">
<img width="1413" alt="Screen Shot 2022-05-04 at 5 36 15 PM" src="https://user-images.githubusercontent.com/47337592/166848384-1a4ed8f5-ef13-402b-990a-703722a37d80.png">
<img width="1386" alt="Screen Shot 2022-05-04 at 5 37 13 PM" src="https://user-images.githubusercontent.com/47337592/166848445-55325615-110c-462b-87be-8667f54f49ac.png">

