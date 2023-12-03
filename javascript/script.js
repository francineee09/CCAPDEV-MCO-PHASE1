
// Sign up
document.addEventListener('DOMContentLoaded', function () {
    const signupForm = document.getElementById('signup-form');

    signupForm.addEventListener('submit', async function (event){
        event.preventDefault(); // Preventing the form from submitting by default

        // User input values
        const username = document.getElementById('username').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirm-password').value;

        // Password validation
        if (password !== confirmPassword) {
            alert('Passwords do not match. Please try again.');
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('Please enter a valid email address.');
            return;
        }

        // Password strength validation
        if (password.length < 8 || !/[A-Za-z]/.test(password) || !/\d/.test(password)) {
            alert('Password must be at least 8 characters long and contain both letters and numbers.');
            return;
        }

        // If user validation is correct, send the data to the server to register
        const userData = {
            username: username,
            email: email,
            password: password,
        };

        // Send the user data to the server using a fetch request
        try {
            const response = await fetch('http://localhost:3000/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });

            if (response.ok) {
                // If registration is successful, redirect to a login page or display a success message
                alert('Registration successful! Please log in.');
                signupForm.reset(); // Clearing of form fields
            } else {
                const errorData = await response.json();
                if (errorData.error) {
                    alert(`Registration failed: ${errorData.error}`);
                } else {
                    alert('Registration failed. Please check your input and try again.');
                }
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while processing your request. Please try again later.');
        }
    });
});

/*************************************************************/

// Login
document.addEventListener('DOMContentLoaded', function () {
    console.log('DOMContentLoaded event fired'); // Add this line
    const loginForm = document.getElementById('login-form');

    loginForm.addEventListener('submit', async function (event) {
        event.preventDefault(); // Preventing the form from submitting by default
        console.log('Form submitted'); // Add this line

        // User input values
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        // User validation, checks for non-empty fields
        if (!email || !password) {
            alert('Please fill in all fields.');
            return; // If field is empty, prevents from submission
        }

        // If user validation is a success, send the data to the server for further processing
        const userData = {
            email: email,
            password: password,
        };

        try {
            const response = await fetch('http://localhost:3000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });
        
            if (response.ok) {
                const responseData = await response.json();
                
                // Check the message in the response for success
                if (responseData.message === 'Login successful') {
                    // If login is successful, redirect the user to the dashboard
                    window.location.href = '/reviews';
                } else {
                    // Handle unexpected success response
                    alert('Unexpected success response. Please try again.');
                }
            } else {
                // Handle login failure
                const errorData = await response.json();
                if (errorData.error) {
                    alert(`Login failed: ${errorData.error}`);
                } else {
                    alert('Login failed. Please check your email and password and try again.');
                }
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while processing your request. Please try again later.');
        } 
    });       
});

/*************************************************************/
function getFormattedDate() {
    const now = new Date();
    const options = {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    };
    return now.toLocaleString('en-US', options);
}
// Function of handling post submission
function submitPost(event) {
    event.preventDefault();

    const formData = new FormData();
    formData.append('title', document.getElementById('postTitle').value);
    formData.append('content', document.getElementById('postContent').value);
    if (document.getElementById('mediaUpload').files.length > 0) {
        formData.append('media', document.getElementById('mediaUpload').files[0]);
    }

    fetch('/submit-post', {
        method: 'POST',
        body: formData,
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        // Handle success, such as clearing the form or redirecting
    })
    .catch(error => {
        console.error('Error:', error);
    });

    // User input for post title, content, and media
    const postTitle = document.getElementById("postTitle").value;
    const postContent = document.getElementById("postContent").value;
    const mediaUpload = document.getElementById("mediaUpload").files[0];

    // Get the formatted date
    const postDate = getFormattedDate();

    // For creation of new post card
    const postCard = document.createElement("div");
    postCard.classList.add("card", "mb-4");

    // For creation of post body
    const cardBody = document.createElement("div");
    cardBody.classList.add("card-body");

    // For creation of post title element
    const cardTitle = document.createElement("h3");
    cardTitle.classList.add("card-title");
    cardTitle.textContent = postTitle;

    // For creation of post text element
    const cardText = document.createElement("p");
    cardText.classList.add("card-text");
    cardText.textContent = postContent;

    // For creation of post date element
    const cardDate = document.createElement("p");
    cardDate.classList.add("date");
    cardDate.textContent = postDate;

    // Appending of elements to the card
    cardBody.appendChild(cardTitle);
    cardBody.appendChild(cardText);
    cardBody.appendChild(cardDate);
    postCard.appendChild(cardBody);

    // Media display
    if (mediaUpload) {
        const mediaElement = document.createElement("img");
        mediaElement.src = URL.createObjectURL(mediaUpload);
        mediaElement.classList.add("img-fluid");
        cardBody.appendChild(mediaElement);
    }

    // For creation of delete button
    const deleteButton = document.createElement("button");
    deleteButton.classList.add("btn", "btn-danger", "mt-2");
    deleteButton.textContent = "Delete";
    deleteButton.addEventListener("click", () => {
        postCard.remove();
    });
    cardBody.appendChild(deleteButton);

    // Container for existing posts
    const postContainer = document.querySelector(".col-md-8");
    
    // New post insertion after the last post 
    const lastPost = postContainer.querySelector(".card:last-child");
    postContainer.insertBefore(postCard, lastPost.nextSibling);

    // Clear the post form
    document.getElementById("postForm").reset();
}

// Event listener for post submission
const postForm = document.getElementById("postForm");
postForm.addEventListener("submit", submitPost);
//Event listener for post button click
document.getElementById('postButton').addEventListener('click', function () {
    addNewPostToReviews();
});

// Additional script for enabling Bootstrap collapse
$(document).ready(function() {
    $('[data-toggle="collapse"]').collapse();

    // Handling of click events on the "Messages" link to toggle the panel
    $('.nav-link[data-toggle="collapse"]').on('click', function() {
        $('.nav-link[data-toggle="collapse"]').not(this).each(function() {
            $($(this).data('target')).collapse('hide');
        });
    });

});

/****************************************************/
//trying to add post to reviews when new post is created in dashboard

function addNewPostToReviews() {
    // Capture post details
    var postTitle = document.getElementById('postTitle').value;
    var postContent = document.getElementById('postContent').value;
    
    // Get user information
    var userProfilePic = "styles/images/profile1.jpg"; // Replace with actual user profile picture
    var username = "User 1"; // Replace with actual username

    // Create a new post element
    var newPost = document.createElement('div');
    newPost.className = 'user-container';

    // Create other elements (profile picture, post title, post content, etc.)

    var postTitleElement = document.createElement('div');
    postTitleElement.className = 'post-title';
    //postTitleElement.innerHTML = '<span class="title" onclick="navigateToUserProfile(\'' + userProfilePic + '\', \'' + username + '\')">' + postTitle + '</span>';
    newPost.appendChild(postTitleElement);

    var postTitleElement = document.createElement('div');
    postTitleElement.className = 'post-title';
    postTitleElement.innerHTML = '<span class="title">' + postTitle + '</span>';
    newPost.appendChild(postTitleElement);

    var postContentElement = document.createElement('div');
    postContentElement.className = 'post-content';
    postContentElement.innerHTML = '<p>' + postContent + '</p>';
    newPost.appendChild(postContentElement);

    // Append the new post to the reviews container
    var reviewsContainer = document.getElementById('reviews-container');
    reviewsContainer.appendChild(newPost);
}

function redirectToUserProfile(username) {
    // Redirect logic here, for example:
    window.location.href = '/user-profile/' + username;
}



/*************************************************************/
function sendMessage() {
    console.log("sendMessage function is called.");
    const messageContent = document.getElementById('messageInput').value; // Ensure this ID is correct
    console.log('sendMessage called with:', messageContent); // This should appear in your console
  
    if (!messageContent.trim()) {
      console.log('No message content to send');
      return; // Don't attempt to send an empty message
    }
  
    // Mock data for senderId and chatId, replace with real data later
    const senderId = 'mockSenderId'; // Placeholder, replace with actual data when available
    const chatId = 'mockChatId'; // Placeholder, replace with actual data when available
  
    console.log('Attempting to send message to server:', messageContent);
  
    fetch('http://localhost:3000/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sender: senderId,
        content: messageContent,
        chat: chatId,
      }),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
      console.log('Message sent', data);
      // Add message to the chat window here
    })
    
    .catch((error) => {
      console.error('Error:', error);
    });
  }
  
  document.getElementById('sendMessage').addEventListener('click', function() {
    console.log('Send button clicked'); // This should show in the browser console when the send button is clicked
    sendMessage();
});

  // Load chat history
  function loadChatHistory(chatId) {
    fetch(`/messages/${chatId}`)
      .then(response => response.json())
      .then(messages => {
        messages.forEach(message => {
          // Add each message to the chat window
          console.log('Loaded message', message);
        });
      })
      .catch(error => console.error('Error loading messages:', error));
  }

  function loadChats() {
    fetch('/chats')
      .then(response => response.json())
      .then(chats => {
        const chatContainer = document.getElementById('chat-container'); // Your chat container element
        chatContainer.innerHTML = ''; // Clear existing chats
        chats.forEach(chat => {
          const chatMessage = document.createElement('div');
          chatMessage.textContent = `${chat.sender}: ${chat.content}`;
          chatContainer.appendChild(chatMessage);
        });
      })
      .catch(error => console.error('Error loading chats:', error));
  }
  
  document.addEventListener('DOMContentLoaded', loadChats); // Load chats when the page is fully loaded
  
// Messages
document.addEventListener("DOMContentLoaded", function () {
    const chatIcon = document.getElementById("chatIcon");
    const chatBox = document.getElementById("chatBox");
    const closeChat = document.getElementById("closeChat");
    const messageInput = document.getElementById("messageInput");
    const chatMessages = document.getElementById("chatMessages");
    const sendMessageButton = document.getElementById("sendMessage");
    const chatEntries = document.querySelectorAll(".chat-entry");

    if(chatEntries.length > 0) {
        loadChatHistory('mockChatId'); // Or the actual chat ID retrieved from the first chat entry
    }
    // Function to load chat data from local storage
    function loadChatData() {
        const chatDataString = localStorage.getItem("chatData");
        return chatDataString ? JSON.parse(chatDataString) : {};
    }

    // Function to save chat data to local storage
    function saveChatData(chatData) {
        localStorage.setItem("chatData", JSON.stringify(chatData));
    }

    // Creates an object to store chat messages for each chat entry
    let chatData = loadChatData();

    // Initializes the active chat entry
    let activeChatEntry = null;

    // Function to toggle the chat box visibility
    function toggleChat() {
        chatBox.style.display = chatBox.style.display === "none" ? "block" : "none";
    }

    // Closes the chat box by default when the page loads
    chatBox.style.display = "none";

    // Event listener to toggle the chat box
    chatIcon.addEventListener("click", toggleChat);
    closeChat.addEventListener("click", toggleChat);

    // Function to add a message to the chat
    function addMessage(messageText, sender) {
        const messageElement = document.createElement("div");
        messageElement.classList.add("message", sender);
    
        // Create a span for the message text
        const messageTextElement = document.createElement("span");
        messageTextElement.innerText = messageText;
    
        messageElement.appendChild(messageTextElement);
    
        // Create a span for the formatted timestamp
        const timestampElement = document.createElement("span");
        timestampElement.classList.add("timestamp");
        
        const now = new Date();
        
        const options = {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        };
    
        const timestamp = now.toLocaleString('en-US', options);
        
        timestampElement.innerText = timestamp;
    
        messageElement.appendChild(timestampElement);
    
        chatMessages.appendChild(messageElement);
    
        // Scrolls to the bottom after adding a new message
        scrollToBottom();
    }

    messageInput.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            event.preventDefault();
            sendMessageButton.click();
        }
    });

    // Function to clear chat messages
    function clearChatMessages() {
        chatMessages.innerHTML = "";
    }

    // Event listener to send a message
    sendMessageButton.addEventListener("click", function () {
        const messageText = messageInput.value;
        if (messageText.trim() !== "") {
            addMessage(messageText, "user");
            messageInput.value = "";
            
            // If there is an active chat entry, add the message to chatData
            if (activeChatEntry) {
                const chatName = activeChatEntry.querySelector("span").innerText;
                if (!chatData[chatName]) {
                    chatData[chatName] = [];
                }
                chatData[chatName].push({ text: messageText, sender: "user" });
                saveChatData(chatData);
            }
        }
    });

    // Event listener to handle chat entry click
    chatEntries.forEach(function (entry) {
        entry.addEventListener("click", function () {
            selectChatEntry(entry);
            clearChatMessages();
            const chatName = entry.querySelector("span").innerText;
            const chatMessagesData = chatData[chatName];
            if (chatMessagesData) {
                chatMessagesData.forEach(function (messageData) {
                    addMessage(messageData.text, messageData.sender);
                });
            }
        });
    });

    // Function to select a chat entry
    function selectChatEntry(entry) {
        chatEntries.forEach(function (chatEntry) {
            chatEntry.classList.remove("active");
        });
        entry.classList.add("active");
        activeChatEntry = entry;
    }

    // Function to scroll to the bottom of the chat messages
    function scrollToBottom() {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    // To add some initial messages
    chatEntries[0].click(); // For clicking on the first chat entry to display its messages
    loadChats();
});

// Event listener for starting a new chat
document.getElementById("startNewChat").addEventListener("click", function () {
    // Open a dialog or input field to select or enter the chat name(s)
    const chatName = prompt("Enter the chat name or select a contact:");
    
    if (chatName) {
        // Check if it's a one-on-one chat or a group chat
        if (chatName.includes(',')) {
            // It's a group chat
            activeChat = chatName;
        } else {
            // It's a one-on-one chat
            activeChat = chatName;
        }
        
        // Clear individual chat messages
        clearChatMessages();
        
        // Display chat messages
        displayChat();
    }
});

// Event listener for the search bar
const chatSearchInput = document.getElementById("chatSearchInput");
chatSearchInput.addEventListener("input", function () {
    const searchTerm = chatSearchInput.value.toLowerCase();

    chatEntries.forEach(function (entry) {
        const chatName = entry.querySelector("span").innerText.toLowerCase();
        if (chatName.includes(searchTerm)) {
            entry.style.display = "block"; // Show matching chat entries
        } else {
            entry.style.display = "none"; // Hide non-matching chat entries
        }
    });
});


/*************************************************************/

// Game Library

// Sample data for user's game library
const userGames = [];

// Function to add a game to the library
function addGame(title) {
    const game = {
        title: title,
    };
    userGames.push(game);
}

// Function to display the game library
function displayLibrary() {
    const gameList = document.getElementById('gameList');
    gameList.innerHTML = '';

    userGames.forEach((game) => {
        const listItem = document.createElement('li');
        listItem.textContent = game.title;
        gameList.appendChild(listItem);
    });
}

// Event listener for the "Add" button
document.getElementById('addGameForm').addEventListener('submit', (event) => {
    event.preventDefault();
    const gameTitle = document.getElementById('gameTitle').value;
    if (gameTitle) {
        addGame(gameTitle);
        displayLibrary();
        document.getElementById('gameTitle').value = ''; // Clears the input field
    }
});

// Initial display of the game library
displayLibrary();

/*************************************************************/

// Function for read more
function myFunction(game) {
    let dots = document.querySelector(`.post-info-container[data-game="${game}"] .dots`);
    let moreText = document.querySelector(`.post-info-container[data-game="${game}"] .more`);
    let btnText = document.querySelector(`.post-info-container[data-game="${game}"] .myBtn`);
  
    if (dots.style.display === "none") {
      dots.style.display = "inline";
      btnText.innerHTML = "Read more"; 
      moreText.style.display = "none";
    } else {
      dots.style.display = "none";
      btnText.innerHTML = "Read less"; 
      moreText.style.display = "inline";
    }
}

/*************************************************************/

// Updated searchPosts function to search and display results
// Get references to the search input and post titles
function searching(){
    var searchInput = document.getElementById('search');
    var postTitles = document.querySelectorAll('.post-title .title');

    // Add an event listener to the search input
    searchInput.addEventListener('input', function() {
        // Get the search query from the input
        var searchQuery = searchInput.value.toLowerCase();

        // Loop through each post title and check if it contains the search query
        postTitles.forEach(function(title) {
            var postTitle = title.textContent.toLowerCase();
            var postContainer = title.parentElement.parentElement.parentElement;

            // If the post title contains the search query, show the post; otherwise, hide it
            if (postTitle.includes(searchQuery)) {
                postContainer.style.display = 'block';
            } else {
                postContainer.style.display = 'none';
            }
        });
    });
}

function searchPost() {
    var searchInput = document.getElementById('searchButton');
    var postTitles = document.querySelectorAll('.card .card-title');

    // Add an event listener to the search input
    searchInput.addEventListener('input', function () {
        // Get the search query from the input
        var searchQuery = searchInput.value.toLowerCase();

        // Loop through each post title and check if it contains the search query
        postTitles.forEach(function (title) {
            var postTitle = title.textContent.toLowerCase();
            var postContainer = title.closest('.card');

            // If the post title contains the search query, show the post; otherwise, hide it
            if (postTitle.includes(searchQuery)) {
                postContainer.style.display = 'block';
            } else {
                postContainer.style.display = 'none';
            }
        });
    });
}


/*************************************************************/

//Profile edit buttons
document.addEventListener("DOMContentLoaded", function() {
    const saveProfileButton = document.getElementById("saveProfileButton");
    const saveBioButton = document.getElementById("saveBioButton");
    const profileForm = document.getElementById("profile-form");
    const bioForm = document.getElementById("bio-form");
    const usernameElement = document.getElementById("username");
    const emailElement = document.getElementById("email");
    const bioTextElement = document.getElementById("bio-text");

    saveProfileButton.addEventListener("click", function() {
        const newUsername = usernameElement.value;
        const newEmail = emailElement.value;

        // Update the user's profile information on the page
        document.querySelector(".card-title").textContent = newUsername;
        document.querySelector(".card-text").textContent = newEmail;
    });

    saveBioButton.addEventListener("click", function() {
        const newBio = bioTextElement.value;

        // Update the user's bio on the page
        document.querySelectorAll(".card-text")[2].textContent = newBio;
    });
});


/*************************************************************/
document.addEventListener('DOMContentLoaded', function () {
    fetchPosts();
});

function fetchPosts() {
    fetch('/posts')
        .then(response => response.json())
        .then(posts => {
            const postsContainer = document.getElementById('postsContainer');
            posts.forEach(post => {
                const postElement = document.createElement('div');
                postElement.className = 'post';
                postElement.innerHTML = `
                    <h3>${post.title}</h3>
                    <p>${post.content}</p>
                    ${post.mediaPath ? `<img src="${post.mediaPath}" alt="Post Image" class="img-fluid">` : ''}
                `;
                postsContainer.appendChild(postElement);
            });
        })
        .catch(error => console.error('Error:', error));
}

document.addEventListener('DOMContentLoaded', function () {
    const editForm = document.getElementById('edit-post-form');
    console.log(editForm);
    editForm.addEventListener('submit', async function (event){
        event.preventDefault(); 
        const title = document.getElementById('title').value;
        const content = document.getElementById('content').value;
        const media = document.getElementById('media').files[0];
        console.log('Title:', title);
        console.log('Content:', content);
        console.log('Media:', media);
    
        const formData = new FormData();
        formData.append('title', title);
        formData.append('content', content);
        formData.append('media', media);
        const postId = document.getElementById('postId').value;
        try {
            // Make a fetch request to update the post
            const response = await fetch(`/update/${postId}`, {
                method: 'POST',
                body: formData,
            });
    
            if (response.ok) {
                window.location.href = '/dashboard';
            } else {
                console.error('Update failed:', response.statusText);
            }
        } catch (error) {
            console.error('Network error:', error);
        }
  });

});

  function editPost(postId) {
    // Redirect to the editPost page with the postId parameter
    console.log('editPost called with postId:', postId);
    window.location.href = '/edit/' + postId;
  }
  
 