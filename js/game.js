const params = new URLSearchParams(location.search);
const key = params.get('t');
const team = CONFIG.TEAMS[key];
const n = team ? team.stations.length : 0;
const sRaw = parseInt(params.get('s'), 10);
const s = sRaw > 0 ? sRaw : 1;
const app = $('#app');

function steps(cur) {
  var d = '';
  for (var k = 0; k < n; k++) d += '<i class="' + (k < cur - 1 ? 'on' : k === cur - 1 ? 'cur' : '') + '"></i>';
  d += '<i class="' + (cur > n ? 'cur' : '') + '"></i>';
  return '<div class="steps">' + d + '</div>';
}

function picker() {
  var b = Object.keys(CONFIG.TEAMS).map(function (k) {
    return '<a class="btn" href="?t=' + k + '&s=1">' + esc(CONFIG.TEAMS[k].name) + '</a>';
  }).join('');
  app.innerHTML = '<h1 class="ar">لعبة الكنز</h1><p>امسحوا الـ QR بتاع تيمكم للبداية.</p>' + b;
}

function station() {
  if (s === 1) setL('hunt-start-' + key, Date.now());
  var S = team.stations[s - 1];
  var opts = S.c.map(function (x, i) { return '<button class="opt" data-i="' + i + '">' + esc(x) + '</button>'; }).join('');
  app.innerHTML = '<h1 class="ar">' + esc(team.name) + '</h1>' + steps(s) +
    '<div class="card"><p class="tag">STATION ' + s + ' / ' + n + '</p><h2>' + esc(S.q) + '</h2>' +
    '<div>' + opts + '</div><p class="err" id="msg" role="alert"></p></div>';
  var btns = document.querySelectorAll('.opt');
  btns.forEach(function (b) {
    b.onclick = function () {
      if (+b.dataset.i === S.a) {
        btns.forEach(function (x) { x.disabled = true; });
        b.classList.add('right');
        $('#msg').outerHTML = '<div class="hint"><b>📍 المكان اللي بعده</b><br>' + esc(S.go) +
          '<br><small>هتلاقوا QR هناك، امسحوه عشان يفتحلكم السؤال اللي بعده.</small></div>';
      } else {
        b.classList.add('wrong'); b.disabled = true;
        $('#msg').textContent = 'إجابة غلط، جرّبوا تاني.';
      }
    };
  });
}

function finale() {
  app.innerHTML = '<h1 class="ar">' + esc(team.name) + '</h1>' + steps(n + 1) +
    '<div class="card"><p class="tag">FINAL</p><h2>اللغز الأخير</h2><p class="hint">' + esc(CONFIG.RIDDLE) + '</p>' +
    '<input id="ans" type="text" autocomplete="off" placeholder="الإجابة"><p class="err" id="err" role="alert"></p>' +
    '<button class="block" id="go">تأكيد الإجابة</button></div>';
  function check() {
    var v = normalize($('#ans').value);
    var ok = v.length > 0 ? CONFIG.ANSWERS.some(function (a) { return v.indexOf(a) > -1; }) : false;
    if (ok) win();
    else $('#err').textContent = 'مش هو، فكّروا تاني.';
  }
  $('#go').onclick = check;
  $('#ans').addEventListener('keydown', function (e) { if (e.key === 'Enter') check(); });
}

function win() {
  var now = new Date(), el = '', st = +getL('hunt-start-' + key);
  if (st) { var sec = Math.round((now - st) / 1000); el = '<p>مدة اللعب: ' + Math.floor(sec / 60) + ' دقيقة و ' + (sec % 60) + ' ثانية</p>'; }
  app.innerHTML = '<h1 class="ar">' + esc(team.name) + '</h1>' + steps(n + 1) +
    '<div class="card"><h2>🏆 الإجابة صح!</h2><p>اجروا بسرعة على المكان ده ووروا الشاشة دي للمنظّمين.</p>' +
    '<div class="code">' + now.toLocaleTimeString('en-GB') + '</div>' + el + '</div>';
}

if (!team) picker();
else if (s > n) finale();
else station();