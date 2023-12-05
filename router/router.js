const { Router }= require('express');
const User = require('../server/schema/User');
const Comment = require('../server/schema/Comments');
const Messages = require('../server/schema/Messages');
const Post = require('../server/schema/Post');
const Profile = require('../server/schema/Profile');
const router = Router();
const bcrypt = require('bcryptjs');
const multer = require('multer');
const path = require('path');
const express = require('express');
router.use(express.json());

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

//rendering index
router.get('/', async function(req, res) {
   res.render('index');
});

//sign up
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

  //log in
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

  //for rendeing reviews page
  router.get('/reviews', async (req, res) => {
    try {
        const reviewsData = await Post.find().populate({ path: 'author', model: 'Profile' }).exec();
        res.render('reviews', { reviewsData, layout: 'main' });
    } catch (error) {
        console.error('Error fetching reviews:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Rendering reviews page with posts sorted by the latest date
router.get('/reviews/latest', async (req, res) => {
    try {
        const reviewsData = await Post.find().sort({ createdAt: 'desc' }).populate({ path: 'author', model: 'Profile' }).exec();
        res.render('reviews', { reviewsData, layout: 'main' });
    } catch (error) {
        console.error('Error fetching reviews:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Rendering reviews page with posts sorted by the oldest date
router.get('/reviews/oldest', async (req, res) => {
    try {
        const reviewsData = await Post.find().sort({ createdAt: 'asc' }).populate({ path: 'author', model: 'Profile' }).exec();
        res.render('reviews', { reviewsData, layout: 'main' });
    } catch (error) {
        console.error('Error fetching reviews:', error);
        res.status(500).send('Internal Server Error');
    }
});



//for rendering bio page of other users
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

//for rendering dashboard
router.get('/dashboard', async (req, res) => {
    try {
        const user = req.session.user;
        const username = user.username;
        const profile = await Profile.findOne({username});
        const posts = await Post.find({ author: profile._id });
        console.log(profile);
        res.render('dashboard', {posts});
        console.log({posts});
    } catch (error) {
        // Handle errors
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

//for publishing new post
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

  //for getting the edit form to edit the post of logged-in user
  router.get('/edit/:postId', async (req, res) => {
    try {
        const postId = req.params.postId;
        const editedPost = await Post.findById(postId);
        console.log(editedPost);

        if (!editedPost) {
            return res.status(404).send('Post not found');
        }
        res.render('editPost', { post: editedPost});

    } catch (error) {
        console.error('Error fetching post for edit:', error);
        res.status(500).send('Internal Server Error');
    }
});

//for editing posts of user that is logged-in
router.post('/update/:_id', upload.single('media'), async (req, res) => {
    console.log('Request Body:', req.body);
    console.log('Request File:', req.file);
    try {
        const postId = req.params._id;
        const editedPost = await Post.findById(postId);

        if (!editedPost) {
            return res.status(404).send('Post not found');
        }
        editedPost.title = req.body.title;
        editedPost.content = req.body.content;

        if (req.file) {
            editedPost.mediaPath = req.file.path;
        }
        editedPost.updatedAt = new Date();
        await editedPost.save();
        res.redirect('/dashboard');

    } catch (error) {
        console.error('Error editing post:', error);
        res.status(500).send('Internal Server Error');
    }
});

//for deleting posts in dashboard
router.post('/delete/:postId', async (req, res) => {
    try {
        const postId = req.params.postId;
        console.log('postId:', postId);
        const deletePost = await Post.findById(postId);
        console.log(deletePost);

        if (!deletePost) {
            return res.status(404).send('Post not found');
        }
        await Post.findByIdAndDelete(postId);
        res.redirect('/dashboard');
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
});

//for comments
// let commentsData = [];
// router.use(express.json());
// router.post('/comment/:postId', (req, res) => {
//     const { content, comment_date, replies, main_comment, likes } = req.body;
//     const { postId } = req.params;
//     // Assuming you have a Comment model or schema
//     const newComment = {
//         content,
//         date: comment_date,
//         replies,
//         likes,
//         postId,
//     };

//     // Add the new comment to the commentsData array (replace this with database operations)
//     commentsData.push(newComment);

//     res.json(newComment);
// });
  
router.get('/comment/:postId', async (req, res) => {
    try {
        const postId = req.params.postId;

        // Find comments for the specified post
        const comments = await Comment.find({ postId })
            .populate('user', 'username profilePictureURL') // Populate the user information
            .populate({
                path: 'replies.user',
                select: 'username profilePictureURL', // Populate user information in replies
            })
            .sort({ createdAt: 'asc' }); // Sort comments by creation time in ascending order

        res.json(comments);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});
  
router.put('/:commentId/reply', async (req, res) => {
    const comment_id = req.params?.commentId;
    const username = req.session.user.username;
    const user = await User.findOne({ username });
    try {
        if (comment_id){
            //reply object
            const reply = {
                commentId: comment_id,
                content : req.body.reply,
                user:user,
            }
            const newComment = await Comments.findByIdAndUpdate({_id: comment_id},{$push:{replies: reply}},{new:true});
            res.json(newComment);
        }
       
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
});

router.post('/comment/:postId', async (req, res) => {
    console.log('Received POST request to /comment/:postId');
    try {
        const postId = req.params.postId;
        const { content } = req.body;
        const user = req.session.user.username;
        const profile = await Profile.findOne({username:user});
        console.log(profile);
        // Create a new comment
        const newComment = new Comment({
            content:content,
            postId,
            pprofile: profile._id,
            date : new Date(),
        });
        console.log(newComment);

        // Save the new comment to the database
        const savedComment = await newComment.save();

        res.status(201).json(savedComment);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});
  
// Renders profile
router.get('/profile', async (req, res) => {
    try {
        if (!req.session.user) {
            return res.redirect('/login');
        }

        const username = req.session.user.username;
        const profile = await Profile.findOne({ username });

        if (!profile) {
            return res.status(404).send('Profile not found');
        }

        res.render('profile', { profile });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

// Renders edit profile
router.get('/updateProfile', async (req, res) => {
    try {
        const username = req.session.user.username;
        const profile = await Profile.findOne({ username });

        if (!profile) {
            return res.status(404).send('Profile not found');
        }

        res.render('editProfile', { profile });
    } catch (error) {
        console.error('Error fetching profile for edit:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Handles profile update
router.post('/updateProfile', upload.single('profilePicture'), async (req, res) => {
    try {
        const username = req.session.user.username;
        
        const profile = await Profile.findOne({ username });

        if (!profile) {
            console.log('Profile not found');
            return res.status(404).send('Profile not found');
        }

        console.log('Current Profile:', profile);
        profile.bio = req.body.bio;

        if (req.file) {
            profile.profilePictureURL = req.file.path;
        }

        await profile.save();

        res.redirect('/profile');
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;