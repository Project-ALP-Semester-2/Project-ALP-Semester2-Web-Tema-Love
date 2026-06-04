document.addEventListener('DOMContentLoaded', () => {

    /* 1. Data Dummy Notifikasi (Bisa diganti dari database) */
    const notificationsData = [
        { 
            id: 1, type: 'system', unread: true, time: '10m lalu', 
            title: 'Ceritamu berhasil dipublikasikan ✨', 
            text: 'Ceritamu tentang "Patah Hati" telah lolos moderasi otomatis dan sekarang bisa didengar oleh jiwa yang lain.', 
            icon: 'bi-check2-circle', iconClass: 'icon-system' 
        },
        { 
            id: 2, type: 'heart', unread: true, time: '2j lalu', 
            title: 'Seseorang memberimu empati', 
            text: '<strong>Autumn Whisper</strong> dan 12 lainnya merasakan dan memberikan empati pada ceritamu.', 
            icon: 'bi-heart-fill', iconClass: 'icon-heart', 
            avatar: 'https://api.dicebear.com/7.x/miniavs/svg?seed=broken7' 
        },
        { 
            id: 3, type: 'comment', unread: false, time: '5j lalu', 
            title: 'Ada balasan baru di ceritamu', 
            text: '<strong>Night Owl</strong> membalas: "Aku pernah merasakan hal yang sama. Rasanya seperti..."', 
            icon: 'bi-chat-fill', iconClass: 'icon-comment', 
            avatar: 'https://api.dicebear.com/7.x/miniavs/svg?seed=toxic88' 
        },
        { 
            id: 4, type: 'heart', unread: false, time: '1 hari lalu', 
            title: 'Seseorang memberimu empati', 
            text: '<strong>Soft Garden</strong> memberikan empati pada curhatan malammu.', 
            icon: 'bi-heart-fill', iconClass: 'icon-heart', 
            avatar: 'https://api.dicebear.com/7.x/miniavs/svg?seed=heal22' 
        },
        { 
            id: 5, type: 'system', unread: false, time: '2 hari lalu', 
            title: 'Selamat datang di UnSaid 🤍', 
            text: 'Terima kasih telah bergabung. Ini adalah ruang aman untuk ceritamu. Jangan ragu untuk berbagi apa pun yang tak terucap.', 
            icon: 'bi-stars', iconClass: 'icon-system' 
        }
    ];

    const feed = document.getElementById('notificationsFeed');
    const tabs = document.querySelectorAll('.feed-tabs .tab-item');

    /* 2. Fungsi untuk memunculkan (render) Notifikasi ke layar */
    function renderNotifications(filter) {
        feed.innerHTML = '';
        
        const filteredData = notificationsData.filter(n => {
            if (filter === 'semua') return true;
            if (filter === 'interaksi') return (n.type === 'heart' || n.type === 'comment');
        });
        
        /* Jika tidak ada notifikasi */
        if (filteredData.length === 0) {
            feed.innerHTML = `
                <div class="text-center py-5 text-muted animate-fade-in">
                    <div style="font-size:3rem; margin-bottom: 10px;">📭</div>
                    <h6 class="fw-bold" style="color: var(--neutral);">Belum ada interaksi</h6>
                    <p style="font-size: 14px;">Mulai bercerita atau berikan empati pada cerita orang lain.</p>
                </div>
            `;
            return;
        }

        feed.innerHTML = filteredData.map(n => {
            const avatarHtml = n.avatar 
                ? `<img src="${n.avatar}" class="rounded-circle border bg-white position-absolute" style="width:20px;height:20px;bottom:-2px;right:-2px; object-fit: cover;">` 
                : '';
            
            const unreadDotHtml = n.unread ? `<div class="unread-dot"></div>` : `<div style="width:10px;"></div>`;

            return `
            <div class="notification-card animate-fade-in ${n.unread ? 'unread' : ''}">
                <div class="position-relative">
                    <div class="notif-icon-wrap ${n.iconClass}">
                        <i class="bi ${n.icon}"></i>
                    </div>
                    ${avatarHtml}
                </div>
                
                <div class="notif-content">
                    <div class="d-flex justify-content-between align-items-start mb-1 gap-2">
                        <span class="fw-bold" style="font-size: 14.5px; color: var(--neutral); line-height: 1.3;">${n.title}</span>
                        <span class="notif-time">${n.time}</span>
                    </div>
                    <p class="mb-0 text-muted" style="font-size: 13.5px; line-height: 1.5;">${n.text}</p>
                </div>

                <div class="d-flex align-items-center justify-content-center">
                    ${unreadDotHtml}
                </div>
            </div>
            `;
        }).join('');
    }

    renderNotifications('semua');

    /* 3. Logika Klik Tab Filter */
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Ubah garis bawah tab
            tabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            // Render ulang berdasarkan data-filter ("semua" atau "interaksi")
            const filterType = this.getAttribute('data-filter');
            renderNotifications(filterType);
        });
    });

});