// Lit un fichier texte du site (sans cache, pour voir tout de suite les ajouts)
async function lire(fichier) {
  const r = await fetch(fichier, { cache: 'no-store' });
  return r.ok ? r.text() : '';
}

// Découpe textes.txt : un texte par bloc, blocs séparés par une ligne "---".
// Une première ligne commençant par "@" est la date (facultative).
async function lireTextes() {
  const brut = await lire('textes.txt');
  const blocs = [];
  let courant = [];
  for (const ligne of brut.split(/\r?\n/)) {
    if (ligne.trim() === '---') { blocs.push(courant); courant = []; }
    else courant.push(ligne);
  }
  blocs.push(courant);
  return blocs.map(lignes => {
    let texte = lignes.join('\n').trim();
    let date = '';
    if (texte.startsWith('@')) {
      const fin = texte.indexOf('\n');
      date = (fin === -1 ? texte : texte.slice(0, fin)).slice(1).trim();
      texte = fin === -1 ? '' : texte.slice(fin + 1).trim();
    }
    return { date, texte };
  }).filter(t => t.texte);
}

// Le lien de la page en cours est en noir plein
const page = location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('nav a').forEach(a => {
  if (a.getAttribute('href') === page) a.classList.add('actif');
});
