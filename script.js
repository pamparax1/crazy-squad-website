// Hide all content sections initially
document.addEventListener('DOMContentLoaded', function() {
    // Hide all content sections initially
    const contents = document.querySelectorAll('.content');
    contents.forEach(content => {
        content.style.display = 'none';
    });

    // Add active state to buttons
    const buttons = document.querySelectorAll('.dropbtn');
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            buttons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
        });
    });

    // Video handling
    const video = document.getElementById('emoVideo');
    if (video) {
        // Debug video loading
        console.log('Video element found:', video);
        
        // Force video reload
        video.load();

        // Event listeners for video states
        const videoEvents = ['loadstart', 'loadedmetadata', 'loadeddata', 'canplay', 'play', 'playing'];
        videoEvents.forEach(eventName => {
            video.addEventListener(eventName, () => {
                console.log(`Video event: ${eventName}`);
            });
        });

        // Handle video errors with specific messages
        video.addEventListener('error', (e) => {
            const error = video.error;
            let errorMessage = 'An error occurred';
            
            if (error) {
                switch (error.code) {
                    case 1:
                        errorMessage = 'Video loading aborted';
                        break;
                    case 2:
                        errorMessage = 'Network error';
                        break;
                    case 3:
                        errorMessage = 'Video decoding failed';
                        break;
                    case 4:
                        errorMessage = 'Video not supported';
                        break;
                }
                console.error('Video error:', errorMessage, error);
            }
        });

        // Try playing when metadata is loaded
        video.addEventListener('loadedmetadata', async () => {
            try {
                // Set initial time to 0
                video.currentTime = 0;
                console.log('Video duration:', video.duration);
                console.log('Video ready to play');
            } catch (err) {
                console.error('Error setting video time:', err);
            }
        });

        // Double click for fullscreen
        video.addEventListener('dblclick', () => {
            if (document.fullscreenElement) {
                document.exitFullscreen();
            } else {
                video.requestFullscreen().catch(err => {
                    console.error('Fullscreen error:', err);
                });
            }
        });

        // Log supported mime types
        const videoTypes = ['video/mp4', 'video/quicktime', 'video/x-m4v'];
        videoTypes.forEach(type => {
            console.log(`Browser support for ${type}:`, video.canPlayType(type));
        });
    } else {
        console.error('Video element not found');
    }

    // Comment handling functions
    function addComment(person) {
        const commentText = document.getElementById(`${person}-comment`).value;
        if (!commentText.trim()) return;

        const comments = JSON.parse(localStorage.getItem(`${person}-comments`) || '[]');
        comments.push({
            text: commentText,
            date: new Date().toLocaleString()
        });
        localStorage.setItem(`${person}-comments`, JSON.stringify(comments));
        
        document.getElementById(`${person}-comment`).value = '';
        loadComments(person);
    }

    function loadComments(person) {
        const commentsContainer = document.getElementById(`${person}-comments`);
        if (!commentsContainer) return;

        const comments = JSON.parse(localStorage.getItem(`${person}-comments`) || '[]');
        commentsContainer.innerHTML = comments.map(comment => `
            <div class="comment">
                <div class="comment-text">${comment.text}</div>
                <div class="comment-date">${comment.date}</div>
            </div>
        `).join('');
    }

    // Load comments when page loads
    const personMatch = window.location.pathname.match(/(\w+)\.html$/);
    if (personMatch) {
        loadComments(personMatch[1]);
    }

    // Function to show selected content
    function showContent(contentId) {
        // Hide all content sections
        const contents = document.querySelectorAll('.content');
        contents.forEach(content => {
            content.style.display = 'none';
        });

        // Show selected content with animation
        const selectedContent = document.getElementById(contentId);
        if (selectedContent) {
            selectedContent.style.display = 'block';
            selectedContent.style.opacity = '0';
            selectedContent.style.transform = 'translateY(20px)';
            
            // Trigger reflow
            selectedContent.offsetHeight;
            
            // Add animation
            selectedContent.style.transition = 'opacity 0.5s ease-out, transform 0.5s ease-out';
            selectedContent.style.opacity = '1';
            selectedContent.style.transform = 'translateY(0)';
        }
    }

    // Function to add a new comment
    function addComment(person) {
        const input = document.getElementById(`${person}-comment-input`);
        const commentsContainer = document.getElementById(`${person}-comments`);
        
        if (input.value.trim() === '') return;

        const comment = {
            text: input.value,
            date: new Date().toLocaleString('bg-BG')
        };

        // Create comment element
        const commentElement = document.createElement('div');
        commentElement.className = 'comment';
        commentElement.innerHTML = `
            <div class="comment-text">${comment.text}</div>
            <div class="comment-date">${comment.date}</div>
        `;

        // Add comment to container
        commentsContainer.appendChild(commentElement);

        // Save comment
        saveComment(person, comment);

        // Clear input
        input.value = '';
    }

    // Function to save comments to localStorage
    function saveComment(person, comment) {
        let comments = JSON.parse(localStorage.getItem(`${person}Comments`) || '[]');
        comments.push(comment);
        localStorage.setItem(`${person}Comments`, JSON.stringify(comments));
    }

    // Function to load comments from localStorage
    function loadComments() {
        const people = ['emo', 'yoan', 'dosev', 'sasho'];
        
        people.forEach(person => {
            const comments = JSON.parse(localStorage.getItem(`${person}Comments`) || '[]');
            const commentsContainer = document.getElementById(`${person}-comments`);
            
            comments.forEach(comment => {
                const commentElement = document.createElement('div');
                commentElement.className = 'comment';
                commentElement.innerHTML = `
                    <div class="comment-text">${comment.text}</div>
                    <div class="comment-date">${comment.date}</div>
                `;
                commentsContainer.appendChild(commentElement);
            });
        });
    }

    // Add keyboard shortcut for submitting comments
    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.key === 'Enter') {
            const activeTextarea = document.activeElement;
            if (activeTextarea.tagName === 'TEXTAREA') {
                const person = activeTextarea.id.split('-')[0];
                addComment(person);
            }
        }
    });
});
