# DevTinder APIs

## authRouter
- POST /signUp
- POST /login
- POST /logout

## profileRouter
- GET /profile/view
- PATCH /profile/edit
- PATCH /profile/password

## connectionRequestRouter
- POST /request/send/interested/:userId
- POST /request/send/ignore/:userId
- POST /request/review/accepted/:userId
- POST /request/review/rejected/:userId

## userRouter
- GET /user/connections
- GET /user/feed  -> Gets profiles of others user in feed
- GET /user/requests