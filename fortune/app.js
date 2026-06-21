/* ─── Star canvas background ─── */
(function initStars() {
  const canvas = document.getElementById("starCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  let stars = [];

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function makeStars(n) {
    stars = [];
    for (let i = 0; i < n; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.4 + 0.2,
        speed: Math.random() * 0.15 + 0.05,
        phase: Math.random() * Math.PI * 2
      });
    }
  }

  let t = 0;
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    t += 0.01;
    stars.forEach(s => {
      const alpha = 0.4 + 0.5 * Math.sin(t * s.speed * 10 + s.phase);
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(240,220,255,${alpha})`;
      ctx.fill();
    });
    requestAnimationFrame(draw);
  }

  resize();
  makeStars(180);
  draw();
  window.addEventListener("resize", () => { resize(); makeStars(180); });
})();

/* ─── Falling stars effect ─── */
function spawnFallingStars() {
  const glyphs = ["✦", "✧", "★", "⭐", "💫", "🌟", "✨"];
  for (let i = 0; i < 18; i++) {
    setTimeout(() => {
      const el = document.createElement("span");
      el.className = "falling-star";
      el.textContent = glyphs[Math.floor(Math.random() * glyphs.length)];
      el.style.left = Math.random() * 100 + "vw";
      el.style.top = "-40px";
      const dur = 1.2 + Math.random() * 1.2;
      el.style.animationDuration = dur + "s";
      el.style.fontSize = (0.9 + Math.random() * 1.1) + "rem";
      el.style.opacity = "1";
      document.body.appendChild(el);
      setTimeout(() => el.remove(), dur * 1000 + 100);
    }, i * 80);
  }
}

/* ─── Zodiac ─── */
let lastResultText = "";

const zodiacRanges = [
  ["山羊座",1,19],["水瓶座",2,18],["魚座",3,20],
  ["牡羊座",4,19],["牡牛座",5,20],["双子座",6,21],
  ["蟹座",7,22],["獅子座",8,22],["乙女座",9,22],
  ["天秤座",10,23],["蠍座",11,22],["射手座",12,21],
  ["山羊座",12,31]
];

const zodiacEmoji = {
  "牡羊座":"♈","牡牛座":"♉","双子座":"♊","蟹座":"♋",
  "獅子座":"♌","乙女座":"♍","天秤座":"♎","蠍座":"♏",
  "射手座":"♐","山羊座":"♑","水瓶座":"♒","魚座":"♓"
};

const animalEmoji = {
  "子":"🐭","丑":"🐮","寅":"🐯","卯":"🐰","辰":"🐲",
  "巳":"🐍","午":"🐴","未":"🐑","申":"🐵","酉":"🐓","戌":"🐶","亥":"🐗"
};

function getZodiac(month, day) {
  for (const z of zodiacRanges) {
    if (month < z[1]) return z[0];
    if (month === z[1] && day <= z[2]) return z[0];
  }
  return "山羊座";
}

function getAnimal(year) {
  const a = ["申","酉","戌","亥","子","丑","寅","卯","辰","巳","午","未"];
  return a[year % 12];
}

function getLifeNumber(dateStr) {
  let total = 0;
  for (const c of dateStr.replaceAll("-","")) total += Number(c);
  while (total > 9) total = String(total).split("").reduce((a,b)=>a+Number(b),0);
  return total || 1;
}

function seededPick(arr, seed) { return arr[seed % arr.length]; }

function diagnose() {
  const birthday = document.getElementById("birthday").value;
  if (!birthday) { alert("生年月日を入力してください"); return; }

  spawnFallingStars();

  const d = new Date(birthday);
  const year = d.getFullYear(), month = d.getMonth()+1, day = d.getDate();
  const zodiac = getZodiac(month, day);
  const animal = getAnimal(year);
  const life   = getLifeNumber(birthday);
  const seed   = year + month + day;

  const luckyColor   = seededPick(luckyColors, seed);
  const todayFortune = seededPick(dailyFortunes, seed + 3);
  const loveFortune  = seededPick(loveFortunes, seed + 7);
  const workFortune  = seededPick(workFortunes, seed + 11);
  const moneyFortune = seededPick(moneyFortunes, seed + 17);
  const luckyNumber  = ((seed * life) % 99) + 1;

  lastResultText =
`【🔮 トリプル占い結果】
星座: ${zodiac} ${zodiacEmoji[zodiac]||""}
干支: ${animal}年 ${animalEmoji[animal]||""}
運命数: ${life}
ラッキーカラー: ${luckyColor.name}
ラッキーナンバー: ${luckyNumber}
#トリプル占い`;

  document.getElementById("result").innerHTML = `
<div class="result-card">
  <div class="result-header">
    <h2>🔮 あなたの運命</h2>
    <p class="result-subtitle">三つの星が照らす、あなただけの物語</p>
  </div>

  <div class="identity-grid">
    <div class="identity-box">
      <div class="identity-icon">${zodiacEmoji[zodiac]||"⭐"}</div>
      <div class="identity-label">星座</div>
      <div class="identity-value">${zodiac}</div>
    </div>
    <div class="identity-box">
      <div class="identity-icon">${animalEmoji[animal]||"🌟"}</div>
      <div class="identity-label">干支</div>
      <div class="identity-value">${animal}年</div>
    </div>
    <div class="identity-box">
      <div class="identity-icon">🔢</div>
      <div class="identity-label">運命数</div>
      <div class="identity-value">${life}</div>
    </div>
  </div>

  <div class="fortune-section">
    <h3>🌟 基本性格 — 星座より</h3>
    <p>${zodiacData[zodiac].trait}</p>
  </div>

  <div class="fortune-section">
    <h3>🐾 干支の素質</h3>
    <p>${animalData[animal]}</p>
  </div>

  <div class="fortune-section">
    <h3>🔢 数秘術の使命</h3>
    <p>${numerologyData[life]}</p>
  </div>

  <div class="fortune-section red-tint">
    <h3>💖 恋愛運</h3>
    <p>${loveFortune}</p>
  </div>

  <div class="fortune-section gold-tint">
    <h3>💼 仕事運</h3>
    <p>${workFortune}</p>
  </div>

  <div class="fortune-section gold-tint">
    <h3>💰 金運</h3>
    <p>${moneyFortune}</p>
  </div>

  <div class="fortune-section">
    <h3>☀️ 今日のメッセージ</h3>
    <p>${todayFortune}</p>
  </div>

  <div class="fortune-section gold-tint">
    <h3>🎨 ラッキーカラー</h3>
    <div class="lucky-color-display">
      <div class="color-swatch" style="background:${luckyColor.hex};"></div>
      <div class="color-info">
        <div class="color-name">${luckyColor.name}</div>
        <div class="color-meaning">${luckyColor.meaning}</div>
      </div>
    </div>
  </div>

  <div class="fortune-section">
    <h3>🔢 ラッキーナンバー</h3>
    <div class="lucky-number-display">
      <div class="lucky-number">${luckyNumber}</div>
      <div class="lucky-number-sub">この数字があなたに幸運をもたらす</div>
    </div>
  </div>
</div>`;

  setTimeout(() => {
    document.getElementById("result").scrollIntoView({ behavior:"smooth", block:"start" });
  }, 100);
}

function compatibility() {
  const you = document.getElementById("you").value;
  const partner = document.getElementById("partner").value;
  if (!you || !partner) { alert("両方の誕生日を入力してください"); return; }

  const a = getLifeNumber(you);
  const b = getLifeNumber(partner);
  const diff = Math.abs(a - b);
  let score = Math.max(50, 100 - diff * 10);

  const text = seededPick(compatibilityTexts, score);
  const pct  = score + "%";

  spawnFallingStars();

  document.getElementById("compatibilityResult").innerHTML = `
<div class="compat-result">
  <div class="compat-score">${score}%</div>
  <div class="compat-bar-wrap">
    <div class="compat-bar" style="width:0%" id="compatBar"></div>
  </div>
  <p class="compat-text">${text}</p>
</div>`;

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      const bar = document.getElementById("compatBar");
      if (bar) bar.style.width = pct;
    });
  });
}

function shareResult() {
  if (!lastResultText) { alert("先に占いを実行してください"); return; }
  navigator.clipboard.writeText(lastResultText).then(() => {
    document.getElementById("shareMessage").innerHTML = "✅ クリップボードにコピーしました！";
    setTimeout(() => { document.getElementById("shareMessage").innerHTML = ""; }, 3000);
  });
}

/* ─── Theme toggle ─── */
function initTheme() {
  const btn = document.getElementById("themeToggle");
  const stored = localStorage.getItem("fortune-theme");
  if (stored === "light") { document.body.classList.add("light"); if (btn) btn.textContent = "🌙 ダークモード"; }
  if (btn) btn.addEventListener("click", () => {
    document.body.classList.toggle("light");
    const isLight = document.body.classList.contains("light");
    localStorage.setItem("fortune-theme", isLight ? "light" : "dark");
    btn.textContent = isLight ? "🌙 ダークモード" : "☀️ ライトモード";
  });
}

window.onload = initTheme;
