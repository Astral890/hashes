// sha384.js
const el = id => document.getElementById(id);

async function serverHashSHA384(serverUrl, text){
  const res = await fetch(serverUrl.replace(/\/$/,'') + '/hash/sha384', {
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
    const h = await serverHashSHA384(server, txt);
    el('output').textContent = h;
  }catch(e){ el('output').textContent = 'Error: '+e.message }
});
