document.addEventListener("DOMContentLoaded", function () {
    // Function to create an input box for adding a reply
    function createInputBox(postId) {
        let div = document.createElement("div");
        div.setAttribute("class", "comment-details");
        div.dataset.postId = postId;

        div.innerHTML += `<div class="d-flex flex-row align-items-start">
                              <img class="rounded-circle" src="/styles/images/purinpost.jpg" width="40">
                              <textarea class="form-control ml-1 shadow-none textarea" placeholder="Add text here"></textarea>
                          </div>
                          <div class="mt-2 text-right">
                              <button class="btn btn-primary btn-sm shadow-none submit" type="button">Submit</button>
                              <button class="btn btn-outline-primary btn-sm ml-1 shadow-none cancel" type="button">Cancel</button>
                          </div>`;
        return div;
    }

    // Function to add a reply
    function addReply(text, postId) {
        let div = document.createElement("div");
        div.setAttribute("class", "all-comment");

        div.innerHTML += `<div class="card bg-white p-2">
                              <div class="d-flex flex-row user-info">
                                  <img class="rounded-circle" src="/styles/images/purinpost.jpg" width="40">
                                  <div class="d-flex flex-column justify-content-start ml-2">
                                      <span class="d-block font-weight-bold name">Your Name</span>
                                      <span class="date text-black-50">Shared publicly - ${getFormattedDate()}</span>
                                  </div>
                              </div>
                              <div class="mt-2">
                                  <p class="comment-text">${text}</p>
                              </div>
                              <div class="d-flex flex-row fs-12 mt-2">
                                  <div class="like p-2 cursor">
                                      <i class="fa fa-thumbs-o-up"></i>
                                      <span class="ml-1">Like</span>
                                  </div>
                                  <div class="like p-2 cursor">
                                      <i class="fa fa-commenting-o"></i>
                                      <span class="ml-1 reply">Comment</span>
                                  </div>
                                  <div class="like p-2 cursor">
                                      <i class="fa fa-share"></i>
                                      <span class="ml-1">Share</span>
                                  </div>
                              </div>
                          </div>`;
        return div;
    }

    // Event listener for handling comments and replies
    document.body.addEventListener("click", function (e) {
        const target = e.target;

        // Handle the "Add Reply" click
        if (target.classList.contains("reply")) {
            const closestBox = target.closest(".comment-box");
            const postId = closestBox.dataset.postId;
            const closestCard = target.closest(".card");
            closestCard.appendChild(createInputBox(postId));
        }

        // Handle the "Submit" click
        if (target.classList.contains("submit")) {
            const commentDetails = target.closest(".comment-details");
            const postId = commentDetails.dataset.postId;
            const closestCard = target.closest(".card");

            // Log the value of the textarea to the console for debugging
            const textareaValue = commentDetails.querySelector(".comment-details .textarea").value.trim();

            if (textareaValue !== "") {
                closestCard.appendChild(addReply(textareaValue, postId));
                commentDetails.remove();
            }
        }

        if (target.classList.contains("cancel")) {
            const commentDetails = target.closest(".comment-details");
            commentDetails.remove();
        }
    });

    // Function to get the formatted date
    function getFormattedDate() {
        const now = new Date();
        const options = {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        };
        return now.toLocaleString('en-US', options);
    }
});
