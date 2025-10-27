// sha256.js
const el = id => document.getElementById(id);

async function serverHashSHA256(serverUrl, text){
  const res = await fetch(serverUrl.replace(/\/$/,'') + '/hash/sha256', {
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({ text })
  });
  if(!res.ok) throw new Error('Error en servidor: ' + res.status);
  return (await res.json()).hash;
}

document.getElementById('btnHash').addEventListener('click', async ()=>{
  const server ='http://localhost:3000';
  const txt = el('inputText').value || '';
  el('output').textContent = 'Generando...';
  try{
    const h = await serverHashSHA256(server, txt);
    el('output').textContent = h;
  }catch(e){ el('output').textContent = 'Error: '+e.message }
});

document.getElementById('btnCompare').addEventListener('click', async ()=>{
  const server = 'http://localhost:3000';
  const txt = el('inputText').value || '';
  const known = (el('knownHash').value || '').trim().toLowerCase();
  el('compareRes').textContent = 'Verificando...';
  try{
    if(!known){ el('compareRes').textContent = 'Ingresa un hash conocido para comparar.'; return; }
    const h = await serverHashSHA256(server, txt);
    el('compareRes').textContent = (h === known) ? 'VERIFICADO — Coincide' : 'NO COINCIDE';
  }catch(e){ el('compareRes').textContent = 'Error: '+e.message }
});
