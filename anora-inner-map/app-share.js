(() => {
  let storyBlob = null;
  let storyFile = null;
  let storyDataUrl = '';
  let lastSignature = '';

  function $(selector) { return document.querySelector(selector); }
  function $all(selector) { return Array.from(document.querySelectorAll(selector)); }

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

    const canvas = buildCanvas(getReportData());
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
      img.style.cssText = 'width:100%;height:auto;display:block;border-radius:24px;box-shadow:0 18px 48px rgba(0,0,0,.26);-webkit-touch-callout:default;user-select:auto;-webkit-user-select:auto;';

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

  function buildCanvas(report) {
    const canvas = document.createElement('canvas');
    canvas.width = 1080;
    canvas.height = 1920;
    const ctx = canvas.getContext('2d');
    const green = '#3C5343';
    const gold = '#C89867';
    const cream = '#F3E6DE';
    const muted = '#E8D6C8';

    ctx.fillStyle = green;
    ctx.fillRect(0, 0, 1080, 1920);

    const gradient = ctx.createRadialGradient(950, 120, 10, 950, 120, 780);
    gradient.addColorStop(0, 'rgba(200,152,103,0.20)');
    gradient.addColorStop(1, 'rgba(60,83,67,0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 1080, 1920);

    ctx.strokeStyle = 'rgba(243,230,222,0.13)';
    ctx.lineWidth = 2;
    roundedRect(ctx, 68, 68, 944, 1784, 46);
    ctx.stroke();

    ctx.fillStyle = cream;
    ctx.font = '500 46px -apple-system, BlinkMacSystemFont, "PingFang TC", sans-serif';
    ctx.fillText('anōra', 104, 145);

    ctx.fillStyle = gold;
    ctx.font = '500 20px -apple-system, BlinkMacSystemFont, "PingFang TC", sans-serif';
    ctx.fillText('INNER MAP REPORT', 104, 188);
    ctx.fillRect(104, 245, 72, 5);

    ctx.fillStyle = cream;
    ctx.font = '700 58px -apple-system, BlinkMacSystemFont, "PingFang TC", sans-serif';
    wrapText(ctx, report.type, 104, 330, 860, 70);

    ctx.fillStyle = muted;
    ctx.font = '500 30px -apple-system, BlinkMacSystemFont, "PingFang TC", sans-serif';
    let y = wrapText(ctx, report.one, 104, 440, 860, 45) + 28;

    if (report.keyword) {
      ctx.fillStyle = 'rgba(243,230,222,0.10)';
      roundedRect(ctx, 104, y, 872, 72, 22);
      ctx.fill();
      ctx.fillStyle = gold;
      ctx.font = '600 24px -apple-system, BlinkMacSystemFont, "PingFang TC", sans-serif';
      wrapText(ctx, `關鍵字｜${report.keyword}`, 132, y + 44, 812, 32);
      y += 112;
    }

    ctx.fillStyle = 'rgba(200,152,103,0.14)';
    roundedRect(ctx, 104, y, 872, 1050, 34);
    ctx.fill();

    y += 62;
    report.sections.forEach(section => {
      if (y > 1570) return;
      ctx.fillStyle = gold;
      ctx.font = '700 23px -apple-system, BlinkMacSystemFont, "PingFang TC", sans-serif';
      y = wrapText(ctx, section.title, 142, y, 796, 31) + 6;
      ctx.fillStyle = cream;
      ctx.font = '500 25px -apple-system, BlinkMacSystemFont, "PingFang TC", sans-serif';
      const compact = section.text.replace(/\n+/g, ' ');
      y = wrapText(ctx, compact, 142, y, 796, 36) + 20;
    });

    ctx.fillStyle = cream;
    ctx.font = '600 28px -apple-system, BlinkMacSystemFont, "PingFang TC", sans-serif';
    wrapText(ctx, '如果這份報告有說中你，歡迎分享到限動，標記 @anora___shop。', 104, 1745, 872, 40);

    ctx.fillStyle = gold;
    ctx.font = '500 23px -apple-system, BlinkMacSystemFont, "PingFang TC", sans-serif';
    ctx.fillText('anōra Studio & Store｜水晶・能量・療癒選物', 104, 1835);

    return canvas;
  }

  function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
    const chars = String(text || '').split('');
    let line = '';
    let currentY = y;
    chars.forEach(char => {
      const testLine = line + char;
      if (ctx.measureText(testLine).width > maxWidth && line) {
        ctx.fillText(line, x, currentY);
        line = char;
        currentY += lineHeight;
      } else {
        line = testLine;
      }
    });
    if (line) ctx.fillText(line, x, currentY);
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

  document.addEventListener('click', shareStoryImage, true);
  const observer = new MutationObserver(() => setTimeout(buildAndShowStoryImage, 250));
  window.addEventListener('DOMContentLoaded', () => {
    const result = $('#result');
    if (result) observer.observe(result, { attributes: true, attributeFilter: ['class'], subtree: true, childList: true });
    setTimeout(buildAndShowStoryImage, 500);
  });
})();