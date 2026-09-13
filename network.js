const canvas = document.getElementById('quantum-circuit-canvas');
const ctx = canvas.getContext('2d');

let width = canvas.width = window.innerWidth;
let height = canvas.height = window.innerHeight;

const mouse = {
    x: -2000,
    y: -2000,
    radius: 180
};

window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
}, { passive: true });

window.addEventListener('mouseleave', () => {
    mouse.x = -2000;
    mouse.y = -2000;
});

// Hybrid nodes: Neural Synapses, Integrated Circuits, and Quantum Qubits
const nodes = [];
const numNodes = Math.min(Math.floor(window.innerWidth / 24), 52);

class MultidisciplinaryNode {
    constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.radius = Math.random() * 2 + 1.2;
        this.type = Math.random() > 0.65 ? 'qubit' : (Math.random() > 0.4 ? 'synapse' : 'circuit');
        this.phase = Math.random() * Math.PI * 2;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.phase += 0.03;

        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;

        // Interactive mouse tension
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.hypot(dx, dy);

        if (dist < mouse.radius && dist > 0) {
            const force = (mouse.radius - dist) / mouse.radius;
            this.x += (dx / dist) * force * 1.6;
            this.y += (dy / dist) * force * 1.6;
        }
    }

    draw() {
        ctx.beginPath();
        if (this.type === 'qubit') {
            // Pulsing Quantum Qubit
            const pulse = this.radius + Math.sin(this.phase) * 0.9;
            ctx.arc(this.x, this.y, pulse, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(124, 58, 237, 0.6)'; // Violet
        } else if (this.type === 'circuit') {
            // Square micro-chip bus terminal
            ctx.rect(this.x - this.radius, this.y - this.radius, this.radius * 2, this.radius * 2);
            ctx.fillStyle = 'rgba(2, 132, 199, 0.5)'; // Deep Cyan
        } else {
            // Neural Synapse Node
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(13, 148, 136, 0.5)'; // Teal Synapse
        }
        ctx.fill();
    }
}

for (let i = 0; i < numNodes; i++) {
    nodes.push(new MultidisciplinaryNode());
}

function renderEngine() {
    ctx.clearRect(0, 0, width, height);

    const len = nodes.length;
    for (let i = 0; i < len; i++) {
        const n1 = nodes[i];
        n1.update();
        n1.draw();

        for (let j = i + 1; j < len; j++) {
            const n2 = nodes[j];
            const dx = n1.x - n2.x;
            const dy = n1.y - n2.y;
            const dist = Math.hypot(dx, dy);

            if (dist < 130) {
                ctx.beginPath();
                // If both are circuits, draw Manhattan-style PCB bus traces (Orthogonal right-angle track)
                if (n1.type === 'circuit' && n2.type === 'circuit') {
                    ctx.moveTo(n1.x, n1.y);
                    ctx.lineTo(n2.x, n1.y);
                    ctx.lineTo(n2.x, n2.y);
                    ctx.strokeStyle = `rgba(2, 132, 199, ${(1 - dist / 130) * 0.18})`;
                    ctx.lineWidth = 0.8;
                } else {
                    // Neural synapse / Quantum entanglement connection
                    ctx.moveTo(n1.x, n1.y);
                    ctx.lineTo(n2.x, n2.y);
                    const strokeColor = (n1.type === 'qubit' || n2.type === 'qubit') 
                        ? `rgba(124, 58, 237, ${(1 - dist / 130) * 0.2})` 
                        : `rgba(13, 148, 136, ${(1 - dist / 130) * 0.15})`;
                    ctx.strokeStyle = strokeColor;
                    ctx.lineWidth = 0.7;
                }
                ctx.stroke();
            }
        }

        // Direct laser connection to mouse pointer (Neural firing)
        const mDist = Math.hypot(mouse.x - n1.x, mouse.y - n1.y);
        if (mDist < mouse.radius) {
            ctx.beginPath();
            ctx.moveTo(n1.x, n1.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.strokeStyle = `rgba(2, 132, 199, ${(1 - mDist / mouse.radius) * 0.28})`;
            ctx.lineWidth = 0.9;
            ctx.stroke();
        }
    }

    requestAnimationFrame(renderEngine);
}

renderEngine();

window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
}, { passive: true });
