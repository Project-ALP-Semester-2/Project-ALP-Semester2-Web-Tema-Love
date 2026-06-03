// ── explorepage.js ──
// Reuses UI patterns from homepage.js

// ─── Data ───────────────────────────────────────────────────────────────────

const allStories = [
  {
    id: 1, cat: "heartbreak", tags: ["patah-hati", "move-on"],
    author: "Autumn Whisper", seed: "broken7", avatarClass: "avatar-pink",
    badge: "💔 Heartbreak", badgeClass: "badge-heartbreak",
    time: "3 hari lalu",
    text: "Aku masih menyimpan foto kita di folder tersembunyi. Bukan karena aku belum move on — tapi karena aku takut suatu hari aku lupa betapa bahagianya kita dulu. Apakah itu salah?",
    empathy: 847, comments: 92, reposts: 34, heat: 412
  },
  {
    id: 2, cat: "anxiety", tags: ["anxiety", "toxic", "overthinking"],
    author: "Midnight Rover", seed: "toxic88", avatarClass: "avatar-teal",
    badge: "🌀 Anxiety", badgeClass: "badge-anxiety",
    time: "1 hari lalu",
    text: "Setiap kali dia bilang 'terserah kamu', itu bukan pilihan — itu jebakan. Aku selalu salah apapun yang aku putuskan. Dan aku baru sadar itu bukan cinta, itu kontrol.",
    empathy: 621, comments: 74, reposts: 0, heat: 288,
    hasVote: true, voteHealthy: 12, voteToxic: 88
  },
  {
    id: 3, cat: "healing", tags: ["healing", "self-love"],
    author: "Soft Garden", seed: "heal22", avatarClass: "avatar-teal",
    badge: "🌿 Healing", badgeClass: "badge-selflove",
    time: "2 hari lalu",
    text: "Hari ini aku berhasil makan tiga kali. Aku mandi. Aku keluar rumah meski cuma ke teras. Kecil banget kan? Tapi setahun lalu aku bahkan nggak bisa bangun dari kasur. Ini kemenangan.",
    empathy: 1200, comments: 143, reposts: 89, heat: 533
  },
  {
    id: 4, cat: "family", tags: ["keluarga"],
    author: "Quiet Forest", seed: "fam99", avatarClass: "avatar-pink",
    badge: "🏠 Family", badgeClass: "badge-family",
    time: "4 hari lalu",
    text: "Orang tua ku tidak pernah bertanya bagaimana perasaanku. Mereka hanya bertanya nilai, ranking, masa depan. Aku jadi orang asing di rumah sendiri. Tapi aku nggak menyalahkan mereka — mereka tidak tahu cara lain mencintai.",
    empathy: 532, comments: 61, reposts: 0, heat: 201
  },
  {
    id: 5, cat: "firstlove", tags: ["cinta-pertama", "nostalgia"],
    author: "Paper Crane", seed: "fl33", avatarClass: "avatar-teal",
    badge: "🌸 First Love", badgeClass: "badge-heartbreak",
    time: "5 hari lalu",
    text: "Cinta pertama bukan tentang siapa orangnya. Tapi tentang versi dirimu yang belum pernah terluka. Aku bukan merindukan dia — aku merindukan diriku yang dulu percaya bahwa semuanya akan baik-baik saja.",
    empathy: 489, comments: 57, reposts: 44, heat: 178
  },
  {
    id: 6, cat: "selflove", tags: ["self-love", "healing"],
    author: "Lunar Drift", seed: "sl44", avatarClass: "avatar-pink",
    badge: "🪞 Self-Love", badgeClass: "badge-selflove",
    time: "6 hari lalu",
    text: "Aku belajar bahwa mencintai diri sendiri bukan berarti narsis. Itu hanya berarti kamu tidak akan membiarkan siapapun — termasuk dirimu sendiri — memperlakukanmu dengan buruk.",
    empathy: 376, comments: 48, reposts: 22, heat: 144
  },
  {
    id: 7, cat: "toxic", tags: ["toxic", "move-on"],
    author: "Red Flag Museum", seed: "rf55", avatarClass: "avatar-teal",
    badge: "🚩 Toxic", badgeClass: "badge-heartbreak",
    time: "2 hari lalu",
    text: "Tanda pertama: dia selalu punya alasan untuk setiap sikap buruknya. Tanda kedua: maaf selalu datang diikuti pengulangan. Tanda ketiga: kamu mulai merasa kamu yang selalu salah.",
    empathy: 910, comments: 105, reposts: 67, heat: 392,
    hasVote: true, voteHealthy: 5, voteToxic: 95
  },
  {
    id: 8, cat: "platonic", tags: ["platonic", "friendship"],
    author: "Still Waters", seed: "pl66", avatarClass: "avatar-pink",
    badge: "🤝 Platonic", badgeClass: "badge-selflove",
    time: "3 hari lalu",
    text: "Ada teman yang hafal cara kamu nangis. Hafal kode kalau kamu lagi nggak baik-baik aja. Itu cinta juga — cuma beda bentuk.",
    empathy: 298, comments: 35, reposts: 18, heat: 112
  },
  {
    id: 9, cat: "friendship", tags: ["friendship"],
    author: "Echo Valley", seed: "fr77", avatarClass: "avatar-teal",
    badge: "🫂 Friendship", badgeClass: "badge-family",
    time: "7 hari lalu",
    text: "Kehilangan sahabat bisa lebih menyakitkan dari putus cinta. Tapi nggak ada yang mau ngakuin itu. Kita nggak pernah diajari cara berduka untuk persahabatan yang pergi.",
    empathy: 441, comments: 52, reposts: 30, heat: 167
  },
  {
    id: 10, cat: "nostalgia", tags: ["nostalgia", "cinta-pertama"],
    author: "Glass Archive", seed: "ns88", avatarClass: "avatar-pink",
    badge: "🕰️ Nostalgia", badgeClass: "badge-heartbreak",
    time: "5 hari lalu",
    text: "Aku ketemu foto lama di hp rusak yang akhirnya berhasil aku recover. Ada kita. Tertawa. Aku lupa kita pernah sebahagia itu.",
    empathy: 312, comments: 40, reposts: 15, heat: 120
  }
];

// ─── Render Utils ────────────────────────────────────────────────────────────

function fmtNum(n) {
  return n >= 1000 ? (n / 1000).toFixed(1).replace('.0', '') + 'k' : n;
}

function buildPostCard(story, highlight = '') {
  let textHtml = story.text;
  if (highlight) {
    const re = new RegExp(`(${highlight.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    textHtml = story.text.replace(re, '<mark class="search-highlight">$1</mark>');
  }

  let voteHtml = '';
  if (story.hasVote) {
    voteHtml = `
      <div class="voting-box rounded-3 p-3 my-2">
        <p class="mb-2 small fw-semibold" style="color:var(--neutral);">Menurutmu hubungan ini...</p>
        <div class="d-flex gap-2">
          <button class="btn-vote btn-vote-healthy">🌿 Sehat</button>
          <button class="btn-vote btn-vote-toxic active">🚩 Toxic</button>
        </div>
        <div class="mt-2">
          <div class="vote-bar-wrap">
            <div class="vote-bar-healthy" style="width:${story.voteHealthy}%;"></div>
          </div>
          <div class="d-flex justify-content-between mt-1" style="font-size:11px;color:var(--neutral-light);">
            <span>${story.voteHealthy}% Sehat</span><span>${story.voteToxic}% Toxic</span>
          </div>
        </div>
      </div>`;
  }

  const repostHtml = story.reposts
    ? `<span class="interaction-btn text-muted hover-primary"><i class="bi bi-arrow-repeat"></i> ${story.reposts}</span>`
    : '';

  return `
    <article class="post-card hover-effect p-3 p-md-4 animate-fade-in">
      <div class="d-flex gap-3">
        <div class="position-relative flex-shrink-0">
          <img src="https://api.dicebear.com/7.x/miniavs/svg?seed=${story.seed}" class="rounded-circle ${story.avatarClass}" style="width:46px;height:46px;" />
        </div>
        <div class="flex-grow-1 min-w-0">
          <div class="d-flex align-items-center gap-2 mb-1 flex-wrap">
            <span class="fw-bold" style="font-size:14px;">${story.author}</span>
            <span class="text-muted" style="font-size:12px;">· ${story.time}</span>
            <span class="badge-category ${story.badgeClass} ms-auto">${story.badge}</span>
          </div>
          <p class="post-text mb-2">${textHtml}</p>
          ${voteHtml}
          <div class="d-flex align-items-center gap-3 mt-2 flex-wrap">
            <span class="interaction-btn text-muted hover-heart"><i class="bi bi-heart-fill" style="color:#c2185b;"></i> ${fmtNum(story.empathy)} empati</span>
            <span class="interaction-btn text-muted hover-primary"><i class="bi bi-chat"></i> ${story.comments}</span>
            ${repostHtml}
          </div>
        </div>
      </div>
    </article>`;
}

// ─── Search ──────────────────────────────────────────────────────────────────

const searchInput    = document.getElementById('searchInput');
const btnClearSearch = document.getElementById('btnClearSearch');
const searchInfo     = document.getElementById('searchResultsInfo');
const searchPanel    = document.getElementById('searchResultsPanel');
const searchList     = document.getElementById('searchResultsList');
const searchEmpty    = document.getElementById('searchEmpty');
const exploreMain    = document.getElementById('exploreMain');
const catPanel       = document.getElementById('categoryResultsPanel');

let searchDebounce;

searchInput.addEventListener('input', () => {
  clearTimeout(searchDebounce);
  searchDebounce = setTimeout(runSearch, 260);
});

btnClearSearch.addEventListener('click', clearSearch);

function runSearch() {
  const q = searchInput.value.trim();
  if (!q) { clearSearch(); return; }

  btnClearSearch.classList.remove('d-none');
  exploreMain.classList.add('d-none');
  catPanel.classList.add('d-none');
  searchPanel.classList.remove('d-none');

  const results = allStories.filter(s =>
    s.text.toLowerCase().includes(q.toLowerCase()) ||
    s.author.toLowerCase().includes(q.toLowerCase()) ||
    s.tags.some(t => t.includes(q.toLowerCase())) ||
    s.badge.toLowerCase().includes(q.toLowerCase())
  );

  searchInfo.classList.remove('d-none');
  searchInfo.textContent = results.length
    ? `${results.length} cerita ditemukan untuk "${q}"`
    : '';

  if (!results.length) {
    searchList.innerHTML = '';
    searchEmpty.classList.remove('d-none');
  } else {
    searchEmpty.classList.add('d-none');
    searchList.innerHTML = results.map(s => buildPostCard(s, q)).join('');
    attachVoteListeners(searchList);
  }
}

function clearSearch() {
  searchInput.value = '';
  btnClearSearch.classList.add('d-none');
  searchInfo.classList.add('d-none');
  searchPanel.classList.add('d-none');
  searchEmpty.classList.add('d-none');
  exploreMain.classList.remove('d-none');
}

// ─── Category Cards ──────────────────────────────────────────────────────────

const catLabels = {
  heartbreak: '💔 Heartbreak',
  firstlove:  '🌸 First Love',
  toxic:      '🚩 Toxic Relationship',
  healing:    '🌿 Healing',
  platonic:   '🤝 Platonic Love',
  selflove:   '🪞 Self-Love',
  family:     '🏠 Family',
  anxiety:    '🌀 Anxiety',
  friendship: '🫂 Friendship',
  nostalgia:  '🕰️ Nostalgia'
};

document.getElementById('categoriesGrid').addEventListener('click', e => {
  const card = e.target.closest('.category-card');
  if (!card) return;

  const cat = card.dataset.cat;
  showCategoryResults(cat);
});

document.getElementById('btnBackCat').addEventListener('click', () => {
  catPanel.classList.add('d-none');
  exploreMain.classList.remove('d-none');
});

function showCategoryResults(cat) {
  exploreMain.classList.add('d-none');
  searchPanel.classList.add('d-none');
  catPanel.classList.remove('d-none');

  document.getElementById('catResultTitle').textContent = catLabels[cat] || cat;

  const posts = allStories.filter(s => s.cat === cat);
  const list  = document.getElementById('categoryPostsList');

  if (!posts.length) {
    list.innerHTML = `<div class="text-center py-5 text-muted">
      <div style="font-size:2.5rem;">✨</div>
      <p class="mt-2">Belum ada cerita di kategori ini.</p>
    </div>`;
    return;
  }

  list.innerHTML = posts.map(s => buildPostCard(s)).join('');
  attachVoteListeners(list);
  catPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ─── Tag Buttons ─────────────────────────────────────────────────────────────

document.getElementById('trendingTags').addEventListener('click', e => {
  const btn = e.target.closest('.trending-tag-btn');
  if (!btn) return;

  document.querySelectorAll('.trending-tag-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');

  const tag = btn.dataset.tag;
  searchInput.value = '#' + tag;
  btnClearSearch.classList.remove('d-none');

  const results = allStories.filter(s => s.tags.includes(tag));
  exploreMain.classList.add('d-none');
  catPanel.classList.add('d-none');
  searchPanel.classList.remove('d-none');
  searchInfo.classList.remove('d-none');
  searchInfo.textContent = `${results.length} cerita dengan tag #${tag}`;

  if (!results.length) {
    searchList.innerHTML = '';
    searchEmpty.classList.remove('d-none');
  } else {
    searchEmpty.classList.add('d-none');
    searchList.innerHTML = results.map(s => buildPostCard(s, tag)).join('');
    attachVoteListeners(searchList);
  }
});

// ─── Mood Chips ──────────────────────────────────────────────────────────────

const moodToCat = {
  'patah-hati': ['heartbreak', 'firstlove'],
  'gelisah':    ['anxiety'],
  'rindu':      ['nostalgia', 'firstlove'],
  'bersyukur':  ['healing', 'selflove'],
  'marah':      ['toxic', 'anxiety'],
  'semua':      null
};

document.getElementById('moodChips').addEventListener('click', e => {
  const chip = e.target.closest('.mood-chip');
  if (!chip) return;

  document.querySelectorAll('.mood-chip').forEach(c => c.classList.remove('active'));
  chip.classList.add('active');

  const mood = chip.dataset.mood;
  const cats = moodToCat[mood];

  const feed = document.getElementById('trendingFeed');
  const articles = feed.querySelectorAll('.post-card');

  if (!cats) {
    articles.forEach(a => { a.style.display = ''; });
    return;
  }

  articles.forEach(a => {
    const id = parseInt(a.dataset.id);
    const story = allStories.find(s => s.id === id);
    a.style.display = story && cats.includes(story.cat) ? '' : 'none';
  });
});

// ─── Voting ──────────────────────────────────────────────────────────────────

function attachVoteListeners(container) {
  container.querySelectorAll('.voting-box').forEach(box => {
    const healthy = box.querySelector('.btn-vote-healthy');
    const toxic   = box.querySelector('.btn-vote-toxic');
    const bar     = box.querySelector('.vote-bar-healthy');
    const labels  = box.querySelectorAll('.d-flex.justify-content-between span');

    [healthy, toxic].forEach(btn => {
      btn.addEventListener('click', () => {
        healthy.classList.remove('active');
        toxic.classList.remove('active');
        btn.classList.add('active');

        const isHealthy = btn === healthy;
        const hPct = isHealthy ? Math.min(parseInt(bar.style.width) + 5, 95) : Math.max(parseInt(bar.style.width) - 5, 5);
        bar.style.width = hPct + '%';
        if (labels.length === 2) {
          labels[0].textContent = hPct + '% Sehat';
          labels[1].textContent = (100 - hPct) + '% Toxic';
        }
      });
    });
  });
}

// Attach vote listeners for pre-rendered trending feed
attachVoteListeners(document.getElementById('trendingFeed'));

// ─── Follow Buttons ───────────────────────────────────────────────────────────

document.addEventListener('click', e => {
  const btn = e.target.closest('.btn-follow');
  if (!btn) return;
  const isFollowing = btn.classList.toggle('following');
  btn.textContent = isFollowing ? 'Following' : 'Follow';
});