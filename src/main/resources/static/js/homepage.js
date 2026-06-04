document.addEventListener('DOMContentLoaded', function () {
    /* TAB SWITCHING */
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get('userId');
    const token = urlParams.get('token');

    // 2. Ambil semua tombol vote
    const semuaTombolVote = document.querySelectorAll(".btn-vote");

    semuaTombolVote.forEach(button => {
        button.addEventListener("click", function (e) {
            e.preventDefault(); // Mencegah reload paksa

            const votingBox = this.closest(".voting-box");
            
            // PERBAIKAN UTAMA: Ambil data-id yang sudah dirender Thymeleaf, bukan th:data-id!
            const ceritaId = votingBox.getAttribute("data-id"); 
            const pilihanVote = this.getAttribute("data-vote"); // "HEALTHY" atau "TOXIC"

            if (!ceritaId) {
                console.error("ID Cerita tidak ditemukan pada elemen .voting-box!");
                return;
            }

            // 3. Bungkus data untuk dikirim ke RatingRestController
            const formData = new FormData();
            formData.append("ceritaId", ceritaId);
            formData.append("username", userId);
            formData.append("pilihan", pilihanVote);
            formData.append("token", token);

            // 4. Tembak API Backend
            fetch("/api/rating/vote", {
                method: "POST",
                body: formData
            })
            .then(res => res.json())
            .then(data => {
                if (data.status === "success") {
                    // Sembunyikan container tombol vote
                    const tombolContainer = votingBox.querySelector(".d-flex.gap-2.mb-2");
                    if (tombolContainer) tombolContainer.classList.add("d-none");

                    // Munculkan container hasil (buka d-none)
                    const voteResult = votingBox.querySelector(".vote-result");
                    voteResult.classList.remove("d-none");

                    // Update Teks Persentase & Total Suara langsung dari respon DB Backend
                    votingBox.querySelector(".vote-pct-healthy").textContent = `${data.pctHealthy}% Healthy`;
                    votingBox.querySelector(".vote-pct-toxic").textContent = `${data.pctToxic}% Toxic`;
                    votingBox.querySelector(".vote-total").textContent = `${data.totalVote} suara`;

                    // Jalankan animasi progress bar hijau
                    const barWrap = votingBox.querySelector(".vote-bar-wrap");
                    if (barWrap) {
                        // Suntikkan style linear-gradient langsung lewat JS
                        barWrap.style.background = `linear-gradient(to right, var(--primary-dark) ${data.pctHealthy}%, var(--secondary-dark) ${data.pctHealthy}%)`;
                    }
                } else {
                    alert("Gagal menyimpan vote: " + data.message);
                }
            })
            .catch(err => console.error("Error Fetch Voting:", err));
        });
    });

    const checkboxes = document.querySelectorAll(".tag-checkbox");
    const finalTagsInput = document.getElementById("finalTagsInput");
    const labelDropdown = document.getElementById("selectedTagsLabel");

    checkboxes.forEach(checkbox => {
        checkbox.addEventListener("change", function () {
            // Ambil semua value dari checkbox yang sedang di-centang
            const checkedValues = Array.from(checkboxes)
                                       .filter(i => i.checked)
                                       .map(i => i.value);

            if (checkedValues.length > 0) {
                // 1. Gabungkan dengan koma untuk dikirim ke database backend
                finalTagsInput.value = checkedValues.join(","); 
                
                // 2. Ubah tulisan tombol dropdown agar user tahu apa saja yang mereka pilih
                labelDropdown.textContent = `Terpilih (${checkedValues.length}): ` + checkedValues.join(", ");
            } else {
                finalTagsInput.value = "";
                labelDropdown.textContent = "Pilih Kategori Cerita (Bisa > 1)...";
            }
        });
    });


    const tabItems = document.querySelectorAll('.tab-item');
    const feedForYou = document.getElementById('feed-foryou');
    const feedFollowing = document.getElementById('feed-following');

    tabItems.forEach(tab => {
        tab.addEventListener('click', function () {
            tabItems.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            if (this.getAttribute('data-tab') === 'foryou') {
                feedForYou.classList.remove('d-none'); feedFollowing.classList.add('d-none');
            } else {
                feedForYou.classList.add('d-none'); feedFollowing.classList.remove('d-none');
            }
        });
    });

    /* FORM BIKIN POSTINGAN BARU */
    const btnSubmitPost = document.getElementById('btnSubmitPost');
    const postContent = document.getElementById('postContent');
    const postTag = document.getElementById('postTag');
    const imageInput = document.getElementById('imageInput');
    const imagePreviewContainer = document.getElementById('imagePreviewContainer');
    const imagePreview = document.getElementById('imagePreview');
    const tagInputContainer = document.getElementById('tagInputContainer');
    let currentImageBase64 = '';

    document.getElementById('btnImage').addEventListener('click', () => imageInput.click());
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
    
    document.getElementById('btnRemoveImage').addEventListener('click', () => {
        currentImageBase64 = ''; imageInput.value = ''; imagePreviewContainer.classList.add('d-none');
    });
    
    
    document.getElementById('btnTag').addEventListener('click', () => {
        tagInputContainer.classList.toggle('d-none');
        if (!tagInputContainer.classList.contains('d-none')) postTag.focus();
    });

    // btnSubmitPost.addEventListener('click', function () {
    //     const content = postContent.value.trim();
    //     let tag = postTag.value.trim().replace(/\s+/g, '');
    //     if (content === '' && currentImageBase64 === '') {
    //         alert('Tulis sesuatu atau tambahkan gambar terlebih dahulu.');
    //         return;
        // }
        
        const myName = 'A human';
        const myAvatar = 'https://api.dicebear.com/7.x/avataaars/svg?seed=Elvina';
        let tagHtml = tag !== '' ? `<div class="mb-3 d-flex gap-2 flex-wrap"><span class="badge rounded-pill px-3 py-2 fw-medium" style="background-color:rgba(133,193,182,0.2);color:var(--primary-dark);">#${tag}</span></div>` : '';
        let imageHtml = currentImageBase64 !== '' ? `<div class="mb-3"><img src="${currentImageBase64}" class="img-fluid rounded-4 border w-100" style="max-height:400px;object-fit:cover;"></div>` : '';
        
        const newPost = `
            <article class="post-card p-3 p-md-4 hover-effect animate-fade-in" style="border-bottom:1px solid var(--neutral-pale);" data-comments="[]" data-comment-count="0">
                <div class="d-flex gap-3">
                    <img src="${myAvatar}" class="rounded-circle bg-white border" style="width:48px;height:48px;flex-shrink:0;">
                    <div class="flex-grow-1">
                        <div class="d-flex align-items-center justify-content-between mb-1">
                            <span class="fw-bold" style="color:var(--neutral);">${myName}</span>
                            <span class="text-muted small">Baru saja</span>
                        </div>
                        <p class="post-text mb-2">${content}</p>
                        ${imageHtml}${tagHtml}
                        <div class="voting-box rounded-4 p-3 mb-3 border" data-healthy="0" data-toxic="0">
                            <div class="vote-question small fw-bold text-muted mb-2">Menurutmu, apakah hubungan ini?</div>
                            <div class="d-flex gap-2 mb-2">
                                <button class="btn btn-vote btn-vote-healthy flex-grow-1 py-2 rounded-pill">💚 Healthy</button>
                                <button class="btn btn-vote btn-vote-toxic flex-grow-1 py-2 rounded-pill">🚩 Toxic</button>
                            </div>
                            <div class="vote-result d-none">
                                <div class="vote-bar-wrap rounded-pill overflow-hidden mb-1" style="height:6px;background:var(--neutral-pale);">
                                    <div class="vote-bar-healthy rounded-pill" style="height:100%;width:0%;background:var(--primary-dark);transition:width 0.5s;"></div>
                                </div>
                                <div class="d-flex justify-content-between" style="font-size:12px;">
                                    <span class="vote-pct-healthy fw-bold" style="color:var(--primary-dark);">0% Healthy</span>
                                    <span class="vote-total text-muted"></span>
                                    <span class="vote-pct-toxic fw-bold" style="color:var(--secondary-dark);">0% Toxic</span>
                                </div>
                            </div>
                        </div>
                        <div class="interaction-row d-flex justify-content-between text-muted" style="max-width:360px;">
                            <div class="interaction-btn hover-heart"><i class="bi bi-heart"></i> <span>0</span></div>
                            <div class="interaction-btn hover-primary"><i class="bi bi-chat"></i> <span>0</span></div>
                            <div class="interaction-btn hover-primary"><i class="bi bi-bookmark"></i></div>
                            <div class="interaction-btn hover-primary"><i class="bi bi-share"></i></div>
                        </div>
                    </div>
                </div>
            </article>`;
        feedForYou.insertAdjacentHTML('afterbegin', newPost);
        
        postContent.value = ''; postTag.value = ''; currentImageBase64 = ''; imageInput.value = '';
        imagePreviewContainer.classList.add('d-none'); tagInputContainer.classList.add('d-none'); emojiPicker.classList.add('d-none');
    });
