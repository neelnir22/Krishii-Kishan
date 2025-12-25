// Check auth
async function checkAuth() {
    try {
        const res = await fetch("/api/auth/me");
        if (!res.ok) return null;
        return await res.json();
    } catch (err) {
        return null;
    }
}

// Modal functionality
const modal = document.getElementById("newPostModal");
const newPostBtn = document.getElementById("newPostBtn");
const closeModal = document.querySelector(".close-modal");

newPostBtn.addEventListener("click", async () => {
    const auth = await checkAuth();
    if (!auth) {
        alert("Please login to create a post.");
        return;
    }
    modal.style.display = "block";
    document.body.classList.add("modal-open");
});

closeModal.addEventListener("click", () => {
  modal.style.display = "none";
  document.body.classList.remove("modal-open");
});

window.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.style.display = "none";
    document.body.classList.remove("modal-open");
  }
});

// Form submission
const newPostForm = document.getElementById("newPostForm");
const forumPosts = document.querySelector(".forum-posts");

function createPostElement(postData) {
  const postCard = document.createElement("div");
  postCard.className = "post-card";
  postCard.innerHTML = `
    <div class="post-header">
      <div class="post-author">
        <img src="https://via.placeholder.com/40" alt="User" class="author-avatar" />
        <div class="author-info">
          <h4>${postData.authorName || "User"}</h4>
          <span class="post-time">${new Date(postData.createdAt).toLocaleDateString()}</span>
        </div>
      </div>
      <span class="post-category">${postData.category}</span>
    </div>
    <div class="post-content">
      <h3>${postData.title}</h3>
      <p>${postData.content}</p>
    </div>
    <div class="post-actions">
      <button class="action-btn">
        <i class="far fa-comment"></i> ${postData.comments ? postData.comments.length : 0} Comments
      </button>
      <button class="action-btn">
        <i class="far fa-heart"></i> ${postData.likes ? postData.likes.length : 0} Likes
      </button>
      <button class="action-btn">
        <i class="fas fa-share"></i> Share
      </button>
    </div>
  `;
  return postCard;
}

// Fetch posts on load
async function loadPosts() {
    try {
        const res = await fetch("/api/posts");
        const data = await res.json();
        if(data.success && data.posts) {
            forumPosts.innerHTML = ""; // Clear placeholders
            data.posts.forEach(post => {
                const el = createPostElement(post);
                forumPosts.appendChild(el);
            });
        }
    } catch(err) {
        console.error("Failed to load posts", err);
    }
}
loadPosts();

newPostForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const auth = await checkAuth();
  if(!auth) {
      alert("Please login.");
      return;
  }

  // Get form data
  const title = document.getElementById("postTitle").value;
  const category = document.getElementById("postCategory").value;
  const content = document.getElementById("postContent").value;

  try {
      const res = await fetch("/api/posts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
              userId: auth.user._id,
              authorName: auth.user.fullName,
              title,
              category,
              content
          })
      });
      
      const data = await res.json();
      if(res.ok && data.success) {
          // Add new post to top
          const newPost = createPostElement(data.post);
          forumPosts.insertBefore(newPost, forumPosts.firstChild);

          // Reset form and close modal
          newPostForm.reset();
          modal.style.display = "none";
          document.body.classList.remove("modal-open");

          // Show success message
          alert("Post created successfully!");
      } else {
          alert("Failed to create post");
      }
  } catch(err) {
      console.error(err);
      alert("Error posting.");
  }
});
