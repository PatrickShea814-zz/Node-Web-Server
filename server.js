// ============================= Require Express Node Module =============================
// Requiring Express
const express = require('express');
// Requiring Handlebars
const hbs = require('hbs');
// Require File System So We Can Print Timestamps (or whatever we want) To A File.
const fs = require('fs');

// ============================= Create an Instance of Express App =============================
var app = express();

// ============================= MIDDLEWARE - 3rd Party Add On =============================
// Takes Directory You Want To Use To Handle All Partial Files.
hbs.registerPartials(__dirname + '/views/partials');

// Tells Express what View Engine We Want To Use.
app.set('view engine', 'hbs');

// "Express works like this but I want to tweak it a bit to work more like this."
// app.use is how you Register Middleware. Chain to Express as argument.


// Next (optional) exists to tell Express when your Middelware Function is done.
// If doing something Asynchronous, Middleware will not move on, until we call Next to let the app continue.
// If we do not Call Next, then our Handlers for Each Request Will NEVER FIRE.
app.use((request, response, next) => {

    // Creates a Formatted Date.
    var now = new Date().toString();

    // Timestamp, HTTP Method (req.method = GET), Path (URL)
    var log = `${now}:${request.method} ${request.url}`;
    console.log(log);

    // Adds To Existing File - Args("file name", content to add + new line). \n is RegEx for New Line.
    fs.appendFile('server.log', log + '\n', (err) => {

        // Node V7 > Required Callback Function for Error Arg --> If Error Print To Screen.
        if (err) {
            console.log('Unable to append to server.log');
        }
    })
    next();
})

// The Next() Up Middleware After  ^^ And Will Never Move On To Below To Our HTTP Route Handlers
app.use((request, response) => {
    response.render('maintenance.hbs', {
        pageTitle: 'Pardon Our Dust. :(',
        welcomeMessage: 'Site Under Maintenance. We Will Be Right Back!'
    })
});

// __dirname takes absolute path of your file dynamically for static pages.
app.use(express.static(__dirname + '/public'));

// ============================= Handlebars Helpers =============================
// Register Functions To Run To Dynamically Create Some Output
// Two Arguments: Name of Helper, Function To Run
hbs.registerHelper('getCurrentYear', () => {
    return new Date().getFullYear();
});

hbs.registerHelper('screamIt', (text) => {
    return text.toUpperCase();
});

// ============================= Setup HTTP Route Handlers =============================
// HTTP GET Request
// Two Arguments: URL, Function To Run - what to send back during the request.
// Request Stores Info About Request Made. Headers, Body, etc.
app.get('/', (request, response) => {

    // Response for HTTP Request as Body Data.
    // response.send('<h1>Hello Express!</h1>'); // Able to pass HTML in directly.
    // Sending JSON - Express notices it is an object, and converts to JSON and sends to browser.
    // response.send({
    //     name: 'Patrick',
    //     likes: ["dogs", 
    //         "cats", 
    //         "football"
    //     ]
    // })
    response.render('home.hbs', {
        pageTitle: 'Home Page',
        welcomeMessage: 'Welcome to my Node Web Server using Express & Handlebars.'
    })
});

// Setting Up Additional Routes
app.get('/about', (request, response) => {

    // Lets You Render Templates Setup With Current View Engine
    // Second Argument Object --> Injecting Data To Template
    response.render('about.hbs', {
        pageTitle: 'About Page'
    });
});

// Request Fails - Send Back JSON with errorMessage Property.
app.get('/bad', (request, response) => {
    response.send({
        errorMessage: 'Bad Request: Unable to Handle Request.'
    });
});

// ============================= Express App needs a 'Send or Listen' =============================
// Binds Application to a Port on our machine
// Can take a second argument that is optional. Function to do something when the server is up.
app.listen(3000, () => {
    console.log('Server is up on Port 3000.');
});