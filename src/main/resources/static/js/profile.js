document.addEventListener('DOMContentLoaded', () => {
    const profileFeed = document.getElementById('profileFeed');
    const tabs = document.querySelectorAll('.feed-tabs .tab-item');
    const storiesCountHead = document.getElementById('storiesCountHead');

    function renderProfileTab(tabName) {
        profileFeed.innerHTML = '';
        
        if (tabName === 'my-stories') {
            profileFeed.innerHTML = defaultMyStoriesHTML;
            storiesCountHead.innerText = "1 cerita";
        } else if (tabName === 'liked-stories') {
            profileFeed.innerHTML = likedStoriesHTML;
        }
    }

    renderProfileTab('my-stories');

    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            tabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            renderProfileTab(this.getAttribute('data-tab'));
        });
    });
});