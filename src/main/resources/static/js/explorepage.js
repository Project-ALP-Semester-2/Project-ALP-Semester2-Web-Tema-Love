document.addEventListener('DOMContentLoaded', function () {

  const allStories = [
    { id:'t1', tags:['heartbreak','patah-hati','move-on'], author:'Autumn Whisper', seed:'broken7', avatarClass:'avatar-pink', badge:'💔 Heartbreak', badgeClass:'badge-heartbreak', time:'3 hari lalu', healthy:74, toxic:26, empathy:847, comments:92, text:'Aku masih menyimpan foto kita di folder tersembunyi. Bukan karena aku belum move on — tapi karena aku takut suatu hari aku lupa betapa bahagianya kita dulu. Apakah itu salah?' },
    { id:'t2', tags:['anxiety','toxic','overthinking'], author:'Midnight Rover', seed:'toxic88', avatarClass:'avatar-teal', badge:'🌀 Anxiety', badgeClass:'badge-anxiety', time:'1 hari lalu', healthy:12, toxic:88, empathy:621, comments:74, text:'Setiap kali dia bilang "terserah kamu", itu bukan pilihan — itu jebakan. Aku selalu salah apapun yang aku putuskan. Dan aku baru sadar itu bukan cinta, itu kontrol.' },
    { id:'t3', tags:['healing','self-love'], author:'Soft Garden', seed:'heal22', avatarClass:'avatar-teal', badge:'🌿 Healing', badgeClass:'badge-selflove', time:'2 hari lalu', healthy:95, toxic:5, empathy:1200, comments:143, text:'Hari ini aku berhasil makan tiga kali. Aku mandi. Aku keluar rumah meski cuma ke teras. Kecil banget kan? Tapi setahun lalu aku bahkan nggak bisa bangun dari kasur. Ini kemenangan.' },
    { id:'t4', tags:['family','keluarga'], author:'Quiet Forest', seed:'fam99', avatarClass:'avatar-pink', badge:'🏠 Family', badgeClass:'badge-family', time:'4 hari lalu', healthy:60, toxic:40, empathy:532, comments:61, text:'Orang tua ku tidak pernah bertanya bagaimana perasaanku. Mereka hanya bertanya nilai, ranking, masa depan. Aku jadi orang asing di rumah sendiri. Tapi aku nggak menyalahkan mereka — mereka tidak tahu cara lain mencintai.' },
    { id:'t5', tags:['firstlove','cinta-pertama','nostalgia'], author:'Paper Crane', seed:'fl33', avatarClass:'avatar-teal', badge:'🌸 First Love', badgeClass:'badge-heartbreak', time:'5 hari lalu', healthy:55, toxic:45, empathy:489, comments:57, text:'Cinta pertama bukan tentang siapa orangnya. Tapi tentang versi dirimu yang belum pernah terluka. Aku bukan merindukan dia — aku merindukan diriku yang dulu percaya bahwa semuanya akan baik-baik saja.' },
    { id:'s6', tags:['self-love','healing'], author:'Lunar Drift', seed:'sl44', avatarClass:'avatar-pink', badge:'🪞 Self-Love', badgeClass:'badge-selflove', time:'6 hari lalu', healthy:88, toxic:12, empathy:376, comments:48, text:'Aku belajar bahwa mencintai diri sendiri bukan berarti narsis. Itu hanya berarti kamu tidak akan membiarkan siapapun — termasuk dirimu sendiri — memperlakukanmu dengan buruk.' },
    { id:'s7', tags:['toxic','move-on'], author:'Red Flag Museum', seed:'rf55', avatarClass:'avatar-teal', badge:'🚩 Toxic Relationship', badgeClass:'badge-heartbreak', time:'2 hari lalu', healthy:5, toxic:95, empathy:910, comments:105, text:'Tanda pertama: dia selalu punya alasan untuk setiap sikap buruknya. Tanda kedua: maaf selalu datang diikuti pengulangan. Tanda ketiga: kamu mulai merasa kamu yang selalu salah.' },
    { id:'s8', tags:['platonic','friendship'], author:'Still Waters', seed:'pl66', avatarClass:'avatar-pink', badge:'🤝 Platonic Love', badgeClass:'badge-selflove', time:'3 hari lalu', healthy:92, toxic:8, empathy:298, comments:35, text:'Ada teman yang hafal cara kamu nangis. Hafal kode kalau kamu lagi nggak baik-baik aja. Itu cinta juga — cuma beda bentuk.' },
    { id:'s9', tags:['friendship'], author:'Echo Valley', seed:'fr77', avatarClass:'avatar-teal', badge:'🫂 Friendship', badgeClass:'badge-family', time:'7 hari lalu', healthy:70, toxic:30, empathy:441, comments:52, text:'Kehilangan sahabat bisa lebih menyakitkan dari putus cinta. Tapi nggak ada yang mau ngakuin itu. Kita nggak pernah diajari cara berduka untuk persahabatan yang pergi.' },
    { id:'s10',tags:['nostalgia','cinta-pertama'], author:'Glass Archive', seed:'ns88', avatarClass:'avatar-pink', badge:'🕰️ Nostalgia', badgeClass:'badge-heartbreak', time:'5 hari lalu', healthy:65, toxic:35, empathy:312, comments:40, text:'Aku ketemu foto lama di hp rusak yang akhirnya berhasil aku recover. Ada kita. Tertawa. Aku lupa kita pernah sebahagia itu.' }
  ];

  function fmtNum(n) { return n >= 1000 ? (n / 1000).toFixed(1).replace('.0', '') + 'k' : n; }

  function buildPostCardHTML(s, highlight, rank = null) {
    let textHtml = s.text;
    if (highlight) {
      const re = new RegExp(`(${highlight.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
      textHtml = s.text.replace(re, '<mark class="search-highlight">$1</mark>');
    }
    const rankHtml = rank ? `<span class="trending-rank-badge rank-${rank}">${rank}</span>` : '';
    
    return `
      <article class="post-card hover-effect p-3 p-md-4 animate-fade-in" data-id="${s.id}" data-comment-count="${s.comments}" data-comments="[]">
        <div class="d-flex gap-3">
          <div class="position-relative flex-shrink-0">
            <img src="https://api.dicebear.com/7.x/miniavs/svg?seed=${s.seed}" class="rounded-circle ${s.avatarClass}" style="width:46px;height:46px;" />
            ${rankHtml}
          </div>
          <div class="flex-grow-1 min-w-0">
            <div class="d-flex align-items-center gap-2 mb-1 flex-wrap">
              <span class="fw-bold" style="font-size:14px;">${s.author}</span>
              <span class="text-muted" style="font-size:12px;">· ${s.time}</span>
              <span class="badge-category ${s.badgeClass} ms-auto">${s.badge}</span>
            </div>
            <p class="post-text mb-3">${textHtml}</p>
            <div class="voting-box rounded-4 p-3 mb-3 border" data-healthy="${s.healthy}" data-toxic="${s.toxic}">
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
            <div class="interaction-row d-flex gap-1 text-muted" style="max-width:360px;">
              <div class="interaction-btn hover-heart"><i class="bi bi-heart"></i> <span>${fmtNum(s.empathy)}</span></div>
              <div class="interaction-btn hover-primary"><i class="bi bi-chat"></i> <span>${s.comments}</span></div>
              <div class="interaction-btn hover-primary ms-auto"><i class="bi bi-bookmark"></i></div>
              <div class="interaction-btn hover-primary"><i class="bi bi-share"></i></div>
            </div>
          </div>
        </div>
      </article>`;
  }

  /* Render Trending Initial */
  const trendingDiv = document.getElementById('trendingFeed');
  if(trendingDiv) trendingDiv.innerHTML = allStories.slice(0, 5).map((s, i) => buildPostCardHTML(s, '', i+1)).join('');

  /* Search Logic */
  const searchInput    = document.getElementById('searchInput');
  const btnClearSearch = document.getElementById('btnClearSearch');
  const searchInfo     = document.getElementById('searchResultsInfo');
  const searchPanel    = document.getElementById('searchResultsPanel');
  const searchList     = document.getElementById('searchResultsList');
  const searchEmpty    = document.getElementById('searchEmpty');
  const exploreMain    = document.getElementById('exploreMain');

  let searchDebounce;
  searchInput.addEventListener('input', () => { clearTimeout(searchDebounce); searchDebounce = setTimeout(runSearch, 260); });
  btnClearSearch.addEventListener('click', clearSearch);

  function runSearch() {
    const q = searchInput.value.trim();
    if (!q) { clearSearch(); return; }
    btnClearSearch.classList.remove('d-none'); exploreMain.classList.add('d-none'); searchPanel.classList.remove('d-none');

    const lowerQ = q.toLowerCase();
    const tagQ = lowerQ.startsWith('#') ? lowerQ.slice(1) : lowerQ;

    const results = allStories.filter(s => s.text.toLowerCase().includes(lowerQ) || s.author.toLowerCase().includes(lowerQ) || s.tags.some(t => t.toLowerCase().includes(tagQ)) || s.badge.toLowerCase().includes(lowerQ));

    searchInfo.classList.remove('d-none'); searchInfo.textContent = results.length ? `${results.length} cerita ditemukan untuk "${q}"` : '';

    if (!results.length) { searchList.innerHTML = ''; searchEmpty.classList.remove('d-none'); } 
    else { searchEmpty.classList.add('d-none'); searchList.innerHTML = results.map(s => buildPostCardHTML(s, q)).join(''); }
  }

  function clearSearch() {
    searchInput.value = ''; btnClearSearch.classList.add('d-none'); searchInfo.classList.add('d-none'); searchPanel.classList.add('d-none'); searchEmpty.classList.add('d-none'); exploreMain.classList.remove('d-none');
  }

  /* Mood & Categories Logic */
  const moodToCat = { 'patah-hati': ['heartbreak', 'firstlove'], 'gelisah': ['anxiety'], 'rindu': ['nostalgia', 'firstlove'], 'bersyukur': ['healing', 'selflove'], 'marah': ['toxic', 'anxiety'], 'semua': null };

  document.getElementById('moodChips').addEventListener('click', e => {
    const chip = e.target.closest('.mood-chip');
    if (!chip) return;
    document.querySelectorAll('.mood-chip').forEach(c => c.classList.remove('active'));
    chip.classList.add('active');

    const mood = chip.dataset.mood; const cats = moodToCat[mood]; const feed = document.getElementById('trendingFeed');
    if (!cats) { feed.innerHTML = allStories.slice(0, 5).map((s, i) => buildPostCardHTML(s, '', i+1)).join(''); } 
    else { const filtered = allStories.filter(s => cats.some(c => s.tags.includes(c))); feed.innerHTML = filtered.length ? filtered.map(s => buildPostCardHTML(s)).join('') : `<p class="text-muted p-3">Tidak ada trending untuk mood ini.</p>`; }
  });

  const catPanel = document.getElementById('categoryResultsPanel');
  const catLabels = { heartbreak: '💔 Heartbreak', firstlove: '🌸 First Love', toxic: '🚩 Toxic Relationship', healing: '🌿 Healing', platonic: '🤝 Platonic Love', selflove: '🪞 Self-Love', family: '🏠 Family', anxiety: '🌀 Anxiety', friendship: '🫂 Friendship', nostalgia: '🕰️ Nostalgia' };

  document.getElementById('categoriesGrid').addEventListener('click', e => {
    const card = e.target.closest('.category-card');
    if (!card) return;
    const cat = card.dataset.cat;
    exploreMain.classList.add('d-none'); searchPanel.classList.add('d-none'); catPanel.classList.remove('d-none');
    document.getElementById('catResultTitle').textContent = catLabels[cat] || cat;

    const posts = allStories.filter(s => s.tags.includes(cat));
    const list  = document.getElementById('categoryPostsList');
    if (!posts.length) { list.innerHTML = `<div class="text-center py-5 text-muted"><div style="font-size:2.5rem;">✨</div><p class="mt-2">Belum ada cerita dengan kategori #${cat} ini.</p></div>`; return; }
    list.innerHTML = posts.map(s => buildPostCardHTML(s)).join('');
    catPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  document.getElementById('btnBackCat').addEventListener('click', () => { catPanel.classList.add('d-none'); exploreMain.classList.remove('d-none'); });

  /* Trending Tags Logic */
  const trendingTags = document.getElementById('trendingTags');
  if (trendingTags) {
    trendingTags.addEventListener('click', e => {
      const btn = e.target.closest('.trending-tag-btn');
      if (!btn) return;

      document.querySelectorAll('.trending-tag-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const tag = btn.dataset.tag;
      const searchInput = document.getElementById('searchInput');
      searchInput.value = '#' + tag;

      searchInput.dispatchEvent(new Event('input'));
    });
  }
});