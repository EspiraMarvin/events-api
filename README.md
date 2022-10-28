## EXPRESS BACKEND

### TIPS USED while doing this project

1. JSON WEB TOKEN & SECURITY

- Issues Access Token and Refresh Token

- Access token = short time to expire

- Refresh token = long time to expire

- Client stores access token in memory and NOT in local storage or cookies

  > (If you can store tokens with javascript (in localstorage and cookies) a hacker can also retrieve it with javascript)

- The REST API are issued with a `httpOnly cookie`

  > this cookie cannot be accessed with javascript

- Refresh token should have an expiration, which then require a user to login again

- Refresh tokens should not have the ability to issue new refresh tokens because that will grant indefinite access. - they should also be able to expire

- Acess token is issued after user authentication

- New token is issued at Refresh request

2.  To generate random access and refresh tokens with node for our env access token

    > > > >

        open terminal
        type node, hit enter
        type require('crypto').randomBytes(64).toString('hex')

        ----------------------
        output something like below
        21e47046cc77b371fa56b4d840ebdsfsdfskdfl2bfa1de67e9cae6ff77d1d084cf1efed3c2c0d5a1a93ceadd7e6d76da527027f9278a794e166487e306afe527a7f4

    > > > >


###### Migrate scraped data into mongocloud

> mongoimport --uri mongodb+srv://<username>:<password>@cluster0.7tbkbvy.mongodb.net/<dbname> --collection <collection> --type json --file <filename.json> --jsonArray