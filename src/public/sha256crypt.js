// sha256crypt.js
const el = id => document.getElementById(id);

async function serverSha256crypt(serverUrl, text){
  const res = await fetch(serverUrl.replace(/\/$/,'') + '/hash/sha256crypt', {
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({ text })
  });
  if(!res.ok) throw new Error('Error en servidor: ' + res.status);
  return await res.json(); // { salt, hash }
}

document.getElementById('btnHash').addEventListener('click', async ()=>{
  const server ='http://localhost:3000';
  const txt = el('inputText').value || '';
  el('output').textContent = 'Solicitando servidor...';
  try{
    const json = await serverSha256crypt(server, txt);
    el('output').textContent = JSON.stringify(json, null, 2);
  }catch(e){ el('output').textContent = 'Error: '+e.message }
});
