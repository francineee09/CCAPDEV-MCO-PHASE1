// Sign up
document.addEventListener('DOMContentLoaded', function () {
    const signupForm = document.getElementById('signup-form');

    signupForm.addEventListener('submit', async function (event) {
        event.preventDefault(); // Prevent the form from submitting by default

        // Get form input values
        const username = document.getElementById('username').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirm-password').value;

        // Client-side validation
        if (password !== confirmPassword) {
            alert('Passwords do not match. Please try again.');
            return; // Prevent form submission if passwords don't match
        }

        // Email Format Validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('Please enter a valid email address.');
            return;
        }

        // Password Strength Validation
        if (password.length < 8 || !/[A-Za-z]/.test(password) || !/\d/.test(password)) {
            alert('Password must be at least 8 characters long and contain both letters and numbers.');
            return;
        }

        // If client-side validation passes, send the data to the server for registration
        const userData = {
            username: username,
            email: email,
            password: password,
        };

        // Send the user data to the server using a fetch or AJAX request
        try {
            const response = await fetch('/api/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });

            if (response.ok) {
                // Registration successful, you can redirect to a login page or display a success message
                alert('Registration successful! Please log in.');
                signupForm.reset(); // Clear the form fields
            } else {
                // Registration failed, handle errors (e.g., duplicate username or email)
                const errorData = await response.json();
                alert(`Registration failed: ${errorData.message}`);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while processing your request. Please try again later.');
        }
    });
});
//up until here


//Login
document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('login-form');

    loginForm.addEventListener('submit', function (event) {
        event.preventDefault(); // Prevent the form from submitting by default

        // Get form input values
        const usernameOrEmail = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        // Client-side validation (checking for non-empty fields)
        if (!usernameOrEmail || !password) {
            alert('Please fill in all fields.');
            return; // Prevent form submission if any field is empty
        }

        // If client-side validation passes, you can send the data to the server for further processing
        const userData = {
            usernameOrEmail: usernameOrEmail,
            password: password,
        };

        // Simulate sending data to the server for authentication (replace this with actual server interaction)
        console.log('User data to be sent to the server for login:', userData);

        // Clear the form or redirect to a dashboard on successful login
        loginForm.reset(); // Clear the form fields
    });
});
//up until here



// Function to handle post submission
function submitPost(event) {
    event.preventDefault();

    // Get post title, content, and media (if any)
    const postTitle = document.getElementById("postTitle").value;
    const postContent = document.getElementById("postContent").value;
    const mediaUpload = document.getElementById("mediaUpload").files[0];

    // Create a new post card
    const postCard = document.createElement("div");
    postCard.classList.add("card", "mb-4");

    // Create post card body
    const cardBody = document.createElement("div");
    cardBody.classList.add("card-body");

    // Create post title element
    const cardTitle = document.createElement("h3");
    cardTitle.classList.add("card-title");
    cardTitle.textContent = postTitle;

    // Create post text element
    const cardText = document.createElement("p");
    cardText.classList.add("card-text");
    cardText.textContent = postContent;

    // Append elements to the card
    cardBody.appendChild(cardTitle);
    cardBody.appendChild(cardText);
    postCard.appendChild(cardBody);

    // Display media if provided
    if (mediaUpload) {
        const mediaElement = document.createElement("img");
        mediaElement.src = URL.createObjectURL(mediaUpload);
        mediaElement.classList.add("img-fluid");
        cardBody.appendChild(mediaElement);
    }

    // Get the container for existing posts
    const postContainer = document.querySelector(".col-md-8");
    
    // Insert the new post after the last post (before the "Create a New Post" card)
    const lastPost = postContainer.querySelector(".card:last-child");
    postContainer.insertBefore(postCard, lastPost.nextSibling);

    // Clear the post form
    document.getElementById("postForm").reset();
}

// Event listener for post submission
const postForm = document.getElementById("postForm");
postForm.addEventListener("submit", submitPost);

$(document).ready(function() {
    // Enable Bootstrap collapse
    $('[data-toggle="collapse"]').collapse();

    // Handle click events on the "Messages" link to toggle the panel
    $('.nav-link[data-toggle="collapse"]').on('click', function() {
        // Close all other open panels when clicking on this link
        $('.nav-link[data-toggle="collapse"]').not(this).each(function() {
            $($(this).data('target')).collapse('hide');
        });
    });
});
//up until here

//MESSAGES
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

    // Create an object to store chat messages for each chat entry
    let chatData = loadChatData();

    // Initialize the active chat entry
    let activeChatEntry = null;

    // Function to toggle the chat box visibility
    function toggleChat() {
        chatBox.style.display = chatBox.style.display === "none" ? "block" : "none";
    }

    // Close the chat box by default when the page loads
    chatBox.style.display = "none";

    // Event listener to toggle the chat box
    chatIcon.addEventListener("click", toggleChat);
    closeChat.addEventListener("click", toggleChat);

    // Function to add a message to the chat
    function addMessage(messageText, sender) {
        const messageElement = document.createElement("div");
        messageElement.classList.add("message", sender);
        messageElement.innerText = messageText;
        chatMessages.appendChild(messageElement);

        // Scroll to the bottom after adding a new message
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

            // If there is an active chat entry, add the message to its chatData
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

    // Example: Adding some initial messages
    chatEntries[0].click(); // Simulate clicking on the first chat entry to display its messages
});

//game-library
// game-library.js

// Sample data to simulate user's game library
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
        document.getElementById('gameTitle').value = ''; // Clear the input field
    }
});

// Initial display of the game library
displayLibrary();

//for read more
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