/* 
This variable stores the current page, like if displayAllPosts is the home page and it is now the home page
then the currentFunction variable's value will be displayAllPosts
*/
let currentFunction = displayAllPosts;

// Load the DOM 
document.addEventListener("DOMContentLoaded", () => {
  // Add event listener for previous button for the pagination  
  document.getElementById("previous-btn").addEventListener("click", () => {
    // When the user clicks this button, then subtract the currentPage value by 1, which is like going to the previous page
    changePageValue("previous");
    if (currentFunction === displayAllPosts) {
        // If the currentFunction variable's value is displayAllPosts
        /* 
        Then it means the current page is the page of displayAllPosts, so we add the function to the event listener that whenever the user clicks on this
        it will run the function below
        */ 
        displayAllPosts();
    }

    else if (currentFunction === displayFollowingUserPosts) {
        // Else if the currentFunction variable's value is displayFollowingUserPosts
        // Then add it to the event listener
        displayFollowingUserPosts();
    } 

    else { 
        // Else, pass in the currentFunction variable's value in displayProfile as arguments.
        // In this case, the currentFunction is displayAllPosts nor displayFollowingUserPosts, it is actually a username which we can pass in as arguments for displayProfile function.
        // Since Every function above doesn't need arguments, but displayProfile function takes arguments and for that we store the username inside the currentFunction variable.
        displayProfile(currentFunction);
    }
  });

  // Add the same thing for the next button for the pagination
  document.getElementById("next-btn").addEventListener("click", () => {
    // When the user clicks this button, then add the currentPage value by 1, which is like going to the next page
    changePageValue("next");
    if (currentFunction === displayAllPosts) {
        displayAllPosts();
    }

    else if (currentFunction === displayFollowingUserPosts) {
        displayFollowingUserPosts();
    }

    else {
        displayProfile(currentFunction);
    }

  });

  try {
    // Add event listener for profile-text-link element
    document.querySelector(".profile-text-link").addEventListener("click", () =>
        // If it is clicked, then display the profile.
        displayProfile(document.querySelector(".profile-text-link").textContent)
      );
    
    // Add event listener for following-posts-text-link element  
    document.querySelector(".following-posts-text-link").addEventListener("click", () => {
        // Set the currentPage element to 1
        // The currentPage element is a hidden element inside the HTML file which keeps track of the current page that the user is currently in
        document.querySelector("#currentPage").innerHTML = 1;
        displayFollowingUserPosts()
    });

  } 
  // If any error occurs, catch the error and do nothing
  catch (error) {}

  // Initially set the currentPage element to 1
  // The currentPage element is a hidden element inside the HTML file which keeps track of the current page that the user is currently in as mentioned above
  document.querySelector("#currentPage").innerHTML = 1;
  // Now run displayAllPosts
  displayAllPosts();
});

function displayAllPosts() {
  // Now set the currentFunction to displayAllPosts, since when ever the user clicks the pagination, then they should run this function again instead of any other functions
  currentFunction = displayAllPosts;  
  // Get the currentPage
  const currentPage = parseInt(
    document.querySelector("#currentPage").textContent
  );

  // Try 
  try {
    document.querySelector("#new-post-div").style.display = "block";
    document.querySelector("hr").style.display = "block";
    document.getElementById("profile-div").innerHTML = "";
  } 
  
  // If caught any error, catch the error and do nothing
  catch (error) {}

  document.querySelector("#all-posts-div-title").style.display = "block";
  document.getElementById("all-posts-div").innerHTML = "";
  // Get all posts of the current page
  fetch(`/all_posts/${currentPage}`)
    .then(resposne => resposne.json())
    .then(result => {
      const allPosts = result.allPosts;
      if (parseInt(allPosts.length) <= 0) {
        try {
          document.querySelector("#new-post-div").style.display = "block";
          document.querySelector("hr").style.display = "block";
        } catch (error) {}

        document.querySelector("#pagination-btn-div").style.display = "none";

        const errorMessage = document.createElement("div");
        errorMessage.innerHTML = `<div class="alert alert-light" role="alert" style="width: 500px; margin: auto; margin-bottom: 10px;">
                                        No Posts found
                                      </div>`;

        document.getElementById("all-posts-div").append(errorMessage);
      } 
      else {
        let index = 0;
        allPosts.forEach((post) => {
          const postDiv = document.createElement("div");
          postDiv.className = "card post-div";
          postDiv.style.width = "800px";
          const postBodyDiv = document.createElement("div");
          postBodyDiv.className = "card-body";
          postBodyDiv.id = index;
          // Get the current user
          fetch("/get_user/currentUser/0")
            .then(response => response.json())
            .then(user => {
             

              if (user === post.user) {
                 fetch(`/get_post/${post.id}`)
                .then(response => response.json())
                .then(result => {
                    const likeCount = result.like_count;
                     postBodyDiv.innerHTML = `<div style="display: flex;">
                                         <a onclick="displayProfile('${post.user}')" class="profile-link"><h5 style="cursor: pointer; color: black;">${post.user}</h5></a>
                                            <button class="edit-btn" onclick="editPost(${postBodyDiv.id}, ${post.id})" style="margin-left: 20px; background-color: rgb(13,110,253); border-radius: 4px; border: none; color: white; padding-left: 10px; padding-right: 10px; padding-bottom: -3px; height: 10%">Edit</button>
                                         </div>
                                        
                                         <p class="card-text">${post.body}</p>
                                         <div style="display: flex;">
                                            <p style="font-size: small; margin-bottom: -10px">Posted at ${post.timestamp}</p>
                                            <button class="like-btn" style="border: none; background: none; outline: none;"><i class="fas fa-heart like-icon" style="color: gray;"></i></button>   
                                            <p class="like-count-p-tag" style="font-size: small; margin-bottom: -5px">${likeCount}</p>   
                                         </div>
                                                 
                                                 `;
                })
               
              } else {
                 fetch(`/get_post/${post.id}`)
                .then(response => response.json())
                .then(result => {
                    const likeCount = result.like_count;
                    const alreadyLiked = result.already_liked;
                    const likeIconClassName = alreadyLiked ? 'fas fa-heart like-icon' : 'far fa-heart like-icon'
                    postBodyDiv.innerHTML = `<a onclick="displayProfile('${post.user}')" class="profile-link"><h5 style="cursor: pointer; color: black;">${post.user}</h5></a> 
                                         <p class="card-text">${post.body}</p>
                                         <div style="display: flex;">
                                            <p style="font-size: small; margin-bottom: -10px">Posted at ${post.timestamp}</p>
                                            <button class="like-btn" onclick="likePost('${post.user}', ${post.id}, ${postBodyDiv.id})" style="border: none; background: none; outline: none;"><i class="${likeIconClassName}" style="color: red;"></i></button>
                                            <p class="like-count-p-tag" style="font-size: small; margin-bottom: -5px">${likeCount}</p>
                                         </div>
                                                 `;

                })
                
              }
            });

          postDiv.append(postBodyDiv);
          document.getElementById("all-posts-div").append(postDiv);

          index += 1;
        });

        const totalPages = result.totalPages;
        // Hide or Show the pagination buttons
        if (totalPages > currentPage) {
          if (currentPage > 1) {
            document.querySelector("#previous-btn").style.display = "block";
            document.querySelector("#next-btn").style.display = "block";
            document.querySelector("#previous-btn").style.marginLeft = "45%";
            document.querySelector("#next-btn").style.marginLeft = "5px";
          } else {
            document.querySelector("#previous-btn").style.display = "none";
            document.querySelector("#next-btn").style.display = "block";
            document.querySelector("#next-btn").style.marginLeft = "47.7777%";
          }
        } else if (totalPages === currentPage) {
          if (totalPages === 1) {
            document.querySelector("#next-btn").style.display = "none";
            document.querySelector("#previous-btn").style.display = "none";
          } else {
            document.querySelector("#next-btn").style.display = "none";
            document.querySelector("#previous-btn").style.display = "block";
            document.querySelector("#previous-btn").style.marginLeft = "47.7777%";
          }
        } else {
          document.querySelector("#next-btn").style.display = "block";
          document.querySelector("#previous-btn").style.display = "block";
          document.querySelector("#previous-btn").style.marginLeft = "45%";
          document.querySelector("#next-btn").style.marginLeft = "5px";
        }
      }
    });
}

function displayProfile(username) {
  
  // Check if the currentFunction variable's value is the username that we got as the argument
  // Because, the currentFunction variable's value is the username, which means the current page is the profile of the user with that username
  // and if the currentFunction variable's value is now a different username, then it means we are in the profile of another user  
  if (currentFunction === username) {} // So if the currentFunction variable's value is the username that we got as the argument, then it means we are in the same page
  else {document.querySelector("#currentPage").innerHTML = 1} // Else we got into another page, but the currentPage will be value of the previous page's value, so to reset it we set the currentPage to 1

  // Now, Set the currentFunction variable to the username, even if it is already the same value or a different value
  currentFunction = username;
  // Then get the currentPage
  const currentPage = parseInt(
    document.querySelector("#currentPage").textContent
  );
  
  // Hide all the elements  
  document.querySelector("#profile-div").innerHTML = "";
  document.querySelector("#all-posts-div").innerHTML = "";
  document.querySelector("#new-post-div").style.display = "none";
  document.querySelector("#all-posts-div-title").style.display = "none";
  document.querySelector("hr").style.display = "none";
  // Reset the pagination
  document.querySelector("#pagination-btn-div").style.display = "none";
  document.querySelector("#pagination-btn-div").style.display = "block";
  // Get the user's data by their username and currentPage 
  fetch(`/get_user/${username}/${currentPage}`)
    .then((resposne) => resposne.json())
    .then((user) => {
      const userNameTitle = document.createElement("h2");
      userNameTitle.style.textAlign = "center";
      userNameTitle.innerHTML = user.username;
      const followersCount = document.createElement("h4");
      followersCount.style.textAlign = "center";
      followersCount.innerHTML = `Followers: ${user.followers}`;
      const followingCount = document.createElement("h4");
      followingCount.style.textAlign = "center";
      followingCount.innerHTML = `Following: ${user.following}`;



      document.querySelector("#profile-div").append(userNameTitle);
      document.querySelector("#profile-div").append(followersCount);
      document.querySelector("#profile-div").append(followingCount);

      if (user.same_user === false) {
        const followBtn = document.createElement("button");
        followBtn.classList = user.user_following ? "btn btn-danger" : "btn btn-success";
        followBtn.innerHTML = user.user_following ? "Unfollow" : "Follow";
        followBtn.style.marginLeft = "47.5555%";
        followBtn.style.marginTop = "15px";
        followBtn.style.marginBottom = "15px";
        followBtn.addEventListener("click", () => followUser(user.username));
        document.querySelector("#profile-div").append(followBtn);
      } 

      else {}      





      const allPostsDiv = document.createElement("div");
      
      if (parseInt(user.all_posts.length) <= 0) {
            document.querySelector("#pagination-btn-div").style.display = "none";

            const errorMessage = document.createElement("div");
            errorMessage.innerHTML = `<div class="alert alert-light" role="alert" style="width: 500px; margin: auto; margin-bottom: 10px;">
                                            No Posts found
                                      </div>`;

            allPostsDiv.append(errorMessage);
      }

      else {
            let index = 0
            user.all_posts.forEach((post) => {
                const postDiv = document.createElement("div");
                postDiv.className = "card post-div";
                postDiv.style.width = "800px";
                const postBodyDiv = document.createElement("div");
                postBodyDiv.className = "card-body";
                postBodyDiv.id = index;
                fetch("/get_user/currentUser/0")
                .then(response => response.json())
                .then(user => {
                

                if (user === post.user) {
                    fetch(`/get_post/${post.id}`)
                    .then(response => response.json())
                    .then(result => {
                        const likeCount = result.like_count;
                        postBodyDiv.innerHTML = `<div style="display: flex;">
                                            <a onclick="displayProfile('${post.user}')" class="profile-link"><h5 style="cursor: pointer; color: black;">${post.user}</h5></a>
                                                <button class="edit-btn" onclick="editPost(${postBodyDiv.id}, ${post.id})" style="margin-left: 20px; background-color: rgb(13,110,253); border-radius: 4px; border: none; color: white; padding-left: 10px; padding-right: 10px; padding-bottom: -3px; height: 10%">Edit</button>
                                            </div>
                                            
                                            <p class="card-text">${post.body}</p>
                                            <div style="display: flex;">
                                                <p style="font-size: small; margin-bottom: -10px">Posted at ${post.timestamp}</p>
                                                <button class="like-btn" style="border: none; background: none; outline: none;"><i class="fas fa-heart like-icon" style="color: gray;"></i></button>   
                                                <p class="like-count-p-tag" style="font-size: small; margin-bottom: -5px">${likeCount}</p>   
                                            </div>
                                                    
                                                    `;
                    })
                
                } else {
                    fetch(`/get_post/${post.id}`)
                    .then(response => response.json())
                    .then(result => {
                        const likeCount = result.like_count;
                        const alreadyLiked = result.already_liked;
                        const likeIconClassName = alreadyLiked ? 'fas fa-heart like-icon' : 'far fa-heart like-icon'
                        postBodyDiv.innerHTML = `<a onclick="displayProfile('${post.user}')" class="profile-link"><h5 style="cursor: pointer; color: black;">${post.user}</h5></a> 
                                            <p class="card-text">${post.body}</p>
                                            <div style="display: flex;">
                                                <p style="font-size: small; margin-bottom: -10px">Posted at ${post.timestamp}</p>
                                                <button class="like-btn" onclick="likePost('${post.user}', ${post.id}, ${postBodyDiv.id})" style="border: none; background: none; outline: none;"><i class="${likeIconClassName}" style="color: red;"></i></button>
                                                <p class="like-count-p-tag" style="font-size: small; margin-bottom: -5px">${likeCount}</p>
                                            </div>
                                                    `;

                    })
                
                }
                
                });

            index += 1;    
            postDiv.append(postBodyDiv);
            document.getElementById("all-posts-div").append(postDiv);
            });
        }
      

      document.querySelector("#profile-div").append(document.createElement("hr"));
      document.querySelector("#profile-div").append(allPostsDiv);

      const totalPages = user.totalPages;
      // Hide or show the pagination buttons
      if (totalPages > currentPage) {
        if (currentPage > 1) {
            document.querySelector("#previous-btn").style.display = "block";
            document.querySelector("#next-btn").style.display = "block";
            document.querySelector("#previous-btn").style.marginLeft = "45%";
            document.querySelector("#next-btn").style.marginLeft = "5px";
        } else {
            document.querySelector("#previous-btn").style.display = "none";
            document.querySelector("#next-btn").style.display = "block";
            document.querySelector("#next-btn").style.marginLeft = "47.7777%";
        }
        } else if (totalPages === currentPage) {
            if (totalPages === 1) {
                document.querySelector("#next-btn").style.display = "none";
                document.querySelector("#previous-btn").style.display = "none";
            } else {
                document.querySelector("#next-btn").style.display = "none";
                document.querySelector("#previous-btn").style.display = "block";
                document.querySelector("#previous-btn").style.marginLeft = "47.7777%";
            }
        } 
    
      else {
            document.querySelector("#next-btn").style.display = "block";
            document.querySelector("#previous-btn").style.display = "block";
            document.querySelector("#previous-btn").style.marginLeft = "45%";
            document.querySelector("#next-btn").style.marginLeft = "5px";
        }

    });
}

function followUser(username) { 
  // We are adding username as an argument instead of POST since for follow_user function, we only need the user's username  
  fetch(`/follow_user/${username}`);
  // After that run the displayAllPosts 
  displayAllPosts();
}

function displayFollowingUserPosts() {
  // Set the currentFunction to displayFollowingUserPosts  
  currentFunction = displayFollowingUserPosts;

  // Get the currentPage  
  const currentPage = parseInt(document.querySelector("#currentPage").textContent)  
  
  // Get all posts of users who the current user is following 
  fetch(`/get_follower_posts/${currentPage}`)
    .then((response) => response.json())
    .then((result) => {
      const allPosts = result.allPosts;   

      if (parseInt(allPosts.length) <= 0) {
        document.querySelector("#profile-div").innerHTML = "";
        document.querySelector("#all-posts-div").innerHTML = "";
        document.querySelector("#new-post-div").style.display = "none";
        document.querySelector("#all-posts-div-title").style.display = "none";
        document.querySelector("#pagination-btn-div").style.display = "block";
        document.querySelector("hr").style.display = "none";
        const postHead = document.createElement("h2");
        postHead.style.textAlign = "center";
        postHead.innerHTML = "Your Following's posts";
        document.getElementById("all-posts-div").append(postHead);
        document
          .getElementById("all-posts-div")
          .append(document.createElement("hr"));

        const errorMessage = document.createElement("div");
        errorMessage.innerHTML = `<div class="alert alert-light" role="alert" style="width: 500px; margin: auto; margin-bottom: 10px;">
                                        You are not following anybody
                                      </div>`;

        document.getElementById("all-posts-div").append(errorMessage);
      } 
      
      else {
        document.querySelector("#profile-div").innerHTML = "";
        document.querySelector("#all-posts-div").innerHTML = "";
        document.querySelector("#new-post-div").style.display = "none";
        document.querySelector("#all-posts-div-title").style.display = "none";
        document.querySelector("#pagination-btn-div").style.display = "block";
        document.querySelector("hr").style.display = "none";
        const postHead = document.createElement("h2");
        postHead.style.textAlign = "center";
        postHead.innerHTML = "Your Following's posts";
        document.getElementById("all-posts-div").append(postHead);
        document.getElementById("all-posts-div").append(document.createElement("hr"));
        let index = 0;
        allPosts.forEach((post) => {
          
            const postDiv = document.createElement("div");
            postDiv.className = "card post-div";
            postDiv.style.width = "800px";
            const postBodyDiv = document.createElement("div");
            postBodyDiv.className = "card-body";
            postBodyDiv.id = index;
            fetch(`/get_post/${post.id}`)
                .then(response => response.json())
                .then(result => {
                    const likeCount = result.like_count;
                    const alreadyLiked = result.already_liked;
                    const likeIconClassName = alreadyLiked ? 'fas fa-heart like-icon' : 'far fa-heart like-icon'
                    postBodyDiv.innerHTML = `<a onclick="displayProfile('${post.user}')" class="profile-link"><h5 style="cursor: pointer; color: black;">${post.user}</h5></a> 
                                         <p class="card-text">${post.body}</p>
                                         <div style="display: flex;">
                                            <p style="font-size: small; margin-bottom: -10px">Posted at ${post.timestamp}</p>
                                            <button class="like-btn" onclick="likePost('${post.user}', ${post.id}, ${postBodyDiv.id})" style="border: none; background: none; outline: none;"><i class="${likeIconClassName}" style="color: red;"></i></button>
                                            <p class="like-count-p-tag" style="font-size: small; margin-bottom: -5px">${likeCount}</p>
                                         </div>
                                                 `;

                })

              postDiv.append(postBodyDiv);
              document.getElementById("all-posts-div").append(postDiv);

              index += 1;
                
                }
            )

        };
        const totalPages = result.totalPages;
        // Hide or show the pagination buttons
        if (totalPages > currentPage) {
          if (currentPage > 1) {
            document.querySelector("#previous-btn").style.display = "block";
            document.querySelector("#next-btn").style.display = "block";
            document.querySelector("#previous-btn").style.marginLeft = "45%";
            document.querySelector("#next-btn").style.marginLeft = "5px";
          } else {
            document.querySelector("#previous-btn").style.display = "none";
            document.querySelector("#next-btn").style.display = "block";
            document.querySelector("#next-btn").style.marginLeft = "47.7777%";
          }
        } else if (totalPages === currentPage) {
          if (totalPages === 1) {
            document.querySelector("#next-btn").style.display = "none";
            document.querySelector("#previous-btn").style.display = "none";
          } else {
            document.querySelector("#next-btn").style.display = "none";
            document.querySelector("#previous-btn").style.display = "block";
            document.querySelector("#previous-btn").style.marginLeft = "47.7777%";
          }
        } else {
          document.querySelector("#next-btn").style.display = "block";
          document.querySelector("#previous-btn").style.display = "block";
          document.querySelector("#previous-btn").style.marginLeft = "45%";
          document.querySelector("#next-btn").style.marginLeft = "5px";
        }
    });

};

function changePageValue(method) {
  if (method === "previous") {
    // If given argument is "previous"
    // Then subtract the currentPage with 1
    document.querySelector("#currentPage").innerHTML =
      parseInt(document.querySelector("#currentPage").textContent) - 1;
  } else {
    // If given argument is "next"
    // Then add the currentPage with 1
    document.querySelector("#currentPage").innerHTML =
      parseInt(document.querySelector("#currentPage").textContent) + 1;

  }
}

function editPost(postBodyDivID, postID) {
  postID = parseInt(postID); // The ID of the post to be edited
  const postBodyDiv = document.getElementById(postBodyDivID); // Get the div of the post
  const previousContent = postBodyDiv.querySelector(".card-text"); // Get the content of the post
  const textArea = document.createElement("textarea"); // Create a textarea element for users to type in the new content
  textArea.className = "edit-post-textarea";
  textArea.style.width = "750px";
  textArea.style.outline = "none";
  textArea.style.padding = "2px";
  textArea.innerHTML = previousContent.textContent; // Also add the previous content into the textarea
  const saveBtn = document.createElement("button"); // Create save button to save the content typed in the textarea
  saveBtn.className = "btn btn-primary";
  saveBtn.style.outline = "none";
  saveBtn.innerHTML = "Save";
  postBodyDiv.replaceChild(textArea, previousContent); // Replace the previous content with the textarea
  postBodyDiv.append(saveBtn); // Also add save button to the body of the post
  saveBtn.addEventListener("click", () => {
    saveEditedPosts(textArea.value, postID); // Save the post 
    const newCardText = document.createElement("p"); // Create new element to store the new content
    newCardText.className = "card-text";
    newCardText.innerHTML = textArea.value;
    postBodyDiv.replaceChild(newCardText, textArea); // Then replace the text area with the new content
    postBodyDiv.removeChild(saveBtn); // Then also remove the save button
  });
}

function saveEditedPosts(postContent, postID) {
  // Send the new data in PUT method
  fetch(`/edit_post/${postID}`, {
    method: "PUT",
    body: JSON.stringify({
      content: postContent,
    }),
  })
    .then((response) => response.json())
    .then((result) => {
      console.log(result);
    });
}


function likePost(username, postID, postBodyDivID) {
    postID = parseInt(postID) // The ID of the post which got liked by the user
    const postBodyDiv = document.getElementById(postBodyDivID); // Get the div of the post
    // Send the data in POST method
    fetch(`/like_post`, {
        method: "POST",
        body: JSON.stringify({
            username: username,
            post_id: postID
        }),
    })
    .then(response => response.json())
    .then(result => {
        // Print the result 
        console.log(result.message);
        // Check if the like icon is far fa-heart (outlined heart icon)
        if (postBodyDiv.querySelector(".like-icon").className === "far fa-heart like-icon") {
            // If so change it to fas fa-heart (solid heart icon) 
            postBodyDiv.querySelector(".like-icon").className = "fas fa-heart like-icon";
            // Then update the like count
            postBodyDiv.querySelector(".like-count-p-tag").innerHTML = parseInt(result.like_count)
        }

        // Else
        else {
            // Change the fas fa-heart (solid heart icon) to far fa-heart (outlined heart icon)
            postBodyDiv.querySelector(".like-icon").className = "far fa-heart like-icon";
            // Then update the like count
            postBodyDiv.querySelector(".like-count-p-tag").innerHTML = parseInt(result.like_count)
        }

    })
}