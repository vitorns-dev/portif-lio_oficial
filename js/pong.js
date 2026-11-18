export function iniciarPong({ som, confete, safeGet, safeSet, isViewProjetos }) {
    const pc = document.getElementById('pong-canvas');
    const pctx = pc.getContext('2d');
    const PW = 480, PH = 260, META = 5;

    const pong = {
        b: { x: PW / 2, y: PH / 2, vx: 3.2, vy: 1.5, r: 6 },
        p: { x: 12, y: 102, w: 8, h: 56 },
        ai: { x: 460, y: 102, w: 8, h: 56 },
        sp: 0, sa: 0, ativo: false, fim: '', up: false, down: false, ultimo: 0,
        vitorias: parseInt(safeGet('pongVitorias') || '0', 10) || 0
    };

    document.getElementById('pong-vitorias').textContent = '🏆 Vitórias: ' + pong.vitorias;

    function pongSaque(dir) {
        const b = pong.b, a = (Math.random() - .5) * 0.9;
        b.x = PW / 2; b.y = PH / 2;
        b.vx = Math.cos(a) * 3.2 * dir;
        b.vy = Math.sin(a) * 3.2;
    }

    function pongReset() {
        pong.sp = pong.sa = 0;
        pong.fim = '';
        pong.p.y = pong.ai.y = PH / 2 - 28;
        pongSaque(Math.random() < .5 ? 1 : -1);
    }

    function setPongAtivo(v) {
        if (v && pong.fim) pongReset();
        pong.ativo = v;
        document.getElementById('pong-status-label').textContent = v ? '▶️ Em jogo' : '⏸️ Pausado';
        som(v ? 523 : 300, 'sine', 0.1);
    }

    const togglePong = () => setPongAtivo(!pong.ativo);

    function rebater(raq, dir) {
        const b = pong.b;
        const rel = Math.max(-1, Math.min(1, (b.y - (raq.y + raq.h / 2)) / (raq.h / 2)));
        const vel = Math.min(Math.hypot(b.vx, b.vy) * 1.06, 9);
        const a = rel * 0.85;
        b.vx = Math.cos(a) * vel * dir;
        b.vy = Math.sin(a) * vel;
    }

    function pongUpdate(dt) {
        const { b, p, ai } = pong;
        if (pong.up) p.y -= 5 * dt;
        if (pong.down) p.y += 5 * dt;
        p.y = Math.max(0, Math.min(PH - p.h, p.y));

        b.x += b.vx * dt; b.y += b.vy * dt;
        if (b.y - b.r < 0) { b.y = b.r; b.vy = Math.abs(b.vy); som(300, 'triangle', .05); }
        if (b.y + b.r > PH) { b.y = PH - b.r; b.vy = -Math.abs(b.vy); som(300, 'triangle', .05); }

        const alvo = b.vx > 0 ? b.y : PH / 2, centro = ai.y + ai.h / 2;
        if (Math.abs(centro - alvo) > 10) ai.y += Math.sign(alvo - centro) * 3.1 * dt;
        ai.y = Math.max(0, Math.min(PH - ai.h, ai.y));

        if (b.vx < 0 && b.x - b.r <= p.x + p.w && b.x > p.x && b.y + b.r >= p.y && b.y - b.r <= p.y + p.h) {
            b.x = p.x + p.w + b.r; rebater(p, 1); som(600, 'square', .08);
        }
        if (b.vx > 0 && b.x + b.r >= ai.x && b.x < ai.x + ai.w && b.y + b.r >= ai.y && b.y - b.r <= ai.y + ai.h) {
            b.x = ai.x - b.r; rebater(ai, -1); som(700, 'square', .08);
        }

        if (b.x < -b.r) { pong.sa++; som(200, 'sawtooth', .2); pongSaque(1); }
        else if (b.x > PW + b.r) { pong.sp++; som(800, 'triangle', .15); pongSaque(-1); }

        if (pong.sp >= META || pong.sa >= META) {
            pong.ativo = false;
            const ganhou = pong.sp >= META;
            pong.fim = ganhou ? '🏆 VOCÊ VENCEU!' : '🤖 A IA VENCEU';
            document.getElementById('pong-status-label').textContent = '⏸️ Fim de jogo';
            if (ganhou) {
                pong.vitorias++;
                safeSet('pongVitorias', pong.vitorias);
                document.getElementById('pong-vitorias').textContent = '🏆 Vitórias: ' + pong.vitorias;
                const r = pc.getBoundingClientRect();
                confete(r.left + r.width / 2, r.top + r.height / 2);
            }
        }
    }

    function pongDraw() {
        const { b, p, ai } = pong;
        pctx.fillStyle = '#06030e'; pctx.fillRect(0, 0, PW, PH);
        pctx.strokeStyle = '#2d1b4e'; pctx.setLineDash([4, 4]);
        pctx.beginPath(); pctx.moveTo(PW / 2, 0); pctx.lineTo(PW / 2, PH); pctx.stroke(); pctx.setLineDash([]);
        pctx.shadowBlur = 12;
        pctx.shadowColor = '#c084fc'; pctx.fillStyle = '#c084fc'; pctx.fillRect(p.x, p.y, p.w, p.h);
        pctx.shadowColor = '#f43f5e'; pctx.fillStyle = '#f43f5e'; pctx.fillRect(ai.x, ai.y, ai.w, ai.h);
        pctx.shadowColor = '#ffd166'; pctx.fillStyle = '#ffd166';
        pctx.beginPath(); pctx.arc(b.x, b.y, b.r, 0, 6.283); pctx.fill();
        pctx.shadowBlur = 0;
        pctx.font = '22px "Share Tech Mono", monospace'; pctx.fillStyle = '#c084fc'; pctx.textAlign = 'center';
        pctx.fillText(pong.sp, PW / 2 - 40, 28); pctx.fillText(pong.sa, PW / 2 + 40, 28);
        if (!pong.ativo) {
            pctx.fillStyle = 'rgba(6,3,14,.6)'; pctx.fillRect(0, 0, PW, PH);
            pctx.fillStyle = '#fff'; pctx.font = 'bold 18px Inter, sans-serif';
            pctx.fillText(pong.fim || 'JOGO PAUSADO', PW / 2, PH / 2 - 4);
            pctx.font = '13px Inter, sans-serif';
            pctx.fillText(pong.fim ? 'Clique para jogar de novo' : 'Clique aqui ou aperte Espaço', PW / 2, PH / 2 + 20);
        }
        pctx.textAlign = 'left';
    }

    function pongLoop(t) {
        if (isViewProjetos()) {
            const dt = Math.min(2.5, (t - (pong.ultimo || t)) / 16.67);
            pong.ultimo = t;
            if (pong.ativo) pongUpdate(dt);
            pongDraw();
        } else {
            pong.ultimo = 0;
        }
        requestAnimationFrame(pongLoop);
    }

    function moverRaquete(e) {
        const r = pc.getBoundingClientRect();
        pong.p.y = Math.max(0, Math.min(PH - pong.p.h, (e.clientY - r.top) * (PH / r.height) - pong.p.h / 2));
    }

    pc.addEventListener('pointermove', e => { if (pong.ativo) moverRaquete(e); });
    pc.addEventListener('pointerdown', e => { if (!pong.ativo) setPongAtivo(true); moverRaquete(e); });
    document.getElementById('btn-pong-pausa').addEventListener('click', togglePong);

    pongReset();
    requestAnimationFrame(pongLoop);

    return {
        isAtivo: () => pong.ativo,
        setAtivo: setPongAtivo,
        toggle: togglePong,
        setDir(dir, estado) { pong[dir] = estado; },
        pararControles() { pong.up = pong.down = false; }
    };
}