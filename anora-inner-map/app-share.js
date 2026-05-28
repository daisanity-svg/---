(() => {
  let storyBlob = null;
  let storyFile = null;
  let storyDataUrl = '';
  let lastSignature = '';

  function $(selector) { return document.querySelector(selector); }
  function $all(selector) { return Array.from(document.querySelectorAll(selector)); }

  const PALETTES = [
    { name: 'warm cream', bg: '#F4EEE4', ink: '#2F473A', soft: '#DCD5C8', muted: '#6D7568', accent: '#B89263', panel: '#E7E0D3' },
    { name: 'linen sage', bg: '#EFEBDD', ink: '#344A3C', soft: '#D8D8C9', muted: '#697265', accent: '#A8895F', panel: '#DFDFD0' },
    { name: 'milk tea', bg: '#F1E8DC', ink: '#3B493B', soft: '#DED1C1', muted: '#70665A', accent: '#AE865F', panel: '#E4D6C5' },
    { name: 'mist olive', bg: '#ECEBDF', ink: '#31483E', soft: '#D3D8CC', muted: '#657166', accent: '#A58B63', panel: '#DDE1D4' },
    { name: 'paper green', bg: '#F6F0E6', ink: '#284337', soft: '#E0D8CA', muted: '#657064', accent: '#BE9565', panel: '#EAE2D5' },
    { name: 'soft stone', bg: '#EEE8DE', ink: '#33453C', soft: '#D7D1C8', muted: '#6B6D64', accent: '#A99068', panel: '#E2DCD2' }
  ];

  const COPY = {
    '反覆重播型': {
      headline: '你不是想太多，\n你只是太容易被細節留下。',
      sub: '最近的你，常常被一句話、一個語氣，拖進很長的反覆思考裡。',
      strengthTitle: '你的內在力量',
      strength: '敏感、細膩、很會感受他人，也能看見別人忽略的情緒縫隙。'
    },
    '硬撐責任型': {
      headline: '你不是不累，\n你只是太習慣自己撐住。',
      sub: '最近的你，明明已經很滿，卻還是下意識把事情接過來。',
      strengthTitle: '你的內在力量',
      strength: '可靠、負責、穩定，能在混亂裡把事情慢慢整理回來。'
    },
    '卡在轉彎型': {
      headline: '你不是沒有方向，\n你只是正在離開舊的自己。',
      sub: '最近的你，知道不能再照以前那樣過，卻還沒找到新的步伐。',
      strengthTitle: '你的內在力量',
      strength: '有覺察、有更新能力，也願意在不確定裡重新理解自己。'
    },
    '把話吞回去型': {
      headline: '你不是沒情緒，\n你只是太常把話吞回去。',
      sub: '最近的你，很多時候說沒事，其實只是還沒有人讓你安心說真話。',
      strengthTitle: '你的內在力量',
      strength: '能忍、能體諒、很懂分寸，但也值得被好好聽見。'
    },
    '先顧別人型': {
      headline: '你不是太懂事，\n你只是太少把自己放前面。',
      sub: '最近的你，總是先照顧別人的感受，才回頭處理自己的委屈。',
      strengthTitle: '你的內在力量',
      strength: '溫柔、共感力強，能讓人安心，也很適合成為穩定的陪伴。'
    },
    '等一個確定型': {
      headline: '你不是要很多，\n你只是想被堅定放在心上。',
      sub: '最近的你，常常在等一個回應，也在等自己終於可以安心。',
      strengthTitle: '你的內在力量',
      strength: '真誠、深情、願意投入，只是需要把安全感慢慢拿回自己手裡。'
    },
    '怕失控預演型': {
      headline: '你不是愛控制，\n你只是太怕事情突然壞掉。',
      sub: '最近的你，常常先把最壞的情況想完，才敢讓自己放鬆一點。',
      strengthTitle: '你的內在力量',
      strength: '細心、能規劃、能預判風險，也擁有把日子安定下來的能力。'
    },
    '假裝不在意型': {
      headline: '你不是冷淡，\n你只是太久沒有被好好理解。',
      sub: '最近的你，習慣先消化情緒，再假裝自己沒事。',
      strengthTitle: '你的內在力量',
      strength: '清醒、敏銳、有界線，也比自己以為的更渴望被支持。'
    },
    '安靜消化型': {
      headline: '你不是不需要人，\n你只是太習慣自己消化。',
      sub: '最近的你，看起來很安靜，其實心裡處理了很多沒有說出口的事。',
      strengthTitle: '你的內在力量',
      strength: '獨立、清醒、有自己的節奏，也擁有慢慢修復自己的能力。'
    },
    '慢慢安心型': {
      headline: '你不是害怕改變，\n你只是需要慢慢安心。',
      sub: '最近的你，不是不想往前，而是需要先確認自己不會再被丟下。',
      strengthTitle: '你的內在力量',
      strength: '穩定、耐心、能長期經營，也能把重要的事慢慢守住。'
    }
  };

  function isResultVisible() {
    const result = $('#result');
    return result && !result.classList.contains('hidden');
  }

  function getReportSignature() {
    return [
      $('#archetypeName')?.innerText || '',
      $('#archetypeOneLiner')?.innerText || '',
      $('#reportSubtitle')?.innerText || '',
      $('#reportContent')?.innerText || ''
    ].join('|');
  }

  function getReportData() {
    const type = $('#archetypeName')?.innerText.trim() || '內在狀態';
    const one = $('#archetypeOneLiner')?.innerText.trim() || '';
    const keyword = ($('#reportSubtitle')?.innerText || '').replace('關鍵字：', '').trim();
    const sections = $all('#reportContent section').map((section) => ({
      title: section.querySelector('h4')?.innerText.trim() || '',
      text: section.querySelector('p')?.innerText.trim() || ''
    })).filter(s => s.title || s.text);
    return { type, one, keyword, sections };
  }

  async function buildAndShowStoryImage() {
    if (!isResultVisible()) return;
    const signature = getReportSignature();
    if (!signature || signature === lastSignature) return;
    lastSignature = signature;

    const canvas = buildCanvas(getReportData(), signature);
    storyDataUrl = canvas.toDataURL('image/png');
    storyBlob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png', 1));
    storyFile = storyBlob ? new File([storyBlob], 'anora-inner-map-story.png', { type: 'image/png' }) : null;

    let wrap = $('#storyPreviewWrap');
    if (!wrap) {
      wrap = document.createElement('div');
      wrap.id = 'storyPreviewWrap';
      wrap.style.cssText = 'max-width:420px;margin:0 auto 24px;text-align:center;';

      const img = document.createElement('img');
      img.id = 'storyPreviewImage';
      img.alt = 'anōra 內在狀態人格報告圖片，長按可儲存';
      img.style.cssText = 'width:100%;height:auto;display:block;border-radius:22px;box-shadow:0 18px 48px rgba(0,0,0,.18);-webkit-touch-callout:default;user-select:auto;-webkit-user-select:auto;';

      const hint = document.createElement('p');
      hint.id = 'storyPreviewHint';
      hint.textContent = '可長按圖片儲存，或按「分享圖片」。';
      hint.style.cssText = 'margin:12px 0 0;color:#f3e6de;font-size:14px;line-height:1.8;opacity:.85;';

      wrap.appendChild(img);
      wrap.appendChild(hint);
      const reportPaper = $('#reportPaper');
      reportPaper?.parentNode?.insertBefore(wrap, reportPaper);
    }

    const img = $('#storyPreviewImage');
    if (img) img.src = storyDataUrl;

    const reportPaper = $('#reportPaper');
    if (reportPaper) reportPaper.style.display = 'none';
  }

  async function shareStoryImage(event) {
    const button = event.target.closest('[data-download]');
    if (!button) return;

    event.preventDefault();
    event.stopImmediatePropagation();

    await buildAndShowStoryImage();

    if (storyFile && navigator.share && (!navigator.canShare || navigator.canShare({ files: [storyFile] }))) {
      try {
        await navigator.share({
          title: 'anōra Inner Map',
          text: '我的 anōra 內在狀態人格報告',
          files: [storyFile]
        });
        return;
      } catch (error) {
        if (error && error.name === 'AbortError') return;
      }
    }

    const hint = $('#storyPreviewHint');
    if (hint) hint.textContent = '此瀏覽器不支援直接分享圖片，請長按圖片儲存到相簿。';
    $('#storyPreviewImage')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  function buildCanvas(report, signature) {
    const hash = hashString(signature);
    const palette = PALETTES[hash % PALETTES.length];
    const variant = Math.floor(hash / PALETTES.length) % 6;
    const copy = COPY[report.type] || {
      headline: report.one || '你的內在地圖，\n正在慢慢展開。',
      sub: report.sections?.[0]?.text || '最近的你，正在學會用更誠實的方式理解自己。',
      strengthTitle: '你的內在力量',
      strength: '敏感、真誠、願意面對自己，也正在慢慢回到穩定。'
    };

    const canvas = document.createElement('canvas');
    canvas.width = 1080;
    canvas.height = 1920;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = palette.bg;
    ctx.fillRect(0, 0, 1080, 1920);
    drawSoftPaper(ctx, palette, variant);
    drawFrame(ctx, palette, variant);

    ctx.fillStyle = palette.ink;
    ctx.font = '400 54px Georgia, "Times New Roman", "Noto Serif TC", serif';
    ctx.fillText('anōra', 136, 178);

    ctx.fillStyle = palette.muted;
    ctx.font = '400 25px Georgia, "Times New Roman", "Noto Serif TC", serif';
    ctx.letterSpacing = '6px';
    ctx.fillText('INNER MAP', 138, 226);
    ctx.font = '400 24px -apple-system, BlinkMacSystemFont, "PingFang TC", sans-serif';
    ctx.fillText('心理地圖分析', 138, 276);
    ctx.letterSpacing = '0px';

    const titleY = variant % 2 === 0 ? 520 : 565;
    ctx.fillStyle = palette.ink;
    ctx.font = '700 75px "Noto Serif TC", "PingFang TC", serif';
    const afterTitleY = wrapTextByLine(ctx, copy.headline, 136, titleY, 828, 104);

    ctx.strokeStyle = palette.accent;
    ctx.globalAlpha = 0.55;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(136, afterTitleY + 28);
    ctx.lineTo(330, afterTitleY + 28);
    ctx.stroke();
    ctx.globalAlpha = 1;

    ctx.fillStyle = palette.ink;
    ctx.font = '400 39px "Noto Serif TC", "PingFang TC", serif';
    wrapParagraph(ctx, copy.sub, 136, afterTitleY + 118, 760, 60, 3);

    const cardY = variant < 3 ? 1375 : 1328;
    ctx.fillStyle = palette.panel;
    roundedRect(ctx, 136, cardY, 808, 205, 24);
    ctx.fill();

    ctx.fillStyle = palette.ink;
    ctx.globalAlpha = 0.92;
    ctx.beginPath();
    ctx.arc(238, cardY + 102, 58, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;

    drawMinimalIcon(ctx, 238, cardY + 102, palette.bg, variant);

    ctx.strokeStyle = palette.muted;
    ctx.globalAlpha = 0.5;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(338, cardY + 48);
    ctx.lineTo(338, cardY + 158);
    ctx.stroke();
    ctx.globalAlpha = 1;

    ctx.fillStyle = palette.ink;
    ctx.font = '500 38px "Noto Serif TC", "PingFang TC", serif';
    ctx.fillText(copy.strengthTitle, 384, cardY + 73);
    ctx.font = '400 27px "Noto Serif TC", "PingFang TC", serif';
    wrapParagraph(ctx, copy.strength, 384, cardY + 120, 480, 42, 2);

    ctx.fillStyle = palette.muted;
    ctx.font = '400 28px Georgia, "Times New Roman", "Noto Serif TC", serif';
    ctx.fillText('anōra INNER MAP', 136, 1738);
    ctx.font = '400 25px "Noto Serif TC", "PingFang TC", serif';
    ctx.fillText('陪你看見內在的真實地圖', 136, 1790);

    ctx.fillStyle = palette.accent;
    ctx.font = '400 21px -apple-system, BlinkMacSystemFont, "PingFang TC", sans-serif';
    ctx.fillText(`TYPE ${String(hash % 60 + 1).padStart(2, '0')} / 60`, 760, 1790);

    return canvas;
  }

  function drawSoftPaper(ctx, palette, variant) {
    const grad = ctx.createLinearGradient(0, 0, 1080, 1920);
    grad.addColorStop(0, 'rgba(255,255,255,0.18)');
    grad.addColorStop(0.55, 'rgba(255,255,255,0)');
    grad.addColorStop(1, 'rgba(0,0,0,0.035)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1080, 1920);

    if (variant === 1 || variant === 4) {
      ctx.fillStyle = 'rgba(52,74,60,0.035)';
      roundedRect(ctx, 650, 250, 520, 1120, 260);
      ctx.fill();
    }
    if (variant === 2 || variant === 5) {
      ctx.fillStyle = 'rgba(200,152,103,0.045)';
      roundedRect(ctx, -180, 1060, 700, 620, 310);
      ctx.fill();
    }
  }

  function drawFrame(ctx, palette, variant) {
    ctx.strokeStyle = palette.ink;
    ctx.globalAlpha = 0.38;
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(78, 120);
    ctx.lineTo(78, 1810);
    ctx.stroke();

    if (variant % 3 === 0) {
      ctx.fillStyle = palette.ink;
      ctx.globalAlpha = 0.9;
      ctx.fillRect(74, 450, 9, 100);
    } else if (variant % 3 === 1) {
      ctx.strokeStyle = palette.accent;
      ctx.globalAlpha = 0.55;
      ctx.beginPath();
      ctx.moveTo(78, 1810);
      ctx.lineTo(930, 1810);
      ctx.stroke();
    } else {
      ctx.fillStyle = palette.accent;
      ctx.globalAlpha = 0.6;
      ctx.fillRect(74, 1450, 9, 92);
    }
    ctx.globalAlpha = 1;
  }

  function drawMinimalIcon(ctx, x, y, color, variant) {
    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (variant % 3 === 0) {
      ctx.beginPath();
      ctx.moveTo(x, y + 34);
      ctx.lineTo(x, y - 34);
      ctx.moveTo(x, y - 6);
      ctx.quadraticCurveTo(x - 38, y - 34, x - 48, y - 2);
      ctx.quadraticCurveTo(x - 24, y + 6, x, y + 18);
      ctx.moveTo(x, y - 10);
      ctx.quadraticCurveTo(x + 42, y - 38, x + 50, y - 4);
      ctx.quadraticCurveTo(x + 20, y + 8, x, y + 22);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x - 45, y + 38);
      ctx.quadraticCurveTo(x, y + 18, x + 45, y + 38);
      ctx.stroke();
    } else if (variant % 3 === 1) {
      ctx.beginPath();
      ctx.arc(x, y, 34, 0, Math.PI * 2);
      ctx.moveTo(x - 18, y + 4);
      ctx.lineTo(x, y - 22);
      ctx.lineTo(x + 18, y + 4);
      ctx.lineTo(x, y + 26);
      ctx.closePath();
      ctx.stroke();
    } else {
      ctx.beginPath();
      ctx.moveTo(x - 36, y);
      ctx.bezierCurveTo(x - 28, y - 32, x + 28, y - 32, x + 36, y);
      ctx.bezierCurveTo(x + 26, y + 34, x - 26, y + 34, x - 36, y);
      ctx.moveTo(x, y - 28);
      ctx.lineTo(x, y + 32);
      ctx.stroke();
    }
  }

  function wrapTextByLine(ctx, text, x, y, maxWidth, lineHeight) {
    let currentY = y;
    String(text || '').split('\n').forEach(line => {
      currentY = wrapParagraph(ctx, line, x, currentY, maxWidth, lineHeight, 2);
    });
    return currentY;
  }

  function wrapParagraph(ctx, text, x, y, maxWidth, lineHeight, maxLines = 99) {
    const chars = String(text || '').replace(/\n+/g, ' ').split('');
    let line = '';
    let currentY = y;
    let lines = 0;
    for (const char of chars) {
      const testLine = line + char;
      if (ctx.measureText(testLine).width > maxWidth && line) {
        ctx.fillText(line, x, currentY);
        lines += 1;
        if (lines >= maxLines) return currentY + lineHeight;
        line = char;
        currentY += lineHeight;
      } else {
        line = testLine;
      }
    }
    if (line && lines < maxLines) ctx.fillText(line, x, currentY);
    return currentY + lineHeight;
  }

  function roundedRect(ctx, x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.arcTo(x + width, y, x + width, y + height, radius);
    ctx.arcTo(x + width, y + height, x, y + height, radius);
    ctx.arcTo(x, y + height, x, y, radius);
    ctx.arcTo(x, y, x + width, y, radius);
    ctx.closePath();
  }

  function hashString(str) {
    let hash = 2166136261;
    for (let i = 0; i < str.length; i++) {
      hash ^= str.charCodeAt(i);
      hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
    }
    return Math.abs(hash >>> 0);
  }

  document.addEventListener('click', shareStoryImage, true);
  const observer = new MutationObserver(() => setTimeout(buildAndShowStoryImage, 250));
  window.addEventListener('DOMContentLoaded', () => {
    const result = $('#result');
    if (result) observer.observe(result, { attributes: true, attributeFilter: ['class'], subtree: true, childList: true });
    setTimeout(buildAndShowStoryImage, 500);
  });
})();