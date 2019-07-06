# FaceFeka #

***THIS README IS IMPORTANT IN ORDER FOR THE PROJECT TO WORK, AS SOME OF THE CONFIGURATIONS IN THE PROJECT ARE SECRET AND HAS BEEN DELETED BY ME***

In order to use the program in your localhost, please do:

1. `npm install` in order to install all Node.js dependencies
2. In the game directory, use `php install` in order to install all composer required files

3. You'll notice that the project is using mongoDB, cloudinary and JWT. The file Config.json is defining some attribute and secrets in order to use those modules.
Due to the face that those are secrets, i've removed them from the file as they contain personal information.

4. In order to use mongoDB you should first download mongoDB to your localhost. It is also extremely recommended that you download Robo 3T which is a GUI program for mongoDB.
You have two options to run mongoDB:
	1. First one is to use your local mongoDB that you’ve just downloaded. 
	  In order to do so, you need to adjust your package.json file: 
	  in the start script, you should change the NODE_ENV to development instead of production.
	  ```
	  "script" {
	  	"start": "npm run build && export NODE_ENV=development || SET \"NODE_ENV=development\" && node website/server/server.js"
	  }
	  ```
	2. Second one is to use mongoDB cloud. 
		1. In order to do so, please register to mongoDB cloud in https://cloud.mongodb.com. 
		2. After your register to the cloud, you should define a user name and a password to be used in the cluster.
		3. When you have defined a user, you need to adjust some things in the code.
	  		1. In the mongodb cloud cluster cockpit, select the ‘connect’ button and then ‘connect your application'.
			It should provide you with a url to use to connect to the cloud cluster.
			2. Put your username and password in the relevant places and copy the link.
			3. In Config.json file, under ‘production’, paste the link to the MONGODB_URI attribute.
			```
			"production" : {
				"MONGODB_URI": "mongodb+srv://<user-name>:<password>@<cluster>.mongodb.net/test?retryWrites=true&w=majority",
			}
			```
	  		4. In package.json file, in your start script, change ‘development’ to ‘production’ in all places,
			if production is not already set.
			
			 ```
	  		"script" {
	  			"start": "npm run build && export NODE_ENV=production || SET \"NODE_ENV=production\" && node website/server/server.js"
	  		}
	  		```
			
5. In order to use cloudinary, please register to the cloudinary website at https://cloudinary.com/.
   After the registration completes, you should be provided with three secrets: cloud name, api_key and api_secret. 
   All three should be inserted in the relevant places in Config.json file, for example:
   ```
     "production": {
    		"MONGODB_URI": "mongodb+srv://<user-name>:<password>@<cluster>.mongodb.net/test?retryWrites=true&w=majority",
    		"JWT_SECRET": "12u412un4cu21m4212x",
    		"CLOUD_NAME": "<cloud name>",
    		"API_KEY": "<api key>",
    		"API_SECRET": "<api secret>"
  	}
   ```
5. The JWT_SECRET attribute in Config.json is a scrambled random string that can be changed, to your likes.
6. Navigate to FaceFeka folder and start the server by running npm start. This will start webpack, build your project and run it on port 3000.
7. In the FaceFeka/game/server folder, run php server.php in order to run the php server for the game. 
   The game will be hosted on port 4000, tho the access to the game is via the facefeka interface on localhost:3000
8. Navigate to localhost:3000/facefeka in order to get to the login page.

***ALL THE ABOVE STEPS ARE A MUST IN ORDER FOR THE PROJECT TO WORK PROPERLY WITH THE DATABASE AND THE CLOUD.***

Thanks for the understanding,
if you encounter any problem during installation, please contact me at rubykozel@gmail.com, i'd be happy to help.




