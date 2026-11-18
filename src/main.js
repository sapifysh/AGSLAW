// Theme toggle (light default, optional dark mode via navbar symbol)
const themeToggle = document.getElementById('theme-toggle');
const THEME_STORAGE_KEY = 'agslaw-theme';

function applyTheme(theme) {
  const isDark = theme === 'dark';
  if (isDark) {
    document.documentElement.setAttribute('data-theme', 'dark');
  } else {
    document.documentElement.removeAttribute('data-theme');
  }

  if (themeToggle) {
    themeToggle.setAttribute('aria-pressed', String(isDark));
    themeToggle.setAttribute(
      'aria-label',
      isDark ? 'Aktifkan mode terang' : 'Aktifkan mode gelap'
    );
    themeToggle.setAttribute('title', isDark ? 'Mode Terang' : 'Mode Gelap');
  }
}

if (themeToggle) {
  const initialTheme =
    document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
  applyTheme(initialTheme);

  themeToggle.addEventListener('click', () => {
    const rootEl = document.documentElement;
    rootEl.classList.add('is-theme-switching');
    const nextTheme = rootEl.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    applyTheme(nextTheme);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
    } catch (e) {}
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        rootEl.classList.remove('is-theme-switching');
      });
    });
  });
}

// Mobile navigation drawer, scroll choreography & interactive components

const menuToggle = document.getElementById('menu-toggle');
const mobileMenu = document.getElementById('mobile-menu');
const mobileLinks = document.querySelectorAll('.mobile-nav-link, .btn-mobile-cta');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function closeMobileMenu() {
  if (!menuToggle || !mobileMenu) return;
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-label', 'Buka menu navigasi');
  mobileMenu.hidden = true;
}

if (menuToggle && mobileMenu) {
  menuToggle.addEventListener('click', () => {
    const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
    const nextState = !isExpanded;
    menuToggle.setAttribute('aria-expanded', String(nextState));
    menuToggle.setAttribute(
      'aria-label',
      nextState ? 'Tutup menu navigasi' : 'Buka menu navigasi'
    );
    mobileMenu.hidden = !nextState;
  });

  mobileLinks.forEach((link) => {
    link.addEventListener('click', () => {
      closeMobileMenu();
    });
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && menuToggle.getAttribute('aria-expanded') === 'true') {
      closeMobileMenu();
      menuToggle.focus();
    }
  });

  document.addEventListener('click', (event) => {
    if (
      menuToggle.getAttribute('aria-expanded') === 'true' &&
      !event.target.closest('.site-header')
    ) {
      closeMobileMenu();
    }
  });
}

// Custom silk anchor scroll (easeOutQuint, 720ms)
const anchorLinks = document.querySelectorAll('a[href^="#"]');
let activeScrollAnimId = null;

function smoothScrollToTarget(targetEl) {
  if (prefersReducedMotion) {
    targetEl.scrollIntoView();
    return;
  }

  if (activeScrollAnimId) {
    window.cancelAnimationFrame(activeScrollAnimId);
  }

  const startY = window.scrollY;
  const headerOffset = targetEl.id === 'beranda' ? 0 : 78;
  const rawTargetY = targetEl.getBoundingClientRect().top + startY - headerOffset;
  const maxScrollY = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
  const targetY = Math.min(Math.max(0, rawTargetY), maxScrollY);
  const distance = targetY - startY;

  if (Math.abs(distance) < 4) return;

  const duration = 720;
  const startTime = performance.now();
  const easeOutQuint = (t) => 1 - Math.pow(1 - t, 5);

  const step = (now) => {
    const elapsed = now - startTime;
    const progress = Math.min(1, elapsed / duration);
    const eased = easeOutQuint(progress);
    window.scrollTo({ top: startY + distance * eased, behavior: 'instant' });

    if (progress < 1) {
      activeScrollAnimId = window.requestAnimationFrame(step);
    } else {
      activeScrollAnimId = null;
    }
  };

  activeScrollAnimId = window.requestAnimationFrame(step);
}

anchorLinks.forEach((link) => {
  link.addEventListener('click', (event) => {
    const href = link.getAttribute('href');
    if (!href || href.length <= 1) return;
    const targetEl = document.getElementById(href.slice(1));
    if (!targetEl) return;
    event.preventDefault();
    closeMobileMenu();
    smoothScrollToTarget(targetEl);
    if (history.pushState) {
      history.pushState(null, '', href);
    }
  });
});

// Interactive & Scroll-Driven Process Stepper (01 - 03)
const workflowSection = document.getElementById('kenapa-kami');
const workflowSteps = Array.from(document.querySelectorAll('.workflow-step'));
const workflowPanels = Array.from(document.querySelectorAll('.workflow-panel'));
let currentWorkflowStep = '0';
let manualWorkflowLockUntil = 0;

function activateWorkflowStep(targetIdx) {
  if (currentWorkflowStep === targetIdx) return;
  currentWorkflowStep = targetIdx;

  workflowSteps.forEach((step) => {
    const isActive = step.dataset.step === targetIdx;
    step.classList.toggle('is-active', isActive);
    step.setAttribute('aria-selected', String(isActive));
  });

  workflowPanels.forEach((panel) => {
    const isMatch = panel.dataset.step === targetIdx;
    panel.hidden = !isMatch;
    panel.classList.toggle('is-active', isMatch);
  });
}

if (workflowSteps.length > 0 && workflowPanels.length > 0) {
  workflowPanels.forEach((panel) => {
    const isMatch = panel.dataset.step === '0';
    panel.hidden = !isMatch;
    panel.classList.toggle('is-active', isMatch);
  });

  workflowSteps.forEach((step) => {
    step.addEventListener('click', () => {
      if (step.dataset.step !== undefined) {
        manualWorkflowLockUntil = performance.now() + 5000;
        activateWorkflowStep(step.dataset.step);
      }
    });
  });
}

// Configure staggered cascade delays for grid & list items
const staggerGroups = [
  { selector: '.trust-pillars', itemSelector: '.trust-pillar', stepMs: 85, cols: 4 },
  { selector: '.workflow-steps', itemSelector: '.workflow-step', stepMs: 90, cols: 3 },
  { selector: '.services-grid', itemSelector: '.service-card, .service-conversion-card', stepMs: 85, cols: 2 },
  { selector: '.faq-list', itemSelector: '.faq-item', stepMs: 65, cols: 4 },
  { selector: '.contact-grid', itemSelector: '.contact-item', stepMs: 75, cols: 3 },
];

staggerGroups.forEach(({ selector, itemSelector, stepMs, cols }) => {
  const container = document.querySelector(selector);
  if (!container) return;
  container.classList.remove('reveal');
  const items = Array.from(container.querySelectorAll(itemSelector));
  items.forEach((item, index) => {
    item.classList.add('reveal');
    const colIndex = index % cols;
    item.style.setProperty('--reveal-delay', `${colIndex * stepMs}ms`);
  });
});

// Smooth spring-deceleration reveal on scroll
const revealElements = document.querySelectorAll('.reveal');

if (prefersReducedMotion || !('IntersectionObserver' in window)) {
  revealElements.forEach((el) => el.classList.add('is-visible'));
} else {
  const isInOrAboveViewport = (el) => {
    const rect = el.getBoundingClientRect();
    return rect.top < window.innerHeight * 0.94;
  };

  const revealInOrAboveViewport = () => {
    revealElements.forEach((el) => {
      if (!el.classList.contains('is-visible') && isInOrAboveViewport(el)) {
        el.classList.add('is-visible');
        observer.unobserve(el);
      }
    });
  };

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting || entry.boundingClientRect.top < window.innerHeight * 0.94) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.04,
      rootMargin: '0px 0px -4% 0px',
    }
  );

  revealElements.forEach((el) => {
    if (isInOrAboveViewport(el)) {
      el.classList.add('is-visible');
    } else {
      observer.observe(el);
    }
  });

  window.addEventListener('scroll', revealInOrAboveViewport, { passive: true });
  window.addEventListener('hashchange', () => setTimeout(revealInOrAboveViewport, 50));
}

// Unified Scroll Choreography (Navbar, Hero Depth Planes, Workflow Stepper, Practice Areas Tracker)
const siteHeader = document.getElementById('top');
const heroSection = document.getElementById('beranda');
const navLinks = Array.from(document.querySelectorAll('.desktop-nav .nav-link'));
const pageSections = Array.from(document.querySelectorAll('main > section, footer.site-footer'));
const navTrackedSections = navLinks
  .map((link) => {
    const id = link.getAttribute('href')?.slice(1);
    return id ? { link, el: document.getElementById(id) } : null;
  })
  .filter((item) => item && item.el);

const serviceCards = Array.from(document.querySelectorAll('.service-card'));
const servicesCountEl = document.getElementById('services-scroll-count');
const servicesNameEl = document.getElementById('services-scroll-name');
const servicesBarEl = document.getElementById('services-scroll-bar');

const heroMetricsStrip = document.querySelector('.hero-metrics');
const heroMetricCells = Array.from(document.querySelectorAll('.hero-metric'));
let hasAnimatedMetrics = false;
let spotlightIdx = 0;
let spotlightTimerId = null;
let isPointerInsideMetrics = false;

function setMetricSpotlight(targetIdx) {
  heroMetricCells.forEach((cell, idx) => {
    cell.classList.toggle('is-spotlight', idx === targetIdx);
  });
}

let scrollTicking = false;
let targetHeroProgress = 0;
let currentHeroProgress = 0;
let heroLerpRafId = null;
let lastHeroLerpTs = 0;

function stepHeroScrollDepth(now) {
  heroLerpRafId = null;
  if (!heroSection || prefersReducedMotion) return;

  const dt = lastHeroLerpTs ? Math.min(48, now - lastHeroLerpTs) : 16.67;
  lastHeroLerpTs = now;
  const alpha = 1 - Math.pow(1 - 0.16, dt / 16.67);
  currentHeroProgress += (targetHeroProgress - currentHeroProgress) * alpha;

  if (Math.abs(targetHeroProgress - currentHeroProgress) <= 0.0008) {
    currentHeroProgress = targetHeroProgress;
  }

  heroSection.style.setProperty('--hero-progress', currentHeroProgress.toFixed(4));

  if (
    hasAnimatedMetrics &&
    heroMetricCells.length > 0 &&
    !isPointerInsideMetrics &&
    currentHeroProgress > 0.03 &&
    currentHeroProgress < 0.96
  ) {
    const scrollMappedIdx = Math.min(
      heroMetricCells.length - 1,
      Math.floor(currentHeroProgress * heroMetricCells.length * 1.15)
    );
    if (scrollMappedIdx !== spotlightIdx) {
      spotlightIdx = scrollMappedIdx;
      setMetricSpotlight(spotlightIdx);
    }
  }

  if (Math.abs(targetHeroProgress - currentHeroProgress) > 0.0008) {
    heroLerpRafId = window.requestAnimationFrame(stepHeroScrollDepth);
  } else {
    lastHeroLerpTs = 0;
  }
}

function updateScrollChoreography() {
  scrollTicking = false;
  const scrollY = window.scrollY;
  const vh = window.innerHeight;
  const docHeight = Math.max(1, document.documentElement.scrollHeight - vh);
  const pageProgress = Math.min(1, Math.max(0, scrollY / docHeight));

  // 1. Navbar state & progress sheen
  if (siteHeader) {
    siteHeader.classList.toggle('is-scrolled', scrollY > 24);
    siteHeader.style.setProperty('--page-progress', pageProgress.toFixed(3));

    const probeY = 48;
    const currentSurface = pageSections.find((sec) => {
      const rect = sec.getBoundingClientRect();
      return rect.top <= probeY && rect.bottom > probeY;
    });

    const isDarkBackdrop = currentSurface
      ? currentSurface.classList.contains('hero') ||
        currentSurface.classList.contains('site-footer') ||
        currentSurface.classList.contains('motto-banner')
      : false;

    siteHeader.classList.toggle('is-over-dark', isDarkBackdrop);

    if (navTrackedSections.length > 0) {
      const activeOffset = 150;
      let activeItem = navTrackedSections[0];
      for (const item of navTrackedSections) {
        if (item.el.getBoundingClientRect().top <= activeOffset) {
          activeItem = item;
        }
      }
      if (vh + scrollY >= document.documentElement.scrollHeight - 40) {
        activeItem = navTrackedSections[navTrackedSections.length - 1];
      }
      navTrackedSections.forEach(({ link }) => {
        link.classList.toggle('is-active', link === activeItem.link);
      });
    }
  }

  // 2. Hero multi-plane scroll depth (lerp-damped 60-120fps)
  if (heroSection && !prefersReducedMotion) {
    const heroTravel = Math.max(380, heroSection.offsetHeight * 0.72);
    targetHeroProgress = Math.min(1, Math.max(0, scrollY / heroTravel));
    if (!heroLerpRafId) {
      heroLerpRafId = window.requestAnimationFrame(stepHeroScrollDepth);
    }
  }

  // 3. Scroll-driven workflow stepper (01 -> 02 -> 03)
  if (workflowSection && workflowSteps.length === 3 && performance.now() > manualWorkflowLockUntil) {
    const wfRect = workflowSection.getBoundingClientRect();
    // Map progress while #kenapa-kami passes through the middle reading zone
    const startTrigger = vh * 0.55;
    const endTrigger = vh * 0.15;
    const travel = Math.max(1, wfRect.height - (startTrigger - endTrigger));
    const rawProgress = (startTrigger - wfRect.top) / travel;

    if (rawProgress >= -0.1 && rawProgress <= 1.15) {
      const clamped = Math.min(0.999, Math.max(0, rawProgress));
      const targetStepIdx = String(Math.floor(clamped * 3));
      activateWorkflowStep(targetStepIdx);
    }
  }

  // 4. Sticky split-scroll practice areas tracker (01 / 07)
  if (serviceCards.length > 0) {
    const focusY = vh * 0.42;
    let bestIdx = 0;
    let bestDist = Infinity;

    serviceCards.forEach((card, idx) => {
      const rect = card.getBoundingClientRect();
      const center = rect.top + rect.height * 0.5;
      const dist = Math.abs(center - focusY);
      if (dist < bestDist) {
        bestDist = dist;
        bestIdx = idx;
      }
    });

    serviceCards.forEach((card, idx) => {
      card.classList.toggle('is-in-focus', idx === bestIdx);
    });

    const total = serviceCards.length;
    const currentNum = String(bestIdx + 1).padStart(2, '0');
    const totalNum = String(total).padStart(2, '0');
    const activeTitleId = serviceCards[bestIdx].querySelector('.service-title-id')?.textContent || '';

    if (servicesCountEl) {
      servicesCountEl.textContent = `${currentNum} / ${totalNum}`;
    }
    if (servicesNameEl && activeTitleId) {
      servicesNameEl.textContent = activeTitleId;
    }
    if (servicesBarEl) {
      const ratio = (bestIdx + 1) / total;
      servicesBarEl.style.setProperty('--services-progress', ratio.toFixed(3));
    }
  }
}

function scheduleScrollChoreography() {
  if (!scrollTicking) {
    scrollTicking = true;
    window.requestAnimationFrame(updateScrollChoreography);
  }
}

updateScrollChoreography();
window.addEventListener('scroll', scheduleScrollChoreography, { passive: true });
window.addEventListener('resize', scheduleScrollChoreography, { passive: true });

// FAQ Accordion
const faqItems = Array.from(document.querySelectorAll('.faq-item'));

if (faqItems.length > 0) {
  faqItems.forEach((item) => {
    const trigger = item.querySelector('.faq-trigger');
    const panel = item.querySelector('.faq-panel');
    if (!trigger || !panel) return;

    trigger.addEventListener('click', () => {
      const isCurrentlyOpen = trigger.getAttribute('aria-expanded') === 'true';

      faqItems.forEach((otherItem) => {
        const otherTrigger = otherItem.querySelector('.faq-trigger');
        const otherPanel = otherItem.querySelector('.faq-panel');
        if (!otherTrigger || !otherPanel) return;
        otherItem.classList.remove('is-open');
        otherTrigger.setAttribute('aria-expanded', 'false');
        otherPanel.hidden = true;
      });

      if (!isCurrentlyOpen) {
        item.classList.add('is-open');
        trigger.setAttribute('aria-expanded', 'true');
        panel.hidden = false;
      }
    });
  });
}

// Hero Metrics Choreography (Staggered Entrance, easeOutExpo Count-Up, Top Hairline Gauge & Ambient/Scroll Spotlight)
if (heroMetricsStrip && heroMetricCells.length > 0) {
  const startAmbientSpotlight = () => {
    if (prefersReducedMotion || spotlightTimerId) return;
    setMetricSpotlight(spotlightIdx);
    spotlightTimerId = window.setInterval(() => {
      if (isPointerInsideMetrics || (currentHeroProgress > 0.03 && currentHeroProgress < 0.96)) {
        return;
      }
      spotlightIdx = (spotlightIdx + 1) % heroMetricCells.length;
      setMetricSpotlight(spotlightIdx);
    }, 3200);
  };

  heroMetricCells.forEach((cell, idx) => {
    cell.style.setProperty('--metric-delay', `${idx * 110}ms`);

    cell.addEventListener('pointerenter', () => {
      isPointerInsideMetrics = true;
      spotlightIdx = idx;
      setMetricSpotlight(idx);
    });

    cell.addEventListener('pointermove', (event) => {
      const rect = cell.getBoundingClientRect();
      const relX = ((event.clientX - rect.left) / Math.max(1, rect.width)) * 100;
      const relY = ((event.clientY - rect.top) / Math.max(1, rect.height)) * 100;
      cell.style.setProperty('--mouse-x', `${relX.toFixed(1)}%`);
      cell.style.setProperty('--mouse-y', `${relY.toFixed(1)}%`);
    });
  });

  heroMetricsStrip.addEventListener('pointerleave', () => {
    isPointerInsideMetrics = false;
    setMetricSpotlight(spotlightIdx);
  });

  const runHeroMetricsEntrance = () => {
    if (hasAnimatedMetrics) return;
    hasAnimatedMetrics = true;

    if (prefersReducedMotion) {
      heroMetricCells.forEach((cell) => {
        cell.classList.add('is-entered');
        cell.style.setProperty('--metric-fill', '1');
      });
      return;
    }

    const easeOutExpo = (t) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t));

    heroMetricCells.forEach((cell, idx) => {
      const numEl = cell.querySelector('.hero-metric-num');
      const targetVal = numEl ? Number(numEl.dataset.countTarget || numEl.textContent) : 0;
      const delayMs = idx * 110;
      const durationMs = 1350;

      if (numEl && targetVal > 0) {
        numEl.textContent = '0';
      }
      cell.style.setProperty('--metric-fill', '0');

      requestAnimationFrame(() => {
        cell.classList.add('is-entered');
      });

      const startTime = performance.now() + delayMs;

      const tick = (now) => {
        if (now < startTime) {
          requestAnimationFrame(tick);
          return;
        }
        const elapsed = now - startTime;
        const progress = Math.min(1, elapsed / durationMs);
        const eased = easeOutExpo(progress);

        cell.style.setProperty('--metric-fill', eased.toFixed(3));
        if (numEl && targetVal > 0) {
          const currentVal = Math.round(targetVal * eased);
          numEl.textContent = String(currentVal);
        }

        if (progress < 1) {
          requestAnimationFrame(tick);
        } else if (idx === heroMetricCells.length - 1) {
          startAmbientSpotlight();
        }
      };

      requestAnimationFrame(tick);
    });
  };

  if ('IntersectionObserver' in window && !prefersReducedMotion) {
    const metricsObserver = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            runHeroMetricsEntrance();
            obs.disconnect();
          }
        });
      },
      { threshold: 0.2 }
    );
    metricsObserver.observe(heroMetricsStrip);
  } else {
    runHeroMetricsEntrance();
  }
}

