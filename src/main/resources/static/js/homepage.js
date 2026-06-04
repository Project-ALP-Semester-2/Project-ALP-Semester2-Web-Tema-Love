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
    const tabItems = document.querySelectorAll('.tab-item');
    const feedForYou = document.getElementById('feed-foryou');
    const feedFollowing = document.getElementById('feed-following');
    const imageInput = document.getElementById('imageInput');
    const imagePreviewContainer = document.getElementById('imagePreviewContainer');
    const imagePreview = document.getElementById('imagePreview');
    const tagInputContainer = document.getElementById('tagInputContainer');
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

    /* LOGIKA TAB SWITCHING (DUPLIKASI SUDAH DIHAPUS) */
    tabItems.forEach(tab => {
        tab.addEventListener('click', function () {
            tabItems.forEach(t => t.classList.remove('active'));
            this.classList.add('active');

            if (feedFollowing) {
                if (this.getAttribute('data-tab') === 'foryou') {
                    feedForYou.classList.remove('d-none'); 
                    feedFollowing.classList.add('d-none');
                } else {
                    feedForYou.classList.add('d-none'); 
                    feedFollowing.classList.remove('d-none');
                }
            }
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
});