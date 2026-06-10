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

// ==========================================================================
// 3. LOGIKA AJAX VOTING / RATING (ADAPTASI BERDASARKAN HTML LU 100%)
// ==========================================================================
document.addEventListener("click", function (e) {
    const button = e.target.closest(".btn-vote");
    if (button) {
        e.preventDefault();

        const urlParams = new URLSearchParams(window.location.search);
        const userId = urlParams.get('userId'); 
        const token = urlParams.get('token');

        const votingBox = button.closest(".voting-box");
        const ceritaId = votingBox.getAttribute("data-id"); 
        const pilihanVote = button.getAttribute("data-vote"); 

        if (!ceritaId) {
            console.error("ID Cerita tidak ditemukan!");
            return;
        }

        const formData = new FormData();
        formData.append("ceritaId", ceritaId);
        formData.append("username", userId); 
        formData.append("pilihan", pilihanVote);
        formData.append("token", token);

        fetch("/api/rating/vote", {
            method: "POST",
            body: formData
        })
        .then(res => res.json())
        .then(data => {
            if (data.status === "success") {
                // SELEKTOR DISESUAIKAN: Cari pembungkus tombol berdasarkan tombol itu sendiri
                const tombolContainer = button.parentElement;
                if (tombolContainer) {
                    tombolContainer.classList.add("d-none");
                }

                // Munculkan area hasil vote bawaan HTML lu
                const voteResult = votingBox.querySelector(".vote-result");
                if (voteResult) {
                    voteResult.classList.remove("d-none");
                }

                // Update teks angka persentase baru ke element HTML lu yang sekarang
                const pctHealthyText = votingBox.querySelector(".vote-pct-healthy");
                const pctToxicText = votingBox.querySelector(".vote-pct-toxic");
                const totalVoteText = votingBox.querySelector(".vote-total");

                if (pctHealthyText) pctHealthyText.textContent = `${data.pctHealthy}% Healthy`;
                if (pctToxicText) pctToxicText.textContent = `${data.pctToxic}% Toxic`;
                if (totalVoteText) totalVoteText.textContent = `${data.totalVote} suara`;

                // Update gradasi warna progress bar bawaan HTML lu (width tetep 100% sesuai gaya lu)
                const barWrap = votingBox.querySelector(".vote-bar-wrap");
                if (barWrap) {
                    barWrap.style.background = `linear-gradient(to right, var(--primary-dark) ${data.pctHealthy}%, var(--secondary-dark) ${data.pctHealthy}%)`;
                }
            } else {
                alert("Gagal menyimpan vote: " + data.message);
            }
        })
        .catch(err => console.error("Error Fetch Voting:", err));
    }
});