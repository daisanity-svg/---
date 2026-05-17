const questions = [
  { title: '最近的你，比較常是哪一種？', answers: [
    { text: '手機亮了，會下意識立刻看。', type: 'attachment' },
    { text: '很想休息，但停下來會有罪惡感。', type: 'pressure' },
    { text: '開始不太想解釋自己。', type: 'lonely' },
    { text: '白天沒事，晚上情緒突然很重。', type: 'suppressed' }
  ]},
  { title: '哪個畫面最像你最近的狀態？', answers: [
    { text: '點開對話框，看一下，又關掉。', type: 'attachment' },
    { text: '明明不舒服，第一句還是「沒關係」。', type: 'caretaker' },
    { text: '腦中一直重播某句話，停不下來。', type: 'sensitive' },
    { text: '把事情排得很滿，因為一空下來就會慌。', type: 'pressure' }
  ]},
  { title: '你最常卡在哪個瞬間？', answers: [
    { text: '對方語氣一變，你就開始想自己是不是講錯。', type: 'sensitive' },
    { text: '很想拒絕，但怕對方失望。', type: 'caretaker' },
    { text: '想改變，但不知道第一步該放在哪。', type: 'fog' },
    { text: '想講真話，但又怕講了關係會變。', type: 'defense' }
  ]},
  { title: '最近比較像哪一種累？', answers: [
    { text: '不是身體累，是心一直沒有安靜。', type: 'sensitive' },
    { text: '不是事情多，是每件事都像只能靠自己。', type: 'pressure' },
    { text: '不是想哭，是覺得沒人會真的懂。', type: 'lonely' },
    { text: '不是放不下，是還在等一個答案。', type: 'attachment' }
  ]},
  { title: '如果誠實一點，你最近最常出現的是？', answers: [
    { text: '有點希望有人主動來找自己。', type: 'attachment' },
    { text: '覺得自己好像一直在替別人收拾情緒。', type: 'caretaker' },
    { text: '明明想往前，卻又不知道自己要什麼。', type: 'fog' },
    { text: '很怕一放鬆，事情就會失控。', type: 'control' }
  ]},
  { title: '哪一句最像你心裡沒有說出口的話？', answers: [
    { text: '其實我也想被好好照顧一次。', type: 'caretaker' },
    { text: '我不是不在意，我只是不想表現出來。', type: 'defense' },
    { text: '我真的很累，但我不知道怎麼停。', type: 'pressure' },
    { text: '我只是太久沒有安心了。', type: 'stability' }
  ]},
  { title: '你最近最常做的事，比較像？', answers: [
    { text: '截圖、重看、反覆想對方到底什麼意思。', type: 'sensitive' },
    { text: '把很多事自己扛下來，然後裝沒事。', type: 'suppressed' },
    { text: '把行程、計畫、細節都想好，才敢安心。', type: 'control' },
    { text: '突然很想消失一下，不想回任何人。', type: 'lonely' }
  ]},
  { title: '接下來你最想從哪種狀態裡走出來？', answers: [
    { text: '一直猜對方心裡有沒有我。', type: 'attachment' },
    { text: '一直替別人想，卻忘記自己。', type: 'caretaker' },
    { text: '一直害怕選錯，所以什麼都沒開始。', type: 'fog' },
    { text: '一直忍到最後，才發現自己快不行了。', type: 'suppressed' }
  ]}
];

const archetypes = {
  sensitive: { name: '反覆重播型', one: '你不是想太多。你只是很容易被一句話留住。', keyword: '語氣／細節／一直想' },
  pressure: { name: '硬撐責任型', one: '你不是不累。你只是太習慣把事情扛起來。', keyword: '責任／不能停／自己來' },
  fog: { name: '卡在轉彎型', one: '你不是沒有方向。你只是站在舊生活和新生活中間。', keyword: '迷惘／想改變／不知道第一步' },
  suppressed: { name: '把話吞回去型', one: '你不是沒情緒。你只是太常說算了。', keyword: '沒關係／忍住／吞下去' },
  caretaker: { name: '先顧別人型', one: '你很會照顧別人。只是很少有人照顧你。', keyword: '體貼／怕失望／忘記自己' },
  attachment: { name: '等一個確定型', one: '你不是要很多。你只是想被堅定放在心上。', keyword: '對話框／已讀／安全感' },
  control: { name: '怕失控預演型', one: '你不是愛控制。你只是太怕事情突然壞掉。', keyword: '預想／細節／不敢放鬆' },
  defense: { name: '假裝不在意型', one: '你看起來很冷靜。其實只是很怕先受傷。', keyword: '防衛／冷靜／裝沒事' },
  lonely: { name: '安靜消化型', one: '你不是不需要人。你只是太習慣自己消化。', keyword: '不解釋／消失一下／沒人懂' },
  stability: { name: '慢慢安心型', one: '你不是害怕改變。你只是需要先確定自己不會被丟下。', keyword: '穩定／退路／慢慢來' }
};

const typeModules = {
  sensitive: {
    core: ['對方只是回得冷一點。\n\n你心裡已經跑完很多版本。', '你很容易被一句話留住。\n\n不是因為那句話多重要。\n\n是你會一直想：他是不是有別的意思。'],
    stuck: ['你最近卡住的，不是事情本身。\n\n是你一直在回想細節。'],
    pattern: ['你會先檢討自己。\n\n哪怕對方其實沒有說你錯。'],
    blind: ['不是每一個語氣變化，都跟你有關。'],
    strength: ['你其實很會看細節。\n\n只是別再每次都拿來懲罰自己。'],
    next: ['下一次開始亂想時，先停一下。\n\n問自己：這是事實，還是我最害怕的劇情？']
  },
  pressure: {
    core: ['你很常一邊說可以。\n\n一邊其實已經快不行了。', '很多事情沒有人叫你扛。\n\n但你就是放不下。'],
    stuck: ['你卡住的地方，是一直覺得自己還能再撐一下。'],
    pattern: ['別人沒想到的，你會補。\n\n別人沒收好的，你會收。'],
    blind: ['你不需要累到壞掉，才算盡力。'],
    strength: ['你很可靠。\n\n但可靠不代表要一直被消耗。'],
    next: ['接下來，少接一件不是非你不可的事。\n\n先把自己留下來。']
  },
  fog: {
    core: ['你不是沒有方向。\n\n是原本的方向，已經不太能說服你了。', '你不是停住。\n\n你是在轉彎。'],
    stuck: ['你卡住的，是想改變，卻不知道從哪裡開始。'],
    pattern: ['你會想很多可能。\n\n想到最後，反而什麼都沒有開始。'],
    blind: ['有些方向，是走了才清楚。'],
    strength: ['你其實正在更新。\n\n不是壞掉。'],
    next: ['先做一件很小的事。\n\n小到不會害怕。\n\n但足夠讓你開始往前。']
  },
  suppressed: {
    core: ['你很常說沒事。\n\n但其實根本不是沒事。', '很多話到了嘴邊。\n\n最後變成一句算了。'],
    stuck: ['你卡住的，是那些沒有說出口的失望。'],
    pattern: ['你怕造成麻煩。\n\n所以最後都麻煩自己。'],
    blind: ['沉默不一定是成熟。\n\n有時候只是委屈。'],
    strength: ['你很能撐。\n\n但能撐，不代表應該一直撐。'],
    next: ['找一件小事說出來。\n\n不是為了吵架。\n\n是讓自己被聽見。']
  },
  caretaker: {
    core: ['你很常先顧別人的情緒。\n\n最後才想到自己。', '你嘴巴說沒關係。\n\n其實心裡已經有點失望。'],
    stuck: ['你累的不是付出。\n\n是付出了，卻沒有人真的看見。'],
    pattern: ['你會先想對方會不會難過。\n\n再決定自己要不要說真話。'],
    blind: ['被需要，不等於被愛。'],
    strength: ['你的溫柔是真的。\n\n但不要讓它變成消耗。'],
    next: ['答應之前，先停三秒。\n\n問自己：我是願意，還是不敢拒絕？']
  },
  attachment: {
    core: ['你會點開對話框。\n\n看一下。\n\n又關掉。', '你不是要很多。\n\n你只是想被堅定選擇。'],
    stuck: ['你卡住的，是對方沒有明說。\n\n你也沒有真的放下。'],
    pattern: ['你會假裝沒事。\n\n但其實一直在等對方主動。'],
    blind: ['不要用一個人的回覆速度，判斷你的價值。'],
    strength: ['你很真誠。\n\n只是別把真誠交給一直讓你不安的人。'],
    next: ['問自己一句：\n\n我在這段關係裡，真的安心嗎？']
  },
  control: {
    core: ['你不是愛控制。\n\n你只是很怕突然失控。'],
    stuck: ['你卡住的，是每件事都想做到不出錯。'],
    pattern: ['你會把事情排好。\n\n也會把自己逼很緊。'],
    blind: ['不完美，不一定會毀掉結果。'],
    strength: ['你很能把混亂整理好。\n\n這是能力，不該變成壓力。'],
    next: ['選一件小事，讓它不用完美。\n\n世界不會因此崩掉。']
  },
  defense: {
    core: ['你看起來很冷靜。\n\n其實只是很怕受傷。'],
    stuck: ['你卡住的，是明明在意，卻一直演得很淡。'],
    pattern: ['你會先觀察。\n\n再決定要不要打開自己。'],
    blind: ['保護自己沒有錯。\n\n但不要把自己關太久。'],
    strength: ['你很清醒。\n\n也不容易被漂亮話騙走。'],
    next: ['對一個相對安全的人，多說一點真話。\n\n一點點就好。']
  },
  lonely: {
    core: ['你不是不需要人。\n\n你只是太習慣自己消化。'],
    stuck: ['你卡住的，是很多事都只能自己吞下去。'],
    pattern: ['你會保持距離。\n\n不是高傲，是不想再失望。'],
    blind: ['不是所有靠近，都是打擾。'],
    strength: ['你很清醒。\n\n也很有自己的判斷。'],
    next: ['讓一個人多看見你一點。\n\n不用很多。\n\n一點點就好。']
  },
  stability: {
    core: ['你不是害怕改變。\n\n你只是需要慢一點。'],
    stuck: ['你卡住的，是一直在不確定裡找安全感。'],
    pattern: ['你會先想後果。\n\n再決定要不要開始。'],
    blind: ['改變也可以很小。\n\n也可以很慢。'],
    strength: ['你很能長期經營。\n\n只要找到節奏，就不容易放棄。'],
    next: ['先做一個小改變。\n\n小到不害怕。\n\n但足夠讓你知道：我可以往前。']
  }
};

let current = 0;
const answers = [];

function $(selector) { return document.querySelector(selector); }
function $all(selector) { return Array.from(document.querySelectorAll(selector)); }

const quiz = $('#quiz');
const loading = $('#loading');
const result = $('#result');
const questionCard = $('#questionCard');

$all('[data-start]').forEach((btn) => {
  btn.addEventListener('click', () => {
    $all('.landing-section').forEach(section => section.classList.add('hidden'));
    quiz.classList.remove('hidden');
    current = 0;
    answers.length = 0;
    renderQuestion();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
});

$('[data-prev]')?.addEventListener('click', () => {
  if (current > 0) {
    current--;
    renderQuestion();
  }
});

$('[data-restart]')?.addEventListener('click', () => window.location.reload());

$('[data-download]')?.addEventListener('click', () => {
  const element = $('#reportPaper');
  if (!window.html2pdf || !element) return;
  html2pdf().set({
    margin: 10,
    filename: 'anora-inner-map-report.pdf',
    image: { type: 'jpeg', quality: .98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
  }).from(element).save();
});

function renderQuestion() {
  const q = questions[current];
  $('#stepLabel').innerText = `${current + 1} / ${questions.length}`;
  $('#progressText').innerText = '生活切片選擇';
  $('#progressFill').style.width = `${((current + 1) / questions.length) * 100}%`;
  questionCard.innerHTML = `<h2>${q.title}</h2><div class="answers">${q.answers.map((a, i) => `<button class="answer-btn" data-index="${i}">${a.text}</button>`).join('')}</div>`;
  $all('.answer-btn').forEach((btn, index) => {
    btn.addEventListener('click', () => {
      answers[current] = q.answers[index].type;
      if (current < questions.length - 1) {
        current++;
        renderQuestion();
      } else {
        finishQuiz();
      }
    });
  });
}

function finishQuiz() {
  quiz.classList.add('hidden');
  loading.classList.remove('hidden');
  window.scrollTo({ top: 0, behavior: 'smooth' });
  setTimeout(() => {
    loading.classList.add('hidden');
    result.classList.remove('hidden');
    generateReport();
  }, 900);
}

function generateReport() {
  const counts = {};
  answers.forEach(a => counts[a] = (counts[a] || 0) + 1);
  const dominant = Object.keys(counts).sort((a, b) => counts[b] - counts[a])[0] || 'sensitive';
  const data = archetypes[dominant] || archetypes.sensitive;
  const pack = typeModules[dominant] || typeModules.sensitive;

  $('#archetypeName').innerText = data.name;
  $('#archetypeOneLiner').innerText = data.one;
  $('#reportSubtitle').innerText = `關鍵字：${data.keyword}`;
  $('#reportDate').innerText = new Date().toLocaleDateString('zh-TW');
  $('#reportCode').innerText = 'Report #' + Math.random().toString(36).substring(2, 8).toUpperCase();

  const sections = [
    { title: '你最近真正的狀態', text: pick(pack.core) },
    { title: '你卡住的地方', text: pick(pack.stuck) },
    { title: '你反覆出現的樣子', text: pick(pack.pattern) },
    { title: '你需要看見的一句話', text: pick(pack.blind) },
    { title: '其實你不是沒有力量', text: pick(pack.strength) },
    { title: '接下來 30 天', text: pick(pack.next) },
    { title: '給現在的你', text: '你不用立刻變好。\n\n也不用馬上有答案。\n\n先把自己放回來。\n\n這就已經是開始。' }
  ];

  $('#reportContent').innerHTML = sections.map(section => `<section><h4>${section.title}</h4><p>${section.text.replace(/\n/g, '<br>')}</p></section>`).join('');
}

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}
