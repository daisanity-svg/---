(()=>{
'use strict';
const START='2026-07-09';
const START_WEIGHT=89.7;
const KEY='mounjaro-journey-data-v4';
const LEGACY_KEYS=['mounjaro-journey-data-v3','mounjaro-journey-data-v2'];
const $=s=>document.querySelector(s);
const hero=$('#hero'),timeline=$('#timeline'),overlay=$('#overlay'),form=$('#recordForm');
const error=$('#formError'),toast=$('#toast'),deleteBtn=$('#deleteBtn');
let editingDate=null;

function taipeiToday(){
  const parts=new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Taipei',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date());
  const map={}; parts.forEach(p=>map[p.type]=p.value);
  return `${map.year}-${map.month}-${map.day}`;
}
function utc(date){const [y,m,d]=date.split('-').map(Number);return Date.UTC(y,m-1,d)}
function dayNo(date){return Math.floor((utc(date)-utc(START))/86400000)+1}
function formatDate(date){return date.replaceAll('-',' / ')}
function dateRange(from,to){const out=[];for(let t=utc(from);t<=utc(to);t+=86400000)out.push(new Date(t).toISOString().slice(0,10));return out}
function round1(v){return Math.round(Number(v)*10)/10}
function cleanRecord(source={}){
  const out={};
  ['weight','bodyFat','visceralFat'].forEach(k=>{
    if(source[k]!==''&&source[k]!=null&&Number.isFinite(Number(source[k])))out[k]=round1(source[k]);
  });
  return out;
}
function defaults(){return{version:4,records:{[START]:{weight:START_WEIGHT}}}}
function migrate(raw){
  const next=defaults();
  if(!raw||typeof raw!=='object')return next;
  if(raw.records&&typeof raw.records==='object'){
    Object.entries(raw.records).forEach(([date,record])=>next.records[date]=cleanRecord(record));
  }
  if(raw.weights&&typeof raw.weights==='object'){
    Object.entries(raw.weights).forEach(([date,weight])=>next.records[date]={...(next.records[date]||{}),weight:round1(weight)});
  }
  next.records[START]={...(next.records[START]||{}),weight:START_WEIGHT};
  return next;
}
function load(){
  try{
    const current=JSON.parse(localStorage.getItem(KEY)||'null');
    if(current)return migrate(current);
    for(const key of LEGACY_KEYS){
      const old=JSON.parse(localStorage.getItem(key)||'null');
      if(old){const moved=migrate(old);localStorage.setItem(KEY,JSON.stringify(moved));return moved}
    }
  }catch(e){}
  return defaults();
}
let state=load();
function save(){
  state.records[START]={...(state.records[START]||{}),weight:START_WEIGHT};
  localStorage.setItem(KEY,JSON.stringify(state));
}
function getRecord(date){return cleanRecord(state.records[date]||{})}
function hasData(record){return Object.keys(record).length>0}
function metric(value,unit,label){
  const shown=value==null?'—':`${value}${unit||''}`;
  return `<div class="metric"><strong>${shown}</strong><span>${label}</span></div>`;
}
function latestWeight(){
  return Object.entries(state.records)
    .filter(([date,r])=>date<=taipeiToday()&&Number.isFinite(Number(r.weight)))
    .sort((a,b)=>a[0].localeCompare(b[0]))
    .at(-1);
}
function renderHero(){
  const today=taipeiToday();
  const latest=latestWeight();
  const current=latest?round1(latest[1].weight):START_WEIGHT;
  const change=round1(current-START_WEIGHT);
  const sign=change>0?'+':'';
  hero.innerHTML=`<div class="hero-card">
    <p class="hero-date">${formatDate(today)}</p>
    <p class="hero-day">${dayNo(today)}</p>
    <p class="hero-caption">DAY · 從 ${formatDate(START)} 開始</p>
    <div class="progress"><strong>${current.toFixed(1)} kg</strong><span>目前體重</span></div>
    <div class="progress"><strong>${sign}${change.toFixed(1)} kg</strong><span>相較 Day 1</span></div>
  </div>`;
}
function renderTimeline(){
  const today=taipeiToday();
  timeline.innerHTML=dateRange(START,today).reverse().map(date=>{
    const r=getRecord(date),exists=hasData(r);
    return `<article class="day-row ${date===today?'today':''}" id="day-${date}">
      <button class="day-button" type="button" data-date="${date}">
        <div class="day-head"><span class="day-label">DAY ${dayNo(date)}</span><span class="date-label">${formatDate(date)}</span></div>
        ${exists?`<div class="metrics">
          ${metric(r.weight,' kg','體重')}
          ${metric(r.bodyFat,'%','體脂肪率')}
          ${metric(r.visceralFat,'','內臟脂肪')}
        </div>`:`<div class="empty">點一下新增今天的量測</div>`}
      </button>
    </article>`;
  }).join('');
}
function render(){renderHero();renderTimeline()}
function openSheet(date){
  editingDate=date;
  const r=getRecord(date);
  form.reset();
  ['weight','bodyFat','visceralFat'].forEach(k=>{form.elements[k].value=r[k]??''});
  $('#sheetDay').textContent=`DAY ${dayNo(date)}`;
  $('#sheetDate').textContent=formatDate(date);
  error.textContent='';
  deleteBtn.hidden=!hasData(r)||date===START;
  overlay.classList.add('open');
  overlay.setAttribute('aria-hidden','false');
  setTimeout(()=>form.elements.weight.focus(),100);
}
function closeSheet(){
  overlay.classList.remove('open');
  overlay.setAttribute('aria-hidden','true');
  editingDate=null;
}
function notify(message){toast.textContent=message;toast.classList.add('show');setTimeout(()=>toast.classList.remove('show'),1500)}
function readNumber(name){const value=form.elements[name].value.trim();return value===''?null:Number(value)}
function validate(record){
  if(record.weight!=null&&(record.weight<30||record.weight>300))return '體重請輸入 30–300 kg。';
  if(record.bodyFat!=null&&(record.bodyFat<1||record.bodyFat>75))return '體脂肪率請輸入 1–75%。';
  if(record.visceralFat!=null&&(record.visceralFat<1||record.visceralFat>60))return '內臟脂肪請輸入 1–60。';
  if(Object.values(record).every(v=>v==null))return '請至少輸入一項數據。';
  return '';
}
form.addEventListener('submit',event=>{
  event.preventDefault();
  const input={weight:readNumber('weight'),bodyFat:readNumber('bodyFat'),visceralFat:readNumber('visceralFat')};
  const message=validate(input); if(message){error.textContent=message;return}
  const cleaned={};Object.entries(input).forEach(([k,v])=>{if(v!=null)cleaned[k]=round1(v)});
  if(editingDate===START)cleaned.weight=START_WEIGHT;
  state.records[editingDate]=cleaned;
  save();render();closeSheet();notify('紀錄已儲存');
});
$('#cancelBtn').addEventListener('click',closeSheet);
deleteBtn.addEventListener('click',()=>{
  if(!editingDate||editingDate===START)return;
  delete state.records[editingDate];save();render();closeSheet();notify('紀錄已刪除');
});
overlay.addEventListener('click',event=>{if(event.target===overlay)closeSheet()});
timeline.addEventListener('click',event=>{const button=event.target.closest('[data-date]');if(button)openSheet(button.dataset.date)});
$('#todayBtn').addEventListener('click',()=>{
  const today=taipeiToday();document.querySelector(`#day-${today}`)?.scrollIntoView({behavior:'smooth',block:'center'});
});
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&overlay.classList.contains('open'))closeSheet()});

render();
if('serviceWorker'in navigator)window.addEventListener('load',()=>navigator.serviceWorker.register('./service-worker.js').catch(()=>{}));
})();
