(function () {
  const wall = document.getElementById('wall');
  const fileInput = document.getElementById('fileInput');
  const dropHint = document.getElementById('dropHint');
  const clearBtn = document.getElementById('clearBtn');

  const modal = document.getElementById('modal');
  const modalImg = document.getElementById('modalImg');
  const modalCaption = document.getElementById('modalCaption');
  const modalClose = document.getElementById('modalClose');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');

  let photos = [];
  let currentIndex = 0;

  try {
    const saved = localStorage.getItem('polaroid-photos');
    photos = saved ? JSON.parse(saved) : [];
  } catch (e) { photos = []; }

  function save() {
    try { localStorage.setItem('polaroid-photos', JSON.stringify(photos)); } 
    catch (e) { console.warn('save failed', e); }
  }

  function createPolaroid(photo, index) {
    const fig = document.createElement('figure');
    fig.className = 'polaroid';
    fig.style.setProperty('--rot', (Math.random() * 12 - 6).toFixed(2) + 'deg');

    const sticker = document.createElement('div');
    sticker.className = 'sticker';
    sticker.textContent = '✦';
    fig.appendChild(sticker);

    const img = document.createElement('img');
    img.src = photo.src;
    img.alt = photo.caption || 'Memory';
    fig.appendChild(img);

    const cap = document.createElement('figcaption');
    cap.className = 'caption';
    cap.textContent = photo.caption || 'A special moment';
    fig.appendChild(cap);

    fig.addEventListener('click', () => openModal(index));

    fig.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      const newCap = prompt('Edit caption:', photo.caption || '');
      if (newCap === null) return;
      if (newCap === '') {
        if (confirm('Delete this photo?')) {
          photos.splice(index, 1);
          render(); save();
        }
      } else {
        photos[index].caption = newCap;
        save(); render();
      }
    });

    return fig;
  }

  function render() {
    wall.innerHTML = '';
    photos.forEach((p, i) => wall.appendChild(createPolaroid(p, i)));
  }

  function openModal(i) {
    currentIndex = i;
    modalImg.src = photos[i].src;
    modalCaption.textContent = photos[i].caption || '';
    modal.setAttribute('aria-hidden', 'false');
  }
  function closeModal() { modal.setAttribute('aria-hidden', 'true'); }
  function next() {
    if (photos.length === 0) return;
    currentIndex = (currentIndex + 1) % photos.length;
    openModal(currentIndex);
  }
  function prev() {
    if (photos.length === 0) return;
    currentIndex = (currentIndex - 1 + photos.length) % photos.length;
    openModal(currentIndex);
  }

  modalClose.addEventListener('click', closeModal);
  nextBtn.addEventListener('click', next);
  prevBtn.addEventListener('click', prev);
  modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
    if (e.key === 'ArrowRight') next();
    if (e.key === 'ArrowLeft') prev();
  });

  fileInput.addEventListener('change', async (e) => {
    const files = Array.from(e.target.files || []);
    await addFiles(files);
    fileInput.value = '';
  });

  ['dragenter', 'dragover'].forEach(ev => {
    document.addEventListener(ev, (e) => { e.preventDefault(); dropHint.style.opacity = 1; });
  });
  ['dragleave', 'drop'].forEach(ev => {
    document.addEventListener(ev, (e) => { e.preventDefault(); dropHint.style.opacity = 0; });
  });
  document.addEventListener('drop', async (e) => {
    const files = Array.from(e.dataTransfer.files || []);
    await addFiles(files);
  });

  async function addFiles(files) {
    const images = files.filter(f => f.type.startsWith('image/'));
    for (const f of images) {
      const data = await fileToDataURL(f);
      photos.push({ src: data, caption: f.name.replace(/\.[^.]+$/, '') });
    }
    save(); render();
  }

  function fileToDataURL(file) {
    return new Promise((res, rej) => {
      const r = new FileReader();
      r.onload = () => res(r.result);
      r.onerror = rej;
      r.readAsDataURL(file);
    });
  }

  clearBtn.addEventListener('click', () => {
    if (confirm('Clear all photos from this wall? This will remove them from this browser only.')) {
      photos = [];
      save(); render();
    }
  });

  render();

  if (photos.length === 0) {
    const seed = [
      { src: 'data:image/svg+xml;utf8,' + encodeURIComponent(makePlaceholderSVG('Add your first memory','320x220')), caption: 'Our first memory' },
      { src: 'data:image/svg+xml;utf8,' + encodeURIComponent(makePlaceholderSVG('Add more photos','320x220')), caption: 'More to come' }
    ];
    photos = seed.concat(photos); save(); render();
  }

  function makePlaceholderSVG(text, size) {
    return `<?xml version='1.0' encoding='utf-8'?><svg xmlns='http://www.w3.org/2000/svg' width='320' height='220'><rect width='100%' height='100%' fill='%23ddd'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='18' fill='%23666'>${text}</text></svg>`;
  }
})();
