// Faturamais 2.0 — Build script
const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, 'out');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

const files = ['index.html', 'app.html', 'privacidade.html', 'termos.html', 'cookies.html', 'acessibilidade.html', 'mapa-site.html', 'app.js', 'views.js', 'data.js', 'style.css', 'favicon.svg', 'favicon.png', 'og-image.png', 'robots.txt', 'sitemap.xml'];
files.forEach(function (f) {
  const src = path.join(__dirname, f);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, path.join(outDir, f));
    console.log('  ✓ ' + f);
  } else {
    console.log('  ✗ ' + f + ' (não encontrado)');
  }
});

// Copy brand assets directory
const brandDir = path.join(__dirname, 'brand');
const outBrandDir = path.join(outDir, 'brand');
if (fs.existsSync(brandDir)) {
  if (!fs.existsSync(outBrandDir)) fs.mkdirSync(outBrandDir, { recursive: true });
  fs.readdirSync(brandDir).forEach(function (f) {
    fs.copyFileSync(path.join(brandDir, f), path.join(outBrandDir, f));
    console.log('  ✓ brand/' + f);
  });
}

// Copy public images directory
const imagesDir = path.join(__dirname, 'public', 'images');
const outImagesDir = path.join(outDir, 'images');
if (fs.existsSync(imagesDir)) {
  fs.mkdirSync(outImagesDir, { recursive: true });
  function copyDir(src, dst) {
    fs.readdirSync(src).forEach(function (f) {
      const s = path.join(src, f);
      const d = path.join(dst, f);
      if (fs.statSync(s).isDirectory()) {
        fs.mkdirSync(d, { recursive: true });
        copyDir(s, d);
      } else {
        fs.copyFileSync(s, d);
        console.log('  ✓ ' + path.relative(outDir, d));
      }
    });
  }
  copyDir(imagesDir, outImagesDir);
}

console.log('Build concluído — ' + files.length + ' arquivos em out/');
