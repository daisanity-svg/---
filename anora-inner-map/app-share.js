(() => {
  const $ = s => document.querySelector(s);
  let lastSignature = '';
  let analysisFile = null;
  let wallpaperFile = null;

  const IG_URL = 'https://www.instagram.com/anora___shop?igsh=bW5nanM3bTd5d21s';
  const SHOP_URL = 'https://s.shopee.tw/90276JpWao';

  const COPY = {
    '硬撐責任型': {
      title: '你不是不累。\n你只是太習慣\n把事情扛起來。',
      recent: '最近的你，\n很多事情沒有人叫你扛，\n但你就是放不下。\n\n你常常先把事情處理好，\n再回頭才發現，\n自己其實已經很累。',
      power: '你很可靠，也很穩定。\n但可靠不代表\n什麼都要自己撐住。',
      advice: '接下來，少接一件\n不是非你不可的事。\n先把自己留在生活裡。',
      companion: '今天先少撐一點。\n\n沒有把所有事情做好，\n你依然值得被愛。',
      small: '你已經很努力了'
    },
    '假裝不在意型': {
      title: '你不是冷淡。\n你只是太久\n沒有被好好理解。',
      recent: '最近的你，\n習慣先消化情緒，\n再假裝自己沒事。\n\n很多事情明明在意，\n卻選擇不說。\n久而久之，別人以為你不需要被照顧。',
      power: '你很清醒，也很敏銳。\n你不是脆弱，\n只是比別人多感受到一些東西。',
      advice: '不用急著讓所有人理解你。\n先允許自己停下來。\n照顧自己，也是一種勇敢。',
      companion: '你不用一直\n表現得沒事。\n\n脆弱不是麻煩，\n那也是你的一部分。',
      small: '你可以被好好理解'
    },
    '反覆重播型': {
      title: '你不是想太多。\n你只是太容易\n被細節留下。',
      recent: '最近的你，\n常常被一句話、一個語氣，\n拖進很長的反覆思考裡。\n\n你不是故意鑽牛角尖，\n只是太習慣從細節裡找答案。',
      power: '你敏感、細膩、共感力強。\n這不是缺點，\n只是你需要更溫柔地使用它。',
      advice: '下一次開始亂想時，\n先問自己：\n這是事實，還是我最害怕的劇情？',
      companion: '有些答案，\n不是想出來的。\n\n是慢慢活出來的。',
      small: '先讓心安靜下來'
    },
    '卡在轉彎型': {
      title: '你不是沒有方向。\n你只是正在\n離開舊的自己。',
      recent: '最近的你，\n知道不能再照以前那樣過，\n卻還沒找到新的步伐。\n\n你不是停住，\n你是在轉彎。',
      power: '你有覺察，也有更新能力。\n能承認自己正在變，\n本身就需要勇氣。',
      advice: '先做一件很小的事。\n小到不會害怕，\n但足夠讓你開始往前。',
      companion: '不用急著\n找到答案。\n\n願意繼續往前，\n就已經很好了。',
      small: '你正在離開舊的自己'
    },
    '把話吞回去型': {
      title: '你不是沒情緒。\n你只是太常\n把話吞回去。',
      recent: '最近的你，\n很多時候說沒事，\n其實只是還沒有人讓你安心說真話。\n\n你怕造成麻煩，\n所以最後都麻煩自己。',
      power: '你能忍、能體諒、很懂分寸。\n但你也值得\n被好好聽見。',
      advice: '找一件小事說出來。\n不是為了吵架，\n是讓自己被看見。',
      companion: '你可以慢慢說。\n\n真正重要的人，\n會願意聽見你。',
      small: '你的感受值得被聽見'
    },
    '先顧別人型': {
      title: '你不是太懂事。\n你只是太少\n把自己放前面。',
      recent: '最近的你，\n總是先照顧別人的感受，\n才回頭處理自己的委屈。\n\n你嘴巴說沒關係，\n但心裡其實有點失望。',
      power: '你的溫柔是真的。\n但溫柔不應該\n變成你被消耗的理由。',
      advice: '答應之前，先停三秒。\n問自己：\n我是願意，還是不敢拒絕？',
      companion: '你也可以\n先選擇自己。\n\n這不是自私，\n是把心放回原位。',
      small: '溫柔也需要界線'
    },
    '等一個確定型': {
      title: '你不是要很多。\n你只是想被\n堅定放在心上。',
      recent: '最近的你，\n常常在等一個回應，\n也在等自己終於可以安心。\n\n你不是放不下，\n你只是還在等一個明確。',
      power: '你真誠，也很願意投入。\n只是別把安全感\n全部交給別人的反應。',
      advice: '問自己一句：\n我在這段關係裡，\n真的安心嗎？',
      companion: '不用靠反覆確認，\n才證明自己值得。\n\n你本來就值得\n被穩定對待。',
      small: '你的真心值得被安放'
    },
    '怕失控預演型': {
      title: '你不是愛控制。\n你只是太怕\n事情突然壞掉。',
      recent: '最近的你，\n總是先把最壞的情況想完，\n才敢讓自己放鬆一點。\n\n你很努力讓生活穩住，\n只是也把自己逼得太緊。',
      power: '你細心、能規劃、能安定局面。\n這是能力，\n不該只變成壓力。',
      advice: '選一件小事，\n讓它不用完美。\n世界不會因此崩掉。',
      companion: '今天可以\n不用那麼完美。\n\n有些事情鬆一點，\n也會慢慢變好。',
      small: '你可以不用一直預演最壞'
    },
    '安靜消化型': {
      title: '你不是不需要人。\n你只是太習慣\n自己消化。',
      recent: '最近的你，\n看起來很安靜，\n其實心裡處理了很多沒有說出口的事。\n\n你不是高傲，\n只是太不想再失望。',
      power: '你獨立、清醒、有自己的節奏。\n也擁有慢慢\n修復自己的能力。',
      advice: '讓一個人多看見你一點。\n不用很多，\n一點點就好。',
      companion: '你不需要\n總是一個人消化。\n\n有人靠近時，\n也可以試著讓他留下。',
      small: '你的安靜也值得被陪伴'
    },
    '慢慢安心型': {
      title: '你不是害怕改變。\n你只是需要\n慢慢安心。',
      recent: '最近的你，\n不是不想往前，\n只是需要先確認自己不會再被丟下。\n\n你不是慢，\n你是在等心裡跟上。',
      power: '你穩定、耐心、能長期經營。\n只要找到節奏，\n你會走得很遠。',
      advice: '先做一個小改變。\n小到不害怕，\n但足夠讓你知道：我可以往前。',
      companion: '慢慢來也可以。\n\n你不是落後，\n你只是在用自己的速度安心。',
      small: '你的節奏沒有錯'
    }
  };

  function isVisible() { const result = $('#result'); return result && !result.classList.contains('hidden'); }
  function getSignature() { return (($('#archetypeName')?.innerText || '') + ($('#reportContent')?.innerText || '')); }
  function getCopy() {
    const type = $('#archetypeName')?.innerText.trim() || '';
    return COPY[type] || { title: '你的內在地圖。\n正在慢慢展開。', recent: '最近的你，\n正在學會用更誠實的方式理解自己。\n\n有些答案不用急，\n你可以先把自己放回來。', power: '你敏感、真誠，\n也願意面對自己。', advice: '不用立刻變好。\n先穩定下來，\n這就已經是開始。', companion: '不用急著變好。\n\n先穩定下來，\n這就已經是開始。', small: '你正在慢慢回到自己' };
  }

  async function renderCard() {
    if (!isVisible()) return;
    const sig = getSignature();
    if (!sig || sig === lastSignature) return;
    lastSignature = sig;
    const copy = getCopy();
    const analysisCanvas = drawAnalysisCard(copy);
    const wallpaperCanvas = drawWallpaperCard(copy, sig);
    const analysisUrl = analysisCanvas.toDataURL('image/png');
    const wallpaperUrl = wallpaperCanvas.toDataURL('image/png');
    analysisFile = await canvasToFile(analysisCanvas, 'anora-inner-map-analysis.png');
    wallpaperFile = await canvasToFile(wallpaperCanvas, 'anora-inner-map-companion.png');

    let wrap = $('#anoraResultExperience');
    if (!wrap) {
      wrap = document.createElement('div');
      wrap.id = 'anoraResultExperience';
      wrap.style.cssText = 'width:100%;max-width:880px;margin:0 auto 28px;';
      $('#reportPaper')?.parentNode?.insertBefore(wrap, $('#reportPaper'));
    }

    wrap.innerHTML = `
      <style>
        .anora-result-wrap{display:flex;flex-direction:column;gap:20px;align-items:center;}
        .anora-top-links{width:100%;display:grid;grid-template-columns:1fr 1fr;gap:0;border-radius:18px;background:rgba(244,238,228,.94);box-shadow:0 10px 30px rgba(0,0,0,.10);overflow:hidden;border:1px solid rgba(47,71,58,.12);}
        .anora-top-link{display:flex;align-items:center;justify-content:center;gap:10px;padding:13px 10px;text-decoration:none;color:#2F473A;font-size:14px;letter-spacing:.03em;white-space:nowrap;border-right:1px solid rgba(47,71,58,.14);}
        .anora-top-link:last-child{border-right:0;}
        .anora-top-link b{font-weight:500;font-size:17px;}
        .anora-preview-grid{display:grid;grid-template-columns:1fr 1fr;gap:20px;width:100%;align-items:start;}
        .anora-card-preview{display:flex;flex-direction:column;gap:10px;align-items:center;}
        .anora-card-preview h3{margin:0;color:#F4EEE4;font-size:20px;letter-spacing:.08em;font-weight:600;}
        .anora-card-preview p{margin:0;color:rgba(244,238,228,.82);font-size:14px;line-height:1.7;text-align:center;}
        .anora-card-preview img{width:100%;max-width:360px;aspect-ratio:9/16;object-fit:cover;border-radius:24px;box-shadow:0 20px 54px rgba(0,0,0,.24);-webkit-touch-callout:default;user-select:auto;-webkit-user-select:auto;background:#F4EEE4;}
        .anora-action-panel{width:100%;display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-top:4px;}
        .anora-action-btn{appearance:none;border:1px solid rgba(244,238,228,.34);background:rgba(244,238,228,.92);color:#2F473A;border-radius:22px;padding:18px;display:flex;align-items:center;justify-content:space-between;gap:14px;text-align:left;text-decoration:none;box-shadow:0 12px 32px rgba(0,0,0,.12);cursor:pointer;font-family:inherit;}
        .anora-action-btn strong{display:block;font-size:19px;letter-spacing:.04em;margin-bottom:4px;}
        .anora-action-btn small{display:block;font-size:13px;line-height:1.55;color:rgba(47,71,58,.76);}
        .anora-action-btn .mark{width:42px;height:42px;flex:0 0 42px;border-radius:50%;display:grid;place-items:center;background:#2F473A;color:#F4EEE4;font-size:20px;}
        .anora-action-btn.primary{background:#2F473A;color:#F4EEE4;}
        .anora-action-btn.primary small{color:rgba(244,238,228,.75);}
        .anora-action-btn.primary .mark{background:rgba(244,238,228,.14);}
        .anora-restart{border:0;background:transparent;color:rgba(244,238,228,.86);font-size:16px;letter-spacing:.12em;padding:12px 20px;cursor:pointer;}
        @media (max-width:720px){.anora-preview-grid,.anora-action-panel{grid-template-columns:1fr;}.anora-card-preview img{max-width:380px}.anora-result-wrap{gap:18px}.anora-action-btn{border-radius:18px}.anora-top-links{position:sticky;top:0;z-index:2;border-radius:0;margin:-10px -10px 4px;width:calc(100% + 20px)}.anora-top-link{font-size:13px;padding:12px 6px}}
      </style>
      <div class="anora-result-wrap">
        <div class="anora-top-links">
          <a class="anora-top-link" href="${IG_URL}" target="_blank" rel="noreferrer"><span>◎</span><span>想看更多內在地圖？</span><b>›</b></a>
          <a class="anora-top-link" href="${SHOP_URL}" target="_blank" rel="noreferrer"><span>◇</span><span>探索 anōra 能量手鍊</span><b>›</b></a>
        </div>
        <div class="anora-preview-grid">
          <div class="anora-card-preview"><h3>完整分析卡</h3><img id="analysisCardImg" src="${analysisUrl}" alt="anōra 完整分析卡，長按可儲存" /><p>1080 × 1920｜長按圖片即可儲存</p></div>
          <div class="anora-card-preview"><h3>今日陪伴卡</h3><img id="wallpaperCardImg" src="${wallpaperUrl}" alt="anōra 今日陪伴卡，長按可儲存為手機桌布" /><p>1080 × 1920｜適合手機桌布與限動</p></div>
        </div>
        <div class="anora-action-panel">
          <button class="anora-action-btn primary" data-share-kind="analysis"><span><strong>閱讀完整解析</strong><small>儲存這次的內在地圖</small></span><span class="mark">→</span></button>
          <button class="anora-action-btn" data-share-kind="wallpaper"><span><strong>給今天的自己</strong><small>收藏今日陪伴卡</small></span><span class="mark">♡</span></button>
        </div>
        <button class="anora-restart" data-anora-restart>重新測驗</button>
      </div>`;

    $('.result-actions')?.setAttribute('style', 'display:none !important');
    const paper = $('#reportPaper');
    if (paper) paper.style.display = 'none';
  }

  function drawAnalysisCard(copy) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 1080; canvas.height = 1920;
    const bg = '#F4EEE4', ink = '#2F473A', muted = '#738076', line = '#B89263';
    drawPaperBase(ctx, bg, ink);
    drawSymbol(ctx, 'compass', 860, 212, line, 58);
    drawSymbol(ctx, 'sun', 170, 842, line, 44);
    drawSymbol(ctx, 'mountain', 170, 1182, line, 46);
    drawSymbol(ctx, 'leaf', 170, 1516, line, 42);
    drawSymbol(ctx, 'crystal', 820, 1644, line, 50);
    ctx.fillStyle = ink;
    ctx.font = '400 62px Georgia, Times New Roman, serif'; ctx.fillText('anōra', 150, 174);
    ctx.font = '400 27px Georgia, Times New Roman, serif'; ctx.fillText('I N N E R   M A P', 150, 224);
    ctx.font = '400 25px PingFang TC, Noto Serif TC, serif'; ctx.fillText('心  理  地  圖  分  析', 150, 282);
    ctx.font = '700 64px PingFang TC, Noto Serif TC, serif';
    let y = multiline(ctx, copy.title, 150, 470, 760, 82);
    drawDivider(ctx, 250, y + 30, 860, line);
    y += 115;
    ctx.fillStyle = muted; ctx.font = '600 29px PingFang TC, Noto Serif TC, serif'; ctx.fillText('最近的你', 250, y);
    y += 46; ctx.fillStyle = ink; ctx.font = '400 27px PingFang TC, Noto Serif TC, serif';
    y = multiline(ctx, copy.recent, 250, y, 610, 38);
    const powerY = Math.max(y + 58, 1160);
    drawDivider(ctx, 250, powerY - 44, 860, line);
    ctx.font = '600 31px PingFang TC, Noto Serif TC, serif'; ctx.fillStyle = ink; ctx.fillText('你的內在力量', 250, powerY);
    ctx.font = '400 27px PingFang TC, Noto Serif TC, serif'; multiline(ctx, copy.power, 250, powerY + 50, 610, 38);
    const adviceY = 1490;
    drawDivider(ctx, 250, adviceY - 44, 860, line);
    ctx.font = '600 31px PingFang TC, Noto Serif TC, serif'; ctx.fillText('給現在的你', 250, adviceY);
    ctx.font = '400 27px PingFang TC, Noto Serif TC, serif'; multiline(ctx, copy.advice, 250, adviceY + 50, 610, 38);
    ctx.font = '400 28px Georgia, Times New Roman, serif'; ctx.fillText('anōra INNER MAP', 150, 1768);
    ctx.font = '400 25px PingFang TC, Noto Serif TC, serif'; ctx.fillText('陪你看見內在的真實地圖', 150, 1816);
    return canvas;
  }

  function drawDivider(ctx, x1, y, x2, color) { ctx.strokeStyle = color; ctx.globalAlpha = .42; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(x1, y); ctx.lineTo(x2, y); ctx.stroke(); ctx.globalAlpha = 1; }

  function drawWallpaperCard(copy, sig) {
    const canvas = document.createElement('canvas'); const ctx = canvas.getContext('2d');
    canvas.width = 1080; canvas.height = 1920;
    const bg = '#F4EEE4', ink = '#2F473A', line = '#B89263';
    ctx.fillStyle = bg; ctx.fillRect(0, 0, 1080, 1920);
    const grad = ctx.createLinearGradient(0, 0, 1080, 1920); grad.addColorStop(0, 'rgba(255,255,255,.34)'); grad.addColorStop(.55, 'rgba(255,255,255,0)'); grad.addColorStop(1, 'rgba(47,71,58,.055)'); ctx.fillStyle = grad; ctx.fillRect(0, 0, 1080, 1920);
    drawSoftShadow(ctx, hash(sig) % 3);
    ctx.fillStyle = ink; ctx.textAlign = 'center'; ctx.font = '400 58px Georgia, Times New Roman, serif'; ctx.fillText('anōra', 540, 315);
    ctx.font = '400 23px PingFang TC, Noto Serif TC, serif'; ctx.fillText('給  今  天  的  自  己', 540, 505); drawSymbol(ctx, 'star', 540, 385, line, 26);
    ctx.strokeStyle = line; ctx.globalAlpha = .55; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(500, 560); ctx.lineTo(580, 560); ctx.stroke(); ctx.globalAlpha = 1;
    ctx.fillStyle = ink; ctx.font = '600 54px PingFang TC, Noto Serif TC, serif'; multilineCenter(ctx, copy.companion, 540, 760, 780, 88);
    ctx.strokeStyle = line; ctx.globalAlpha = .45; ctx.beginPath(); ctx.moveTo(540, 1325); ctx.lineTo(540, 1428); ctx.stroke(); ctx.globalAlpha = 1; drawSymbol(ctx, 'sprout', 540, 1500, line, 62);
    ctx.font = '400 27px Georgia, Times New Roman, serif'; ctx.fillStyle = ink; ctx.fillText('Inner Map', 540, 1665);
    ctx.font = '400 23px PingFang TC, Noto Serif TC, serif'; ctx.fillText(copy.small, 540, 1710); ctx.textAlign = 'left'; return canvas;
  }

  function drawPaperBase(ctx, bg, ink) { ctx.fillStyle = bg; ctx.fillRect(0, 0, 1080, 1920); const grad = ctx.createLinearGradient(0, 0, 1080, 1920); grad.addColorStop(0, 'rgba(255,255,255,.28)'); grad.addColorStop(1, 'rgba(47,71,58,.048)'); ctx.fillStyle = grad; ctx.fillRect(0, 0, 1080, 1920); ctx.strokeStyle = ink; ctx.globalAlpha = .25; ctx.lineWidth = 1.3; ctx.beginPath(); ctx.moveTo(82, 115); ctx.lineTo(82, 1785); ctx.stroke(); ctx.globalAlpha = 1; ctx.fillStyle = ink; ctx.fillRect(76, 430, 12, 118); }
  function drawSoftShadow(ctx, mode) { ctx.globalAlpha = mode === 0 ? .18 : .13; ctx.fillStyle = '#9EA996'; for (let i = 0; i < 10; i++) { ctx.beginPath(); const x = mode === 1 ? 100 + i * 120 : 760 - i * 42; const y = 80 + i * 150; ctx.ellipse(x, y, 150, 36, Math.PI / 5, 0, Math.PI * 2); ctx.fill(); } ctx.globalAlpha = 1; }
  function drawSymbol(ctx, type, x, y, color, size) { ctx.save(); ctx.strokeStyle = color; ctx.fillStyle = color; ctx.globalAlpha = .78; ctx.lineWidth = 2.4; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.translate(x, y); const s = size / 60; ctx.scale(s, s); if (type === 'sun') { ctx.beginPath(); ctx.arc(0, 12, 22, Math.PI, Math.PI * 2); ctx.stroke(); for (let i = -3; i <= 3; i++) { ctx.beginPath(); ctx.moveTo(i * 12, 7); ctx.lineTo(i * 12, -18 + Math.abs(i) * 4); ctx.stroke(); } ctx.beginPath(); ctx.moveTo(-42, 18); ctx.lineTo(42, 18); ctx.stroke(); } else if (type === 'mountain') { ctx.beginPath(); ctx.moveTo(-45, 30); ctx.lineTo(-12, -25); ctx.lineTo(8, 8); ctx.lineTo(25, -18); ctx.lineTo(52, 30); ctx.closePath(); ctx.stroke(); } else if (type === 'leaf') { ctx.beginPath(); ctx.moveTo(0, 45); ctx.lineTo(0, -42); ctx.stroke(); ctx.beginPath(); ctx.moveTo(0, -18); ctx.quadraticCurveTo(-34, -36, -42, -8); ctx.quadraticCurveTo(-18, -2, 0, 8); ctx.stroke(); ctx.beginPath(); ctx.moveTo(0, -8); ctx.quadraticCurveTo(36, -34, 44, -6); ctx.quadraticCurveTo(18, 4, 0, 18); ctx.stroke(); } else if (type === 'crystal') { ctx.beginPath(); ctx.moveTo(0, -48); ctx.lineTo(38, -8); ctx.lineTo(10, 50); ctx.lineTo(-28, 30); ctx.lineTo(-40, -12); ctx.closePath(); ctx.stroke(); ctx.beginPath(); ctx.moveTo(0, -48); ctx.lineTo(0, 50); ctx.moveTo(-40, -12); ctx.lineTo(0, 8); ctx.lineTo(38, -8); ctx.stroke(); } else if (type === 'compass') { ctx.beginPath(); ctx.arc(0, 0, 45, 0, Math.PI * 2); ctx.stroke(); ctx.beginPath(); ctx.moveTo(0, -52); ctx.lineTo(12, -10); ctx.lineTo(52, 0); ctx.lineTo(12, 10); ctx.lineTo(0, 52); ctx.lineTo(-12, 10); ctx.lineTo(-52, 0); ctx.lineTo(-12, -10); ctx.closePath(); ctx.stroke(); } else if (type === 'star') { ctx.beginPath(); ctx.moveTo(0, -30); ctx.lineTo(6, -6); ctx.lineTo(30, 0); ctx.lineTo(6, 6); ctx.lineTo(0, 30); ctx.lineTo(-6, 6); ctx.lineTo(-30, 0); ctx.lineTo(-6, -6); ctx.closePath(); ctx.stroke(); } else if (type === 'sprout') { ctx.beginPath(); ctx.moveTo(0, 55); ctx.lineTo(0, -45); ctx.stroke(); ctx.beginPath(); ctx.moveTo(0, -12); ctx.quadraticCurveTo(-40, -35, -50, -2); ctx.quadraticCurveTo(-24, 8, 0, 20); ctx.stroke(); ctx.beginPath(); ctx.moveTo(0, -18); ctx.quadraticCurveTo(40, -45, 50, -8); ctx.quadraticCurveTo(22, 6, 0, 24); ctx.stroke(); } ctx.restore(); }
  function multiline(ctx, text, x, y, maxWidth, lineHeight) { let currentY = y; String(text).split('\n').forEach(line => { currentY = wrap(ctx, line, x, currentY, maxWidth, lineHeight); }); return currentY; }
  function multilineCenter(ctx, text, x, y, maxWidth, lineHeight) { let currentY = y; String(text).split('\n').forEach(line => { const lines = splitLine(ctx, line, maxWidth); lines.forEach(item => { ctx.fillText(item, x, currentY); currentY += lineHeight; }); }); return currentY; }
  function splitLine(ctx, text, maxWidth) { const output = []; let line = ''; for (const ch of String(text)) { const test = line + ch; if (ctx.measureText(test).width > maxWidth && line) { output.push(line); line = ch; } else { line = test; } } if (line) output.push(line); if (!output.length) output.push(''); return output; }
  function wrap(ctx, text, x, y, maxWidth, lineHeight) { const lines = splitLine(ctx, text, maxWidth); let currentY = y; lines.forEach(line => { if (line) ctx.fillText(line, x, currentY); currentY += lineHeight; }); return currentY; }
  function canvasToFile(canvas, name) { return new Promise(resolve => { canvas.toBlob(blob => resolve(blob ? new File([blob], name, { type: 'image/png' }) : null), 'image/png', 1); }); }
  async function shareCard(kind) { const file = kind === 'wallpaper' ? wallpaperFile : analysisFile; if (file && navigator.share && (!navigator.canShare || navigator.canShare({ files: [file] }))) { try { await navigator.share({ title: 'anōra Inner Map', text: kind === 'wallpaper' ? '我的 anōra 今日陪伴卡' : '我的 anōra 完整分析卡', files: [file] }); return; } catch (err) { if (err && err.name === 'AbortError') return; } } const target = kind === 'wallpaper' ? $('#wallpaperCardImg') : $('#analysisCardImg'); target?.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
  function hash(str) { let h = 2166136261; for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h += (h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24); } return Math.abs(h >>> 0); }
  document.addEventListener('click', e => { const shareBtn = e.target.closest('[data-share-kind]'); if (shareBtn) { e.preventDefault(); shareCard(shareBtn.getAttribute('data-share-kind')); return; } const restart = e.target.closest('[data-anora-restart]'); if (restart) { e.preventDefault(); document.querySelector('[data-restart]')?.click(); } });
  const observer = new MutationObserver(() => setTimeout(renderCard, 250));
  window.addEventListener('DOMContentLoaded', () => { const result = $('#result'); if (result) { observer.observe(result, { attributes: true, attributeFilter: ['class'], subtree: true, childList: true }); } setTimeout(renderCard, 500); });
})();