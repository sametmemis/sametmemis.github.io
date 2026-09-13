const canvas = document.getElementById('quantum-circuit-canvas');
const ctx = canvas.getContext('2d');

let width = canvas.width = window.innerWidth;
let height = canvas.height = window.innerHeight;

// Track mouse position and interaction
const mouse = {
    x: width / 2,
    y: height / 2,
    radius: 170
};

window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
});

window.addEventListener('mouseleave', () => {
    mouse.x = -1000;
    mouse.y = -1000;
});

const particles = [];
const numParticles = Math.min(Math.floor(window.innerWidth / 16), 85);

class QuantumNode {
    constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.baseX = this.x;
        this.baseY = this.y;
        this.vx = (Math.random() - 0.5) * 0.75;
        this.vy = (Math.random() - 0.5) * 0.75;
        this.radius = Math.random() * 2 + 1.2;
        this.isQubit = Math.random() > 0.6; // Highlighting quantum state nodes
        this.phase = Math.random() * Math.PI * 2;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.phase += 0.03;

        // Bounce from boundaries
        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;

        // Interactive mouse tension / attraction
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < mouse.radius) {
            const forceDirectionX = dx / distance;
            const forceDirectionY = dy / distance;
            const force = (mouse.radius - distance) / mouse.radius;
            // Gentle orbital attraction toward cursor
            this.x += forceDirectionX * force * 2.2;
            this.y += forceDirectionY * force * 2.2;
        }
    }

    draw() {
        ctx.beginPath();
        const pulsingRadius = this.isQubit ? this.radius + Math.sin(this.phase) * 0.8 : this.radius;
        ctx.arc(this.x, this.y, pulsingRadius, 0, Math.PI * 2);
        
        if (this.isQubit) {
            ctx.fillStyle = 'rgba(192, 132, 252, 0.85)'; // Purple/violet qubit accent
            ctx.shadowBlur = 10;
            ctx.shadowColor = '#c084fc';
        } else {
            ctx.fillStyle = 'rgba(56, 189, 248, 0.6)'; // Cyan circuit node
            ctx.shadowBlur = 4;
            ctx.shadowColor = '#38bdf8';
        }
        ctx.fill();
        ctx.shadowBlur = 0; // Reset
    }
}

for (let i = 0; i < numParticles; i++) {
    particles.push(new QuantumNode());
}

function render() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();

        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            // Connect nearby circuit/qubit nodes
            if (dist < 135) {
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                
                const opacity = (1 - dist / 135) * 0.22;
                ctx.strokeStyle = `rgba(56, 189, 248, ${opacity})`;
                ctx.lineWidth = 0.75;
                ctx.stroke();
            }
        }

        // Draw dynamic laser/entanglement beam to the cursor if within range
        const mdx = mouse.x - particles[i].x;
        const mdy = mouse.y - particles[i].y;
        const mDist = Math.sqrt(mdx * mdx + mdy * mdy);

        if (mDist < mouse.radius) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(mouse.x, mouse.y);
            const beamOpacity = (1 - mDist / mouse.radius) * 0.35;
            ctx.strokeStyle = `rgba(129, 140, 248, ${beamOpacity})`;
            ctx.lineWidth = 0.9;
            ctx.stroke();
        }
    }

    requestAnimationFrame(render);
}

render();

window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
});
