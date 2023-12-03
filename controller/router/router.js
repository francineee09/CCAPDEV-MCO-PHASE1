const { Router }= require('express');
const User = require('../../model/schema/User');
const Comments = require('../../model/schema/Comments');
const Messages = require('../../model/schema/Messages');
const Post = require('../../model/schema/Post');
const Profile = require('../../model/schema/profile');
const router = Router();
const bcrypt = require('bcryptjs');
const multer = require('multer');
const path = require('path');


// this is for multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      console.log('Uploading file:', file.originalname);
      cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      const filename = file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname);
      console.log('Saving as:', filename);
      cb(null, filename)
    }
  });
  
  const upload = multer({ storage: storage });

// *********************************8

router.get('/', async function(req, res) {
   res.render('index');
});

router.post('/signup', async (req, res) => {
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

  router.post('/login', async (req, res) => {
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

  router.get('/reviews', async (req, res) => {
    try {
        const reviewsData = await Post.find().populate({ path: 'author', model: 'Profile' }).exec();
        res.render('reviews', { reviewsData, layout: 'main' });
    } catch (error) {
        console.error('Error fetching reviews:', error);
        res.status(500).send('Internal Server Error');
    }
});

router.get('/user-profile/:username', async (req, res) => {
    try {
        console.log(req.session.user);
        const username = req.params.username;
        console.log(username);
        const profile = await Profile.findOne({ username });
        if (profile) {
            // Render the userProfile template with user data
            console.log(profile);
            res.render('userProfile', {profile});
        } else {
            // User not found
            res.status(404).send('User not found');
        }
    } catch (error) {
        // Handle errors
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

router.get('/dashboard', async (req, res) => {
    try {
        const user = req.session.user;
        const username = user.username;
        const profile = await Profile.findOne({username});
        const posts = await Post.find({ author: profile._id });
        console.log(profile);
        res.render('dashboard', {posts});
    } catch (error) {
        // Handle errors
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

router.post('/submit-post', upload.single('media'), async (req, res) => {
    console.log('Request Body:', req.body);
    console.log('Request File:', req.file);
    try {
        const user = req.session.user;
        const username = user.username;
        const profile = await Profile.findOne({username});
        const { title, content } = req.body;
        let mediaPath = '';
  
      if (req.file) {
        mediaPath = req.file.path; // Set the path where Multer saves the file
      }
  
      const newPost = new Post({ title, content, mediaPath, author:profile});
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



  


  
module.exports = router;


