const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');

// Configure Express to use EJS
app.set('view engine', 'ejs'); 
app.set('views', path.join(__dirname, 'views'));

// Use bodyParser middleware to parse request bodies
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => {
  res.send('Welcome to the homepage');
});

// For a user profile page
app.get('/profile', (req, res) => {
  const userData = {
      username: 'Alicia Smith',
      email: 'aliciasmith@gmail.com',
      bio: 'Im a 22-year-old gamer whos been exploring virtual worlds since I can remember. When Im not in front of my screen, youll find me cooking.',
      gamingInterests: 'Im a Console & PC gamer whos into a wide range of games. My favorites include Overwatch, but Im always up for a good challenge or an epic adventure.',
  };
  res.render('profile', userData);
});

// For a forum post
app.get('/posts/:postID', (req, res) => {
  const postID = req.params.postID;
  res.render('post', { postID });
});

app.post('/submit-post', (req, res) => {
  //TODO

});

// Route for the login page
app.get('/login', (req, res) => {
  res.render('login');
});

// Route for handling the login form submission (POST request)
app.post('/login', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
});

// Define a route for displaying the sign-up form (GET request)
app.get('/signup', (req, res) => {
  res.render('signup'); 
});

// Define a route for handling the sign-up form submission (POST request)
app.post('/signup', (req, res) => {
  const username = req.body.username;
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body['confirm-password'];
});


// Start the server
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
