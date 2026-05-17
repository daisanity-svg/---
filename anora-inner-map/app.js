const questions = [
  { id: 'q1', title: '最近的你，最像哪一句？', answers: [
    { text: '明明很努力，卻還是卡住', type: 'pressure' },
    { text: '很想改變，但不知道從哪裡開始', type: 'fog' },
    { text: '表面沒事，其實很累', type: 'suppressed' },
    { text: '一直在顧別人的感受', type: 'caretaker' }
  ]},
  { id: 'q2', title: '你最近最怕的是？', answers: [
    { text: '被忽略，或不再被需要', type: 'attachment' },
    { text: '事情失控，不在自己掌握裡', type: 'control' },
    { text: '改變太快，來不及準備', type: 'stability' },
    { text: '被人看見真正脆弱的那一面', type: 'defense' }
  ]},
  { id: 'q3', title: '在人際裡，你比較像？', answers: [
    { text: '先理解別人，再處理自己', type: 'caretaker' },
    { text: '看起來冷靜，其實心裡很多話', type: 'defense' },
    { text: '很多事都自己消化', type: 'lonely' },
    { text: '對語氣和態度的變化很敏感', type: 'sensitive' }
  ]},
  { id: 'q4', title: '最近最消耗你的感覺是？', answers: [
    { text: '一直想，停不下來', type: 'sensitive' },
    { text: '不能倒下，只能繼續撐', type: 'pressure' },
    { text: '不知道自己到底要去哪裡', type: 'fog' },
    { text: '很想說，但最後還是吞回去', type: 'suppressed' }
  ]},
  { id: 'q5', title: '你最想被理解的是？', answers: [
    { text: '我不是不努力，我是真的累了', type: 'pressure' },
    { text: '我不是想太多，我只是很容易感覺到變化', type: 'sensitive' },
    { text: '我不是沒情緒，我只是不知道怎麼說', type: 'suppressed' },
    { text: '我只是太久沒有真正安心了', type: 'attachment' }
  ]},
  { id: 'q6', title: '如果選一個最近的狀態？', answers: [
    { text: '想靠近，但又怕自己太需要對方', type: 'attachment' },
    { text: '想把事情做好，所以很難放鬆', type: 'control' },
    { text: '想離開舊狀態，但還沒找到新方向', type: 'fog' },
    { text: '很多話到了嘴邊，最後還是算了', type: 'suppressed' }
  ]},
  { id: 'q7', title: '你最常對自己說的是？', answers: [
    { text: '再撐一下就好了', type: 'pressure' },
    { text: '不要麻煩別人', type: 'lonely' },
    { text: '是不是我哪裡做得不夠好', type: 'sensitive' },
    { text: '算了，先顧好大家的感受', type: 'caretaker' }
  ]},
  { id: 'q8', title: '接下來你最想要的是？', answers: [
    { text: '穩一點，不要再反覆內耗', type: 'stability' },
    { text: '重新相信自己值得被好好對待', type: 'attachment' },
    { text: '找回方向和行動感', type: 'fog' },
    { text: '不用再什麼都自己扛', type: 'pressure' }
  ]}
];

const archetypes = {
  sensitive: { name: '高敏感觀察型', one: '你不是想太多。你只是太早感覺到變化。', keyword: '敏銳／反覆想／怕自己做錯' },
  pressure: { name: '過度責任型', one: '你不是不累。你只是很習慣撐住。', keyword: '責任／硬撐／不能倒下' },
  fog: { name: '轉變迷霧型', one: '你不是沒有方向。你只是正在離開舊的自己。', keyword: '迷惘／轉折／想重來' },
  suppressed: { name: '情緒壓抑型', one: '你不是沒情緒。你只是太會忍。', keyword: '吞下去／算了／沒說出口' },
  caretaker: { name: '討好照顧型', one: '你很會照顧別人。只是常常忘了自己。', keyword: '體貼／退讓／怕別人失望' },
  attachment: { name: '關係不安型', one: '你要的不是很多。你只是想被堅定選擇。', keyword: '安全感／確認／怕被丟下' },
  control: { name: '完美控制型', one: '你不是愛控制。你只是太怕失控。', keyword: '標準／預想／放不下' },
  defense: { name: '理性防衛型', one: '你看起來很冷靜。其實只是很怕受傷。', keyword: '距離／防衛／假裝不在意' },
  lonely: { name: '孤獨清醒型', one: '你不是不需要人。你只是太習慣一個人。', keyword: '清醒／距離／自己消化' },
  stability: { name: '安全感需求型', one: '你不是害怕改變。你只是需要慢一點。', keyword: '穩定／熟悉／慢慢來' }
};

const typeModules = {
  sensitive: {
    core: ['對方一冷淡。\n\n你就開始檢討自己。', '你很容易記得別人一句話。\n\n尤其是那種聽起來不太對勁的語氣。', '很多人還沒發現氣氛變了。\n\n你已經先感覺到了。'],
    stuck: ['你最累的不是敏感。\n\n是每次感覺到變化，都會先懷疑是不是自己做錯。', '你常常不是被事情傷到。\n\n是被自己腦中反覆重播的細節傷到。'],
    pattern: ['你會替對方找理由。\n\n然後把委屈留給自己。', '你明明很想問清楚。\n\n但又怕自己看起來太在意。'],
    blind: ['不是每個冷淡，都是你的問題。', '有些人的忽冷忽熱，不值得你整晚睡不好。'],
    strength: ['你的敏銳不是缺點。\n\n只是以前太常拿來傷自己。', '你其實很會看人。\n\n只是有時候太快先檢討自己。'],
    next: ['下一次不安的時候，先不要急著補故事。\n\n先問自己：我看到的是事實，還是我最害怕的版本？']
  },
  pressure: {
    core: ['很多事情，根本沒有人要求你扛。\n\n是你自己不敢倒下。', '你不是不累。\n\n你只是太習慣說「我可以」。', '你最常安慰別人。\n\n但很少有人問你撐不撐得住。'],
    stuck: ['你真正累的，是永遠都覺得自己還不夠好。', '你已經做很多了。\n\n只是你很少允許自己停下來。'],
    pattern: ['別人沒想到的，你會先想到。\n\n別人沒收好的，你會默默補上。', '你很少開口說累。\n\n因為你覺得說了也沒用。'],
    blind: ['你不用把自己累壞，才證明你有價值。', '不是每一件事，都該由你收尾。'],
    strength: ['你很可靠。\n\n但可靠不代表要一直被消耗。', '你有把混亂整理好的能力。\n\n只是別再用這個能力困住自己。'],
    next: ['接下來，少接一件不是非你不可的事。\n\n你不需要靠硬撐，證明你值得被信任。']
  },
  fog: {
    core: ['你不是沒有方向。\n\n你只是對原本的生活，開始沒辦法再說服自己。', '你想往前。\n\n但又不知道哪一步才是真的。', '你不是停住。\n\n你是在重整。'],
    stuck: ['最累的是，你知道自己想改變。\n\n卻不知道該從哪裡開始。', '你不是懶。\n\n你只是卡在太多可能性裡。'],
    pattern: ['你會一直想，如果選錯怎麼辦。', '你常常等一個很明確的答案。\n\n但答案一直沒有出現。'],
    blind: ['有些方向，不是想出來的。\n\n是走了才慢慢清楚。', '你不用一次變成新的自己。'],
    strength: ['你其實很有轉換能力。\n\n只是現在還在過渡期。', '你不是崩壞。\n\n你是在更新。'],
    next: ['先做一件小事就好。\n\n整理房間、完成一件小計畫、把作息拉回來。\n\n方向會從行動裡慢慢回來。']
  },
  suppressed: {
    core: ['你很常說沒事。\n\n但其實根本不是沒事。', '很多話到了嘴邊。\n\n你最後還是吞回去。', '你不是沒情緒。\n\n你只是太會忍。'],
    stuck: ['你最累的，是那些沒說出口的失望。', '你一直告訴自己算了。\n\n但心裡其實都有記得。'],
    pattern: ['你看起來很穩。\n\n只是沒有人知道你裡面已經很亂。', '你不想造成別人的負擔。\n\n所以最後都變成自己的負擔。'],
    blind: ['沉默不一定是成熟。\n\n有時候只是你太委屈自己。', '你不需要每一次都忍到沒感覺。'],
    strength: ['你其實很能撐。\n\n但能撐，不代表應該一直撐。', '你的心很厚。\n\n只是也需要被好好放下來。'],
    next: ['這 30 天，請你練習說一次「我不太舒服」。\n\n不是為了吵架。\n\n是為了讓自己被聽見。']
  },
  caretaker: {
    core: ['你很會照顧別人的情緒。\n\n但很多時候，沒有人照顧你的。', '你嘴巴說沒關係。\n\n其實心裡已經有點失望。', '你很常先想到別人。\n\n最後才想到自己。'],
    stuck: ['你累的不是付出。\n\n是付出了，卻沒有人真的看見。', '你不是不想拒絕。\n\n你只是怕對方失望。'],
    pattern: ['你會把對方的感受排在前面。\n\n然後把自己的需要往後放。', '你很常替別人解釋。\n\n也很常替自己委屈。'],
    blind: ['被需要，不等於被愛。', '真正好的關係，不會因為你少付出一點就散掉。'],
    strength: ['你的溫柔是真的。\n\n但不要讓它變成委屈。', '你很懂人的脆弱。\n\n也該有人懂你的。'],
    next: ['下次答應之前，先停三秒。\n\n問自己：我是真的想做，還是怕對方不高興？']
  },
  attachment: {
    core: ['你不是要很多。\n\n你只是想被堅定地選擇。', '對方一忽冷忽熱。\n\n你就開始懷疑自己。', '你不是太黏。\n\n你只是太久沒有安心。'],
    stuck: ['你放不下的，可能不是那個人。\n\n是那段關係裡，曾經讓你覺得自己值得被愛的感覺。', '你最怕的不是失去。\n\n是又一次證明自己沒有被放在心上。'],
    pattern: ['你會假裝沒事。\n\n但其實一直在等對方給一個明確訊號。', '你很想靠近。\n\n又怕自己看起來太需要。'],
    blind: ['不要用別人的回覆速度，判斷自己的價值。', '真正適合你的人，不會讓你一直靠猜。'],
    strength: ['你其實很真誠。\n\n愛一個人的時候，也真的願意經營。', '你不是脆弱。\n\n你只是把關係看得很重。'],
    next: ['把注意力拉回自己。\n\n問一句：我在這段關係裡，真的安心嗎？']
  },
  control: {
    core: ['你不是愛控制。\n\n你只是很怕事情失控。', '只要有一點不確定。\n\n你心裡就很難放鬆。', '你常常想很多步。\n\n因為你不想讓自己措手不及。'],
    stuck: ['你累的不是事情多。\n\n是你覺得每一件都不能出錯。', '你很難放心交給別人。\n\n因為你總覺得最後還是要自己收。'],
    pattern: ['你會把細節整理好。\n\n也會把自己逼得很緊。', '你不是真的不能放鬆。\n\n是放鬆會讓你不安心。'],
    blind: ['不完美，不一定會毀掉結果。', '你不用每一次都提前預防所有壞事。'],
    strength: ['你很有秩序感。\n\n也很能把混亂拉回來。', '你的標準很高。\n\n只是別讓標準變成懲罰自己的方式。'],
    next: ['選一件小事，讓它不用完美。\n\n你會發現，世界不會因此崩掉。']
  },
  defense: {
    core: ['你看起來很冷靜。\n\n其實只是很怕受傷。', '你不是不在意。\n\n你只是很會裝得沒那麼在意。', '你不太快靠近人。\n\n因為你知道失望是什麼感覺。'],
    stuck: ['你最累的，是明明在意，卻一直演得很淡。', '你把自己保護得很好。\n\n也把真正想靠近你的人擋在外面。'],
    pattern: ['你會先觀察。\n\n再決定要不要打開自己。', '你常用理性把情緒蓋過去。\n\n但情緒其實沒有消失。'],
    blind: ['保護自己沒有錯。\n\n但不要把自己關太久。', '不是每一個靠近你的人，都會傷害你。'],
    strength: ['你很清醒。\n\n也很難被表面話術騙走。', '你的真誠很珍貴。\n\n因為你不是隨便給出去的人。'],
    next: ['試著對一個安全的人，多說一點真話。\n\n不用全部打開。\n\n一點點就好。']
  },
  lonely: {
    core: ['你不是不需要人。\n\n你只是太習慣一個人撐住。', '你很少麻煩別人。\n\n所以別人也很少知道你需要幫忙。', '你看得很清楚。\n\n所以也常常覺得很孤單。'],
    stuck: ['你累的，是很多事都只能自己消化。', '你不是不想說。\n\n只是覺得說了也不一定有人懂。'],
    pattern: ['你會保持距離。\n\n不是因為高傲，是因為不想再失望。', '你寧願安靜。\n\n也不想花力氣解釋自己。'],
    blind: ['不是所有靠近，都是打擾。', '也許不是沒有人懂你。\n\n只是你太快把門關起來。'],
    strength: ['你很獨立。\n\n也很有自己的判斷。', '你的清醒很珍貴。\n\n只是不要讓它變成孤立自己的牆。'],
    next: ['這 30 天，試著讓一個人多看見你一點。\n\n不用很多。\n\n一點點就好。']
  },
  stability: {
    core: ['你不是害怕改變。\n\n你只是需要慢一點。', '你很需要穩定。\n\n因為變動太快，心會先亂掉。', '你不是不想往前。\n\n你只是需要知道自己不會被丟下。'],
    stuck: ['你累的，是一直在不確定裡找安全感。', '你不是太保守。\n\n你只是很怕一動，就失去現在僅有的穩。'],
    pattern: ['你會先想後果。\n\n再決定要不要開始。', '你需要退路。\n\n不是因為膽小，是因為你想安心。'],
    blind: ['未知不一定是危險。', '改變也可以很小，也可以很慢。'],
    strength: ['你很能長期經營。\n\n只要找到節奏，就不容易放棄。', '你的穩定感，是很多人缺少的力量。'],
    next: ['選一個很小的改變開始。\n\n小到不會害怕。\n\n但足夠讓你知道：我可以往前。']
  }
};

let current = 0;
const answers = [];
const hero = document.getElementById('hero');
const quiz = document.getElementById('quiz');
const loading = document.getElementById('loading');
const result = document.getElementById('result');
const questionCard = document.getElementById('questionCard');

document.querySelector('[data-start]').addEventListener('click', () => {
  hero.classList.add('hidden');
  quiz.classList.remove('hidden');
  renderQuestion();
});

document.querySelector('[data-prev]').addEventListener('click', () => {
  if (current > 0) {
    current--;
    renderQuestion();
  }
});

document.querySelector('[data-restart]').addEventListener('click', () => window.location.reload());

document.querySelector('[data-download]').addEventListener('click', () => {
  const element = document.getElementById('reportPaper');
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
  document.getElementById('stepLabel').innerText = `${current + 1} / ${questions.length}`;
  document.getElementById('progressFill').style.width = `${((current + 1) / questions.length) * 100}%`;
  questionCard.innerHTML = `<h2>${q.title}</h2><div class="answers">${q.answers.map((a, i) => `<button class="answer-btn" data-index="${i}">${a.text}</button>`).join('')}</div>`;
  document.querySelectorAll('.answer-btn').forEach((btn, index) => {
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
  setTimeout(() => {
    loading.classList.add('hidden');
    result.classList.remove('hidden');
    generateReport();
  }, 1500);
}

function generateReport() {
  const counts = {};
  answers.forEach(a => counts[a] = (counts[a] || 0) + 1);
  const dominant = Object.keys(counts).sort((a, b) => counts[b] - counts[a])[0];
  const data = archetypes[dominant] || archetypes.sensitive;
  const pack = typeModules[dominant] || typeModules.sensitive;

  document.getElementById('archetypeName').innerText = data.name;
  document.getElementById('archetypeOneLiner').innerText = data.one;
  document.getElementById('reportSubtitle').innerText = `關鍵字：${data.keyword}`;
  document.getElementById('reportDate').innerText = new Date().toLocaleDateString('zh-TW');
  document.getElementById('reportCode').innerText = 'Report #' + Math.random().toString(36).substring(2, 8).toUpperCase();

  const sections = [
    { title: '你的核心狀態', text: pick(pack.core) },
    { title: '你最近真正卡住的地方', text: pick(pack.stuck) },
    { title: '你在人際裡的樣子', text: pick(pack.pattern) },
    { title: '你需要看見的一句話', text: pick(pack.blind) },
    { title: '你不是沒有力量', text: pick(pack.strength) },
    { title: '接下來 30 天', text: pick(pack.next) },
    { title: '給現在的你', text: '你不用立刻變好。\n\n也不用馬上有答案。\n\n先把自己放回來。\n\n這就已經是開始。' }
  ];

  document.getElementById('reportContent').innerHTML = sections.map(section => `
    <section>
      <h4>${section.title}</h4>
      <p>${section.text.replace(/\n/g, '<br>')}</p>
    </section>
  `).join('');
}

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}
