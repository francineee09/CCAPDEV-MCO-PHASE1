//script.js
//sign in
document.addEventListener('DOMContentLoaded', function () {
    const signupForm = document.getElementById('signup-form');

    signupForm.addEventListener('submit', function (event) {
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

        // You can add more validation checks here for email format, password strength, etc.

        // If client-side validation passes, you can send the data to the server for further processing
        const userData = {
            username: username,
            email: email,
            password: password,
        };

        // Simulate sending data to the server (replace this with actual server interaction)
        console.log('User data to be sent to the server:', userData);

        // Clear the form or redirect to a success page
        signupForm.reset(); // Clear the form fields
    });
});
//up until here

//login js
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


