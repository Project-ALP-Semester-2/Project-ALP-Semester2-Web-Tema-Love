document.addEventListener('DOMContentLoaded', () => {
    const tabs = document.querySelectorAll('.feed-tabs .tab-item');
    const notifItems = document.querySelectorAll('.notif-item');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {

            tabs.forEach(t => t.classList.remove('active', 'fw-bold'));
            tab.classList.add('active', 'fw-bold');

            const filter = tab.getAttribute('data-filter');

            notifItems.forEach(item => {
                const jenis = item.getAttribute('data-type');
                
                if (filter === 'semua') {
                    item.style.display = 'flex'; 
                } else if (filter === 'interaksi') {
                    if (jenis === 'LIKE' || jenis === 'KOMENTAR' || jenis === 'FOLLOW') {
                        item.style.display = 'flex';
                    } else {
                        item.style.display = 'none'; 
                    }
                }
            });
        });
    });
});