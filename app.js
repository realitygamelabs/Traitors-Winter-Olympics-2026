(() => {
  'use strict';
  const root = window.TRAITORS_DATA;
  if (!root || !Array.isArray(root.phases)) {
    document.body.insertAdjacentHTML('afterbegin','<p style="padding:24px;background:#421920;color:white">The archive data could not be loaded. Keep data.js beside index.html.</p>');
    return;
  }

  const $ = (id) => document.getElementById(id);
  const clean = (s) => String(s == null ? '' : s);
  const html = (s) => clean(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
  const pad = (v) => String(v).padStart(2,'0');
  const phaseById = (id) => root.phases.findIndex(p => p.id === id);
  const phaseFromUrl = () => {
    const chosen = new URLSearchParams(location.search).get('phase');
    const number = phaseById(chosen);
    return number >= 0 ? number : 0;
  };
  const state = { phase:phaseFromUrl(), selectedRecording:0, player:'all', sort:'asc', search:'', gallery:'all', date:'all', shown:36, visiblePhotos:[] };
  const getPhase = () => root.phases[state.phase];
  const getConfessionals = () => root.confessionals.filter(c => c.phase === state.phase);
  const getPhotos = () => root.photos.filter(p => p.phase === state.phase);
  const num = (n) => String(n).padStart(2,'0');

  function renderNav() {
    $('chapterNav').innerHTML = root.phases.map((p,i) => `<button type="button" class="chapter-tab ${i===state.phase?'active':''}" data-phase="${i}" aria-label="View chapter ${i+1}: ${html(p.title)}" aria-current="${i===state.phase?'step':'false'}"><span class="num">${num(i+1)} / 06</span><span class="name">${html(p.title)}</span><span class="hint">${html(p.period)}</span></button>`).join('');
    $('chapterNav').querySelectorAll('button').forEach(button => button.addEventListener('click', () => setPhase(Number(button.dataset.phase))));
    $('chapterNav').querySelector('.active')?.scrollIntoView({block:'nearest', inline:'nearest', behavior:'instant'});
  }

  function updateHeading() {
    const p=getPhase();
    $('chapterIndicator').textContent=`CHAPTER ${num(p.index)} OF 06`;
    $('chapterDates').textContent=p.date;
    $('chapterSub').textContent=p.period.toUpperCase();
    $('chapterTitle').textContent=p.title;
    $('chapterNum').innerHTML=`${num(p.index)}<span>/06</span>`;
    $('chapterLead').textContent=p.lead;
    $('chapterStats').innerHTML = [
      [p.recordings.length, 'OFFICIAL RECORDING'+(p.recordings.length===1?'':'S')],
      [p.confessionals, 'CONFESSIONALS'],
      [p.players, 'PLAYERS HEARD FROM'],
      [p.screenshots, 'CHAT SCREENGRABS']
    ].map(([v,l])=>`<div class="stat-item"><strong>${v}</strong><span>${html(l)}</span></div>`).join('');
  }

  function selectRecording(index) {
    const recordings=getPhase().recordings;
    const film=recordings[index];
    if(!film) return;
    state.selectedRecording=index;
    // Google Drive preview is an iframe rather than a direct video file URL.
    // A user's sharing settings still control whether the video is playable.
    $('mainPlayer').src=film.embed || 'about:blank';
    $('mainPlayer').title=film.name;
    $('playerPlaceholder').style.display=film.embed ? 'none' : 'grid';
    $('playingName').textContent=film.name;
    $('playingDate').textContent=film.date || '';
    $('externalVideo').href=film.link;
    $('playerCount').textContent=`${num(index+1)} / ${num(recordings.length)}`;
    for(const button of $('recordingList').querySelectorAll('button')) {
      const active=Number(button.dataset.index)===index;
      button.classList.toggle('active',active);
      button.setAttribute('aria-pressed',String(active));
    }
  }

  function renderRecordings() {
    const arr=getPhase().recordings;
    $('playlistCount').textContent=`${num(arr.length)} FILM${arr.length===1?'':'S'}`;
    $('recordingList').innerHTML=arr.map((r,i) => `<button class="playlist-item" type="button" data-index="${i}" aria-label="Play ${html(r.name)}"><span class="play-icon">▶</span><span><strong>${html(r.name)}</strong><small>${html(r.date||'GAME RECORDING')}</small></span><span class="arrow">↗</span></button>`).join('');
    $('recordingList').querySelectorAll('button').forEach(b=>b.addEventListener('click',()=>selectRecording(Number(b.dataset.index))));
    selectRecording(0);
  }

  function renderStory() {
    const p=getPhase();
    $('bigQuote').textContent=p.pull;
    $('storyNote').textContent=p.note;
    $('storyBeats').innerHTML=p.sections.map((section,i)=>`<article class="story-beat"><div class="beat-no">${num(i+1)} <span>✦</span></div><h4>${html(section[0])}</h4><p>${html(section[1])}</p></article>`).join('');
  }

  function renderHighlights() {
    const p=getPhase();
    $('highlightGrid').innerHTML=p.highlights.map((h,i)=>`<button type="button" class="evidence-card" data-highlight="${i}" aria-label="Open conversation exhibit ${i+1}"><div class="exhibit-img"><img loading="lazy" src="${html(h.src)}" alt="Original chat screenshot for exhibit ${i+1}"></div><div class="evidence-body"><span class="evidence-num">EXHIBIT ${num(i+1)}</span><h4>Conversation ${num(i+1)}</h4><p>${html(h.caption)}</p><div class="shot-date">CAPTURED ${html(h.date.toUpperCase())} · ${html(h.time)}</div></div></button>`).join('');
    $('highlightGrid').querySelectorAll('button').forEach(button=>button.addEventListener('click',()=>{
      const item=p.highlights[Number(button.dataset.highlight)];
      const current=getPhotos().findIndex(photo=>photo.src===item.src);
      openImage(current>=0?current:0,getPhotos(),item.caption);
    }));
  }

  function renderPlayers() {
    const present=[...new Set(getConfessionals().map(c=>c.player))].sort((a,b)=>a.localeCompare(b));
    $('playerSelect').innerHTML='<option value="all">All players</option>'+present.map(p=>`<option value="${html(p)}">${html(p)}</option>`).join('');
    $('playerSelect').value=state.player==='all'||present.includes(state.player)?state.player:'all';
    state.player=$('playerSelect').value;
  }

  function renderConfessionals() {
    const q=state.search.trim().toLowerCase();
    let items=getConfessionals().filter(c => (state.player==='all'||c.player===state.player) && (!q || `${c.player} ${c.date} ${c.time}`.toLowerCase().includes(q)));
    items.sort((a,b)=>state.sort==='asc'?a.iso.localeCompare(b.iso):b.iso.localeCompare(a.iso));
    $('confCounter').textContent=`${items.length} RECORDING${items.length===1?'':'S'}`;
    $('confList').innerHTML=items.length?items.map((c,i)=>`<button type="button" class="conf-entry" data-conf="${c.id}" aria-label="Play ${html(c.player)} confessional from ${html(c.date)} at ${html(c.time)}"><span class="conf-avatar">${html(c.player.charAt(0))}</span><span><strong>${html(c.player)}</strong><small>${html(c.date)} · ${html(c.time)}</small></span><em aria-hidden="true">▶</em></button>`).join(''):'<div class="empty-state">No confessionals match this filter.</div>';
    $('confList').querySelectorAll('button').forEach(b=>b.addEventListener('click',()=>openConfessional(Number(b.dataset.conf))));
    $('sortOld').classList.toggle('active',state.sort==='asc');
    $('sortNew').classList.toggle('active',state.sort==='desc');
  }

  function openConfessional(id) {
    const c=root.confessionals.find(v=>v.id===id);
    if (!c) return;
    $('dialogTitle').textContent=`${c.player} · ${c.date}`;
    $('dialogExternal').href=c.url;
    $('dialogFrame').src=c.embed||'about:blank';
    try {$('mediaDialog').showModal();} catch(e) {window.open(c.url,'_blank','noopener,noreferrer');}
  }

  function closeConfessional() {
    $('dialogFrame').src='about:blank';
    if($('mediaDialog').open) $('mediaDialog').close();
  }

  function renderDays() {
    const days=[...new Set(getPhotos().map(p=>p.day))].sort();
    $('daySelect').innerHTML='<option value="all">All dates</option>'+days.map(day=>{
      const date=new Date(day+'T12:00:00');
      const display=date.toLocaleDateString('en-US',{month:'short',day:'numeric'});
      return `<option value="${html(day)}">${html(display)}</option>`;
    }).join('');
    $('daySelect').value=state.date;
  }

  function photoFilter() {
    const p=getPhase();
    const featured=new Set(p.highlights.map(v=>v.src));
    return getPhotos().filter(photo => (state.gallery==='all'||featured.has(photo.src))&&(state.date==='all'||photo.day===state.date));
  }

  function renderGallery() {
    const pics=photoFilter();
    const visible=pics.slice(0,state.shown);
    state.visiblePhotos=pics;
    $('photoCount').textContent=`${pics.length} PHOTO${pics.length===1?'':'S'}`;
    $('galleryAll').classList.toggle('selected',state.gallery==='all');
    $('galleryHighlights').classList.toggle('selected',state.gallery==='highlights');
    $('galleryAll').setAttribute('aria-pressed',String(state.gallery==='all'));
    $('galleryHighlights').setAttribute('aria-pressed',String(state.gallery==='highlights'));
    $('photoGrid').innerHTML=visible.map((photo,i)=>`<button class="gallery-item" type="button" data-photo="${i}" aria-label="View screenshot captured ${html(photo.date)} at ${html(photo.time)}" title="${html(photo.date)} · ${html(photo.time)}"><img src="${html(photo.src)}" loading="lazy" decoding="async" alt="WhatsApp screenshot, captured ${html(photo.date)}" /></button>`).join('');
    $('photoGrid').querySelectorAll('button').forEach(b=>b.addEventListener('click',()=>openImage(Number(b.dataset.photo),pics)));
    if (!pics.length) $('photoGrid').innerHTML='<p class="empty-state">There are no photos for this selection.</p>';
    $('shownCount').textContent=`SHOWING ${visible.length} OF ${pics.length} CAPTURES`;
    $('morePhotos').hidden=visible.length>=pics.length;
  }

  let lightboxPhotos=[], lightboxIndex=0, lightboxNote='';
  function openImage(index,collection,note='') {
    if (!collection.length) return;
    lightboxPhotos=collection;
    lightboxIndex=Math.min(Math.max(0,index),collection.length-1);
    lightboxNote=note;
    updateImageLightbox();
    try { $('imageDialog').showModal(); } catch(e) { window.open(collection[lightboxIndex].src,'_blank','noopener,noreferrer'); }
  }
  function updateImageLightbox() {
    const photo=lightboxPhotos[lightboxIndex]; if (!photo) return;
    $('zoomImage').src=photo.src;
    $('zoomImage').alt=`Original conversation screenshot captured ${photo.date} at ${photo.time}`;
    $('lightboxLabel').textContent=`CAPTURED ${photo.date.toUpperCase()} · ${photo.time.toUpperCase()} · ${lightboxIndex+1}/${lightboxPhotos.length}`;
    $('lightboxCaption').textContent=lightboxNote || 'Original screenshot from the game archive. The capture timestamp may differ from individual message timestamps.';
    $('photoPrev').disabled=lightboxIndex===0;
    $('photoNext').disabled=lightboxIndex===lightboxPhotos.length-1;
  }
  function moveImage(step) {
    const next=lightboxIndex+step;
    if(next<0||next>=lightboxPhotos.length)return;
    lightboxIndex=next;
    lightboxNote='';
    updateImageLightbox();
  }
  function closeImage() {
    if($('imageDialog').open) $('imageDialog').close();
    $('zoomImage').removeAttribute('src');
  }

  function renderPrevNext() {
    const previous=root.phases[state.phase-1];
    const next=root.phases[state.phase+1];
    $('prevChapter').disabled=!previous;
    $('nextChapter').disabled=!next;
    $('prevName').textContent=previous?previous.title:'THE BEGINNING';
    $('nextName').textContent=next?next.title:'THE END';
  }

  function setPhase(index, options={}) {
    if (!Number.isInteger(index)||index<0||index>=root.phases.length) return;
    closeConfessional();closeImage();
    state.phase=index;
    state.selectedRecording=0;
    state.player='all';state.search='';state.sort='asc';state.date='all';state.gallery='all';state.shown=36;
    $('confSearch').value='';
    renderAll();
    const url=new URL(location.href);
    if(index===0)url.searchParams.delete('phase');else url.searchParams.set('phase',getPhase().id);
    if(!options.skipHistory) {
      try { history.pushState({phase:index},'',url.pathname+url.search); }
      catch(error) { /* File previews and restricted browser contexts may disallow History API updates. */ }
    }
    if(options.scroll!==false) {
      const nav=$('chapterNav');
      const navHeight=document.querySelector('.chapter-nav')?.offsetHeight||0;
      const y=$('main').getBoundingClientRect().top+window.scrollY-navHeight-6;
      window.scrollTo({top:Math.max(0,y),behavior:'smooth'});
    }
  }

  function renderAll() {
    renderNav();updateHeading();renderRecordings();renderStory();renderHighlights();renderPlayers();renderConfessionals();renderDays();renderGallery();renderPrevNext();
    document.title=`${getPhase().title} | The Traitors: Winter Olympics`;
  }

  $('playerSelect').addEventListener('change',(event)=>{state.player=event.target.value;renderConfessionals();});
  $('confSearch').addEventListener('input',(event)=>{state.search=event.target.value;renderConfessionals();});
  $('sortOld').addEventListener('click',()=>{state.sort='asc';renderConfessionals();});
  $('sortNew').addEventListener('click',()=>{state.sort='desc';renderConfessionals();});
  $('galleryAll').addEventListener('click',()=>{state.gallery='all';state.shown=36;renderGallery();});
  $('galleryHighlights').addEventListener('click',()=>{state.gallery='highlights';state.shown=36;renderGallery();});
  $('daySelect').addEventListener('change',event=>{state.date=event.target.value;state.shown=36;renderGallery();});
  $('morePhotos').addEventListener('click',()=>{state.shown+=36;renderGallery();});
  $('prevChapter').addEventListener('click',()=>setPhase(state.phase-1));
  $('nextChapter').addEventListener('click',()=>setPhase(state.phase+1));
  $('dialogClose').addEventListener('click',closeConfessional);
  $('mediaDialog').addEventListener('close',()=>{$('dialogFrame').src='about:blank';});
  $('photoClose').addEventListener('click',closeImage);
  $('photoPrev').addEventListener('click',()=>moveImage(-1));
  $('photoNext').addEventListener('click',()=>moveImage(1));
  $('imageDialog').addEventListener('close',()=>{$('zoomImage').removeAttribute('src');});
  document.querySelectorAll('dialog').forEach(dialog=>dialog.addEventListener('click',(e)=>{
    if(e.target===dialog) dialog.close();
  }));
  document.addEventListener('keydown',(e)=>{
    if(!$('imageDialog').open)return;
    if(e.key==='ArrowLeft')moveImage(-1);
    if(e.key==='ArrowRight')moveImage(1);
  });
  window.addEventListener('popstate',()=>setPhase(phaseFromUrl(),{skipHistory:true,scroll:false}));
  renderAll();
})();
