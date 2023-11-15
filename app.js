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

// Route for the reviews page
// Assuming you have a User model

app.get('/reviews', async (req, res) => {
    try {
        // Fetch posts with associated user information
        const reviewsData = await Post.find().populate('author').exec();

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
  const check = await User.findOne({ email: email});
  console.log('User found:', check);

  try {
      const check = await User.findOne({ email: email});

      if (!check) {
          console.log('User not found');
          return res.status(400).json({ error: 'User not found' });
      }

      const isPasswordValid = await bcrypt.compare(password, check.password);

      if (isPasswordValid) {
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
