
Hi Everyone!

I will assume you have no dependencies installed.

First, you will need to have Node.JS installed.  Node.js allows provides packages and modules we can use in a Javascript environment.

Go to https://nodejs.org/en/ to download Node.js

When installing Node.js, make sure you also install the npm package manager - this is an option when installing Node.js. 
Npm manages all dependencies for a web application making it easier to scale the application.

Although npm would be proficient for this application, I chose to use a package mananger developed by Facebook: Yarn.  

Yarn provides the same funcitonality as npm, but yarn is quickly becoming the industry standard because of its compatibility
with React.js, and yarn's registry is quickly outpacing npm's.  

To install Yarn open up a terminal application such as GitBash or just the windows command prompt and run the command:

npm install -g yarnpkg

Yarn should now be installed on your computer globally.

Open your terminal application to the project directory by using the command 'cd [project directory]'

Using the command 'yarn start' in the terminal application should update or install all the applicationsdependencies locally.  Your local browser should then automatically open to 'localhost:3000' running the application.  If your browser does not open automatically, simply enter 'localhost:3000' in the url bar. 


Troubleshooting:
If any errors occur while using the command 'yarn start', the erros may be caused by dependency issues.  
To add a dependency use the command 'yarn add [dependency]'


__________
THE REPORT
__________

1.  Describe the different tools and design decisions you made to build your app. Why did you pick those tools?

To develop the application, I decided to use the React.js framework for the application's architecture.  React.js is a Javascript library that was developed by Facebook and released in 2013. React has quickly become to industry standard for developing user interfaces for web applications
due to its flexibility, and its ability to construct applications by constructing components.  React components can be quickly built with JSX, 
similar to HTML, and Javascript logic, and then be resused throughout the application.  Although not utilized in this application, The framework was designed for components to be easily testable with frameworks like Mocha.js.

To style the applcation I decided to use Bootstrap.  Bootstrap speeds up the development process by providing classes developers can use to style their HTML or JSX. For example, the nav-bar at the top of the application did not require much css styling while developing because Bootstrap came with the styling.

I used the yarn package manager for package management. As mentioned previously in the README file, yarn makes it easy to quickly add a dependency to the application.  Yarn also preemptively installs and updates all dependencies that depend on your desired package to avoid errors. For example, I used yarn to add the router package I used to route between the homepage and the portfolio; Yarn will keep the router package updated so it does not deprecate. Yarn also makes it easy to set up a local development server to run the application.  By using the command "yarn start" in the directory, the application is served on localhost:3000 and updates after changing the code. 


2.  How would you deploy your app to production? What tools would you use? 

Before starting the application's deployment, I would use a testing framework like Mocha.js to verify all the application's outputs.  Yarn can be used to bundle a build directory.  The package manager bundles the project into a directory that can be hosted on a web server.  Although I have no professional experience deploying applications, most developers use Amazon Web Services, AWS, to host their servers due to the quantity and quality of their services.  To host the application, I would open a container on an AWS account, configure the container, and then drop the build directory into the container to host.     

3.  Suppose instead of updating every 10 seconds, the requirements were that the prices and balances needed to be updated in real-time, i.e., as the prices change on the exchanges. How would you accomplish this? What happens if you had a portfolio of 1000 currencies? What changes would you have to make?

The application in its current state calls a GET request to the cryptocompare api every 10 seconds.  If the application were to be converted to using the real-time data, the applicaiton would either need to make more frequent GET requests, or the application will need to utilize the API's streamer functionality.  By subscribing to the desired coins and connecting to the API's socket.io, the API sets itself up in a way that it will push the application real-time data.  Although cryptocompare does not provide a lot of documentation about how to use its socket.io options, Socket.io is a javascript library that lets clients and servers communicate back and forth. The application can make use of the functionality by only receiving real-time data from currencies that have changed from the previous update.

 In the applications current state, the large amount of data received from the API may reduce performance because each currency is not its own component, but React.js actually provides tools to not have performance dip when dealing with large amounts of data. To utilize these tools, I would divide each currency into its own resuable component that would have to keep track of its own data as states.  The react framework only updates states of a component when the application will not dip in performance.  By implementing each currency as its own component, performance will not decrease no matter how many currencies that application will need to update.

4.  Suppose that instead of using CryptoCompare you had your own awesome data API that had authentication on top of it (assume token authentication). You need your app to protect your portfolio tracker to only allow authenticated users. How would you manage on the front-end to not show the tracker to unauthenticated users?

If the API had authentication on top of it, non-authenticated users will not be able to retrieve data from the API.  Additionally, the application can use a service like Auth0 that uses token authentication to verify users access to different routes.  Auth0 allows the developer set pre-defined roles to users, such as Administrator or General user, that can be used to give certain users particular rights. This front-end authentication can stop users from ever getting to the application's tracker.   


I hope you guys enjoy the app!






