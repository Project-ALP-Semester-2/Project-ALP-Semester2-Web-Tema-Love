document.addEventListener('DOMContentLoaded', () => {
    const profileFeed = document.getElementById('profileFeed');
    const tabs = document.querySelectorAll('.feed-tabs .tab-item');
    const storiesCountHead = document.getElementById('storiesCountHead');

    /* Liked Stories Data Dummy */
    const likedStoriesHTML = `
        <article class="post-card p-3 p-md-4 hover-effect" data-id="t3" data-comment-count="143" data-comments="[]">
            <div class="d-flex gap-3">
                <img src="https://api.dicebear.com/7.x/miniavs/svg?seed=heal22" class="rounded-circle avatar-teal" style="width:46px;height:46px;" />
                <div class="flex-grow-1 min-w-0">
                    <div class="d-flex align-items-center gap-2 mb-1 flex-wrap">
                        <span class="fw-bold" style="font-size:14px;">Soft Garden</span>
                        <span class="text-muted" style="font-size:12px;">· 2 hari lalu</span>
                        <span class="badge-category badge-selflove ms-auto">🌿 Healing</span>
                    </div>
                    <p class="post-text mb-3">Hari ini aku berhasil makan tiga kali. Aku mandi. Aku keluar rumah meski cuma ke teras. Kecil banget kan? Tapi setahun lalu aku bahkan nggak bisa bangun dari kasur. Ini kemenangan.</p>
                    <div class="interaction-row d-flex gap-3 text-muted" style="max-width:360px;">
                        <div class="interaction-btn hover-heart"><i class="bi bi-heart-fill" style="color:#e91e63;"></i> <span>1.2k</span></div>
                        <div class="interaction-btn hover-primary"><i class="bi bi-chat"></i> <span>143</span></div>
                    </div>
                </div>
            </div>
        </article>
    `;

    /* Liked Stories ini nanti akan di-render berdasarkan data yang didapat dari database, ini cuma dummy untuk tampilan awal */
    const defaultMyStoriesHTML = `
        <article class="post-card p-3 p-md-4 hover-effect" data-id="my_1" data-comment-count="12" data-comments="[]">
            <div class="d-flex gap-3">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Elvina" class="rounded-circle bg-white border" style="width:46px;height:46px;" />
                <div class="flex-grow-1 min-w-0">
                    <div class="d-flex align-items-center gap-2 mb-1 flex-wrap">
                        <span class="fw-bold" style="font-size:14px;">A human</span>
                        <span class="text-muted" style="font-size:12px;">· 4 jam lalu</span>
                        <span class="badge-category badge-selflove ms-auto">✨ Growth</span>
                    </div>
                    <p class="post-text mb-3">Kadang melepas itu bukan berarti kita menyerah, tapi kita akhirnya sadar ada hal-hal yang memang tidak bisa dipaksakan. Menyakitkan di awal, melegakan di akhir. 🤍</p>
                    <div class="interaction-row d-flex gap-3 text-muted" style="max-width:360px;">
                        <div class="interaction-btn hover-heart"><i class="bi bi-heart"></i> <span>42</span></div>
                        <div class="interaction-btn hover-primary"><i class="bi bi-chat"></i> <span>12</span></div>
                    </div>
                </div>
            </div>
        </article>
    `;

    function renderProfileTab(tabName) {
        profileFeed.innerHTML = '';
        
        if (tabName === 'my-stories') {
            profileFeed.innerHTML = defaultMyStoriesHTML;
            storiesCountHead.innerText = "1 cerita";
        } else if (tabName === 'liked-stories') {
            profileFeed.innerHTML = likedStoriesHTML;
        }
    }

    renderProfileTab('my-stories');

    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            tabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            renderProfileTab(this.getAttribute('data-tab'));
        });
    });
});