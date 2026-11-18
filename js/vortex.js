import { PROJETOS } from './dados.js';

export function iniciarVortex({ reduceMotion, som, toast, irPara }) {
    const root = document.documentElement;
    const cv = document.getElementById('canvas-vortex');
    const cx = cv.getContext('2d');

    let W = 0, H = 0;
    let mouse = { x: -1000, y: -1000 };
    let confetes = [], faiscas = [];
    let vortexPausado = false;
    let vortexPulse = 0;
    let scrollVel = 0, ultimoScroll = window.scrollY;
    let tempoGlobal = 0;

    let crackPoints = [];
    let crackOpenSmooth = 0;
    let crackTeleportExpand = 0;
    let crackProjectIdx = 0;
    let crackCycleTimer = 0;
    let teletransportando = false;

    let vortexStars = [];
    const gallifreyRings = [
        { r: 0.22, speed: 0.0025, dashes: [25, 12, 6, 12], nodes: 5, nodeR: 6 },
        { r: 0.32, speed: -0.0018, dashes: [40, 18], nodes: 7, nodeR: 4 },
        { r: 0.44, speed: 0.0012, dashes: [12, 10, 3, 10], nodes: 9, nodeR: 8 },
        { r: 0.56, speed: -0.0008, dashes: [60, 25, 8, 25], nodes: 4, nodeR: 5 }
    ];

    function gerarFenda() {
        crackPoints = [];
        const isMobile = W < 768;
        const segments = 16;
        const startX = isMobile ? W * 0.91 : W * 0.78;
        const startY = isMobile ? H * 0.16 : H * 0.20;
        const endX = isMobile ? W * 0.95 : W * 0.86;
        const endY = isMobile ? H * 0.74 : H * 0.72;
        const amp1 = isMobile ? 13 : 26;
        const amp2 = isMobile ? 7 : 14;

        for (let i = 0; i <= segments; i++) {
            const t = i / segments;
            const baseX = startX + (endX - startX) * t;
            const baseY = startY + (endY - startY) * t;
            const zigueZague = (i === 0 || i === segments) ? 0 : (Math.sin(i * 2.9) * amp1 + Math.cos(i * 4.7) * amp2);
            crackPoints.push({ x: baseX + zigueZague, y: baseY });
        }
    }

    function distanciaAteFenda(px, py) {
        if (px < 0 || py < 0 || crackPoints.length === 0) return 9999;
        let minD = 9999;
        for (let i = 0; i < crackPoints.length; i++) {
            const d = Math.hypot(px - crackPoints[i].x, py - crackPoints[i].y);
            if (d < minD) minD = d;
        }
        return minD;
    }

    function redimensionar() {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        W = window.innerWidth; H = window.innerHeight;
        cv.width = W * dpr; cv.height = H * dpr;
        cx.setTransform(dpr, 0, 0, dpr, 0, 0);

        const nStars = Math.max(70, Math.min(160, Math.round(W * H / 10000)));
        while (vortexStars.length < nStars) {
            vortexStars.push({
                angle: Math.random() * Math.PI * 2,
                z: Math.random() * 1000 + 10,
                size: Math.random() * 2.2 + 0.8,
                hueOffset: Math.random()
            });
        }
        vortexStars.length = nStars;
        gerarFenda();
    }

    window.addEventListener('resize', redimensionar);
    redimensionar();

    window.addEventListener('scroll', () => {
        const atual = window.scrollY;
        scrollVel = Math.min(25, Math.abs(atual - ultimoScroll) * 0.35);
        ultimoScroll = atual;
    }, { passive: true });

    function teletransportarPelaFenda() {
        if (teletransportando) return;
        teletransportando = true;
        const proj = PROJETOS[crackProjectIdx];

        crackTeleportExpand = 1.0;
        vortexPulse = 3.2;
        som(520, 'sine', 0.18);

        const flash = document.getElementById('portal-flash');
        flash.classList.add('ativo');

        setTimeout(() => {
            irPara('projetos', proj.id);
            toast(`🌀 Teletransportado pela Fenda para: ${proj.t}`);
            setTimeout(() => {
                flash.classList.remove('ativo');
                crackTeleportExpand = 0;
                teletransportando = false;
            }, 220);
        }, 260);
    }

    document.addEventListener('pointerdown', e => {
        if (e.target.closest('button, a, input, textarea, .card, .projeto-card, header, nav, .terminal-box, .cv-modal')) return;
        const distFenda = distanciaAteFenda(e.clientX, e.clientY);
        const raioToque = W < 768 ? 140 : 220;
        if (distFenda < raioToque) {
            teletransportarPelaFenda();
        }
    });

    document.getElementById('btn-vortex-pausa').addEventListener('click', () => {
        vortexPausado = !vortexPausado;
        document.getElementById('btn-vortex-pausa').textContent = vortexPausado ? '▶️' : '⏸️';
        toast(vortexPausado ? '⏸️ Vórtice Temporal pausado.' : '🌀 Vórtice Temporal ativo!');
        som(450, 'sine', 0.08);
    });

    function confete(x = W / 2, y = H / 3, n = 90) {
        if (reduceMotion) return;
        const cores = ['#c084fc', '#38bdf8', '#f43f5e', '#34d399', '#ffd166'];
        for (let i = 0; i < n; i++) {
            const a = Math.random() * Math.PI * 2, v = Math.random() * 7 + 2;
            confetes.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 4, g: .18, s: Math.random() * 6 + 3, c: cores[i % cores.length], rot: Math.random() * 6, vr: (Math.random() - .5) * .4, vida: 1 });
        }
    }

    function paletaVortex() {
        if (root.classList.contains('sci-fi-ativo')) {
            return {
                vortexA: '56, 189, 248',
                vortexB: '255, 209, 102',
                gallifrey: '255, 209, 102',
                crackCore: '#ffffff',
                crackGlow: '56, 189, 248',
                alphaMult: 1
            };
        }
        if (root.classList.contains('claro')) {
            return {
                vortexA: '124, 58, 237',
                vortexB: '2, 132, 199',
                gallifrey: '124, 58, 237',
                crackCore: '#ffffff',
                crackGlow: '124, 58, 237',
                alphaMult: 0.65
            };
        }
        return {
            vortexA: '168, 85, 247',
            vortexB: '56, 189, 248',
            gallifrey: '255, 209, 102',
            crackCore: '#ffffff',
            crackGlow: '192, 132, 252',
            alphaMult: 1
        };
    }

    function frameVortex() {
        const P = paletaVortex();
        const isMobile = W < 768;
        cx.clearRect(0, 0, W, H);

        if (!vortexPausado && !reduceMotion) {
            tempoGlobal += 0.016;
            scrollVel *= 0.92;
            vortexPulse *= 0.94;
        }

        const speed = (vortexPausado || reduceMotion) ? 0 : (3.2 + scrollVel + vortexPulse * 14);
        const targetX = mouse.x > 0 ? W * 0.5 + (mouse.x - W * 0.5) * 0.28 : W * 0.5 + Math.sin(tempoGlobal * 0.4) * 40;
        const targetY = mouse.y > 0 ? H * 0.5 + (mouse.y - H * 0.5) * 0.28 : H * 0.5 + Math.cos(tempoGlobal * 0.3) * 30;

        cx.save();
        for (let i = 0; i < vortexStars.length; i++) {
            const s = vortexStars[i];
            const prevZ = s.z;
            s.z -= speed;
            if (s.z <= 5) {
                s.z = 1000;
                s.angle = Math.random() * Math.PI * 2;
                continue;
            }

            const twist = (1000 - s.z) * 0.0022 + tempoGlobal * 0.25;
            const a = s.angle + twist;

            const scale1 = 360 / s.z;
            const scale2 = 360 / Math.min(1000, prevZ + speed * 1.8);

            const x1 = targetX + Math.cos(a) * 280 * scale1;
            const y1 = targetY + Math.sin(a) * 280 * scale1;
            const x2 = targetX + Math.cos(a - 0.03) * 280 * scale2;
            const y2 = targetY + Math.sin(a - 0.03) * 280 * scale2;

            const alpha = Math.min(1, (1 - s.z / 1000) * 0.85) * P.alphaMult;
            const rgb = s.hueOffset > 0.45 ? P.vortexA : P.vortexB;

            cx.beginPath();
            cx.moveTo(x2, y2);
            cx.lineTo(x1, y1);
            cx.strokeStyle = `rgba(${rgb}, ${alpha})`;
            cx.lineWidth = Math.max(0.8, s.size * scale1 * 0.8);
            cx.stroke();
        }
        cx.restore();

        const minDim = Math.min(W, H);
        const gCenterX = W * 0.24;
        const gCenterY = H * 0.48;
        const distMouseGallifrey = mouse.x > 0 ? Math.hypot(mouse.x - gCenterX, mouse.y - gCenterY) : 9999;
        const gallifreyBoost = distMouseGallifrey < 260 ? (1 - distMouseGallifrey / 260) : 0;

        cx.save();
        cx.translate(gCenterX, gCenterY);
        gallifreyRings.forEach((ring, idx) => {
            const radius = minDim * ring.r;
            const rot = tempoGlobal * ring.speed * 60 * (1 + gallifreyBoost * 1.8);
            const alpha = (0.14 + gallifreyBoost * 0.26) * P.alphaMult;

            cx.save();
            cx.rotate(rot);
            cx.beginPath();
            cx.setLineDash(ring.dashes);
            cx.arc(0, 0, radius, 0, Math.PI * 2);
            cx.strokeStyle = `rgba(${P.gallifrey}, ${alpha})`;
            cx.lineWidth = 1.1 + gallifreyBoost * 0.8;
            cx.stroke();
            cx.setLineDash([]);

            for (let n = 0; n < ring.nodes; n++) {
                const na = (Math.PI * 2 / ring.nodes) * n + idx;
                const nx = Math.cos(na) * radius;
                const ny = Math.sin(na) * radius;

                cx.beginPath();
                cx.arc(nx, ny, ring.nodeR + gallifreyBoost * 3, 0, Math.PI * 2);
                cx.strokeStyle = `rgba(${P.vortexB}, ${alpha * 1.3})`;
                cx.lineWidth = 1;
                cx.stroke();

                if (n % 2 === 0) {
                    cx.beginPath();
                    cx.moveTo(nx, ny);
                    cx.lineTo(nx * 0.78, ny * 0.78);
                    cx.strokeStyle = `rgba(${P.gallifrey}, ${alpha * 0.8})`;
                    cx.stroke();
                }
            }
            cx.restore();
        });
        cx.restore();

        if (crackPoints.length > 1) {
            const minCrackDist = distanciaAteFenda(mouse.x, mouse.y);
            const hoverOpen = minCrackDist < 240 ? (1 - minCrackDist / 240) : 0;
            const targetOpen = crackTeleportExpand > 0 ? 1.8 : hoverOpen;

            crackOpenSmooth += (targetOpen - crackOpenSmooth) * (crackTeleportExpand > 0 ? 0.25 : 0.12);

            if (hoverOpen > 0.35 && !teletransportando) {
                crackCycleTimer += 0.016;
                if (crackCycleTimer > 2.8) {
                    crackCycleTimer = 0;
                    crackProjectIdx = (crackProjectIdx + 1) % PROJETOS.length;
                }
            } else {
                crackCycleTimer = 0;
            }

            const maxSpread = crackOpenSmooth * 120;

            if (maxSpread > 2) {
                cx.save();
                cx.beginPath();
                cx.moveTo(crackPoints[0].x, crackPoints[0].y);
                for (let i = 1; i < crackPoints.length; i++) {
                    const env = Math.sin((i / (crackPoints.length - 1)) * Math.PI);
                    cx.lineTo(crackPoints[i].x - env * maxSpread, crackPoints[i].y);
                }
                for (let i = crackPoints.length - 2; i >= 0; i--) {
                    const env = Math.sin((i / (crackPoints.length - 1)) * Math.PI);
                    cx.lineTo(crackPoints[i].x + env * maxSpread, crackPoints[i].y);
                }
                cx.closePath();
                cx.clip();

                const centerCrack = crackPoints[Math.floor(crackPoints.length / 2)];
                const portalGrad = cx.createRadialGradient(centerCrack.x, centerCrack.y, 10, centerCrack.x, centerCrack.y, 240);
                portalGrad.addColorStop(0, '#1e1b4b');
                portalGrad.addColorStop(0.6, '#090d1f');
                portalGrad.addColorStop(1, '#02040a');
                cx.fillStyle = portalGrad;
                cx.fillRect(centerCrack.x - 350, centerCrack.y - 350, 700, 700);

                cx.strokeStyle = 'rgba(56, 189, 248, 0.22)';
                cx.lineWidth = 1;
                const gridShift = (tempoGlobal * 22) % 24;
                for (let gy = centerCrack.y - 250 + gridShift; gy < centerCrack.y + 250; gy += 24) {
                    cx.beginPath();
                    cx.moveTo(centerCrack.x - 250, gy);
                    cx.lineTo(centerCrack.x + 250, gy);
                    cx.stroke();
                }
                for (let gx = centerCrack.x - 240; gx <= centerCrack.x + 240; gx += 24) {
                    cx.beginPath();
                    cx.moveTo(gx, centerCrack.y - 250);
                    cx.lineTo(gx, centerCrack.y + 250);
                    cx.stroke();
                }

                const proj = PROJETOS[crackProjectIdx];
                cx.globalAlpha = Math.min(1, crackOpenSmooth * 1.4);
                cx.textAlign = 'center';

                cx.fillStyle = '#34d399';
                cx.font = 'bold 11px "Share Tech Mono", monospace';
                cx.fillText('🌀 PORTAL DIMENSIONAL', centerCrack.x, centerCrack.y - 34);

                cx.fillStyle = '#ffd166';
                cx.font = 'bold 16px "Philosopher", serif';
                cx.fillText(proj.t, centerCrack.x, centerCrack.y - 10);

                cx.fillStyle = '#38bdf8';
                cx.font = '12px "Share Tech Mono", monospace';
                cx.fillText(`[ ${proj.tags.join(' • ')} ]`, centerCrack.x, centerCrack.y + 14);

                cx.fillStyle = '#e2e8f0';
                cx.font = 'bold 11px Inter, sans-serif';
                cx.fillText('Clique para entrar e ver o projeto →', centerCrack.x, centerCrack.y + 38);

                cx.restore();
            }

            const pulseWave = 0.5 + 0.5 * Math.sin(tempoGlobal * 2.5);
            const mobileDim = isMobile ? 0.65 : 1;
            const intensity = (0.35 + Math.min(0.65, crackOpenSmooth * 0.65) + pulseWave * 0.12) * P.alphaMult * mobileDim;

            cx.save();
            cx.shadowColor = `rgba(${P.crackGlow}, 1)`;
            cx.shadowBlur = (isMobile ? 10 : 16) + crackOpenSmooth * 28;

            cx.beginPath();
            cx.moveTo(crackPoints[0].x, crackPoints[0].y);
            for (let i = 1; i < crackPoints.length; i++) {
                const env = Math.sin((i / (crackPoints.length - 1)) * Math.PI);
                const jitter = crackOpenSmooth > 0.05 ? (Math.random() - 0.5) * 2.2 : 0;
                cx.lineTo(crackPoints[i].x - env * maxSpread + jitter, crackPoints[i].y);
            }
            cx.strokeStyle = `rgba(${P.crackGlow}, ${intensity})`;
            cx.lineWidth = (isMobile ? 1.6 : 2.2) + crackOpenSmooth * 2.5;
            cx.stroke();
            cx.strokeStyle = P.crackCore;
            cx.lineWidth = isMobile ? 0.8 : 1.1;
            cx.stroke();

            if (maxSpread > 1) {
                cx.beginPath();
                cx.moveTo(crackPoints[0].x, crackPoints[0].y);
                for (let i = 1; i < crackPoints.length; i++) {
                    const env = Math.sin((i / (crackPoints.length - 1)) * Math.PI);
                    const jitter = (Math.random() - 0.5) * 2.2;
                    cx.lineTo(crackPoints[i].x + env * maxSpread + jitter, crackPoints[i].y);
                }
                cx.strokeStyle = `rgba(${P.crackGlow}, ${intensity})`;
                cx.lineWidth = (isMobile ? 1.6 : 2.2) + crackOpenSmooth * 2.5;
                cx.stroke();
                cx.strokeStyle = P.crackCore;
                cx.lineWidth = isMobile ? 0.8 : 1.1;
                cx.stroke();
            }
            cx.restore();

            if (!vortexPausado && !reduceMotion && Math.random() < (0.10 + crackOpenSmooth * 0.5)) {
                const idx = Math.floor(Math.random() * crackPoints.length);
                const env = Math.sin((idx / (crackPoints.length - 1)) * Math.PI);
                const side = Math.random() < 0.5 ? -1 : 1;
                faiscas.push({
                    x: crackPoints[idx].x + side * env * maxSpread,
                    y: crackPoints[idx].y,
                    vx: (Math.random() - 0.5) * 3,
                    vy: (Math.random() - 0.5) * 3,
                    vida: 1,
                    r: Math.random() * 2 + 0.8
                });
            }
        }

        faiscas = faiscas.filter(f => (f.vida -= 0.03) > 0);
        faiscas.forEach(f => {
            f.x += f.vx; f.y += f.vy;
            cx.beginPath();
            cx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
            cx.fillStyle = `rgba(${P.crackGlow}, ${f.vida * P.alphaMult})`;
            cx.fill();
        });

        confetes = confetes.filter(c => c.vida > 0 && c.y < H + 20);
        confetes.forEach(c => {
            c.vy += c.g; c.x += c.vx; c.y += c.vy; c.vx *= .99; c.rot += c.vr; c.vida -= .006;
            cx.save(); cx.translate(c.x, c.y); cx.rotate(c.rot); cx.globalAlpha = Math.max(c.vida, 0);
            cx.fillStyle = c.c; cx.fillRect(-c.s / 2, -c.s / 2, c.s, c.s * .6); cx.restore();
        });

        requestAnimationFrame(frameVortex);
    }

    frameVortex();

    return {
        setMouse(x, y) { mouse.x = x; mouse.y = y; },
        impulso(valor = 1.0) { vortexPulse = valor; },
        distanciaFenda: distanciaAteFenda,
        teletransportar: teletransportarPelaFenda,
        confete
    };
}