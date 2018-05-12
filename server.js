const express = require('express');
const hbs = require('hbs');
const fs = require('fs');
const port = process.env.PORT || 3000;
var app = express();

hbs.registerPartials(__dirname + '/views/partials');
// app.set('view engine') tells express what view engine we'd like to
// use and we're going to pass in inside of quotes 'hbs'
app.set('view engine', 'hbs');



// app.use is how register middleware and it takes a function here
// next exists so you can tell express that when your middleware
// function is done and this is useful b/c you can have as much middleware
// as you like register to a single express app.
// middleware is not going to move on (asynchronously) only when we call next
// will the application continue to run.
// this means if your middleware doesn't come next your handlers for each request
// they'll never going to fire
app.use((req, res, next) => {
  // create logger that's going to log out all of the requests that come into the server
  // also going to story time stamp so  we can see the extactly when someone made a request for
  // a specific URL
  var now = new Date().toString();
  var log = `${now}: ${req.method} ${req.url}`;
  console.log(log);
  fs.appendFile('server.log',log + '\n',(err) => {
    if(err){
      console.log('Unable to append to server.log.')
    }
  });
  next();

});
/*
  If you called the help that's in the public folder you'll see the help html
  instead of the maintence page.
  That is b/c middleware is executed in the order you call app use which means the first thing
  we do is we set up our express static directory then we set up our logger then we set up
  our maintence.hbs logger,

  This is a pretty big problem, if we also want to make the public directory files like help
  .html private we're going to have reorder our calls to app.use b/c currently the Express server
  is responding inside of the Express static middleware so our maintence middleware doesn't get a chance
  to execute
*/
// app.use((req, res, next) => {
//   res.render('maintence.hbs');
// });

//__dirname restores the filepath to the name directory.
app.use(express.static(__dirname + '/public'));

hbs.registerHelper('getCurrentYear', () =>{
   return new Date().getFullYear();
});

hbs.registerHelper('screamIt', (text) => {
  return text.toUpperCase();
});


// HTTP route handlers
// register a handler
// url ('/') and the function with request and respond
// request : stores information about the request coming in
// things like the header that were used, any body information the method
// that was made with the request to the path all of that is stored in.
// in request
// response: has a bunch of methods available, so you can respond to the HTTP
// request in whatever way you like. Customize what data you send back
// you could set your age to status codes,
// a partial is a piece of your website that can be reuse again and again.

app.get('/', (req, res) => {
  // respond to the request being sent.
  // get the Hello Express as the data
  //  res.send('<h1>Hello Express!</h1>');
      // res.send({
      //   name: 'Tim',
      //   likes: [
      //     'Drawing',
      //     'Swimming'
      //   ]
      // });

      res.render('home.hbs', {
        pageTitle: 'Home Page',
        welcomeMessage: 'Welcome to my website',
      })
});

// take a user to a different page on the website
app.get('/about', (req, res) => {
    //res.send('About Page');
    // render will render any templates called
    res.render('about.hbs',  {
      pageTitle: 'About Page',
    });
});

// create route at /bad
// - send back json with errorMessage
app.get('/bad', (req, res) => {
  res.send({
    errorMessage: 'Unable to handle request'
  });
});

// listen to port 3000
app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});

/*
    Handlebar helpers are going to be ways for you to register functions
    to run dynamically create some output.

    A partial inserted into code like this is nothing more than a function
    you can run from inside of your handlebars templates.
    All you need to do is register it.

    When you first use something inside of curly braces inside of a hbs file
    that clearly isn't a partial, handlebars is first going to look for a helper
    with that name.

    If there is no helper it will look for a piece of data with that getCurrentYearName

*/
