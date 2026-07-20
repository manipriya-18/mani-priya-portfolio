/* ==========================================================================
   DEVELOPER PORTFOLIO - CORE LOGIC & MICRO-INTERACTIONS
   Developer: Mani Priya Koppula
   ========================================================================= */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initTypingEffect();
  initScrollAnimations();
  initMobileMenu();
  initScrollToTop();
  initActiveNavLinkScroll();
});

/* --- Theme Toggle (Dark/Light Mode) --- */
function initTheme() {
  const themeToggle = document.getElementById('themeToggle');
  const themeIcon = themeToggle.querySelector('i');
  
  // Set default theme state based on previous storage or system preference
  const currentTheme = localStorage.getItem('portfolio-theme') || 'dark';
  document.documentElement.setAttribute('data-theme', currentTheme);
  
  if (currentTheme === 'light') {
    themeIcon.classList.replace('fa-moon', 'fa-sun');
  } else {
    themeIcon.classList.replace('fa-sun', 'fa-moon');
  }
  
  themeToggle.addEventListener('click', () => {
    let theme = document.documentElement.getAttribute('data-theme');
    let nextTheme = theme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', nextTheme);
    localStorage.setItem('portfolio-theme', nextTheme);
    
    // Smooth rotation and icon update
    themeToggle.style.transform = 'scale(0.8) rotate(360deg)';
    
    setTimeout(() => {
      if (nextTheme === 'light') {
        themeIcon.classList.replace('fa-moon', 'fa-sun');
      } else {
        themeIcon.classList.replace('fa-sun', 'fa-moon');
      }
      themeToggle.style.transform = 'scale(1) rotate(0deg)';
    }, 200);
  });
}

/* --- Hero Auto-Typing Effect --- */
function initTypingEffect() {
  const typedTextSpan = document.querySelector('.hero-typing .typed-text');
  const textArray = ["Full-Stack Developer", "Backend Engineer", "IT Student", "Problem Solver"];
  const typingSpeed = 100;
  const erasingSpeed = 60;
  const newTextDelay = 2000; // Delay between typing phrases
  let textArrayIndex = 0;
  let charIndex = 0;
  
  function type() {
    if (charIndex < textArray[textArrayIndex].length) {
      typedTextSpan.textContent += textArray[textArrayIndex].charAt(charIndex);
      charIndex++;
      setTimeout(type, typingSpeed);
    } else {
      setTimeout(erase, newTextDelay);
    }
  }
  
  function erase() {
    if (charIndex > 0) {
      typedTextSpan.textContent = textArray[textArrayIndex].substring(0, charIndex - 1);
      charIndex--;
      setTimeout(erase, erasingSpeed);
    } else {
      textArrayIndex = (textArrayIndex + 1) % textArray.length;
      setTimeout(type, 500);
    }
  }
  
  if (textArray.length) setTimeout(type, 1000);
}

/* --- Responsive Scroll Reveal & Skill Progress Fill --- */
function initScrollAnimations() {
  const revealElements = document.querySelectorAll('.reveal');
  const skillBars = document.querySelectorAll('.skill-bar-fill');
  
  // Intersection Observer for scroll triggers
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        
        // If the skill section was revealed, trigger the bar animations
        if (entry.target.id === 'skills' || entry.target.querySelector('#skillsContent')) {
          animateSkillBars();
        }
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });
  
  revealElements.forEach(el => revealObserver.observe(el));
  
  function animateSkillBars() {
    skillBars.forEach(bar => {
      const percentage = bar.getAttribute('data-percent');
      bar.style.width = percentage;
    });
  }
  
  // Shrink/expand navbar on scroll
  const header = document.querySelector('header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
}

/* --- Skill Category Filter --- */
function filterSkills(category) {
  const cards = document.querySelectorAll('.skill-card');
  const buttons = document.querySelectorAll('.skills-tabs .tab-btn');
  
  // Update active tab buttons
  buttons.forEach(btn => {
    const isClicked = btn.getAttribute('onclick').includes(category);
    if (isClicked) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
  
  // Filter card content
  cards.forEach(card => {
    const cardCat = card.getAttribute('data-category');
    
    // Visual transitions
    card.style.opacity = '0';
    card.style.transform = 'scale(0.85) translateY(15px)';
    
    setTimeout(() => {
      if (category === 'all' || cardCat === category) {
        card.style.display = 'flex';
        // Force Reflow
        card.offsetHeight;
        card.style.opacity = '1';
        card.style.transform = 'scale(1) translateY(0)';
        
        // Ensure progress bar triggers width
        const barFill = card.querySelector('.skill-bar-fill');
        barFill.style.width = barFill.getAttribute('data-percent');
      } else {
        card.style.display = 'none';
      }
    }, 300);
  });
}

/* --- Mobile Menu Drawer --- */
function initMobileMenu() {
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');
  const navItems = navLinks.querySelectorAll('a');
  
  menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    navLinks.classList.toggle('active');
  });
  
  // Close menu drawer when Clicking menu items
  navItems.forEach(item => {
    item.addEventListener('click', () => {
      menuToggle.classList.remove('active');
      navLinks.classList.remove('active');
    });
  });
}

/* --- Floating Scroll to Top button --- */
function initScrollToTop() {
  const scrollTopBtn = document.getElementById('scrollTop');
  
  window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
      scrollTopBtn.style.display = 'flex';
    } else {
      scrollTopBtn.style.display = 'none';
    }
  });
  
  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/* --- Sticky Active Navigation Link Track --- */
function initActiveNavLinkScroll() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');
  
  window.addEventListener('scroll', () => {
    let currentId = '';
    const scrollPosition = window.scrollY + 120; // Offset checking height
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        currentId = section.getAttribute('id');
      }
    });
    
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentId}`) {
        link.classList.add('active');
      }
    });
  });
}

/* --- Toast Feedback Form Submission Handler --- */
function handleFormSubmit(event) {
  event.preventDefault();
  
  const form = document.getElementById('contactForm');
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const message = document.getElementById('message').value;
  
  // Visual validation checking before triggering toast
  if (name.trim() && email.trim() && message.trim()) {
    // Show toast message
    const toast = document.getElementById('toastMsg');
    toast.querySelector('span').textContent = `Thank you, ${name}! Your email is copied/simulated.`;
    toast.classList.add('show');
    
    // Clear Form inputs
    form.reset();
    
    // Hide toast indicator after delay
    setTimeout(() => {
      toast.classList.remove('show');
    }, 4000);
  }
}
