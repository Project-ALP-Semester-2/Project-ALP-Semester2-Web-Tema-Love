// ── js/follow.js ──

document.addEventListener('DOMContentLoaded', () => {

    const usersData = {
        suggested: [
            { name: 'Soft Ember', username: '@softember', avatar: 'wtf1', bio: 'Menulis untuk menyembuhkan luka masa lalu. Membaca untuk tahu aku tidak sendiri.', tags: ['#Healing', '#SelfLove'] },
            { name: 'Quiet Thunder', username: '@qthunder', avatar: 'wtf2', bio: 'Bercerita tentang badai di kepalaku agar yang lain bisa mencari tempat berteduh.', tags: ['#MentalHealth', '#Anxiety'] },
            { name: 'Lunar Drift', username: '@lunardrift', avatar: 'wtf3', bio: 'Mencoba memahami arti melepaskan. Sedikit demi sedikit.', tags: ['#MoveOn', '#Heartbreak'] }
        ],
        following: [
            { name: 'Paper Crane', username: '@papercrane', avatar: 'fl33', bio: 'Percaya bahwa setiap cerita punya hak untuk diucapkan.', tags: ['#Growth'], following: true },
            { name: 'Midnight Rover', username: '@mrover', avatar: 'toxic88', bio: 'Malam adalah teman terbaik untuk pikiran yang terlalu berisik.', tags: ['#Overthinking'], following: true }
        ],
        followers: [
            { name: 'Still Waters', username: '@stillwaters', avatar: 'pl66', bio: 'Air yang tenang menghanyutkan, atau menyimpan terlalu banyak rahasia?', tags: ['#Introvert'], followsYou: true },
            { name: 'Soft Garden', username: '@sgarden', avatar: 'heal22', bio: 'Menanam bunga di atas rasa sakit.', tags: ['#Healing'], followsYou: true, following: true }
        ]
    };

    const feed = document.getElementById('followFeed');
    const tabs = document.querySelectorAll('.tab-item');

    function renderUsers(tabName) {
        feed.innerHTML = '';
        const users = usersData[tabName];

        if (!users || users.length === 0) {
            feed.innerHTML = `
                <div class="text-center py-5 text-muted animate-fade-in">
                    <div style="font-size:3rem; margin-bottom: 10px;">🌱</div>
                    <h6 class="fw-bold" style="color: var(--neutral);">Belum ada siapa-siapa di sini</h6>
                </div>`;
            return;
        }

        feed.innerHTML = users.map(u => {
            const btnClass = u.following ? 'btn-follow following' : 'btn-follow';
            const btnText = u.following ? 'Following' : 'Follow';
            const badgeHtml = u.followsYou ? `<span class="badge bg-secondary-soft text-secondary rounded-pill ms-2" style="font-size:10px;">Mengikutimu</span>` : '';
            const tagsHtml = u.tags.map(t => `<span class="badge-category" style="background-color: rgba(133,193,182,0.15); color: var(--primary-dark); font-size:11px; padding:2px 8px;">${t}</span>`).join(' ');

            return `
            <div class="user-card p-3 p-md-4 border-bottom hover-effect animate-fade-in d-flex gap-3">
                <img src="https://api.dicebear.com/7.x/miniavs/svg?seed=${u.avatar}" class="rounded-circle bg-light border" style="width:60px;height:60px;flex-shrink:0; object-fit:cover;">
                <div class="flex-grow-1 min-w-0">
                    <div class="d-flex justify-content-between align-items-start mb-2">
                        <div>
                            <div class="fw-bold" style="font-size:15px; color:var(--neutral);">${u.name} ${badgeHtml}</div>
                            <div class="text-muted" style="font-size:13px;">${u.username}</div>
                        </div>
                        <button class="${btnClass}">${btnText}</button>
                    </div>
                    <p class="mb-2" style="font-size:14px; line-height:1.5; color:var(--neutral);">${u.bio}</p>
                    <div class="d-flex gap-2 flex-wrap">
                        ${tagsHtml}
                    </div>
                </div>
            </div>`;
        }).join('');
    }

    renderUsers('suggested');

    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            tabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            renderUsers(this.getAttribute('data-tab'));
        });
    });
});