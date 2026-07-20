(() => {
  'use strict';

  document.documentElement.classList.add('has-js');

  const normalizeText = (value) => String(value ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();

  const sidebar = document.querySelector('#codex-sidebar');
  const sidebarBackdrop = document.querySelector('#sidebar-backdrop');
  const menuToggle = document.querySelector('#menu-toggle');
  const navLinks = [...document.querySelectorAll('.nav-link')];
  const sections = [...document.querySelectorAll('[data-section]')];
  const progressBar = document.querySelector('#reading-progress-bar');
  const resumeCard = document.querySelector('#resume-card');
  const resumeLink = document.querySelector('#resume-link');
  const storageKey = 'kingdoom-archivum:last-section';

  const closeSidebar = () => {
    sidebar?.classList.remove('is-open');
    sidebarBackdrop?.classList.remove('is-visible');
    menuToggle?.setAttribute('aria-expanded', 'false');
    menuToggle?.setAttribute('aria-label', 'Abrir índice');
    document.body.classList.remove('is-locked');
  };

  const openSidebar = () => {
    sidebar?.classList.add('is-open');
    sidebarBackdrop?.classList.add('is-visible');
    menuToggle?.setAttribute('aria-expanded', 'true');
    menuToggle?.setAttribute('aria-label', 'Cerrar índice');
    document.body.classList.add('is-locked');
  };

  menuToggle?.addEventListener('click', () => {
    if (sidebar?.classList.contains('is-open')) closeSidebar();
    else openSidebar();
  });
  sidebarBackdrop?.addEventListener('click', closeSidebar);
  navLinks.forEach((link) => link.addEventListener('click', closeSidebar));

  const updateResumeLink = (section) => {
    if (!resumeCard || !resumeLink || !section || section.id === 'inicio') return;
    resumeLink.href = `#${section.id}`;
    resumeLink.textContent = section.dataset.sectionTitle || 'Continuar lectura';
    resumeCard.hidden = false;
  };

  try {
    const savedSectionId = localStorage.getItem(storageKey);
    updateResumeLink(savedSectionId ? document.getElementById(savedSectionId) : null);
  } catch {
    // Reading continuity is optional when storage is unavailable.
  }

  const setActiveSection = (section) => {
    navLinks.forEach((link) => {
      const active = link.getAttribute('href') === `#${section.id}`;
      link.classList.toggle('is-active', active);
      if (active) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });

    try {
      localStorage.setItem(storageKey, section.id);
      updateResumeLink(section);
    } catch {
      // The navigation remains fully functional without localStorage.
    }
  };

  if ('IntersectionObserver' in window) {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((first, second) => second.intersectionRatio - first.intersectionRatio)[0];
        if (visible) setActiveSection(visible.target);
      },
      { rootMargin: '-22% 0px -62% 0px', threshold: [0, 0.1, 0.25] }
    );
    sections.forEach((section) => sectionObserver.observe(section));
  }

  let progressFrame = 0;
  const updateReadingProgress = () => {
    progressFrame = 0;
    if (!progressBar) return;
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollable > 0 ? Math.min(1, Math.max(0, window.scrollY / scrollable)) : 0;
    progressBar.style.width = `${progress * 100}%`;
  };

  window.addEventListener('scroll', () => {
    if (!progressFrame) progressFrame = requestAnimationFrame(updateReadingProgress);
  }, { passive: true });
  window.addEventListener('resize', updateReadingProgress, { passive: true });
  updateReadingProgress();

  const revealTargets = [...document.querySelectorAll(
    '.section-heading, .journey-path > li, .codex-volume, .realm-card, .tension-grid > article, .race-family, .rules-ledger > details, .app-showcase, .install-steps > li, .sheet-layout'
  )];

  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    revealTargets.forEach((target, index) => {
      target.classList.add('reveal-ready');
      target.style.setProperty('--reveal-delay', `${Math.min(index % 5, 4) * 55}ms`);
    });
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-revealed');
        observer.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    revealTargets.forEach((target) => revealObserver.observe(target));
  }

  const raceFilter = document.querySelector('#race-filter');
  const raceCount = document.querySelector('#race-count');
  const raceFamilies = [...document.querySelectorAll('.race-family')];
  const raceEntries = [...document.querySelectorAll('[data-race]')];

  const updateRaceCount = (visible) => {
    if (raceCount) raceCount.textContent = `${visible} de ${raceEntries.length} registros`;
  };

  const filterRaces = () => {
    const query = normalizeText(raceFilter?.value);
    let visibleCount = 0;

    raceFamilies.forEach((family) => {
      let familyMatches = 0;
      family.querySelectorAll('[data-race]').forEach((race) => {
        const match = !query || normalizeText(race.textContent).includes(query);
        race.hidden = !match;
        race.classList.toggle('is-match', Boolean(query && match));
        if (match) familyMatches += 1;
      });
      family.hidden = familyMatches === 0;
      if (query && familyMatches > 0) family.open = true;
      visibleCount += familyMatches;
    });

    updateRaceCount(visibleCount);
  };

  raceFilter?.addEventListener('input', filterRaces);
  updateRaceCount(raceEntries.length);

  const copyButton = document.querySelector('#copy-sheet');
  const copyStatus = document.querySelector('#copy-status');
  const characterTemplate = document.querySelector('#character-template');

  const copyText = async (text) => {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return;
    }

    const fallback = document.createElement('textarea');
    fallback.value = text;
    fallback.setAttribute('readonly', '');
    fallback.style.position = 'fixed';
    fallback.style.opacity = '0';
    document.body.append(fallback);
    fallback.select();
    const copied = document.execCommand('copy');
    fallback.remove();
    if (!copied) throw new Error('copy_failed');
  };

  copyButton?.addEventListener('click', async () => {
    const text = characterTemplate?.textContent?.trim();
    if (!text || !copyStatus) return;

    try {
      await copyText(text);
      copyStatus.textContent = 'Plantilla copiada. Ya puedes completarla donde prefieras.';
      copyButton.classList.add('is-copied');
      window.setTimeout(() => copyButton.classList.remove('is-copied'), 1800);
    } catch {
      copyStatus.textContent = 'No se pudo copiar automáticamente. Selecciona el texto de la plantilla.';
    }
  });

  const searchDialog = document.querySelector('#search-dialog');
  const searchInput = document.querySelector('#codex-search');
  const searchResults = document.querySelector('#search-results');
  const searchClose = document.querySelector('#search-close');
  const searchTriggers = [...document.querySelectorAll('.search-trigger')];
  const searchEntries = [...document.querySelectorAll('[data-search-entry]')].map((entry, index) => {
    if (!entry.id) entry.id = `registro-${index + 1}`;
    const section = entry.closest('[data-section]');
    return {
      element: entry,
      id: entry.id,
      title: entry.dataset.searchTitle || entry.querySelector('h2, h3, h4')?.textContent?.trim() || 'Registro',
      section: section?.dataset.sectionTitle || 'Archivum',
      normalized: normalizeText(`${entry.dataset.searchTitle ?? ''} ${entry.textContent}`),
      excerpt: String(entry.textContent ?? '').replace(/\s+/g, ' ').trim(),
    };
  });

  const renderSearchResults = () => {
    if (!searchResults) return;
    const query = normalizeText(searchInput?.value);
    searchResults.replaceChildren();

    if (!query) {
      const empty = document.createElement('p');
      empty.className = 'search-empty';
      empty.textContent = 'Escribe una palabra para consultar los registros.';
      searchResults.append(empty);
      return;
    }

    const terms = query.split(' ').filter(Boolean);
    const matches = searchEntries
      .filter((entry) => terms.every((term) => entry.normalized.includes(term)))
      .sort((first, second) => {
        const firstTitleMatch = normalizeText(first.title).startsWith(query) ? 1 : 0;
        const secondTitleMatch = normalizeText(second.title).startsWith(query) ? 1 : 0;
        return secondTitleMatch - firstTitleMatch;
      })
      .slice(0, 12);

    if (matches.length === 0) {
      const empty = document.createElement('p');
      empty.className = 'search-empty';
      empty.textContent = `No hay registros para “${searchInput.value.trim()}”.`;
      searchResults.append(empty);
      return;
    }

    matches.forEach((entry) => {
      const link = document.createElement('a');
      link.className = 'search-result';
      link.href = `#${entry.id}`;

      const text = document.createElement('span');
      const title = document.createElement('strong');
      const excerpt = document.createElement('small');
      const arrow = document.createElement('span');
      title.textContent = entry.title;
      const excerptStart = Math.max(0, entry.normalized.indexOf(terms[0]) - 35);
      excerpt.textContent = `${entry.section} · ${entry.excerpt.slice(excerptStart, excerptStart + 115)}`;
      arrow.textContent = '↗';
      text.append(title, excerpt);
      link.append(text, arrow);

      link.addEventListener('click', () => {
        if (entry.element instanceof HTMLDetailsElement) entry.element.open = true;
        entry.element.closest('details')?.setAttribute('open', '');
        searchDialog?.close();
      });
      searchResults.append(link);
    });
  };

  const openSearch = () => {
    if (!searchDialog) return;
    if (typeof searchDialog.showModal === 'function') searchDialog.showModal();
    else searchDialog.setAttribute('open', '');
    window.setTimeout(() => searchInput?.focus(), 0);
  };

  const closeSearch = () => {
    if (!searchDialog) return;
    if (typeof searchDialog.close === 'function') searchDialog.close();
    else searchDialog.removeAttribute('open');
  };

  searchTriggers.forEach((trigger) => trigger.addEventListener('click', openSearch));
  searchClose?.addEventListener('click', closeSearch);
  searchInput?.addEventListener('input', renderSearchResults);
  searchDialog?.addEventListener('click', (event) => {
    if (event.target === searchDialog) closeSearch();
  });

  document.addEventListener('keydown', (event) => {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      openSearch();
    }
    if (event.key === 'Escape') {
      if (searchDialog?.hasAttribute('open')) closeSearch();
      if (sidebar?.classList.contains('is-open')) closeSidebar();
    }
  });

  const downloadButton = document.querySelector('.app-download');
  if (downloadButton && !/Android/i.test(navigator.userAgent)) {
    downloadButton.textContent = 'Descargar APK para Android';
  }
})();
