document.addEventListener('DOMContentLoaded', function () {

    /* 1. SINKRONISASI ANGKA KOMENTAR AWAL */
    document.querySelectorAll('.post-card').forEach(card => {
        const count = card.dataset.commentCount;
        if (count === undefined) return;
        const chatIcon = card.querySelector('i.bi-chat');
        if (chatIcon && chatIcon.nextElementSibling?.tagName === 'SPAN') {
            chatIcon.nextElementSibling.innerText = parseInt(count) >= 1000 ? (parseInt(count)/1000).toFixed(1)+'k' : count;
        }
    });

    /* 2. MODAL & THREAD VARIABLES */
    const imageModalEl = document.getElementById('imageModal');
    if (!imageModalEl) return; // Mencegah error di halaman login

    const imageModal = new bootstrap.Modal(imageModalEl);
    const fullSizeImage = document.getElementById('fullSizeImage');

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

    /* Gabungan data komentar dummy (Home + Explore) */
    const globalComments = {
        0: [ { name: 'Gentle Breeze', avatar: 'https://api.dicebear.com/7.x/miniavs/svg?seed=Reply1', time: '1j lalu', text: 'Aku pernah merasakan hal yang sama. Rasanya seperti kamu satu-satunya yang tertinggal, sementara dunia terus berputar. Semangat ya, pelan-pelan pasti bisa. 🫂' }, { name: 'Night Owl', avatar: 'https://api.dicebear.com/7.x/miniavs/svg?seed=Reply2', time: '45m lalu', text: 'Kadang mencintai seseorang dari jauh itu lebih menyakitkan dari perpisahan itu sendiri. Kamu nggak sendirian di sini.' }, { name: 'Ember Sky', avatar: 'https://api.dicebear.com/7.x/miniavs/svg?seed=Reply9', time: '20m lalu', text: 'Yang kamu rasakan itu valid banget. Butuh waktu, dan itu nggak apa-apa. ❤️‍🩹' } ],
        1: [ { name: 'Soft Rain', avatar: 'https://api.dicebear.com/7.x/miniavs/svg?seed=Reply3', time: '3j lalu', text: 'Bilang "tidak" itu salah satu hal paling susah yang pernah aku lakukan juga. Bangga sama kamu! 🌱' }, { name: 'Still Waters', avatar: 'https://api.dicebear.com/7.x/miniavs/svg?seed=Reply4', time: '2j lalu', text: 'Memilih diri sendiri bukan egois — itu perlu. Terus jaga dirimu ya.' } ],
        2: [ { name: 'Lunar Drift', avatar: 'https://api.dicebear.com/7.x/miniavs/svg?seed=Reply5', time: '5j lalu', text: 'Aku ngerasain ini banget. Rasa nggak cocok di mana-mana itu melelahkan, tapi reframing-mu soal "milik banyak tempat" itu indah sekali. 🌿' }, { name: 'Wandering Echo', avatar: 'https://api.dicebear.com/7.x/miniavs/svg?seed=Reply6', time: '3j lalu', text: 'Justru orang yang nggak cocok di satu tempat sering jadi yang paling adaptif dan empati. Kamu berharga.' } ],
        3: [ { name: 'Paper Crane', avatar: 'https://api.dicebear.com/7.x/miniavs/svg?seed=Reply7', time: '30m lalu', text: 'Jujur itu butuh keberanian. Semoga pelan-pelan makin baik-baik saja. 💙' } ],
        4: [ { name: 'Quiet Thunder', avatar: 'https://api.dicebear.com/7.x/miniavs/svg?seed=Reply8', time: '1j lalu', text: 'Tiga tahun bukan waktu yang sebentar. Tapi kamu udah kuat banget buat sampai di titik ini. Healing itu proses, bukan hasil instan.' } ],
        t1: [ { name: 'Gentle Breeze', avatar: 'https://api.dicebear.com/7.x/miniavs/svg?seed=Reply1', time: '2j lalu', text: 'Menyimpan kenangan bukan berarti kamu belum move on. Itu berarti kamu menghargai apa yang pernah nyata. 🫂' }, { name: 'Night Owl', avatar: 'https://api.dicebear.com/7.x/miniavs/svg?seed=Reply2', time: '1j lalu', text: 'Aku juga punya folder tersembunyi. Kita sama.' } ],
        t2: [ { name: 'Soft Rain', avatar: 'https://api.dicebear.com/7.x/miniavs/svg?seed=Reply3', time: '3j lalu', text: 'Kalimat "terserah kamu" yang penuh jebakan itu capek banget ya. Kamu nggak salah mengenalinya.' }, { name: 'Still Waters', avatar: 'https://api.dicebear.com/7.x/miniavs/svg?seed=Reply4', time: '2j lalu', text: 'Kesadaran itu sendiri sudah langkah pertama yang luar biasa. Semangat.' } ],
        t3: [ { name: 'Lunar Drift', avatar: 'https://api.dicebear.com/7.x/miniavs/svg?seed=Reply5', time: '5j lalu', text: 'Makan tiga kali, mandi, keluar rumah — ini bukan kecil. Ini luar biasa. Bangga sama kamu. 🌿' }, { name: 'Echo Valley', avatar: 'https://api.dicebear.com/7.x/miniavs/svg?seed=Reply6', time: '3j lalu', text: 'Kemenangan kecil adalah pondasi kemenangan besar. Terus lanjutkan. ❤️' } ],
        t4: [ { name: 'Paper Crane', avatar: 'https://api.dicebear.com/7.x/miniavs/svg?seed=Reply7', time: '30m lalu', text: 'Framing "mereka tidak tahu cara lain mencintai" itu dewasa sekali. Respect.' } ],
        t5: [ { name: 'Quiet Thunder', avatar: 'https://api.dicebear.com/7.x/miniavs/svg?seed=Reply8', time: '1j lalu', text: 'Rindu versi diri sendiri yang belum terluka — ini dalam banget. Makasih sudah berbagi.' } ]
    };

    function getPostIndex(postCard) {
        const allCards = document.querySelectorAll('.post-card');
        return Array.from(allCards).indexOf(postCard);
    }

    /* 3. FUNGSI THREAD */
    function openThread(postCard) {
        activePostCard = postCard;
        threadImgBase64 = '';
        threadImgPreviewWrap.classList.add('d-none');
        threadImgPreview.src = ''; threadImgInput.value = ''; threadCommentInput.value = '';

        const clone = postCard.cloneNode(true);
        clone.classList.remove('hover-effect', 'post-card');
        clone.style.cursor = 'default';
        clone.style.borderBottom = 'none';
        const ir = clone.querySelector('.interaction-row');
        if (ir) ir.remove();

        threadPostContent.innerHTML = '';
        threadPostContent.appendChild(clone);

        /* Sync Vote */
        const cloneVotingBox = clone.querySelector('.voting-box');
        const origVotingBox  = postCard.querySelector('.voting-box');
        if (cloneVotingBox && origVotingBox) {
            const alreadyVoted = origVotingBox.getAttribute('data-voted') === 'true';
            if (alreadyVoted) {
                cloneVotingBox.querySelector('.d-flex.mb-2').classList.add('d-none');
                const cloneResult = cloneVotingBox.querySelector('.vote-result');
                const origResult = origVotingBox.querySelector('.vote-result');
                cloneResult.classList.remove('d-none');
                cloneResult.querySelector('.vote-pct-healthy').innerText = origResult.querySelector('.vote-pct-healthy').innerText;
                cloneResult.querySelector('.vote-pct-toxic').innerText   = origResult.querySelector('.vote-pct-toxic').innerText;
                cloneResult.querySelector('.vote-total').innerText       = origResult.querySelector('.vote-total').innerText;
                setTimeout(() => { cloneResult.querySelector('.vote-bar-healthy').style.width = origResult.querySelector('.vote-bar-healthy').style.width; }, 50);
            }

            cloneVotingBox.addEventListener('click', function(e) {
                const voteBtn = e.target.closest('.btn-vote');
                if (!voteBtn || origVotingBox.getAttribute('data-voted') === 'true') return;

                let hV = parseInt(origVotingBox.getAttribute('data-healthy') || 0);
                let tV = parseInt(origVotingBox.getAttribute('data-toxic') || 0);
                voteBtn.classList.contains('btn-vote-healthy') ? hV++ : tV++;
                const total = hV + tV;
                const hPct = Math.round((hV / total) * 100);

                origVotingBox.setAttribute('data-healthy', hV);
                origVotingBox.setAttribute('data-toxic', tV);
                origVotingBox.setAttribute('data-voted', 'true');

                function applyResult(box) {
                    const btns = box.querySelector('.d-flex.mb-2');
                    const res = box.querySelector('.vote-result');
                    if(btns) btns.classList.add('d-none');
                    if(res) {
                        res.classList.remove('d-none');
                        res.querySelector('.vote-pct-healthy').innerText = hPct + '% Healthy';
                        res.querySelector('.vote-pct-toxic').innerText   = (100 - hPct) + '% Toxic';
                        res.querySelector('.vote-total').innerText       = total + ' votes';
                        setTimeout(() => { res.querySelector('.vote-bar-healthy').style.width = hPct + '%'; }, 50);
                    }
                }
                applyResult(cloneVotingBox); applyResult(origVotingBox);
            });
        }

        /* Sync Like */
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

        threadStats.querySelector('.thread-like-btn').addEventListener('click', function() {
            const icon = this.querySelector('i');
            const countEl = this.querySelector('span');
            let count = parseFloat(countEl.innerText.replace('k','')) * (countEl.innerText.includes('k') ? 1000 : 1);
            if (icon.classList.contains('bi-heart')) {
                icon.classList.replace('bi-heart', 'bi-heart-fill'); icon.style.color = '#e91e63';
                if (likeIcon) { likeIcon.classList.replace('bi-heart', 'bi-heart-fill'); likeIcon.style.color = '#e91e63'; }
                count++;
            } else {
                icon.classList.replace('bi-heart-fill', 'bi-heart'); icon.style.color = '';
                if (likeIcon) { likeIcon.classList.replace('bi-heart-fill', 'bi-heart'); likeIcon.style.color = ''; }
                count--;
            }
            const fmt = count >= 1000 ? (count/1000).toFixed(1)+'k' : String(count);
            countEl.innerText = fmt; if (likeSpan) likeSpan.innerText = fmt;
        });

        renderThreadComments();
        threadView.classList.remove('d-none');
        document.body.style.overflow = 'hidden';
        setTimeout(() => threadCommentInput.focus(), 300);
    }

    btnBackThread.addEventListener('click', () => {
        threadView.classList.add('d-none');
        document.body.style.overflow = '';
        activePostCard = null;
    });

    function renderThreadComments() {
        threadCommentsList.innerHTML = '';
        const idx = activePostCard.dataset.id || getPostIndex(activePostCard);
        const defaults = globalComments[idx] || [];
        const stored = activePostCard.dataset.comments ? JSON.parse(activePostCard.dataset.comments) : [];
        [...defaults, ...stored].forEach(c => {
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

    function sendThreadComment() {
        const text = threadCommentInput.value.trim();
        if (!text && !threadImgBase64) return;

        const newComment = { name: 'A human', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Elvina', time: 'Baru saja', text: text || '', image: threadImgBase64 || '' };
        const stored = activePostCard.dataset.comments ? JSON.parse(activePostCard.dataset.comments) : [];
        stored.push(newComment);
        activePostCard.dataset.comments = JSON.stringify(stored);

        let count = parseInt(activePostCard.dataset.commentCount || 0) + 1;
        activePostCard.dataset.commentCount = count;
        threadStats.querySelector('.thread-chat-count').innerText = count;
        const chatIcon = activePostCard.querySelector('i.bi-chat');
        if (chatIcon && chatIcon.nextElementSibling?.tagName === 'SPAN') {
            chatIcon.nextElementSibling.innerText = count >= 1000 ? (count/1000).toFixed(1)+'k' : count;
        }

        threadCommentsList.insertAdjacentHTML('beforeend', buildCommentHTML(newComment));
        threadCommentsList.scrollTop = threadCommentsList.scrollHeight;
        threadCommentInput.value = ''; threadImgBase64 = ''; threadImgPreviewWrap.classList.add('d-none');
        threadImgPreview.src = ''; threadImgInput.value = ''; threadCommentInput.focus();
    }

    btnSendThread.addEventListener('click', sendThreadComment);
    threadCommentInput.addEventListener('keydown', e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendThreadComment(); } });
    btnThreadImg.addEventListener('click', () => threadImgInput.click());
    
    threadImgInput.addEventListener('change', function () {
        const file = this.files[0]; if (!file) return;
        const reader = new FileReader();
        reader.onload = e => { threadImgBase64 = e.target.result; threadImgPreview.src = threadImgBase64; threadImgPreviewWrap.classList.remove('d-none'); };
        reader.readAsDataURL(file);
    });
    
    btnRemoveThreadImg.addEventListener('click', () => {
        threadImgBase64 = ''; threadImgPreview.src = ''; threadImgInput.value = ''; threadImgPreviewWrap.classList.add('d-none');
    });

    /* 4. GLOBAL DELEGATION (KLIK DI MANA SAJA UNTUK INTERAKSI) */
    document.addEventListener('click', function (e) {
        if (e.target.tagName === 'IMG' && e.target.classList.contains('img-fluid') && e.target.closest('.post-card')) {
            fullSizeImage.src = e.target.src; imageModal.show(); return;
        }
        /* Open Thread */
        const chatBtn = e.target.closest('.interaction-btn.hover-primary');
        if (chatBtn && chatBtn.querySelector('i.bi-chat')) {
            const postCard = chatBtn.closest('.post-card');
            if (postCard) { openThread(postCard); return; }
        }
        /* Like */
        const likeBtn = e.target.closest('.hover-heart');
        if (likeBtn && likeBtn.closest('.post-card')) {
            const icon = likeBtn.querySelector('i'); const span = likeBtn.querySelector('span');
            if (!icon || !span) return;
            let count = parseFloat(span.innerText.replace('k', '')) * (span.innerText.includes('k') ? 1000 : 1);
            if (icon.classList.contains('bi-heart')) { icon.classList.replace('bi-heart', 'bi-heart-fill'); icon.style.color = '#e91e63'; count++; } 
            else { icon.classList.replace('bi-heart-fill', 'bi-heart'); icon.style.color = ''; count--; }
            span.innerText = count >= 1000 ? (count / 1000).toFixed(1) + 'k' : count; return;
        }
        /* Vote */
        const voteBtn = e.target.closest('.btn-vote');
        if (voteBtn && voteBtn.closest('.post-card')) {
            const votingBox = voteBtn.closest('.voting-box');
            if (votingBox.getAttribute('data-voted') === 'true') return;
            let hV = parseInt(votingBox.getAttribute('data-healthy') || 0); let tV = parseInt(votingBox.getAttribute('data-toxic') || 0);
            voteBtn.classList.contains('btn-vote-healthy') ? hV++ : tV++;
            const total = hV + tV; const hPct = Math.round((hV / total) * 100);
            votingBox.setAttribute('data-healthy', hV); votingBox.setAttribute('data-toxic', tV); votingBox.setAttribute('data-voted', 'true');
            const btns = votingBox.querySelector('.d-flex.mb-2'); const res = votingBox.querySelector('.vote-result');
            if (btns) btns.classList.add('d-none');
            if (res) {
                res.classList.remove('d-none');
                res.querySelector('.vote-pct-healthy').innerText = hPct + '% Healthy';
                res.querySelector('.vote-pct-toxic').innerText = (100 - hPct) + '% Toxic';
                res.querySelector('.vote-total').innerText = total + ' votes';
                setTimeout(() => { res.querySelector('.vote-bar-healthy').style.width = hPct + '%'; }, 50);
            } return;
        }
        /* Open Thread when clicking on the post card */
        const isInteractive = e.target.closest('.btn-vote, .hover-heart, .hover-primary, button, .interaction-btn, .mood-chip, .category-card, .trending-tag-btn');
        if (!isInteractive) {
            const postCard = e.target.closest('.post-card');
            if (postCard) { openThread(postCard); return; }
        }
        /* Follow Button */
        const followBtn = e.target.closest('.btn-follow');
        if (followBtn) {
            const isFollowing = followBtn.classList.toggle('following');
            followBtn.innerText = isFollowing ? 'Following' : 'Follow'; return;
        }
    });
});