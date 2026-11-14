// Lit un fichier texte du site (sans cache, pour voir tout de suite les ajouts)
async function lire(fichier) {
  const r = await fetch(fichier, { cache: 'no-store' });
  return r.ok ? r.text() : '';
}

// Découpe un fichier de textes : blocs séparés par une ligne "---".
// Une première ligne commençant par "@" est la date (facultative).
async function lireTextes(fichier = 'textes.txt') {
  const brut = await lire(fichier);
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

// Affiche une liste de textes dans un élément
function afficherListe(textes, conteneur) {
  textes.forEach(t => {
    const div = document.createElement('div');
    div.className = 'texte';
    div.textContent = t.texte;
    if (t.date) {
      const d = document.createElement('span');
      d.className = 'date';
      d.textContent = t.date;
      div.appendChild(d);
    }
    conteneur.appendChild(div);
  });
}

// Le lien de la page en cours est en noir
const pageCourante = location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('nav a').forEach(a => {
  if (a.getAttribute('href') === pageCourante) {
    a.classList.add('actif');
    a.setAttribute('aria-current', 'page');
  }
});
