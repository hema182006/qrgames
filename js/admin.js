const base = new URL('index.html', location.href).href;
if (location.protocol === 'file:') $('#warn').hidden = false;
const ids = Object.keys(CONFIG.TEAMS);
$('#links').innerHTML = ids.map(function (k) {
  var t = CONFIG.TEAMS[k], cells = '';
  for (var i = 1; i <= t.stations.length + 1; i++) {
    cells += '<div class="cell"><b>' + (i > t.stations.length ? '🏁 اللغز الأخير' : 'محطة ' + i) + '</b><br>' +
      '<div class="qr" id="qr-' + k + '-' + i + '"></div>' +
      '<p class="small">' + base + '?t=' + k + '&amp;s=' + i + '</p></div>';
  }
  return '<div class="card"><h3>' + esc(t.name) + '</h3><div class="grid">' + cells + '</div></div>';
}).join('');
if (typeof QRCode === 'undefined') $('#nolib').hidden = false;
else ids.forEach(function (k) {
  for (var i = 1; i <= CONFIG.TEAMS[k].stations.length + 1; i++)
    new QRCode($('#qr-' + k + '-' + i), { text: base + '?t=' + k + '&s=' + i, width: 140, height: 140 });
});