// pbkdf2.js
const el = id => document.getElementById(id);

async function serverPbkdf2(serverUrl, text, iterations=100000){
  const res = await fetch(serverUrl.replace(/\/$/,'') + '/hash/pbkdf2', {
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({ text, iterations })
  });
  if(!res.ok) throw new Error('Error en servidor: ' + res.status);
  return await res.json(); // { salt, iterations, derived, digest }
}

document.getElementById('btnDerive').addEventListener('click', async ()=>{
  const server ='http://localhost:3000';
  const pwd = el('password').value || '';
  const it = Number(el('iterations').value) || 100000;
  el('output').textContent = 'Solicitando servidor...';
  try{
    const json = await serverPbkdf2(server, pwd, it);
    el('output').textContent = JSON.stringify(json, null, 2);
  }catch(e){ el('output').textContent = 'Error: '+e.message }
});
