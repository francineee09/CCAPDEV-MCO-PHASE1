const { Router }= require('express');
const User = require('../server/schema/User');
const Comments = require('../server/schema/Comments');
const Messages = require('../server/schema/Messages');
const Post = require('../server/schema/Post');
const Profile = require('../server/schema/profile');
const router = Router();
const bcrypt = require('bcryptjs');

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


  


  
module.exports = router;


