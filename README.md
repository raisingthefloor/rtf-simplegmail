# SimpleGmail

All the APIs are developed in nodejs & frontend in vuejs

### Prerequisites

* Please open the following ports 
  ```
  4000 port for frontend
  4080 port for web server 
  ```
  
* if you want to setup the SSL we recommand to use this URL and follow for nginx 
  * https://tecadmin.net/how-to-setup-lets-encrypt-on-ubuntu-20-04/
  

### Domain Setup

- To configure any domain you have to setup the Nginx Reverse Proxy on your Ubuntu system, you can follow this artical for more detail 

  https://www.hostinger.in/tutorials/how-to-set-up-nginx-reverse-proxy/

  Make sure you set the port `4000` so that your configuared domain open the URL on that specific port 

### Environment Variables 

-  Following variables you need to change as per your requirements in ```docker-compose.yml```
  - ```GOOGLE_CREDENTIALS``` //A JSON used to authenticate with google for signin process (Check Google sign in setup section)
  - ```JWT_SECRET``` //Secret used to verify JWT Token
  - ```DB_NAME``` //Mongodb database name
  - ```FRONT_URL``` //You need to change it with the your origin domain

### Google sign in setup on consolve

- You also have to setup the google credentials, please follow the below setups and generate the JSON file and replece ith with ```GOOGLE_CREDENTIALS```
https://developers.google.com/workspace/guides/create-credentials


### Installation

1. Clone the repo
   ```sh
   git clone git@github.com:raisingthefloor/rtf-simplegmail.git
   ```

2. Switch to main branch
   ```sh
   git checkout main
   ```

3. Build docker image from source using the composer command
   ```sh
   docker-compose build --no-cache
   ```

4. Run the docker image
    ```sh
     docker-compose up -d
