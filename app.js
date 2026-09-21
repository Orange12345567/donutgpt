const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];

let credits = Number(localStorage.getItem("neonCredits") || 10000000);
let soundOn = localStorage.getItem("neonSound") !== "off";
let audioCtx;

function fmt(n){
  const abs=Math.abs(n);
  if(abs>=1e9) return (n/1e9).toFixed(abs>=1e10?0:2).replace(/\.?0+$/,"")+"B";
  if(abs>=1e6) return (n/1e6).toFixed(abs>=1e7?0:2).replace(/\.?0+$/,"")+"M";
  if(abs>=1e3) return (n/1e3).toFixed(abs>=1e4?0:1).replace(/\.?0+$/,"")+"K";
  return Math.round(n).toLocaleString();
}
function parseAmount(v){
  const s=String(v).trim().toUpperCase().replace(/[$,\s]/g,"");
  const m=s.match(/^(\d*\.?\d+)([KMB])?$/); if(!m)return NaN;
  const mult={K:1e3,M:1e6,B:1e9}[m[2]]||1; return Math.floor(Number(m[1])*mult);
}
function setCredits(n){credits=Math.max(0,Math.floor(n));localStorage.setItem("neonCredits",credits);$("#credits").textContent=fmt(credits)}
function toast(t){const e=$("#toast");e.textContent=t;e.classList.add("show");clearTimeout(toast.t);toast.t=setTimeout(()=>e.classList.remove("show"),2200)}
function beep(freq=440,d=.08,type="sine",gain=.04){
  if(!soundOn)return;
  audioCtx ||= new (window.AudioContext||window.webkitAudioContext)();
  const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.type=type;o.frequency.value=freq;g.gain.value=gain;o.connect(g);g.connect(audioCtx.destination);o.start();g.gain.exponentialRampToValueAtTime(.0001,audioCtx.currentTime+d);o.stop(audioCtx.currentTime+d);
}
function winSound(){[523,659,784,1047].forEach((f,i)=>setTimeout(()=>beep(f,.14,"triangle",.06),i*90))}
function loseSound(){beep(180,.2,"sawtooth",.035);setTimeout(()=>beep(120,.25,"sawtooth",.03),120)}

setCredits(credits);
$("#soundBtn").textContent=soundOn?"🔊":"🔇";
$("#soundBtn").onclick=()=>{soundOn=!soundOn;localStorage.setItem("neonSound",soundOn?"on":"off");$("#soundBtn").textContent=soundOn?"🔊":"🔇";beep(660)};

$$("[data-go]").forEach(b=>b.onclick=()=>{
  const id=b.dataset.go;
  $$(".view").forEach(v=>v.classList.remove("active"));
  $("#"+id).classList.add("active");
  window.scrollTo({top:0,behavior:"smooth"});beep(420,.06,"triangle");
});
$("#devBtn").onclick=()=>$("#devModal").classList.remove("hidden");
$$("[data-close]").forEach(b=>b.onclick=()=>$("#"+b.dataset.close).classList.add("hidden"));
$$("[data-addcredits]").forEach(b=>b.onclick=()=>{setCredits(credits+Number(b.dataset.addcredits));toast("Added "+fmt(Number(b.dataset.addcredits))+" demo credits");beep(900)});
$("#resetCredits").onclick=()=>{setCredits(10000000);toast("Credits reset to 10M")};

const canvas=$("#bg"),ctx=canvas.getContext("2d");let pts=[];
function resize(){canvas.width=innerWidth*devicePixelRatio;canvas.height=innerHeight*devicePixelRatio;ctx.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0);pts=Array.from({length:35},()=>({x:Math.random()*innerWidth,y:Math.random()*innerHeight,r:Math.random()*1.2+.2,s:Math.random()*.18+.04}))}
function drawBg(){ctx.clearRect(0,0,innerWidth,innerHeight);ctx.fillStyle="#58ff7855";pts.forEach(p=>{p.y-=p.s;if(p.y<0)p.y=innerHeight;ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fill()});requestAnimationFrame(drawBg)}resize();addEventListener("resize",resize);drawBg();

/* ROULETTE */
const wheelOrder=[0,32,15,19,4,21,2,25,17,34,6,27,13,36,11,30,8,23,10,5,24,16,33,1,20,14,31,9,22,18,29,7,28,12,35,3,26];
const redNums=new Set([1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36]);
let rBet=null,rSpinning=false;
wheelOrder.forEach((n,i)=>{
  const s=document.createElement("span"),a=(i*360/wheelOrder.length)-90,r=171;
  s.textContent=n;s.style.transform=`rotate(${a+90}deg) translate(${r}px) rotate(90deg)`;$("#wheelNumbers").appendChild(s);
});
for(let n=0;n<=36;n++){
  const b=document.createElement("button");b.textContent=n;b.dataset.rbet=n;b.className=n===0?"zero":redNums.has(n)?"red":"black";$("#rouletteTable").appendChild(b)
}
function selectRBet(v,el){
  rBet=String(v);$$("[data-rbet]").forEach(x=>x.classList.remove("selected"));el.classList.add("selected");
  $("#rouletteSelected").textContent="Selected: "+(rBet.match(/^\d+$/)?"Number "+rBet:rBet.toUpperCase());beep(520,.05,"triangle")
}
$("#rouletteTable").onclick=e=>{const b=e.target.closest("[data-rbet]");if(b)selectRBet(b.dataset.rbet,b)};
$$(".outside-bets [data-rbet]").forEach(b=>b.onclick=()=>selectRBet(b.dataset.rbet,b));
$$("[data-rquick]").forEach(b=>b.onclick=()=>$("#rouletteAmount").value=fmt(Number(b.dataset.rquick)));
$("#rouletteAmount").oninput=()=>{const n=parseAmount($("#rouletteAmount").value);$("#rouletteBetTotal").textContent=Number.isFinite(n)?fmt(n):"—"};
$("#rouletteAmount").dispatchEvent(new Event("input"));

function rouletteWin(bet,num){
  if(/^\d+$/.test(bet))return Number(bet)===num?36:0;
  if(num===0)return 0;
  if(bet==="red")return redNums.has(num)?2:0;if(bet==="black")return !redNums.has(num)?2:0;
  if(bet==="even")return num%2===0?2:0;if(bet==="odd")return num%2?2:0;
  if(bet==="low")return num<=18?2:0;if(bet==="high")return num>=19?2:0;return 0;
}
$("#spinRoulette").onclick=()=>{
  if(rSpinning)return;if(rBet===null)return toast("Choose a roulette bet first.");
  const amt=parseAmount($("#rouletteAmount").value);if(!amt||amt<1)return toast("Enter a valid bet like 100K or 1M.");if(amt>credits)return toast("Not enough demo credits.");
  rSpinning=true;setCredits(credits-amt);$("#spinRoulette").disabled=true;$("#rouletteResult").textContent="SPINNING…";
  const result=wheelOrder[Math.floor(Math.random()*wheelOrder.length)],idx=wheelOrder.indexOf(result),sector=360/wheelOrder.length;
  const final=360*5 + (360-(idx*sector));
  $("#rouletteWheel").style.transition="transform 4.2s cubic-bezier(.12,.72,.09,1)";
  $("#rouletteWheel").style.transform=`rotateX(12deg) rotate(${final}deg)`;
  let ticks=0,t=setInterval(()=>{beep(250+(ticks%8)*20,.025,"square",.012);ticks++},90);
  setTimeout(()=>{
    clearInterval(t);const mult=rouletteWin(rBet,result),color=result===0?"GREEN":redNums.has(result)?"RED":"BLACK";
    const payout=amt*mult;if(payout)setCredits(credits+payout);
    $("#rouletteResult").textContent=`${result} • ${color} ${payout?`• WON ${fmt(payout)}`:"• NO WIN"}`;
    payout?winSound():loseSound();$("#spinRoulette").disabled=false;rSpinning=false;
    setTimeout(()=>{$("#rouletteWheel").style.transition="none";$("#rouletteWheel").style.transform="rotateX(12deg)";},300);
  },4300)
};

/* BLACKJACK */
const suits=["♠","♥","♦","♣"],ranks=["A","2","3","4","5","6","7","8","9","10","J","Q","K"];
let deck=[],dealer=[],hands=[],activeHand=0,bjBet=100000,bjRunning=false,dealerHidden=true;
function newDeck(){deck=[];for(const s of suits)for(const r of ranks)deck.push({r,s});for(let i=deck.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[deck[i],deck[j]]=[deck[j],deck[i]]}}
function val(hand){let v=0,a=0;hand.forEach(c=>{if(c.r==="A"){v+=11;a++}else v+=["J","Q","K"].includes(c.r)?10:Number(c.r)});while(v>21&&a){v-=10;a--}return v}
function cardEl(c,back=false){const d=document.createElement("div");d.className="playing-card"+(back?" back":(["♥","♦"].includes(c.s)?" red-suit":""));if(!back)d.innerHTML=`${c.r}<span class="suit">${c.s}</span>`;return d}
function renderBJ(){
  $("#dealerHand").innerHTML="";dealer.forEach((c,i)=>$("#dealerHand").appendChild(cardEl(c,dealerHidden&&i===1)));
  $("#dealerScore").textContent=dealerHidden?val([dealer[0]]):val(dealer);
  $("#playerHands").innerHTML="";hands.forEach((h,i)=>{const w=document.createElement("div");w.className="split-hand "+(i===activeHand&&bjRunning?"active-hand":"");h.cards.forEach(c=>w.appendChild(cardEl(c)));const tag=document.createElement("div");w.appendChild(tag);$("#playerHands").appendChild(w)});
  $("#playerScore").textContent=hands.length===1?val(hands[0]?.cards||[]):hands.map(h=>val(h.cards)).join(" / ");
  const h=hands[activeHand];$("#bjHit").disabled=!bjRunning;$("#bjStand").disabled=!bjRunning;
  $("#bjDouble").disabled=!bjRunning||!h||h.cards.length!==2||credits<h.bet;
  $("#bjSplit").disabled=!bjRunning||!h||h.cards.length!==2||h.cards[0].r!==h.cards[1].r||credits<h.bet||hands.length>1;
  $("#bjDeal").disabled=bjRunning
}
function bjNextOrDealer(){if(activeHand<hands.length-1){activeHand++;renderBJ();$("#bjStatus").textContent="Playing hand "+(activeHand+1);return}dealerTurn()}
function finishBJ(){
  dealerHidden=false;const dv=val(dealer);let totalReturn=0,msg=[];
  hands.forEach(h=>{const pv=val(h.cards);let ret=0;
    const nat=h.cards.length===2&&pv===21&&!h.fromSplit;
    const dnat=dealer.length===2&&dv===21;
    if(pv>21){msg.push("BUST")}
    else if(dv>21||pv>dv){ret=h.bet*(nat&&!dnat?2.5:2);msg.push("WIN "+fmt(ret))}
    else if(pv===dv){ret=h.bet;msg.push("PUSH")}
    else msg.push("DEALER WINS");
    totalReturn+=ret;
  });
  if(totalReturn)setCredits(credits+totalReturn);
  $("#bjStatus").textContent=msg.join(" • ");totalReturn>hands.reduce((s,h)=>s+h.bet,0)?winSound():loseSound();bjRunning=false;renderBJ()
}
function dealerTurn(){dealerHidden=false;renderBJ();$("#bjStatus").textContent="Dealer playing…";let iv=setInterval(()=>{if(val(dealer)<17){dealer.push(deck.pop());beep(380,.06,"triangle");renderBJ()}else{clearInterval(iv);setTimeout(finishBJ,400)}},500)}
$$("[data-bjquick]").forEach(b=>b.onclick=()=>{$("#bjAmount").value=fmt(Number(b.dataset.bjquick));$("#bjBetDisplay").textContent=$("#bjAmount").value});
$("#bjAmount").oninput=()=>{const n=parseAmount($("#bjAmount").value);$("#bjBetDisplay").textContent=Number.isFinite(n)?fmt(n):"—"};
$("#bjDeal").onclick=()=>{
  const amt=parseAmount($("#bjAmount").value);if(!amt||amt<1)return toast("Enter a valid bet.");if(amt>credits)return toast("Not enough demo credits.");
  bjBet=amt;setCredits(credits-amt);newDeck();dealer=[deck.pop(),deck.pop()];hands=[{cards:[deck.pop(),deck.pop()],bet:amt,fromSplit:false}];activeHand=0;dealerHidden=true;bjRunning=true;$("#bjStatus").textContent="Your move.";renderBJ();beep(520);
  if(val(hands[0].cards)===21)setTimeout(dealerTurn,650)
};
$("#bjHit").onclick=()=>{const h=hands[activeHand];h.cards.push(deck.pop());beep(500,.05,"triangle");renderBJ();if(val(h.cards)>=21)setTimeout(bjNextOrDealer,350)};
$("#bjStand").onclick=bjNextOrDealer;
$("#bjDouble").onclick=()=>{const h=hands[activeHand];if(credits<h.bet)return;setCredits(credits-h.bet);h.bet*=2;h.cards.push(deck.pop());beep(700);renderBJ();setTimeout(bjNextOrDealer,400)};
$("#bjSplit").onclick=()=>{const h=hands[activeHand];if(credits<h.bet)return;setCredits(credits-h.bet);const c2=h.cards.pop();h.fromSplit=true;h.cards.push(deck.pop());hands.splice(activeHand+1,0,{cards:[c2,deck.pop()],bet:h.bet,fromSplit:true});beep(800);renderBJ()};
renderBJ();

/* SLOTS */
const symbols=["7","★","◆","🍒","BAR"],weights=["7","★","◆","🍒","BAR","◆","🍒","BAR","🍒","◆","BAR"];
let slotBusy=false,slotBet=100000;
function randSym(){return weights[Math.floor(Math.random()*weights.length)]}
function setReel(el,s){el.textContent=s}
["#reel1","#reel2","#reel3"].forEach((id,i)=>setReel($(id),symbols[i]));
$$("[data-squick]").forEach(b=>b.onclick=()=>{$("#slotAmount").value=fmt(Number(b.dataset.squick));$("#slotBetDisplay").textContent=$("#slotAmount").value});
$("#slotAmount").oninput=()=>{const n=parseAmount($("#slotAmount").value);$("#slotBetDisplay").textContent=Number.isFinite(n)?fmt(n):"—"};
function slotMult(a){
  if(a.every(x=>x==="7"))return 25;if(a.every(x=>x==="★"))return 12;if(a.every(x=>x==="◆"))return 8;if(a.every(x=>x==="🍒"))return 5;
  if(new Set(a).size===2)return 1.5;return 0
}
async function spinSlots(forced=null){
  if(slotBusy)return;const amt=parseAmount($("#slotAmount").value);if(!amt||amt<1)return toast("Enter a valid bet.");if(amt>credits)return toast("Not enough demo credits.");
  slotBet=amt;slotBusy=true;setCredits(credits-amt);$("#slotSpin").disabled=true;$("#slotStatus").textContent="SPINNING…";
  const reels=[$("#reel1"),$("#reel2"),$("#reel3")];reels.forEach(r=>r.classList.add("spinning"));
  const iv=setInterval(()=>{reels.forEach(r=>r.textContent=randSym());beep(160+Math.random()*80,.02,"square",.008)},80);
  await new Promise(r=>setTimeout(r,1100));clearInterval(iv);
  const out=forced||[randSym(),randSym(),randSym()];
  reels.forEach((r,i)=>setTimeout(()=>{r.classList.remove("spinning");setReel(r,out[i]);beep(420+i*120,.09,"triangle",.05)},i*220));
  await new Promise(r=>setTimeout(r,720));
  let mult=slotMult(out),payout=Math.floor(amt*mult);
  if(payout){setCredits(credits+payout);$("#slotStatus").textContent=`WIN ${fmt(payout)} • ${mult}×`;winSound();if(payout>=10000000)toast("HANDPAY! "+fmt(payout)+" demo credits")}
  else{$("#slotStatus").textContent="NO WIN";loseSound()}
  if(out.filter(x=>x==="★").length>=2){setTimeout(()=>launchPinball(),450)}
  $("#slotSpin").disabled=false;slotBusy=false
}
$("#slotSpin").onclick=()=>spinSlots();

async function launchPinball(forceMult=null){
  $("#pinballModal").classList.remove("hidden");$("#pinballResult").textContent="LAUNCHING…";const ball=$("#pinballBall");ball.classList.remove("running");void ball.offsetWidth;ball.classList.add("running");
  [300,420,520,660,830].forEach((f,i)=>setTimeout(()=>beep(f,.08,"triangle",.04),450+i*430));
  await new Promise(r=>setTimeout(r,2850));const opts=[2,5,10,25],mult=forceMult||opts[Math.floor(Math.random()*opts.length)],payout=slotBet*mult;setCredits(credits+payout);$("#pinballResult").textContent=`${mult}× MULTIPLIER • +${fmt(payout)}`;winSound()
}
$("#forcePinball").onclick=()=>launchPinball();
$("#forceMega").onclick=()=>{slotBet=parseAmount($("#slotAmount").value)||100000;launchPinball(25)};
$("#forceHandpay").onclick=()=>{const amt=parseAmount($("#slotAmount").value)||100000;const need=Math.max(10000000,amt*25);setCredits(credits+need);$("#slotStatus").textContent="HANDPAY TEST • +"+fmt(need);toast("HANDPAY! "+fmt(need)+" demo credits");winSound()};
