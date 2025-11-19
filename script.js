document.addEventListener('DOMContentLoaded', function() {
    const profileCard = document.querySelector('.profile-card');
    const particleCount=30;
    // inject CSS keyframes into the document head once
    if (!document.getElementById('particles-keyframes')) {
        const style = document.createElement('style');
        style.id = 'particles-keyframes';
        style.textContent = `@keyframes fall {
  0% { transform: translateY(-30vh); opacity: 0; }
  10% { opacity: 1; }
  100% { transform: translateY(120vh); opacity: 0.15; }
}`;
        document.head.appendChild(style);
    }

    if (!profileCard) return; // nothing to do if element missing

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        // place relative to the card using percentage
        particle.style.left = Math.random() * 100 + '%';
        // random duration between 2s and 5s
        particle.style.animationDuration = (Math.random() * 3 + 2).toFixed(2) + 's';
        // random negative delay so particles appear staggered immediately
        particle.style.animationDelay = (-Math.random() * 5).toFixed(2) + 's';
        particle.style.transform = 'translateY(-30vh)';
        particle.style.opacity = (0.2 + Math.random() * 0.8).toFixed(2);
        particle.style.pointerEvents = 'none';
        // Apply styles
        particle.style.position = 'absolute';
        particle.style.top = '0';
        particle.style.width = '4px';
        particle.style.height = '4px';
        particle.style.backgroundColor = 'rgba(255, 0, 60, 0.8)';
        particle.style.borderRadius = '50%';
        particle.style.animationName = 'fall';
        particle.style.animationTimingFunction = 'linear';
        particle.style.animationIterationCount = 'infinite';

        profileCard.appendChild(particle);
    }

});
