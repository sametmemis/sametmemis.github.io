const canvas = document.getElementById('quantum-circuit-canvas');
const ctx = canvas.getContext('2d');

let width = canvas.width = window.innerWidth;
let height = canvas.height = window.innerHeight;

// Smooth mouse tracking with zero-lag
const mouse = {
    x: -2000,
    y: -2000,
    radius: 150
};

window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
}, { passive: true });

window.addEventListener('mouseleave', () => {
    mouse.x = -2000;
    mouse.y = -2000;
});

// Lightweight particle pool for high frame rates
const particles = [];
const numParticles = Math.min(Math.floor(window.innerWidth / 22), 55);

class QuantumNode {
    constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.6;
        this.vy = (Math.random() - 0.5) * 0.6;
        this.radius = Math.random() * 1.8 + 1.2;
        this.isQubit = Math.random() > 0.65;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;

        // Instant mouse interaction
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.hypot(dx, dy);

        if (dist < mouse.radius && dist > 0) {
            const force = (mouse.radius - dist) / mouse.radius;
            this.x += (dx / dist) * force * 1.8;
            this.y += (dy / dist) * force * 1.8;
        }
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.isQubit ? 'rgba(99, 102, 241, 0.6)' : 'rgba(2, 132, 199, 0.45)';
        ctx.fill();
    }
}

for (let i = 0; i < numParticles; i++) {
    particles.push(new QuantumNode());
}

function animate() {
    ctx.clearRect(0, 0, width, height);

    const len = particles.length;
    for (let i = 0; i < len; i++) {
        const p1 = particles[i];
        p1.update();
        p1.draw();

        for (let j = i + 1; j < len; j++) {
            const p2 = particles[j];
            const dx = p1.x - p2.x;
            const dy = p1.y - p2.y;
            const dist = Math.hypot(dx, dy);

            if (dist < 120) {
                ctx.beginPath();
                ctx.moveTo(p1.x, p1.y);
                ctx.lineTo(p2.x, p2.y);
                ctx.strokeStyle = `rgba(2, 132, 199, ${(1 - dist / 120) * 0.18})`;
                ctx.lineWidth = 0.75;
                ctx.stroke();
            }
        }

        // Draw interactive connection line directly to mouse cursor
        const mDist = Math.hypot(mouse.x - p1.x, mouse.y - p1.y);
        if (mDist < mouse.radius) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.strokeStyle = `rgba(79, 70, 229, ${(1 - mDist / mouse.radius) * 0.28})`;
            ctx.lineWidth = 0.85;
            ctx.stroke();
        }
    }

    requestAnimationFrame(animate);
}

animate();

window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
}, { passive: true });
