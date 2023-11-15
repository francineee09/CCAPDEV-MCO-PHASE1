//insertSampleData.js
const mongoose = require('mongoose');
const Post = require('./models/post');
const Message = require('./models/message');
const Profile = require('./models/profile'); 


// MongoDB connection string - replace 'yourDatabaseName' with your actual database name
const dbURL = 'mongodb://localhost:27017/mygamewebsite'; 

mongoose.connect(dbURL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => { // Added async here
    console.log('Connected to MongoDB');
    try {
      await Promise.all([ // Added Promise.all to run all insertion functions
        insertSamplePosts(),
        insertSampleChats(),
        insertSampleProfiles(),
      ]);
      console.log('All sample data inserted successfully');
    } catch (error) {
      console.error('Error during data insertion:', error);
    } finally {
      mongoose.disconnect(); // Disconnect after all operations are complete
    }
  })
  .catch(err => console.error('Connection error:', err));

async function insertSamplePosts() {
  const samplePosts = [
    {
      title: "First Post",
      content: "This is the first sample post",
      mediaPath: "uploads/post1.jpg"
    },
    {
      title: "Second Post",
      content: "This is the second sample post",
      mediaPath: "uploads/post2.jpg"
    },
    {
      title: "Third Post",
      content: "This is the third sample post",
      mediaPath: "uploads/post3.jpg"
    },
    {
      title: "Fourth Post",
      content: "This is the fourth sample post",
      mediaPath: "uploads/post4.jpg"
    },
    {
      title: "Fifth Post",
      content: "This is the fifth sample post",
      mediaPath: "uploads/post5.jpg"
    }
  ];

  try {
    await Post.insertMany(samplePosts);
    console.log('Sample posts inserted successfully');
    mongoose.disconnect();
  } catch (error) {
    console.error('Error inserting sample posts:', error);
  }
}

async function insertSampleChats() {
    const sampleChats = [
      { sender: 'Alice', receiver: 'Bob', content: 'Hey Bob, hows the project going?', timestamp: new Date('2023-11-14T09:00:00') },
      { sender: 'Bob', receiver: 'Alice', content: 'Hi Alice! Making good progress. How about you?', timestamp: new Date('2023-11-14T09:05:00') },
      { sender: 'Charlie', receiver: 'Alice', content: 'Hey, are we meeting tomorrow?', timestamp: new Date('2023-11-14T09:10:00') },
      { sender: 'Alice', receiver: 'Charlie', content: 'Yes, at the usual spot at 10 AM.', timestamp: new Date('2023-11-14T09:15:00') },
      { sender: 'Bob', receiver: 'Charlie', content: 'Charlie, can you bring the reports?', timestamp: new Date('2023-11-14T09:20:00') }
    ];
  
    try {
      await Message.insertMany(sampleChats); 
      console.log('Sample chats inserted successfully');
    } catch (error) {
      console.error('Error inserting sample chats:', error);
    }
  }

  async function insertSampleProfiles() {
    const sampleProfiles = [
      { username: 'Alice', email: 'alice@example.com', profilePictureURL: 'profiles/profile1.jpg', bio: 'Web developer and tech enthusiast.' },
      { username: 'Bob', email: 'bob@example.com', profilePictureURL: 'profiles/profile2.jpg', bio: 'Gamer, coder, and occasional blogger.' },
      { username: 'Charlie', email: 'charlie@example.com', profilePictureURL: 'profiles/profile3.jpg', bio: 'Music lover and guitar player.' },
      { username: 'Dana', email: 'dana@example.com', profilePictureURL: 'profiles/profile4.jpg', bio: 'Aspiring chef and food critic.' },
      { username: 'Eve', email: 'eve@example.com', profilePictureURL: 'profiles/profile5.jpg', bio: 'Fitness enthusiast and travel blogger.' }
    ];
    try {
        await Profile.insertMany(sampleProfiles);
        console.log('Sample profiles inserted successfully');
      } catch (error) {
        console.error('Error inserting sample profiles:', error);
      }
    }