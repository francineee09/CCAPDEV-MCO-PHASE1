const mongoose = require('mongoose');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const User = require('./server/schema/User');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const Post = require('./server/schema/Post');
const multer = require('multer');
const Message = require('./server/schema/Messages');
const Comment = require('./server/schema/Comments');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const Profile = require('./server/schema/profile');
app.use(
    session({
      secret: process.env.SESSION_SECRET || 'fallback-secret-key',
        resave: false,
        saveUninitialized: true,
        store: MongoStore.create({ 
            mongoUrl: 'mongodb+srv://blabdue:iawynikd@blabdue.m4zqcqu.mongodb.net/test2',
        }),
        cookie: { maxAge: 1000 * 60 * 60 * 24 }, // Session cookie will expire after one day
    })
);


app.use(express.static(path.join(__dirname)));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
      console.log('Uploading file:', file.originalname);
      cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      const filename = file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname);
      console.log('Saving as:', filename);
      cb(null, filename)
  }
});


const upload = multer({ storage: storage });

app.use('/uploads', express.static('uploads'));

const fs = require('fs');

const dir = './uploads';
if (!fs.existsSync(dir)){
    fs.mkdirSync(dir, { recursive: true });
    console.log('Created directory:', dir);
}


app.use(cors());
// Configure Express to use EJS
app.set('view engine', 'ejs'); 
app.set('views', path.join(__dirname, 'views'));

app.use(express.json()); // to parse application/json
app.use(bodyParser.urlencoded({ extended: false })); // to parse application/x-www-form-urlencoded


app.get('/', (req, res) => {
  res.send('Welcome to the homepage');
});

// For a user profile page
app.get('/profile', async (req, res) => {
  let userData; // Define userData variable outside the try block

    try {
        // user ID stored in the session
        const userId = req.session.user.id;

        // Query the database for the user's profile based on the user ID
        const userProfile = await Profile.findOne({ user: userId });

        if (userProfile) {
            // Set default values if profile picture or bio is null
            if (!userProfile.profilePictureURL) {
                userProfile.profilePictureURL = 'styles/images/puripost.png';
            }

            if (!userProfile.bio) {
                userProfile.bio = "I'm too lazy to put a bio.";
            }

            // If the profile is found, set the user data
            userData = {
                username: userProfile.username,
                email: userProfile.email,
                bio: userProfile.bio,
                gamingInterests: userProfile.gamingInterests,
                profilePictureURL: userProfile.profilePictureURL,
            };
        } else {
            // If the profile is not found, handle accordingly (e.g., redirect to an error page)
            res.status(404).send('Profile not found');
            return; // Add return statement to exit the function
        }
    } catch (error) {
        // Handle any errors that may occur during the database query
        console.error(error);
        res.status(500).send('Error fetching user profile');
        return; // Add return statement to exit the function
    }
  res.render('profile', userData);
});

// For a forum post
app.get('/posts/:postID', (req, res) => {
  const postID = req.params.postID;
  res.render('post', { postID });
});

// Route for the reviews page

app.get('/reviews', async (req, res) => {
    try {
        // Fetch posts with associated user information
        const reviewsData = await Post.find().populate({ path: 'author', model: 'Profile' }).exec();

        // Render the EJS template and pass the data
        res.render('reviews', { reviewsData });
    } catch (error) {
        // Handle errors (log or render an error page)
        console.error('Error fetching reviews:', error);
        res.status(500).send('Internal Server Error');
    }
});



app.post('/submit-post', upload.single('media'), async (req, res) => {
  console.log('Request Body:', req.body);
  console.log('Request File:', req.file);
  try {
    const { title, content } = req.body;
    let mediaPath = '';

    if (req.file) {
      mediaPath = req.file.path; // Set the path where Multer saves the file
    }

    const newPost = new Post({ title, content, mediaPath });
    await newPost.save();
    res.status(201).json({ message: 'Post created successfully', post: newPost });
  } catch (error) {
    console.error('Error creating post:', error);
    if (error.name === 'ValidationError') {
        console.error('Validation Error Details:', error.errors);
    }
    res.status(500).json({ message: 'Error in creating post', error: error.message });
}
});

// Route for the login page
app.get('/login', (req, res) => {
  res.render('login');
});

// Define a route for displaying the sign-up form (GET request)
app.get('/signup', (req, res) => {
  res.render('signup'); 
});

// Start the server
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});


mongoose.connect('mongodb+srv://blabdue:iawynikd@blabdue.m4zqcqu.mongodb.net/test2', {
  useNewUrlParser: true, 
  useUnifiedTopology: true 
}).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('MongoDB connection error:', err);
});

/******************************* */
app.post('/test', async (req, res) => {
  console.log('Test route accessed');
  res.status(200).send('Test response');
});

app.post('/login', async (req, res) => {
  const { username, email, password } = req.body;
  const user = await User.findOne({ email: email});
  console.log('User found:', user);

  try {
      const check = await User.findOne({ email: email});

      if (!user) {
          console.log('User not found');
          return res.status(400).json({ error: 'User not found' });
      }

      const isPasswordValid = await bcrypt.compare(password, check.password);

      if (isPasswordValid) {
          // Store user data in the session
          req.session.user = {
            id: user._id,
            username: user.username,
        };

          console.log('Login successful!');
          res.status(200).json({ message: 'Login successful' });
      } else {
          console.log('Incorrect password');
          res.status(400).json({ error: 'Incorrect password' });
      }
  } catch (error) {
      console.error('Error in login:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
});




/***************************************/

app.post('/signup', async (req, res) => {
  try {
    // Extract user details from request body
    const { username, email, password } = req.body;
    
    // Check if user already exists
    let user = await User.findOne({ email: email });
    if (user) {
      return res.status(400).send({ error: 'Email already in use.' });
    }
    
    // Create a new user with hashed password
    const hashedPassword = await bcrypt.hash(password, 10); // Salt rounds = 10
    user = new User({ username, email, password: hashedPassword });
    const userProfile = new Profile({ username, email });
    await userProfile.save();
    await user.save();
    
    res.status(201).send('User registered successfully');
  } catch (error) {
    console.log(error);
    res.status(500).send('Error in saving');
  }
});

app.post('/messages', (req, res) => {
  const newMessage = new Message({
    sender: req.body.sender,
    content: req.body.content,
    chat: req.body.chat,
  });

  newMessage.save()
    .then(savedMessage => {
      res.status(200).json(savedMessage);
    })
    .catch(err => {
      console.error('Error saving message:', err);
      res.status(500).send('Error saving message');
    });
});

// Route for fetching all chat messages
app.get('/chats', async (req, res) => {
  try {
    const messages = await Message.find({}).sort({ timestamp: -1 }); // or sort based on your requirement
    res.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ message: "Error retrieving messages", error: error.message });
  }
});

app.get('/posts', async (req, res) => {
  try {
      const posts = await Post.find({});
      res.json(posts);
  } catch (error) {
      console.error('Error retrieving posts:', error);
      res.status(500).json({ message: 'Error in retrieving posts', error: error.message });
  }
});

//for posting comments
app.post('/api/comments', async (req, res) => {
  try {
      const newComment = await Comment.create(req.body); // Assuming your comment model is named Comment
      res.status(201).json(newComment);
  } catch (error) {
      console.error('Error adding comment:', error);
      res.status(500).send('Internal Server Error');
  }
});

/**dahsboard **/
app.get('/dashboard', async (req, res) => {
  try {
    // Check if the user is logged in
    if (!req.session.user) {
      // Redirect to login if not logged in
      return res.redirect('/login'); 
    }

    // Fetch posts for the logged-in user
    const userId = req.session.user._id;
    const postsData = await Post.find({ author: userId });

    // Render the EJS template and pass the posts data
    res.render('dashboard', { postsData });
  } catch (error) {
    console.error('Error fetching posts for dashboard:', error);
    res.status(500).send('Internal Server Error');
  }
});

