const canvas = document.getElementById('quantum-circuit-canvas');
const ctx = canvas.getContext('2d');

let width = canvas.width = window.innerWidth;
let height = canvas.height = window.innerHeight;

// Mouse tracking with immediate responsive field
const mouse = {
    x: -2000,
    y: -2000,
    radius: 190
};

window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
}, { passive: true });

window.addEventListener('mouseleave', () => {
    mouse.x = -2000;
    mouse.y = -2000;
});

// Multi-disciplinary nodes: Quantum Qubits, Integrated PCB Pins, and Neural Synapses
const nodes = [];
const numNodes = Math.min(Math.floor(window.innerWidth / 20), 65);

class CircuitQuantumNode {
    constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.65;
        this.vy = (Math.random() - 0.5) * 0.65;
        this.type = Math.random() > 0.65 ? 'qubit' : (Math.random() > 0.35 ? 'pcb' : 'neural');
        this.radius = this.type === 'qubit' ? 3.2 : (this.type === 'pcb' ? 2.5 : 2.0);
        this.phase = Math.random() * Math.PI * 2;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.phase += 0.04;

        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;

        // Interactive tension towards cursor
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.hypot(dx, dy);

        if (dist < mouse.radius && dist > 0) {
            const force = (mouse.radius - dist) / mouse.radius;
            this.x += (dx / dist) * force * 2.0;
            this.y += (dy / dist) * force * 2.0;
        }
    }

    draw() {
        ctx.beginPath();
        if (this.type === 'qubit') {
            // Pulsing Quantum Qubit
            const pulse = this.radius + Math.sin(this.phase) * 1.2;
            ctx.arc(this.x, this.y, pulse, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(124, 58, 237, 0.7)'; // Violet
        } else if (this.type === 'pcb') {
            // Gold Microchip Pin
            ctx.rect(this.x - 2.5, this.y - 2.5, 5, 5);
            ctx.fillStyle = 'rgba(217, 119, 6, 0.75)'; // Amber gold
        } else {
            // Neural Synapse
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(2, 132, 199, 0.65)'; // Deep Cyan
        }
        ctx.fill();
    }
}

for (let i = 0; i < numNodes; i++) {
    nodes.push(new CircuitQuantumNode());
}

function render() {
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

            if (dist < 135) {
                ctx.beginPath();
                // If either node is a PCB circuit pin, draw orthogonal Manhattan circuit traces
                if (n1.type === 'pcb' || n2.type === 'pcb') {
                    ctx.moveTo(n1.x, n1.y);
                    ctx.lineTo(n2.x, n1.y);
                    ctx.lineTo(n2.x, n2.y);
                    ctx.strokeStyle = `rgba(2, 132, 199, ${(1 - dist / 135) * 0.22})`;
                    ctx.lineWidth = 1.0;
                } else {
                    // Neural synapse / quantum entanglement link
                    ctx.moveTo(n1.x, n1.y);
                    ctx.lineTo(n2.x, n2.y);
                    const strokeColor = (n1.type === 'qubit' || n2.type === 'qubit') 
                        ? `rgba(124, 58, 237, ${(1 - dist / 135) * 0.24})` 
                        : `rgba(13, 148, 136, ${(1 - dist / 135) * 0.18})`;
                    ctx.strokeStyle = strokeColor;
                    ctx.lineWidth = 0.85;
                }
                ctx.stroke();
            }
        }

        // Direct beam fired towards mouse cursor
        const mDist = Math.hypot(mouse.x - n1.x, mouse.y - n1.y);
        if (mDist < mouse.radius) {
            ctx.beginPath();
            ctx.moveTo(n1.x, n1.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.strokeStyle = `rgba(2, 132, 199, ${(1 - mDist / mouse.radius) * 0.38})`;
            ctx.lineWidth = 1.1;
            ctx.stroke();
        }
    }

    requestAnimationFrame(render);
}

render();

window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
}, { passive: true });
