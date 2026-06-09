// ==========================================================================
// 1. LOGIKA AJAX BOOKMARK (FINAL & BERSIH TANPA SAMPAH LOCALSTORAGE)
// ==========================================================================
document.addEventListener("submit", function (e) {
    // Deteksi lewat class form biar akurat dan anti-gagal
    if (e.target && e.target.classList.contains('form-bookmark-ajax')) {
        
        // JINAKKAN REFRESH BROWSER!
        e.preventDefault();

        const form = e.target;
        const formData = new FormData(form);
        const postCard = form.closest('.post-card') || form.closest('article');

        // --- OPTIMISTIC UPDATE (Kartu langsung hilang smooth dalam 1ms) ---
        if (postCard) {
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
                    
                    // Cek jika sisa kartu di dalam '#bookmarksList' sudah habis
                    const listDaftar = document.getElementById('bookmarksList');
                    if (listDaftar && listDaftar.querySelectorAll('.post-card').length === 0) {
                        listDaftar.innerHTML = `
                            <div class="text-center py-5 mt-5">
                                <h3 class="fw-bold mb-2" style="color: var(--neutral); font-family: var(--font-body); font-size: 1.5rem;">Save posts for later</h3>
                                <p class="text-muted mx-auto" style="font-size: 14.5px; max-width: 320px; line-height: 1.5;">Bookmark posts to easily find them again in the future.</p>
                            </div>`;
                        }
                }, 150);
            }, 300);
        }

        // --- PROSES BELAKANG LAYAR (Kirim data diam-diam ke Controller) ---
        fetch("/api/bookmark/toggle", {
            method: "POST",
            body: formData
        })
        .then(res => res.json())
        .then(data => {
            if (data.status === "unauthorized") {
                window.location.href = "/auth";
            }
        })
        .catch(err => {
            console.error("Error AJAX Bookmark:", err);
            window.location.reload();
        });
    }
});

// ==========================================================================
// 2. LOGIKA AJAX LIKE / EMPATI (SAMA PERSIS DENGAN KODE LU)
// ==========================================================================
document.addEventListener("submit", function (e) {
    if (e.target && e.target.action && e.target.action.includes("/like/toggle")) {
        e.preventDefault();

        const form = e.target;
        const formData = new FormData(form);
        
        const button = form.querySelector("button");
        const iconHeart = form.querySelector("i");
        const likeCountSpan = form.nextElementSibling;

        fetch("/api/like/toggle", {
            method: "POST",
            body: formData
        })
        .then(res => res.json())
        .then(data => {
            if (data.status === "success") {
                if (data.liked) {
                    button.className = "btn p-0 border-0 bg-transparent interaction-btn text-danger";
                    if (iconHeart) iconHeart.className = "bi bi-heart-fill";
                } else {
                    button.className = "btn p-0 border-0 bg-transparent interaction-btn hover-heart text-muted";
                    if (iconHeart) iconHeart.className = "bi bi-heart";
                }
                
                if (likeCountSpan) {
                    likeCountSpan.textContent = data.totalLike;
                }
            } else if (data.status === "unauthorized") {
                window.location.href = "/auth";
            }
        })
        .catch(err => console.error("Error AJAX Like:", err));
    }
});