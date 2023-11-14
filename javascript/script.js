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
            const response = await fetch('/api/signup', {
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
                // If registration failed, error handling such as duplication
                const errorData = await response.json();
                alert(`Registration failed: ${errorData.message}`);
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
    const loginForm = document.getElementById('login-form');

    loginForm.addEventListener('submit', function (event) {
        event.preventDefault(); // Preventing the form from submitting by default

        // User input values
        const usernameOrEmail = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        // User validation, checks for non-empty fields
        if (!usernameOrEmail || !password) {
            alert('Please fill in all fields.');
            return; // If field is empty, prevents from submission
        }

        // If user validation is a success, send the data to the server for further processing
        const userData = {
            usernameOrEmail: usernameOrEmail,
            password: password,
        };

        // Simulate sending data to the server for authentication, must replace with actual server interaction
        console.log('User data to be sent to the server for login:', userData);

        // Clear the form or redirect user to a dashboard
        loginForm.reset(); // Clearing of form fields
    });
});

/*************************************************************/

// Function of handling post submission
function submitPost(event) {
    event.preventDefault();

    // User input for post title, content, and media
    const postTitle = document.getElementById("postTitle").value;
    const postContent = document.getElementById("postContent").value;
    const mediaUpload = document.getElementById("mediaUpload").files[0];

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

    // Appending of elements to the card
    cardBody.appendChild(cardTitle);
    cardBody.appendChild(cardText);
    postCard.appendChild(cardBody);

    // Media display
    if (mediaUpload) {
        const mediaElement = document.createElement("img");
        mediaElement.src = URL.createObjectURL(mediaUpload);
        mediaElement.classList.add("img-fluid");
        cardBody.appendChild(mediaElement);
    }

    // Container for existing posts
    const postContainer = document.querySelector(".col-md-8");
    
    // New post insertion after last post 
    const lastPost = postContainer.querySelector(".card:last-child");
    postContainer.insertBefore(postCard, lastPost.nextSibling);

    // Clear the post form
    document.getElementById("postForm").reset();
}

// Event listener for post submission
const postForm = document.getElementById("postForm");
postForm.addEventListener("submit", submitPost);

$(document).ready(function() {
    // Enables the Bootstrap collapse
    $('[data-toggle="collapse"]').collapse();

    // Handling of click events on the "Messages" link to toggle the panel
    $('.nav-link[data-toggle="collapse"]').on('click', function() {
        // Close all other open panels if user clicks on this link
        $('.nav-link[data-toggle="collapse"]').not(this).each(function() {
            $($(this).data('target')).collapse('hide');
        });
    });
});

/*************************************************************/

// Messages
document.addEventListener("DOMContentLoaded", function () {
    const chatIcon = document.getElementById("chatIcon");
    const chatBox = document.getElementById("chatBox");
    const closeChat = document.getElementById("closeChat");
    const messageInput = document.getElementById("messageInput");
    const chatMessages = document.getElementById("chatMessages");
    const sendMessageButton = document.getElementById("sendMessage");
    const chatEntries = document.querySelectorAll(".chat-entry");

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

        document.querySelector(".card-title").textContent = newUsername;
        document.querySelector(".card-text").textContent = newEmail;
    });

    saveBioButton.addEventListener("click", function() {
        const newBio = bioTextElement.value;

        document.querySelectorAll(".card-text")[2].textContent = newBio;
    });
});

/*************************************************************/