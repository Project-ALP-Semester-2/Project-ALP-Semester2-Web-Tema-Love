document.addEventListener('DOMContentLoaded', () => {
    const bookmarksList = document.getElementById('bookmarksList');
    const emptyBookmarks = document.getElementById('emptyBookmarks');
    const searchInput = document.getElementById('searchBookmarks');

    function renderBookmarks(query = '') {

        const savedBookmarks = JSON.parse(localStorage.getItem('unsaid_bookmarks')) || [];

        if (savedBookmarks.length === 0) {
            emptyBookmarks.classList.remove('d-none');
            bookmarksList.innerHTML = '';
            return;
        }

        emptyBookmarks.classList.add('d-none');
        
        const filtered = savedBookmarks.filter(b => {
            if (!query) return true;

            return b.html.toLowerCase().includes(query.toLowerCase());
        });

        bookmarksList.innerHTML = filtered.reverse().map(b => b.html).join('');
    }

    renderBookmarks();

    searchInput.addEventListener('input', (e) => {
        renderBookmarks(e.target.value.trim());
    });
});