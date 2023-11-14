// user-functions.js

// Function to navigate to user-profile.html with user information as query parameters
function navigateToUserProfile(profilePic, username) {
    window.location.href = 'user-profile.html?profilePic=' + encodeURIComponent(profilePic) + '&username=' + encodeURIComponent(username);
}

// Function to get the value of a query parameter from the URL
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

// Function to initialize user profile details on the user-profile.html page
function initializeUserProfile() {
    // Retrieve user information from the URL
    const profilePic = getQueryParam('profilePic') || 'default-profile-pic.jpg'; // Provide a default profile picture
    const username = getQueryParam('username') || 'Guest';

    // Update profile picture and username on the page
    const profilePicElement = document.getElementById('profilePic');
    const usernameElement = document.getElementById('username');

    if (profilePicElement) {
        profilePicElement.src = profilePic;
    }

    if (usernameElement) {
        usernameElement.textContent = username;
    }

    // You can add more code here to update other details on the page
    // For example, retrieve and update the bio text
    const bioTextElement = document.getElementById('bioText');
    if (bioTextElement) {
        bioTextElement.textContent = "This is the user's bio. Customize this based on your data structure.";
    }
}

// Call initializeUserProfile when the DOM is loaded
document.addEventListener("DOMContentLoaded", initializeUserProfile);
