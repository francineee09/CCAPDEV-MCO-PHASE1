const commentBtn = document.querySelector('.comment-btn');
const replyButtons = document.querySelectorAll('.reply-comment-btn');

commentBtn.addEventListener('click', async () => {
    try {
        const postId = commentBtn.dataset.postId;
        const commentText = document.querySelector('.textarea').value;

        const response = await fetch(`/comment/${postId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content: commentText }),
        });

        if (response.ok) {
            const newComment = await response.json();
            console.log('New comment:', newComment);
            // Update UI or perform other actions as needed
            createCommentHTML(newComment);
        } else {
            console.error('Request failed:', response.statusText);
        }
    } catch (error) {
        console.error('Request failed:', error);
    }
});

replyButtons.forEach((button) => {
    button.addEventListener('click', async () => {
        try {
            const commentId = button.getAttribute('data-comment-id');
            const replyText = button.closest('.card').querySelector('.textarea').value;

            const response = await fetch(`/comment/${commentId}/reply`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ reply: replyText }),
            });

            if (response.ok) {
                const updatedComment = await response.json();
                console.log('Updated comment with reply:', updatedComment);
                // Update UI or perform other actions as needed
                createCommentHTML(updatedComment);
            } else {
                console.error('Request failed:', response.statusText);
            }
        } catch (error) {
            console.error('Request failed:', error);
        }
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const commentBtn = document.querySelector('.comment-btn');
    const commentInputBox = document.querySelector('.comment-details');
    const commentTextarea = document.querySelector('.comment-details textarea');
    const submitCommentBtn = document.querySelector('.submit');
    const cancelCommentBtn = document.querySelector('.cancel');

    // Show the comment input box when clicking the comment button
    commentBtn.addEventListener('click', () => {
        commentInputBox.style.display = 'block';
        commentTextarea.focus();
    });

    // Submit the comment
    submitCommentBtn.addEventListener('click', async () => {
        const postId = commentBtn.dataset.postId;
        const commentText = commentTextarea.value.trim();

        if (commentText) {
            try {
                console.log('postId:', postId);
                console.log('commentText:', commentText);
                // Add logic to submit the comment, update UI, etc.
                const response = await fetch(`/comment/${postId}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ content: commentText }),
                });

                if (response.ok) {
                    const newComment = await response.json();
                    console.log('Comment submitted:', newComment);

                    // Example: Create a new comment element and append it to the comments container
                    const newCommentHTML = createCommentHTML(newComment);
                    document.querySelector('.bg-light').insertAdjacentHTML('beforeend', newCommentHTML);

                    // Clear the textarea and hide the comment input box
                    commentTextarea.value = '';
                    commentInputBox.style.display = 'none';
                } else {
                    console.error('Comment submission failed:', response.statusText);
                }
            } catch (error) {
                console.error('Comment submission failed:', error);
            }
        } else {
            // Handle empty comment submission
            alert('Please enter a comment before submitting.');
        }
    });

    // Cancel the comment
    cancelCommentBtn.addEventListener('click', () => {
        // Clear the textarea and hide the comment input box
        commentTextarea.value = '';
        commentInputBox.style.display = 'none';
    });
});

// Function to create HTML for a comment
function createCommentHTML(comment) {
    // Extract necessary information from the comment object
    const { profile, date, content } = comment;

    // Check if the user object is defined
    const username = profile.username ;
    console.log(username);
    const profilePictureURL = profile ? profile.profilePictureURL : '/styles/images/default-profile.jpg';

    // Format the date (you might want to use a date formatting library)
    const formattedDate = new Date(date).toLocaleString();

    // Create the HTML structure for a comment
    return `
        <div class="card bg-white p-2 mb-2">
            <!-- User Info -->
            <div class="d-flex flex-row user-info">
                <img class="rounded-circle" src="${profilePictureURL}" width="40">
                <div class="d-flex flex-column justify-content-start ml-2">
                    <span class="d-block font-weight-bold name">${username}</span>
                    <span class="date text-black-50">${formattedDate}</span>
                </div>
            </div>

            <!-- Comment Text -->
            <div class="mt-2">
                <p class="comment-text text-dark">${content}</p>
            </div>

            <!-- Like, Reply, etc. Buttons (if needed) -->
            <div class="d-flex flex-row fs-12 mt-2">
                <button class="btn btn-light like-comment-btn" data-comment-id="${comment._id}">
                    <i class="fa fa-thumbs-o-up"></i>
                    Like
                </button>
                <button class="btn btn-light reply-comment-btn ml-2">
                    <i class="fa fa-reply"></i>
                    Reply
                </button>
                <!-- Add more buttons as needed -->
            </div>

            <!-- Reply Input Box (initially hidden) -->
            <div class="comment-details" style="display: none;">
                <div class="d-flex flex-row align-items-start">
                    <img class="rounded-circle" src="/styles/images/purinpost.jpg" width="40">
                    <textarea class="form-control ml-1 shadow-none textarea" placeholder="Add a reply"></textarea>
                </div>
                <div class="mt-2 text-right">
                    <button class="btn btn-primary btn-sm shadow-none submit-reply-btn" type="button">Submit</button>
                    <button class="btn btn-outline-primary btn-sm ml-1 shadow-none cancel-reply-btn" type="button">Cancel</button>
                </div>
            </div>
        </div>
    `;
}
