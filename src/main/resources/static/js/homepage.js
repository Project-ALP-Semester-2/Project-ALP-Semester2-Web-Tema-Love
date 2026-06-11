function toggleKomentar(ceritaId) {
    var areaKomentar = document.getElementById('area-komentar-' + ceritaId);
    if (areaKomentar) {
        areaKomentar.classList.toggle('d-none');
    }
}

document.addEventListener('DOMContentLoaded', function () {
    /* AMBIL PARAMETER URL */
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get('userId'); 
    const token = urlParams.get('token');

    /* ELEMENT INITIALIZATION */
    const semuaTombolVote = document.querySelectorAll(".btn-vote");
    const checkboxes = document.querySelectorAll(".tag-checkbox");
    const finalTagsInput = document.getElementById("finalTagsInput");
    const labelDropdown = document.getElementById("selectedTagsLabel");
    const tabItems = document.querySelectorAll('.feed-tabs .tab-item');
    const forYouTabContent = document.getElementById('foryou-tab');
    const followingTabContent = document.getElementById('following-tab');
    const imageInput = document.getElementById('imageInput');
    const imagePreviewContainer = document.getElementById('imagePreviewContainer');
    const imagePreview = document.getElementById('imagePreview');
    const tagInputContainer = document.getElementById('tagInputContainer');
    // --- TAMBAHKAN LOGIKA INI AGAR POSISI TAB TIDAK RESET SAAT RELOAD ---
    const activeTabParam = urlParams.get('activeTab');
    if (activeTabParam === 'following') {
        // 1. Pindahkan status tombol aktif ke tab following
        tabItems.forEach(t => t.classList.remove('active', 'fw-bold'));
        const followingBtn = document.querySelector('.feed-tabs .tab-item[data-tab="following"]');
        if (followingBtn) followingBtn.classList.add('active', 'fw-bold');

        // 2. Tampilkan konten following dan sembunyikan foryou
        if (forYouTabContent) {
            forYouTabContent.classList.remove('active');
            forYouTabContent.classList.add('d-none');
        }
        if (followingTabContent) {
            followingTabContent.classList.add('active');
            followingTabContent.classList.remove('d-none');
        }
    }
    let currentImageBase64 = '';

    /* LOGIKA AJAX VOTING / RATING */
    semuaTombolVote.forEach(button => {
        button.addEventListener("click", function (e) {
            e.preventDefault(); 

            const votingBox = this.closest(".voting-box");
            const ceritaId = votingBox.getAttribute("data-id"); 
            const pilihanVote = this.getAttribute("data-vote"); 

            if (!ceritaId) {
                console.error("ID Cerita tidak ditemukan!");
                return;
            }

            const formData = new FormData();
            formData.append("ceritaId", ceritaId);
            // Kunci Perbaikan: Kirim sesuai kebutuhan Spring Controller (menggunakan data userId/username aktif)
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
                    const tombolContainer = votingBox.querySelector(".d-flex.gap-2.mb-2");
                    if (tombolContainer) tombolContainer.classList.add("d-none");

                    const voteResult = votingBox.querySelector(".vote-result");
                    voteResult.classList.remove("d-none");

                    votingBox.querySelector(".vote-pct-healthy").textContent = `${data.pctHealthy}% Healthy`;
                    votingBox.querySelector(".vote-pct-toxic").textContent = `${data.pctToxic}% Toxic`;
                    votingBox.querySelector(".vote-total").textContent = `${data.totalVote} suara`;

                    const barWrap = votingBox.querySelector(".vote-bar-wrap");
                    if (barWrap) {
                        barWrap.style.background = `linear-gradient(to right, var(--primary-dark) ${data.pctHealthy}%, var(--secondary-dark) ${data.pctHealthy}%)`;
                    }
                } else {
                    alert("Gagal menyimpan vote: " + data.message);
                }
            })
            .catch(err => console.error("Error Fetch Voting:", err));
        });
    });

    /* LOGIKA CHECKBOX KATEGORI / TAG */
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener("change", function () {
            const checkedValues = Array.from(checkboxes)
                                       .filter(i => i.checked)
                                       .map(i => i.value);

            if (checkedValues.length > 0) {
                finalTagsInput.value = checkedValues.join(","); 
                labelDropdown.textContent = `Terpilih (${checkedValues.length}): ` + checkedValues.join(", ");
            } else {
                finalTagsInput.value = "";
                labelDropdown.textContent = "Pilih Kategori Cerita (Bisa > 1)...";
            }
        });
    });

    /* LOGIKA DISPLAY FORM INPUT TAG */
    if (document.getElementById('btnTag')) {
        document.getElementById('btnTag').addEventListener('click', () => {
            if (tagInputContainer) {
                tagInputContainer.classList.toggle('d-none');
            }
        });
    }

    /* ==========================================================================
       LOGIKA TAB SWITCHING (KONSISTEN & BERSIH — ZERO REFRESH)
       ========================================================================== */
    tabItems.forEach(tab => {
        tab.addEventListener('click', function () {
            // 1. Reset status aktif visual pada teks tab button
            tabItems.forEach(t => t.classList.remove('active', 'fw-bold'));
            
            // 2. Beri efek tebal dan aktif pada tab yang dipilih
            this.classList.add('active', 'fw-bold');

            // 3. Ambil tanda pengenal tab (foryou / following)
            const targetTab = this.getAttribute('data-tab');

            // 4. Lakukan manipulasi class active / d-none secara bergantian
            if (targetTab === 'foryou') {
                if (forYouTabContent) {
                    forYouTabContent.classList.add('active');
                    forYouTabContent.classList.remove('d-none');
                }
                if (followingTabContent) {
                    followingTabContent.classList.remove('active');
                    followingTabContent.classList.add('d-none');
                }
            } else if (targetTab === 'following') {
                if (followingTabContent) {
                    followingTabContent.classList.add('active');
                    followingTabContent.classList.remove('d-none');
                }
                if (forYouTabContent) {
                    forYouTabContent.classList.remove('active');
                    forYouTabContent.classList.add('d-none');
                }
            }
            // Tambahkan ini di baris paling bawah sebelum penutupan event listener click tabItems
            urlParams.set('activeTab', targetTab);
            window.history.replaceState({}, '', `${window.location.pathname}?${urlParams.toString()}`);
        });
    });

    /* LOGIKA IMAGE PREVIEW */
    if (document.getElementById('btnImage')) {
        document.getElementById('btnImage').addEventListener('click', () => imageInput.click());
    }
    
    if (imageInput) {
        imageInput.addEventListener('change', function (e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function (event) {
                    currentImageBase64 = event.target.result;
                    imagePreview.src = currentImageBase64;
                    imagePreviewContainer.classList.remove('d-none');
                };
                reader.readAsDataURL(file);
            }
        });
    }
    
    if (document.getElementById('btnRemoveImage')) {
        document.getElementById('btnRemoveImage').addEventListener('click', () => {
            currentImageBase64 = ''; 
            imageInput.value = ''; 
            imagePreviewContainer.classList.add('d-none');
        });
    }

    /* ==========================================================================
       LOGIKA AJAX LIKE / EMPATI (MURNI MEMBAJAK SUBMIT FORM ASLI)
       ========================================================================== */
    document.querySelectorAll('form[action="/like/toggle"]').forEach(form => {
        form.addEventListener("submit", function (e) {
            // 1. Cegat pengiriman form agar halaman TIDAK REFRESH / KEDIP
            e.preventDefault();

            // 2. Bungkus otomatis data form asli (ceritaId, userId, token)
            const formData = new FormData(this);
            
            // 3. Ambil target element icon, counter text, dan tombol di dalam form ini
            const button = this.querySelector("button");
            const iconHeart = this.querySelector("i");
            const likeCountSpan = this.nextElementSibling; // Asumsi: <span> jumlah like berada tepat setelah form

            // 4. Kirim data ke RestController baru secara senyap di background
            fetch("/api/like/toggle", {
                method: "POST",
                body: formData
            })
            .then(res => res.json())
            .then(data => {
                if (data.status === "success") {
                    // 5. Update tampilan tombol dan jumlah like sesuai data dari server
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
        });
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