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

    /* ==========================================================================
       LOGIKA AJAX BOOKMARK (MURNI MEMBAJAK SUBMIT FORM ASLI)
       ========================================================================== */
    document.querySelectorAll('.form-bookmark-ajax').forEach(form => {
        form.addEventListener("submit", function (e) {
            // 1. Cegat pengiriman form standar agar browser tidak reload halaman
            e.preventDefault();

            // 2. Bungkus data input tersembunyi (ceritaId, userId, token)
            const formData = new FormData(this);
            
            // 3. Ambil target button dan icon di dalam form ini untuk di-update komponennya
            const button = this.querySelector("button");
            const iconBookmark = this.querySelector("i");

            // 4. Kirim data ke BookmarkRestController secara asinkron (background)
            fetch("/api/bookmark/toggle", {
                method: "POST",
                body: formData
            })
            .then(res => res.json())
            .then(data => {
                if (data.status === "success") {
                    // 5. Ubah visual icon dan class warna tombol secara instan berdasarkan respons database
                    if (data.bookmarked) {
                        // Jika berhasil dibookmark: nyalakan warna biru dan isi penuh icon-nya
                        button.className = "btn p-0 border-0 bg-transparent text-primary interaction-btn";
                        if (iconBookmark) iconBookmark.className = "bi bi-bookmark-fill";
                    } else {
                        // Jika dibatalkan/dihapus dari bookmark: kembalikan ke abu-abu murni
                        button.className = "btn p-0 border-0 bg-transparent text-muted hover-primary interaction-btn";
                        if (iconBookmark) iconBookmark.className = "bi bi-bookmark";
                    }
                } else if (data.status === "unauthorized") {
                    // Proteksi keamanan: Tendang ke halaman auth jika token kadaluwarsa/salah
                    window.location.href = "/auth";
                } else {
                    console.error("Gagal melakukan bookmark:", data.message);
                }
            })
            .catch(err => console.error("Error AJAX Bookmark:", err));
        });
    });
});