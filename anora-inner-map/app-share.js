(() => {
  const $ = s => document.querySelector(s);

  let lastSignature = '';

  const COPY = {
    '硬撐責任型': {
      title: '你不是不累。\n你只是太習慣把事情扛起來。',
      sub: '最近的你，很多事情沒有人叫你扛，\n但你就是放不下。',
      power: '可靠、穩定、責任感強，\n也正在學習把自己留下來。'
    },

    '假裝不在意型': {
      title: '你不是冷淡。\n你只是太久沒有被好好理解。',
      sub: '最近的你，\n習慣先消化情緒，\n再假裝自己沒事。',
      power: '清醒、敏銳、有界線，\n也比自己以為的更需要支持。'
    },

    '反覆重播型': {
      title: '你不是想太多。\n你只是太容易被細節留下。',
      sub: '最近的你，常常被一句話、一個語氣，\n拖進很長的反覆思考裡。',
      power: '敏感、細膩、共感力強，\n也能看見別人忽略的情緒。'
    }
  };

  function isVisible() {
    const result = $('#result');
    return result && !result.classList.contains('hidden');
  }

  function getSignature() {
    return (
      ($('#archetypeName')?.innerText || '') +
      ($('#reportContent')?.innerText || '')
    );
  }

  function getCopy() {
    const type = $('#archetypeName')?.innerText.trim() || '';

    return (
      COPY[type] || {
        title: '你的內在地圖。\n正在慢慢展開。',
        sub: '最近的你，正在學會\n用更誠實的方式理解自己。',
        power: '敏感、真誠、願意面對自己，\n也正在慢慢回到穩定。'
      }
    );
  }

  function renderCard() {
    if (!isVisible()) return;

    const sig = getSignature();

    if (!sig || sig === lastSignature) return;

    lastSignature = sig;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    canvas.width = 1080;
    canvas.height = 1920;

    const bg = '#F4EEE4';
    const ink = '#2F473A';
    const panel = '#E5DFD2';

    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, 1080, 1920);

    const grad = ctx.createLinearGradient(0, 0, 1080, 1920);

    grad.addColorStop(0, 'rgba(255,255,255,.25)');
    grad.addColorStop(1, 'rgba(47,71,58,.05)');

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1080, 1920);

    ctx.strokeStyle = ink;
    ctx.globalAlpha = .35;
    ctx.lineWidth = 1.3;

    ctx.beginPath();
    ctx.moveTo(82, 115);
    ctx.lineTo(82, 1785);
    ctx.stroke();

    ctx.globalAlpha = 1;

    ctx.fillStyle = ink;

    ctx.fillRect(76, 450, 12, 118);

    ctx.font = '400 62px Georgia';

    ctx.fillText('anōra', 160, 175);

    ctx.font = '400 27px Georgia';

    ctx.fillText('I N N E R   M A P', 160, 225);

    const copy = getCopy();

    ctx.font = '700 72px PingFang TC';

    multiline(
      ctx,
      copy.title,
      160,
      520,
      800,
      106
    );

    ctx.strokeStyle = ink;
    ctx.globalAlpha = .45;
    ctx.lineWidth = 2;

    ctx.beginPath();

    ctx.moveTo(160, 860);
    ctx.lineTo(335, 860);

    ctx.stroke();

    ctx.globalAlpha = 1;

    ctx.font = '400 40px PingFang TC';

    multiline(
      ctx,
      copy.sub,
      160,
      960,
      730,
      64
    );

    ctx.fillStyle = panel;

    roundRect(
      ctx,
      150,
      1370,
      780,
      210,
      24
    );

    ctx.fill();

    ctx.fillStyle = ink;

    ctx.font = '500 38px PingFang TC';

    ctx.fillText(
      '你的內在力量',
      410,
      1446
    );

    ctx.font = '400 28px PingFang TC';

    multiline(
      ctx,
      copy.power,
      410,
      1492,
      430,
      42
    );

    ctx.font = '400 30px Georgia';

    ctx.fillText(
      'anōra INNER MAP',
      160,
      1730
    );

    ctx.font = '400 27px PingFang TC';

    ctx.fillText(
      '陪你看見內在的真實地圖',
      160,
      1785
    );

    const url = canvas.toDataURL('image/png');

    let wrap = $('#storyCardWrap');

    if (!wrap) {
      wrap = document.createElement('div');

      wrap.id = 'storyCardWrap';

      wrap.style.cssText =
        'max-width:420px;margin:0 auto 24px;text-align:center;';

      wrap.innerHTML = `
        <img
          id="storyCardImg"
          style="
            width:100%;
            border-radius:22px;
            box-shadow:0 18px 48px rgba(0,0,0,.16);
          "
        >

        <p style="
          margin:12px 0 0;
          color:#f3e6de;
          font-size:14px;
          opacity:.85;
        ">
          長按圖片即可儲存
        </p>
      `;

      $('#reportPaper')
        ?.parentNode
        ?.insertBefore(wrap, $('#reportPaper'));
    }

    $('#storyCardImg').src = url;

    const paper = $('#reportPaper');

    if (paper) {
      paper.style.display = 'none';
    }
  }

  function multiline(
    ctx,
    text,
    x,
    y,
    maxWidth,
    lineHeight
  ) {
    let currentY = y;

    String(text)
      .split('\n')
      .forEach(line => {
        currentY = wrap(
          ctx,
          line,
          x,
          currentY,
          maxWidth,
          lineHeight
        );
      });
  }

  function wrap(
    ctx,
    text,
    x,
    y,
    maxWidth,
    lineHeight
  ) {
    let line = '';
    let currentY = y;

    for (const ch of text) {
      const test = line + ch;

      if (
        ctx.measureText(test).width > maxWidth &&
        line
      ) {
        ctx.fillText(line, x, currentY);

        line = ch;

        currentY += lineHeight;
      } else {
        line = test;
      }
    }

    if (line) {
      ctx.fillText(line, x, currentY);
    }

    return currentY + lineHeight;
  }

  function roundRect(
    ctx,
    x,
    y,
    width,
    height,
    radius
  ) {
    ctx.beginPath();

    ctx.moveTo(x + radius, y);

    ctx.arcTo(
      x + width,
      y,
      x + width,
      y + height,
      radius
    );

    ctx.arcTo(
      x + width,
      y + height,
      x,
      y + height,
      radius
    );

    ctx.arcTo(
      x,
      y + height,
      x,
      y,
      radius
    );

    ctx.arcTo(
      x,
      y,
      x + width,
      y,
      radius
    );

    ctx.closePath();
  }

  const observer = new MutationObserver(() => {
    setTimeout(renderCard, 250);
  });

  window.addEventListener('DOMContentLoaded', () => {
    const result = $('#result');

    if (result) {
      observer.observe(result, {
        attributes: true,
        attributeFilter: ['class'],
        subtree: true,
        childList: true
      });
    }

    setTimeout(renderCard, 500);
  });
})();
