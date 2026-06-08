document.addEventListener('DOMContentLoaded', () => {
    const tabs = document.querySelectorAll('.feed-tabs .tab-item');
    const contents = document.querySelectorAll('.tab-content');

    // ==========================================================================
    // 1. LOGIKA TAB SWITCHER (MURNI CSS MANIPULATION - ZERO RELOAD)
    // ==========================================================================
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active', 'fw-bold'));
            contents.forEach(c => c.classList.remove('active'));

            tab.classList.add('active', 'fw-bold');
            const targetId = tab.getAttribute('data-target');
            if (targetId) {
                const targetElement = document.getElementById(targetId);
                if (targetElement) {
                    targetElement.classList.add('active');
                }
            }
        });
    });

    // ==========================================================================
    // 2. LOGIKA AJAX LIKE PROFILE (VERY SMOOTH & TETAP DI HALAMAN DISUKAI)
    // ==========================================================================
    document.addEventListener("submit", function (e) {
        // Deteksi jika form yang di-submit mengarah ke endpoint like toggle
        if (e.target && e.target.action && e.target.action.includes("/like/toggle")) {
            
            // KUNCI UTAMA: Matikan reload paksa dari browser!
            e.preventDefault();

            const form = e.target;
            const formData = new FormData(form);
            
            const button = form.querySelector("button");
            const iconHeart = form.querySelector("i");
            const likeCountSpan = form.nextElementSibling; // Asumsi: <span> jumlah like berada tepat setelah form

            // Cek lokasi element: apakah form like ini berada di dalam tab "Disukai"?
            const isInLikedTab = form.closest('#liked-stories-tab') !== null;
            const postCard = form.closest('.post-card') || form.closest('article');

            // --- OPTIMISTIC UPDATE (Ubah tampilan UI instan dalam 1ms, tanpa nunggu server) ---
            let isCurrentLiked = iconHeart && iconHeart.classList.contains('bi-heart-fill');
            let currentLikes = parseInt(likeCountSpan ? likeCountSpan.textContent : "0") || 0;

            if (isCurrentLiked) {
                // Skenario dari LIKE -> UNLIKE (Hati merah menjadi abu-abu)
                if (iconHeart) iconHeart.className = "bi bi-heart";
                if (button) button.className = "btn p-0 border-0 bg-transparent interaction-btn hover-heart text-muted";
                if (likeCountSpan) likeCountSpan.textContent = Math.max(0, currentLikes - 1);
                
                // Jika user melakukan UNLIKE tepat di dalam tab "Disukai", singkirkan kartu dengan animasi smooth
                if (isInLikedTab && postCard) {
                    postCard.style.transition = "all 0.35s cubic-bezier(0.4, 0, 0.2, 1)";
                    postCard.style.opacity = "0";
                    postCard.style.transform = "scale(0.95)";
                    postCard.style.maxHeight = postCard.offsetHeight + "px";
                    
                    setTimeout(() => {
                        postCard.style.maxHeight = "0px";
                        postCard.style.padding = "0px";
                        postCard.style.margin = "0px";
                        postCard.style.border = "none";
                        
                        setTimeout(() => {
                            postCard.remove();
                            
                            // Jika cerita disukai sudah habis total, tampilkan placeholder kosong (Empty State)
                            const likedTabContainer = document.getElementById('liked-stories-tab');
                            if (likedTabContainer && likedTabContainer.querySelectorAll('.post-card').length === 0) {
                                likedTabContainer.innerHTML = `
                                    <div class="text-center py-5 mt-4 text-muted">
                                        <div style="font-size: 3rem;">🤍</div>
                                        <h5 class="fw-bold mt-3 mb-2" style="color: var(--neutral);">Belum Ada Cerita yang Disukai</h5>
                                        <p style="font-size: 14.5px;">Cerita yang kamu beri hati akan muncul di sini.</p>
                                    </div>`;
                            }
                        }, 150);
                    }, 300);
                }
            } else {
                // Skenario dari UNLIKE -> LIKE (Hati abu-abu menjadi merah)
                if (iconHeart) iconHeart.className = "bi bi-heart-fill";
                if (button) button.className = "btn p-0 border-0 bg-transparent interaction-btn text-danger";
                if (likeCountSpan) likedCeritaIds != null && (likeCountSpan.textContent = currentLikes + 1);
            }

            // --- PROSES BELAKANG LAYAR (Kirim data diam-diam ke Controller API) ---
            fetch("/api/like/toggle", {
                method: "POST",
                body: formData
            })
            .then(res => res.json())
            .then(data => {
                if (data.status === "success") {
                    // Selaraskan jumlah data totalLike asli dari database jika element kartu belum dibuang
                    if (likeCountSpan && (!isInLikedTab || data.liked)) {
                        likeCountSpan.textContent = data.totalLike;
                    }
                } else if (data.status === "unauthorized") {
                    window.location.href = "/auth";
                }
            })
            .catch(err => {
                console.error("Error AJAX Profile Like:", err);
                // Jika koneksi server mendadak terputus, fallback reload halaman agar data aman
                window.location.reload();
            });
        }
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