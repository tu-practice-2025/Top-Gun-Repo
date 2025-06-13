document.addEventListener("DOMContentLoaded", () => {
    const monthInput = document.getElementById("month");
    const today = new Date();
    let year = today.getFullYear();
    let month = today.getMonth() + 2;

    if (month > 12) {
        month = 1;
        year += 1;
    }

    const formattedMonth = `${year}-${month.toString().padStart(2, '0')}`;
    monthInput.value = formattedMonth;
});

function createParticles() {
    const particles = document.getElementById('particles');
    const particleCount = 50;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 15 + 's';
        particle.style.animationDuration = (Math.random() * 10 + 10) + 's';
        particles.appendChild(particle);
    }
}

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

createParticles();

document.querySelectorAll('.category-display, .balance-box').forEach(element => {
    element.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-5px) scale(1.02)';
    });
    
    element.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});