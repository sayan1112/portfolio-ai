// Navbar scroll effect
const nav = document.getElementById("main-nav");

window.addEventListener("scroll", () => {
  if (window.scrollY > 50) {
    nav.classList.add("scrolled");
  } else {
    nav.classList.remove("scrolled");
  }
});

// Smooth reveal animation on scroll (Intersection Observer)
const observerOptions = {
  threshold: 0.1,
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("reveal-active");
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

// Add reveal class to sections
document.querySelectorAll("section").forEach((section) => {
  section.classList.add("reveal");
  observer.observe(section);
});

// Smooth scroll for nav links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
      });
    }
  });
});

// Cursor Glow Effect
const hero = document.querySelector('.hero');
hero.addEventListener('mousemove', (e) => {
    const { clientX, clientY } = e;
    const x = (clientX / window.innerWidth) * 100;
    const y = (clientY / window.innerHeight) * 100;
    
    hero.style.setProperty('--mouse-x', `${x}%`);
    hero.style.setProperty('--mouse-y', `${y}%`);
});

// Contact Form Handling
const contactForm = document.getElementById('contact-form');
const formStatus = document.getElementById('form-status');

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Show loading state
        const submitBtn = contactForm.querySelector('button');
        const originalBtnText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;

        const formData = {
            name: contactForm.name.value,
            email: contactForm.email.value,
            message: contactForm.message.value
        };

        try {
            // In a real app, this URL would be your production backend
            // For now, it points to our local node server
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const result = await response.json();

            if (result.success) {
                formStatus.textContent = result.message;
                formStatus.className = 'form-status success';
                contactForm.reset();
            } else {
                throw new Error(result.message || 'Something went wrong');
            }
        } catch (error) {
            console.error('Submission error:', error);
            formStatus.textContent = 'Failed to connect to backend. Make sure the server is running!';
            formStatus.className = 'form-status error';
        } finally {
            submitBtn.innerHTML = originalBtnText;
            submitBtn.disabled = false;
            
            // Auto-hide status after 5 seconds
            setTimeout(() => {
                formStatus.style.display = 'none';
                formStatus.className = 'form-status';
            }, 5000);
        }
    });
}

// Dynamic News Fetching
const newsContainer = document.getElementById('news-container');

async function fetchNews() {
    try {
        const response = await fetch('/api/news');
        const newsData = await response.json();
        
        if (newsContainer) {
            newsContainer.innerHTML = newsData.map(item => `
                <div class="project-card reveal">
                    <div class="project-info">
                        <span class="tag" style="background: var(--primary); color: white; border: none; font-size: 0.65rem;">${item.category}</span>
                        <p style="margin-top: 0.5rem; font-size: 0.8rem; color: var(--primary); font-weight: 600;">${item.date}</p>
                        <h3 style="margin-top: 0.2rem;">${item.title}</h3>
                        <p style="font-size: 0.9rem; margin-top: 0.5rem;">${item.excerpt}</p>
                    </div>
                </div>
            `).join('');
            
            // Re-run animation observer for new elements
            document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
        }
    } catch (error) {
        console.error('Error fetching news:', error);
        if (newsContainer) {
            newsContainer.innerHTML = '<p style="text-align: center; width: 100%;">Failed to load news. Check if server is running.</p>';
        }
    }
}

// Run news fetch on load
fetchNews();

// Newsletter Subscription
const newsletterForm = document.getElementById('newsletter-form');
const newsStatus = document.getElementById('news-status');

if (newsletterForm) {
    newsletterForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('news-email').value;
        const submitBtn = newsletterForm.querySelector('button');

        submitBtn.disabled = true;
        submitBtn.textContent = '...';

        try {
            const response = await fetch('/api/subscribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });
            const result = await response.json();

            newsStatus.textContent = result.message;
            newsStatus.className = `form-status ${result.success ? 'success' : 'error'}`;
            if (result.success) newsletterForm.reset();
        } catch (err) {
            newsStatus.textContent = 'Connection error.';
            newsStatus.className = 'form-status error';
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Subscribe';
            setTimeout(() => { newsStatus.style.display = 'none'; }, 5000);
        }
    });
}
