// Mobile Menu Toggle
const hamburger = document.querySelector('.hamburger');
const mobileMenu = document.querySelector('.nav-mobile-menu');

if(hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
        mobileMenu.classList.toggle('active');
    });

    const mobileLinks = document.querySelectorAll('.nav-mobile-menu a');
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
        });
    });
}

// Active Navigation Highlighting based on current page URL
const currentPage = window.location.pathname.split('/').pop();
const navLinksDesktop = document.querySelectorAll('.nav-links a');
const navLinksMobile = document.querySelectorAll('.nav-mobile-menu a');

function setActive(links) {
    links.forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href');
        if(href === currentPage || (currentPage === '' && href === 'index.html')) {
            link.classList.add('active');
        }
    });
}
setActive(navLinksDesktop);
setActive(navLinksMobile);

// Interactive Envelope Logic (Only runs if on ek-khat.html)
const openBtn = document.getElementById('open-letter-btn');
const envelopeWrapper = document.getElementById('envelope-wrapper');
const khatIntro = document.getElementById('khat-intro');

if(openBtn && envelopeWrapper && khatIntro) {
    openBtn.addEventListener('click', () => {
        envelopeWrapper.classList.add('open');
        openBtn.style.opacity = '0';
        openBtn.style.pointerEvents = 'none';
        openBtn.style.transform = 'translateY(20px)';
        
        khatIntro.style.opacity = '0';
        setTimeout(() => {
            khatIntro.innerHTML = '<p>Sirf tumhare liye... ❤️</p>';
            khatIntro.style.opacity = '1';
        }, 500);

        // Trigger Heart Explosion when opened
        for(let i=0; i<60; i++) {
            hearts.push(new HeartCanvas(true));
        }
    });
}

// Scroll Reveal Animation
function reveal() {
    var reveals = document.querySelectorAll(".reveal");
    for (var i = 0; i < reveals.length; i++) {
        var windowHeight = window.innerHeight;
        var elementTop = reveals[i].getBoundingClientRect().top;
        var elementVisible = 50;
        if (elementTop < windowHeight - elementVisible) {
            reveals[i].classList.add("active");
        }
    }
}
window.addEventListener("scroll", reveal);
setTimeout(reveal, 100); 

// Canvas Background Particles (Stars & Hearts)
const canvas = document.getElementById('canvas-container');
const ctx = canvas.getContext('2d', { alpha: false });
let width, height;

function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

const particles = [];
const particleCount = window.innerWidth < 768 ? 50 : 100;
const hearts = [];
const initialHeartCount = window.innerWidth < 768 ? 15 : 25;

class Particle {
    constructor() {
        this.x = Math.random() * width; this.y = Math.random() * height;
        this.size = Math.random() * 1.5 + 0.5;
        this.speedX = Math.random() * 0.3 - 0.15; this.speedY = Math.random() * 0.3 - 0.15;
        this.glow = Math.random() > 0.8;
        this.color = this.glow ? 'rgba(147, 197, 253, 0.8)' : 'rgba(255, 255, 255, 0.4)';
    }
    update() {
        this.x += this.speedX; this.y += this.speedY;
        if (this.x < 0) this.x = width; if (this.x > width) this.x = 0;
        if (this.y < 0) this.y = height; if (this.y > height) this.y = 0;
    }
    draw() {
        ctx.fillStyle = this.color; ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2); ctx.fill();
        if(this.glow) { ctx.shadowBlur = 10; ctx.shadowColor = '#93c5fd'; } else { ctx.shadowBlur = 0; }
    }
}

class HeartCanvas {
    constructor(isBurst = false) {
        this.x = isBurst ? (width / 2) + (Math.random() * 200 - 100) : Math.random() * width;
        this.y = isBurst ? height - 100 : Math.random() * height;
        this.size = Math.random() * 5 + 3;
        
        this.speedY = isBurst ? -(Math.random() * 10 + 5) : -(Math.random() * 0.5 + 0.2);
        this.speedX = isBurst ? (Math.random() * 12 - 6) : (Math.random() * 0.3 - 0.15);
        
        this.opacity = isBurst ? (Math.random() * 0.7 + 0.3) : (Math.random() * 0.2 + 0.05);
        this.pulse = Math.random() * Math.PI * 2;
        this.isBurst = isBurst; this.life = 1.0;
    }
    update() {
        this.y += this.speedY;
        this.x += this.speedX + (this.isBurst ? 0 : Math.sin(this.pulse) * 0.3);
        this.pulse += 0.02;
        
        if(this.isBurst) {
            this.speedY += 0.15; // Gravity
            this.life -= 0.008; // Fade out
        }
        
        if (this.y < -50 && !this.isBurst) {
            this.y = height + 50; this.x = Math.random() * width;
        }
    }
    draw() {
        if(this.life <= 0) return;
        ctx.save();
        ctx.translate(this.x, this.y);
        const currentSize = this.size + Math.sin(this.pulse) * 1.5;
        ctx.scale(currentSize / 10, currentSize / 10);
        
        ctx.beginPath();
        ctx.moveTo(0, 3);
        ctx.bezierCurveTo(0, 0, -4, 0, -5, 3);
        ctx.bezierCurveTo(-6, 6, 0, 10, 0, 12);
        ctx.bezierCurveTo(0, 10, 6, 6, 5, 3);
        ctx.bezierCurveTo(4, 0, 0, 0, 0, 3);
        
        ctx.fillStyle = `rgba(225, 29, 72, ${this.isBurst ? this.life : this.opacity})`;
        ctx.shadowBlur = this.isBurst ? 25 : 15;
        ctx.shadowColor = `rgba(255, 0, 50, ${this.isBurst ? this.life : this.opacity * 2})`;
        ctx.fill();
        ctx.restore();
    }
}

for (let i = 0; i < particleCount; i++) particles.push(new Particle());
for (let i = 0; i < initialHeartCount; i++) hearts.push(new HeartCanvas());

function animate() {
    const gradient = ctx.createRadialGradient(width/2, height/2, 0, width/2, height/2, width);
    gradient.addColorStop(0, '#0f172a'); gradient.addColorStop(1, '#020617');
    ctx.fillStyle = gradient; ctx.fillRect(0, 0, width, height);
    
    particles.forEach(p => { p.update(); p.draw(); });
    
    for(let i = hearts.length - 1; i >= 0; i--) {
        hearts[i].update(); hearts[i].draw();
        if(hearts[i].isBurst && hearts[i].life <= 0) hearts.splice(i, 1);
    }
    requestAnimationFrame(animate);
}
animate();

