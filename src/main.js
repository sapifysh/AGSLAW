// Mobile navigation drawer & scroll reveal interaction

const menuToggle = document.getElementById('menu-toggle');
const mobileMenu = document.getElementById('mobile-menu');
const mobileLinks = document.querySelectorAll('.mobile-nav-link, .btn-mobile-cta');

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

// Adaptive liquid glass navbar & active section pill highlight
const siteHeader = document.getElementById('top');
const navLinks = Array.from(document.querySelectorAll('.desktop-nav .nav-link'));
const pageSections = Array.from(document.querySelectorAll('main > section, footer.site-footer'));
const navTrackedSections = navLinks
  .map((link) => {
    const id = link.getAttribute('href')?.slice(1);
    return id ? { link, el: document.getElementById(id) } : null;
  })
  .filter((item) => item && item.el);

if (siteHeader && pageSections.length > 0) {
  let navTicking = false;

  const updateNavbarState = () => {
    navTicking = false;
    const probeY = 48;

    const currentSurface = pageSections.find((sec) => {
      const rect = sec.getBoundingClientRect();
      return rect.top <= probeY && rect.bottom > probeY;
    });

    const isDarkBackdrop = currentSurface
      ? currentSurface.classList.contains('section-navy') ||
        currentSurface.classList.contains('site-footer')
      : window.scrollY < 100;

    siteHeader.classList.toggle('is-over-dark', isDarkBackdrop);

    if (navTrackedSections.length > 0) {
      const activeOffset = 140;
      let activeItem = navTrackedSections[0];
      for (const item of navTrackedSections) {
        if (item.el.getBoundingClientRect().top <= activeOffset) {
          activeItem = item;
        }
      }
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 40) {
        activeItem = navTrackedSections[navTrackedSections.length - 1];
      }
      navTrackedSections.forEach(({ link }) => {
        link.classList.toggle('is-active', link === activeItem.link);
      });
    }
  };

  const scheduleNavbarUpdate = () => {
    if (!navTicking) {
      navTicking = true;
      window.requestAnimationFrame(updateNavbarState);
    }
  };

  updateNavbarState();
  window.addEventListener('scroll', scheduleNavbarUpdate, { passive: true });
  window.addEventListener('resize', scheduleNavbarUpdate, { passive: true });
}

// Smooth fade-in/slide-up reveal on scroll (300-500ms)
const revealElements = document.querySelectorAll('.reveal');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (prefersReducedMotion || !('IntersectionObserver' in window)) {
  revealElements.forEach((el) => el.classList.add('is-visible'));
} else {
  const isInOrAboveViewport = (el) => {
    const rect = el.getBoundingClientRect();
    return rect.top < window.innerHeight * 0.98;
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
        if (entry.isIntersecting || entry.boundingClientRect.top < window.innerHeight) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.05,
      rootMargin: '0px 0px -16px 0px',
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

// Interactive Process Stepper (01 - 03)
const workflowSteps = Array.from(document.querySelectorAll('.workflow-step'));
const workflowPanels = Array.from(document.querySelectorAll('.workflow-panel'));

if (workflowSteps.length > 0 && workflowPanels.length > 0) {
  const activateStep = (targetIdx) => {
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
  };

  workflowSteps.forEach((step) => {
    step.addEventListener('click', () => {
      if (step.dataset.step !== undefined) {
        activateStep(step.dataset.step);
      }
    });
  });
}

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
