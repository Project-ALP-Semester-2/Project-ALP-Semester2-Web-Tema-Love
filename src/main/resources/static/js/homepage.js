document.addEventListener('DOMContentLoaded', function () {

    // ── SINKRONISASI ANGKA KOMENTAR AWAL ──
    document.querySelectorAll('.post-card').forEach(card => {
        const count = card.dataset.commentCount;
        if (count === undefined) return;
        const chatIcon = card.querySelector('i.bi-chat');
        if (chatIcon && chatIcon.nextElementSibling?.tagName === 'SPAN') {
            chatIcon.nextElementSibling.innerText = parseInt(count) >= 1000
                ? (parseInt(count)/1000).toFixed(1)+'k'
                : count;
        }
    });

    // ── TAB SWITCHING ──
    const tabItems = document.querySelectorAll('.tab-item');
    const feedForYou = document.getElementById('feed-foryou');
    const feedFollowing = document.getElementById('feed-following');

    tabItems.forEach(tab => {
        tab.addEventListener('click', function () {
            tabItems.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            if (this.getAttribute('data-tab') === 'foryou') {
                feedForYou.classList.remove('d-none');
                feedFollowing.classList.add('d-none');
            } else {
                feedForYou.classList.add('d-none');
                feedFollowing.classList.remove('d-none');
            }
        });
    });

    // ── IMAGE ZOOM MODAL ──
    const imageModal = new bootstrap.Modal(document.getElementById('imageModal'));
    const fullSizeImage = document.getElementById('fullSizeImage');

    // ── THREAD VIEW ──
    const threadView         = document.getElementById('threadView');
    const threadPostContent  = document.getElementById('threadPostContent');
    const threadStats        = document.getElementById('threadStats');
    const threadCommentsList = document.getElementById('threadCommentsList');
    const threadCommentInput = document.getElementById('threadCommentInput');
    const btnSendThread      = document.getElementById('btnSendThreadComment');
    const btnBackThread      = document.getElementById('btnBackThread');
    const threadImgInput     = document.getElementById('threadImgInput');
    const threadImgPreview   = document.getElementById('threadImgPreview');
    const threadImgPreviewWrap = document.getElementById('threadImgPreviewWrap');
    const btnRemoveThreadImg = document.getElementById('btnRemoveThreadImg');
    const btnThreadImg       = document.getElementById('btnThreadImg');

    let activePostCard = null;
    let threadImgBase64 = '';

    // Komentar bawaan per post (keyed by post index)
    const defaultComments = {
        0: [
            { name: 'Gentle Breeze', avatar: 'https://api.dicebear.com/7.x/miniavs/svg?seed=Reply1', time: '1j lalu', text: 'Aku pernah merasakan hal yang sama. Rasanya seperti kamu satu-satunya yang tertinggal, sementara dunia terus berputar. Semangat ya, pelan-pelan pasti bisa. 🫂' },
            { name: 'Night Owl', avatar: 'https://api.dicebear.com/7.x/miniavs/svg?seed=Reply2', time: '45m lalu', text: 'Kadang mencintai seseorang dari jauh itu lebih menyakitkan dari perpisahan itu sendiri. Kamu nggak sendirian di sini.' },
            { name: 'Ember Sky', avatar: 'https://api.dicebear.com/7.x/miniavs/svg?seed=Reply9', time: '20m lalu', text: 'Yang kamu rasakan itu valid banget. Butuh waktu, dan itu nggak apa-apa. ❤️‍🩹' }
        ],
        1: [
            { name: 'Soft Rain', avatar: 'https://api.dicebear.com/7.x/miniavs/svg?seed=Reply3', time: '3j lalu', text: 'Bilang "tidak" itu salah satu hal paling susah yang pernah aku lakukan juga. Bangga sama kamu! 🌱' },
            { name: 'Still Waters', avatar: 'https://api.dicebear.com/7.x/miniavs/svg?seed=Reply4', time: '2j lalu', text: 'Memilih diri sendiri bukan egois — itu perlu. Terus jaga dirimu ya.' }
        ],
        2: [
            { name: 'Lunar Drift', avatar: 'https://api.dicebear.com/7.x/miniavs/svg?seed=Reply5', time: '5j lalu', text: 'Aku ngerasain ini banget. Rasa nggak cocok di mana-mana itu melelahkan, tapi reframing-mu soal "milik banyak tempat" itu indah sekali. 🌿' },
            { name: 'Wandering Echo', avatar: 'https://api.dicebear.com/7.x/miniavs/svg?seed=Reply6', time: '3j lalu', text: 'Justru orang yang nggak cocok di satu tempat sering jadi yang paling adaptif dan empati. Kamu berharga.' }
        ],
        3: [
            { name: 'Paper Crane', avatar: 'https://api.dicebear.com/7.x/miniavs/svg?seed=Reply7', time: '30m lalu', text: 'Jujur itu butuh keberanian. Semoga pelan-pelan makin baik-baik saja. 💙' }
        ],
        4: [
            { name: 'Quiet Thunder', avatar: 'https://api.dicebear.com/7.x/miniavs/svg?seed=Reply8', time: '1j lalu', text: 'Tiga tahun bukan waktu yang sebentar. Tapi kamu udah kuat banget buat sampai di titik ini. Healing itu proses, bukan hasil instan.' }
        ]
    };

    // Buka thread view saat post card diklik
    function openThread(postCard) {
        activePostCard = postCard;
        threadImgBase64 = '';
        threadImgPreviewWrap.classList.add('d-none');
        threadImgPreview.src = '';
        threadImgInput.value = '';
        threadCommentInput.value = '';

        // Clone post untuk ditampilkan di thread
        const clone = postCard.cloneNode(true);
        clone.classList.remove('hover-effect', 'post-card');
        clone.style.cursor = 'default';
        clone.style.borderBottom = 'none';
        // Hilangkan interaction row dari clone
        const ir = clone.querySelector('.interaction-row');
        if (ir) ir.remove();

        threadPostContent.innerHTML = '';
        threadPostContent.appendChild(clone);

        // ── Sambungkan voting di clone ke post card asli ──
        const cloneVotingBox = clone.querySelector('.voting-box');
        const origVotingBox  = postCard.querySelector('.voting-box');
        if (cloneVotingBox && origVotingBox) {
            const origResult   = origVotingBox.querySelector('.vote-result');
            const cloneButtons = cloneVotingBox.querySelector('.d-flex.mb-2');
            const cloneResult  = cloneVotingBox.querySelector('.vote-result');
            // Gunakan data-voted="true" sebagai penanda sudah divote (bukan d-none)
            const alreadyVoted = origVotingBox.getAttribute('data-voted') === 'true';
            if (alreadyVoted && origResult) {
                cloneButtons.classList.add('d-none');
                cloneResult.classList.remove('d-none');
                cloneResult.querySelector('.vote-pct-healthy').innerText = origResult.querySelector('.vote-pct-healthy').innerText;
                cloneResult.querySelector('.vote-pct-toxic').innerText   = origResult.querySelector('.vote-pct-toxic').innerText;
                cloneResult.querySelector('.vote-total').innerText       = origResult.querySelector('.vote-total').innerText;
                setTimeout(() => {
                    cloneResult.querySelector('.vote-bar-healthy').style.width = origResult.querySelector('.vote-bar-healthy').style.width;
                }, 50);
            }

            // Event vote di thread → sinkron ke original feed
            cloneVotingBox.addEventListener('click', function(e) {
                const voteBtn = e.target.closest('.btn-vote');
                if (!voteBtn) return;
                // Jangan vote ulang jika sudah
                if (origVotingBox.getAttribute('data-voted') === 'true') return;

                let healthyVotes = parseInt(origVotingBox.getAttribute('data-healthy') || 0);
                let toxicVotes   = parseInt(origVotingBox.getAttribute('data-toxic')   || 0);
                if (voteBtn.classList.contains('btn-vote-healthy')) healthyVotes++;
                else toxicVotes++;
                const totalVotes = healthyVotes + toxicVotes;
                const healthyPct = Math.round((healthyVotes / totalVotes) * 100);
                const toxicPct   = 100 - healthyPct;

                origVotingBox.setAttribute('data-healthy', healthyVotes);
                origVotingBox.setAttribute('data-toxic',   toxicVotes);
                origVotingBox.setAttribute('data-voted',   'true');

                function applyVoteResult(box) {
                    const btns   = box.querySelector('.d-flex.mb-2');
                    const result = box.querySelector('.vote-result');
                    if (btns)   btns.classList.add('d-none');
                    if (result) {
                        result.classList.remove('d-none');
                        result.querySelector('.vote-pct-healthy').innerText = healthyPct + '% Healthy';
                        result.querySelector('.vote-pct-toxic').innerText   = toxicPct   + '% Toxic';
                        result.querySelector('.vote-total').innerText       = totalVotes + ' votes';
                        setTimeout(() => {
                            result.querySelector('.vote-bar-healthy').style.width = healthyPct + '%';
                        }, 50);
                    }
                }
                applyVoteResult(cloneVotingBox);
                applyVoteResult(origVotingBox);
            });
        }

        // ── Stats bar dengan like yang bisa diklik ──
        const likeSpan  = postCard.querySelector('.hover-heart span');
        const likeIcon  = postCard.querySelector('.hover-heart i');
        const likeCount = likeSpan ? likeSpan.innerText : '0';
        const isLiked   = likeIcon ? likeIcon.classList.contains('bi-heart-fill') : false;
        const chatCount = postCard.dataset.commentCount || '0';
        threadStats.innerHTML = `
            <div class="interaction-btn hover-heart thread-like-btn" style="cursor:pointer;">
                <i class="bi ${isLiked ? 'bi-heart-fill' : 'bi-heart'}" style="color:${isLiked ? '#e91e63' : 'inherit'};"></i>
                <span>${likeCount}</span>
                <span class="text-muted ms-1" style="font-size:13px;">suka</span>
            </div>
            <span style="color:var(--neutral-light); margin: 0 4px;">·</span>
            <span><i class="bi bi-chat me-1" style="color:var(--primary-mid);"></i><span class="thread-chat-count">${chatCount}</span> balasan</span>`;

        // Event like di thread → sinkron ke post card feed
        threadStats.querySelector('.thread-like-btn').addEventListener('click', function() {
            const icon    = this.querySelector('i');
            const countEl = this.querySelector('span');
            const origIcon = postCard.querySelector('.hover-heart i');
            const origSpan = postCard.querySelector('.hover-heart span');
            let count = parseFloat(countEl.innerText.replace('k','')) * (countEl.innerText.includes('k') ? 1000 : 1);
            if (icon.classList.contains('bi-heart')) {
                icon.classList.replace('bi-heart', 'bi-heart-fill');
                icon.style.color = '#e91e63';
                if (origIcon) { origIcon.classList.replace('bi-heart', 'bi-heart-fill'); origIcon.style.color = '#e91e63'; }
                count++;
            } else {
                icon.classList.replace('bi-heart-fill', 'bi-heart');
                icon.style.color = '';
                if (origIcon) { origIcon.classList.replace('bi-heart-fill', 'bi-heart'); origIcon.style.color = ''; }
                count--;
            }
            const fmt = count >= 1000 ? (count/1000).toFixed(1)+'k' : String(count);
            countEl.innerText = fmt;
            if (origSpan) origSpan.innerText = fmt;
        });

        // Render komentar
        renderThreadComments();

        // Tampilkan thread view
        threadView.classList.remove('d-none');
        threadView.scrollTop = 0;
        document.body.style.overflow = 'hidden';
        setTimeout(() => threadCommentInput.focus(), 300);
    }

    function closeThread() {
        threadView.classList.add('d-none');
        document.body.style.overflow = '';
        activePostCard = null;
    }

    btnBackThread.addEventListener('click', closeThread);

    // Render komentar dari data + default
    function getPostIndex(postCard) {
        const allCards = document.querySelectorAll('.post-card');
        return Array.from(allCards).indexOf(postCard);
    }

    function renderThreadComments() {
        threadCommentsList.innerHTML = '';
        const idx = getPostIndex(activePostCard);
        const defaults = defaultComments[idx] || [];
        const stored = activePostCard.dataset.comments ? JSON.parse(activePostCard.dataset.comments) : [];
        const all = [...defaults, ...stored];

        all.forEach(c => {
            threadCommentsList.insertAdjacentHTML('beforeend', buildCommentHTML(c));
        });
    }

    function buildCommentHTML(c) {
        const imgHtml = c.image ? `<div class="mt-2"><img src="${c.image}" class="rounded-3 border img-fluid" style="max-height:200px;object-fit:cover;cursor:zoom-in;" onclick="document.getElementById('fullSizeImage').src=this.src;bootstrap.Modal.getOrCreateInstance(document.getElementById('imageModal')).show()"></div>` : '';
        return `
        <div class="d-flex gap-3 mb-4 animate-fade-in">
            <img src="${c.avatar}" class="rounded-circle border bg-white" style="width:42px;height:42px;flex-shrink:0;">
            <div class="flex-grow-1">
                <div class="d-flex align-items-center gap-2 mb-1 flex-wrap">
                    <span class="fw-bold" style="color:var(--neutral);font-size:14px;">${c.name}</span>
                    <span class="text-muted" style="font-size:12px;">${c.time}</span>
                </div>
                <p class="mb-0" style="font-size:15px;line-height:1.6;color:var(--neutral);">${c.text}</p>
                ${imgHtml}
            </div>
        </div>`;
    }

    // Kirim komentar baru
    function sendThreadComment() {
        const text = threadCommentInput.value.trim();
        if (!text && !threadImgBase64) return;

        const newComment = {
            name: 'A human',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Elvina',
            time: 'Baru saja',
            text: text || '',
            image: threadImgBase64 || ''
        };

        // Simpan ke dataset
        const stored = activePostCard.dataset.comments ? JSON.parse(activePostCard.dataset.comments) : [];
        stored.push(newComment);
        activePostCard.dataset.comments = JSON.stringify(stored);

        // Update counter
        let count = parseInt(activePostCard.dataset.commentCount || 0);
        count++;
        activePostCard.dataset.commentCount = count;

        // Update stats bar
        const chatCountEl = threadStats.querySelector('.thread-chat-count');
        if (chatCountEl) chatCountEl.innerText = count;

        // Update angka di post card feed
        const chatIcon = activePostCard.querySelector('i.bi-chat');
        if (chatIcon && chatIcon.nextElementSibling?.tagName === 'SPAN') {
            chatIcon.nextElementSibling.innerText = count >= 1000 ? (count/1000).toFixed(1)+'k' : count;
        }

        // Render komentar baru
        threadCommentsList.insertAdjacentHTML('beforeend', buildCommentHTML(newComment));
        threadCommentsList.scrollTop = threadCommentsList.scrollHeight;
        threadView.scrollTo({ top: threadView.scrollHeight, behavior: 'smooth' });

        // Reset input
        threadCommentInput.value = '';
        threadImgBase64 = '';
        threadImgPreviewWrap.classList.add('d-none');
        threadImgPreview.src = '';
        threadImgInput.value = '';
        threadCommentInput.focus();
    }

    btnSendThread.addEventListener('click', sendThreadComment);
    threadCommentInput.addEventListener('keydown', e => {
        if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendThreadComment(); }
    });

    // Upload gambar di komentar
    btnThreadImg.addEventListener('click', () => threadImgInput.click());
    threadImgInput.addEventListener('change', function () {
        const file = this.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = e => {
            threadImgBase64 = e.target.result;
            threadImgPreview.src = threadImgBase64;
            threadImgPreviewWrap.classList.remove('d-none');
        };
        reader.readAsDataURL(file);
    });
    btnRemoveThreadImg.addEventListener('click', () => {
        threadImgBase64 = '';
        threadImgPreview.src = '';
        threadImgInput.value = '';
        threadImgPreviewWrap.classList.add('d-none');
    });

    // ── KLIK POST CARD → buka thread ──
    document.querySelectorAll('.feed-posts').forEach(feed => {
        feed.addEventListener('click', function (e) {

            // Zoom gambar
            if (e.target.tagName === 'IMG' && e.target.classList.contains('img-fluid')) {
                fullSizeImage.src = e.target.src;
                imageModal.show();
                return;
            }

            // Tombol komentar (chat) → buka thread dan fokus ke input
            const chatBtn = e.target.closest('.interaction-btn.hover-primary');
            if (chatBtn && chatBtn.querySelector('i.bi-chat')) {
                const postCard = chatBtn.closest('.post-card');
                if (postCard) { openThread(postCard); return; }
            }

            // Jangan buka thread kalau klik tombol interaktif lain
            const isInteractive = e.target.closest('.btn-vote, .hover-heart, .hover-primary, button, .interaction-btn');
            if (isInteractive) {
                // Tetap proses like & vote di bawah, tapi jangan buka thread
            } else {
                // Klik area post → buka thread
                const postCard = e.target.closest('.post-card');
                if (postCard) {
                    openThread(postCard);
                    return;
                }
            }

            // Like
            const likeBtn = e.target.closest('.hover-heart');
            if (likeBtn) {
                const icon = likeBtn.querySelector('i');
                const span = likeBtn.querySelector('span');
                let countStr = span.innerText;
                let isK = countStr.includes('k');
                let count = parseFloat(countStr.replace('k', '')) * (isK ? 1000 : 1);
                if (icon.classList.contains('bi-heart')) {
                    icon.classList.replace('bi-heart', 'bi-heart-fill');
                    icon.style.color = '#e91e63';
                    count++;
                } else {
                    icon.classList.replace('bi-heart-fill', 'bi-heart');
                    icon.style.color = '';
                    count--;
                }
                span.innerText = count >= 1000 ? (count / 1000).toFixed(1) + 'k' : count;
                return;
            }

            // Voting
            const voteBtn = e.target.closest('.btn-vote');
            if (voteBtn) {
                const votingBox = voteBtn.closest('.voting-box');
                // Jangan vote ulang jika sudah
                if (votingBox.getAttribute('data-voted') === 'true') return;
                const voteButtonsContainer = votingBox.querySelector('.d-flex.mb-2');
                const voteResult = votingBox.querySelector('.vote-result');
                let healthyVotes = parseInt(votingBox.getAttribute('data-healthy') || 0);
                let toxicVotes = parseInt(votingBox.getAttribute('data-toxic') || 0);
                if (voteBtn.classList.contains('btn-vote-healthy')) healthyVotes++;
                else toxicVotes++;
                let totalVotes = healthyVotes + toxicVotes;
                let healthyPct = Math.round((healthyVotes / totalVotes) * 100);
                let toxicPct = 100 - healthyPct;
                votingBox.setAttribute('data-healthy', healthyVotes);
                votingBox.setAttribute('data-toxic',   toxicVotes);
                votingBox.setAttribute('data-voted',   'true');
                voteButtonsContainer.classList.add('d-none');
                voteResult.classList.remove('d-none');
                voteResult.querySelector('.vote-pct-healthy').innerText = healthyPct + '% Healthy';
                voteResult.querySelector('.vote-pct-toxic').innerText = toxicPct + '% Toxic';
                voteResult.querySelector('.vote-total').innerText = totalVotes + ' votes';
                setTimeout(() => {
                    voteResult.querySelector('.vote-bar-healthy').style.width = healthyPct + '%';
                }, 50);
            }

        });
    });

    // ── FOLLOW ──
    document.addEventListener('click', function (e) {
        const btn = e.target.closest('.btn-follow');
        if (!btn) return;
        if (btn.classList.contains('following')) {
            btn.classList.remove('following');
            btn.innerText = 'Follow';
        } else {
            btn.classList.add('following');
            btn.innerText = 'Following';
        }
    });

    // ── BUAT POST BARU ──
    const btnSubmitPost = document.getElementById('btnSubmitPost');
    const postContent = document.getElementById('postContent');
    const postTag = document.getElementById('postTag');
    const imageInput = document.getElementById('imageInput');
    const imagePreviewContainer = document.getElementById('imagePreviewContainer');
    const imagePreview = document.getElementById('imagePreview');
    const emojiPicker = document.getElementById('emojiPicker');
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
    document.getElementById('btnEmoji').addEventListener('click', () => emojiPicker.classList.toggle('d-none'));
    document.querySelectorAll('.emoji-item').forEach(item => {
        item.addEventListener('click', function () {
            postContent.value += this.innerText; emojiPicker.classList.add('d-none'); postContent.focus();
        });
    });
    document.getElementById('btnTag').addEventListener('click', () => {
        tagInputContainer.classList.toggle('d-none');
        if (!tagInputContainer.classList.contains('d-none')) postTag.focus();
    });

    btnSubmitPost.addEventListener('click', function () {
        const content = postContent.value.trim();
        let tag = postTag.value.trim().replace(/\s+/g, '');
        if (content === '' && currentImageBase64 === '') {
            alert('Tulis sesuatu atau tambahkan gambar terlebih dahulu.');
            return;
        }
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
});