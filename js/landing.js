
document.addEventListener('DOMContentLoaded', () => {
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const nav = $('#landingNav');
  const menu = $('#landingMenu');
  const links = $('#landingLinks');
  const video = $('#experienceVideo');
  const film = $('#experienceFilm');
  const playBadge = $('#experiencePlayBadge');
  const playHint = $('#experienceHint');
  const videoModal = $('#videoModal');
  const arenaModal = $('#arenaModal');

  const hackathons = {
    '01': { id: '01', tag: 'ARTIFICIAL INTELLIGENCE', title: 'AI INNOVATION', desc: 'Build intelligent solutions for problems that matter.', prize: '₹2,50,000', teams: '342 registered', deadline: '48h remaining' },
    '02': { id: '02', tag: 'WEB DEVELOPMENT', title: 'FUTURE WEB', desc: 'Design and ship the next generation of digital experiences.', prize: '₹1,75,000', teams: '180 registered', deadline: 'Starts in 4 days' },
    '03': { id: '03', tag: 'SMART TECHNOLOGY', title: 'CAMPUS TECH', desc: 'Create technology that makes student life better.', prize: '₹1,00,000', teams: '75 registered', deadline: 'Opens Nov 20' }
  };
  let selectedHackathon = null;

  function scrollToSection(id) {
    const target = document.getElementById(id);
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    closeMenu();
  }
  function closeMenu() {
    links?.classList.remove('mobile-open');
    menu?.setAttribute('aria-expanded', 'false');
    if (menu) menu.textContent = '☰';
  }
  function lockScroll(locked) { document.body.style.overflow = locked ? 'hidden' : ''; }
  function closeArenaModal() {
    if (arenaModal) arenaModal.hidden = true;
    selectedHackathon = null;
    lockScroll(false);
  }
  function openArenaModal(id) {
    const item = hackathons[id];
    if (!item || !arenaModal) return;
    selectedHackathon = item;
    $('#arenaModalTag').textContent = `${item.tag} · ${item.id}`;
    $('#arenaModalTitle').textContent = item.title;
    $('#arenaModalDesc').textContent = item.desc;
    $('#arenaPrize').textContent = item.prize;
    $('#arenaTeams').textContent = item.teams;
    $('#arenaDeadline').textContent = item.deadline;
    arenaModal.hidden = false;
    lockScroll(true);
  }
  function openVideoModal() {
    if (!videoModal) return;
    videoModal.hidden = false;
    lockScroll(true);
    const modalVideo = $('video', videoModal);
    modalVideo?.play().catch(() => {});
  }
  function closeVideoModal() {
    if (!videoModal) return;
    const modalVideo = $('video', videoModal);
    modalVideo?.pause();
    videoModal.hidden = true;
    lockScroll(false);
  }
  function updateVideoState() {
    const playing = video && !video.paused;
    if (playBadge) playBadge.textContent = playing ? '❚❚' : '▶';
    if (playHint) playHint.textContent = playing ? 'TAP TO PAUSE' : 'TAP TO PLAY';
  }
  async function toggleInlineVideo() {
    if (!video) return;
    if (video.paused) {
      video.muted = false;
      try { await video.play(); } catch (_) { showToast('Video could not be played. Please try again.'); }
    } else video.pause();
    updateVideoState();
  }

  
  document.addEventListener('click', (event) => {
    const scrollControl = event.target.closest('[data-scroll]');
    if (scrollControl) { event.preventDefault(); scrollToSection(scrollControl.dataset.scroll); return; }
    const routeControl = event.target.closest('[data-route]');
    if (routeControl) { navigateTo(routeControl.dataset.route); return; }
    const toastControl = event.target.closest('[data-toast]');
    if (toastControl) { event.preventDefault(); showToast(toastControl.dataset.toast); }
  });
  $('[data-action="top"]')?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  menu?.addEventListener('click', () => {
    const isOpen = links.classList.toggle('mobile-open');
    menu.textContent = isOpen ? '✕' : '☰';
    menu.setAttribute('aria-expanded', String(isOpen));
  });
  window.addEventListener('scroll', () => nav?.classList.toggle('scrolled', window.scrollY > 50), { passive: true });

  
  $$('[data-step]').forEach((card) => card.addEventListener('click', () => {
    const step = card.dataset.step;
    if (step === 'discover') { scrollToSection('hackathons'); showToast('Showing available arena challenges'); }
    if (step === 'team') { navigateTo('register'); showToast('Connect with talented builders'); }
    if (step === 'build') { navigateTo('student'); showToast('Enter student development workspace'); }
    if (step === 'ship') { navigateTo('student'); showToast('Ship to arena for judging'); }
  }));


  $$('.hackathon-row').forEach((row) => {
    row.addEventListener('click', () => openArenaModal(row.dataset.hackathon));
    row.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); openArenaModal(row.dataset.hackathon); }
    });
  });
  $('[data-close-modal]')?.addEventListener('click', closeArenaModal);
  arenaModal?.addEventListener('click', (event) => { if (event.target === arenaModal) closeArenaModal(); });
  $('#enterArena')?.addEventListener('click', () => {
    const title = selectedHackathon?.title || 'Hackathon';
    closeArenaModal();
    showToast(`Entered ${title} Arena!`, 'success');
    navigateTo('student');
  });

  
  film?.addEventListener('click', toggleInlineVideo);
  film?.addEventListener('keydown', (event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); toggleInlineVideo(); } });
  video?.addEventListener('play', updateVideoState);
  video?.addEventListener('pause', updateVideoState);
  if (video && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) video.play().catch(() => {});
      else video.pause();
    }), { threshold: 0.35 });
    const section = $('#experience');
    if (section) observer.observe(section);
  }
  $('#openVideoModal')?.addEventListener('click', openVideoModal);
  $$('[data-close-video]').forEach((button) => button.addEventListener('click', closeVideoModal));
  videoModal?.addEventListener('click', (event) => { if (event.target === videoModal) closeVideoModal(); });

  
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') { closeArenaModal(); closeVideoModal(); closeMenu(); }
  });
  links?.addEventListener('click', (event) => { if (event.target.closest('button')) closeMenu(); });
});
