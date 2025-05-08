// Animation functionality
document.addEventListener('DOMContentLoaded', function() {
    // Fade in animations for sections
    const fadeElems = document.querySelectorAll('.fade-in-section');
    
    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
            }
        });
    }, {
        threshold: 0.1
    });
    
    fadeElems.forEach(elem => {
        fadeObserver.observe(elem);
    });
    
    // Particle effect for backgrounds
    const particleContainers = document.querySelectorAll('.particles-container');
    
    particleContainers.forEach(container => {
        const numberOfParticles = 50;
        
        for (let i = 0; i < numberOfParticles; i++) {
            const particle = document.createElement('div');
            particle.classList.add('particle');
            
            // Random positioning
            particle.style.left = `${Math.random() * 100}%`;
            particle.style.top = `${Math.random() * 100}%`;
            
            // Random size
            const size = Math.random() * 5 + 2;
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            
            // Random animation duration
            particle.style.animationDuration = `${Math.random() * 10 + 10}s`;
            
            // Random delay
            particle.style.animationDelay = `${Math.random() * 5}s`;
            
            container.appendChild(particle);
        }
    });
    
    // Skill icons hover effect
    const skillItems = document.querySelectorAll('.skill-icon');
    skillItems.forEach(item => {
        item.classList.add('skill-icon');
    });
    
    // Portfolio card hover effects
    const portfolioItems = document.querySelectorAll('#portfolio .col > div');
    portfolioItems.forEach(item => {
        item.classList.add('portfolio-card');
    });
    
    // Highlight card effects
    const highlightItems = document.querySelectorAll('#highlights .portfolio-item');
    highlightItems.forEach(item => {
        item.classList.add('highlight-card');
    });
    
    // Add floating animation to certain elements
    document.querySelectorAll('h1, h2, .service-icon').forEach(elem => {
        elem.classList.add('float-element');
    });
    
    // Applying tilt effect to images
    const tiltImages = document.querySelectorAll('#about-image img, #portfolio img');
    tiltImages.forEach(img => {
        img.classList.add('tilt-effect');
    });
    
    // Animated buttons
    document.querySelectorAll('.btn-primary, .btn-dark').forEach(btn => {
        btn.classList.add('btn-animated');
    });
    
    // Animated glowing text
    document.querySelectorAll('h1, h2, .text-secondary').forEach(text => {
        text.classList.add('text-glow');
    });
});

// Background canvas animation
function initBackgroundCanvas() {
    const canvas = document.getElementById('background-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const particles = [];
    const particleCount = 100;
    
    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: Math.random() * 2 + 1,
            color: `rgba(30, 136, 229, ${Math.random() * 0.5 + 0.1})`,
            speedX: Math.random() * 3 - 1.5,
            speedY: Math.random() * 3 - 1.5
        });
    }
    
    function animate() {
        requestAnimationFrame(animate);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        for (let i = 0; i < particleCount; i++) {
            const p = particles[i];
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.fill();
            
            // Update position
            p.x += p.speedX;
            p.y += p.speedY;
            
            // Bounce off edges
            if (p.x < 0 || p.x > canvas.width) p.speedX *= -1;
            if (p.y < 0 || p.y > canvas.height) p.speedY *= -1;
            
            // Draw connections
            for (let j = i + 1; j < particleCount; j++) {
                const p2 = particles[j];
                const distance = Math.sqrt(Math.pow(p.x - p2.x, 2) + Math.pow(p.y - p2.y, 2));
                
                if (distance < 100) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(30, 136, 229, ${0.2 - distance/500})`;
                    ctx.lineWidth = 0.5;
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.stroke();
                }
            }
        }
    }
    
    animate();
    
    // Resize handler
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

// Initialize when DOM is loaded
window.addEventListener('load', function() {
    initBackgroundCanvas();
});