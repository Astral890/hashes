const el = id => document.getElementById(id);
const server = 'http://localhost:3000';

async function p(path, body){
  const res = await fetch(server + path, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(body)});
  if(!res.ok) throw new Error(await res.text());
  return await res.json();
}

el('btnEncrypt').addEventListener('click', async ()=>{
  el('output').textContent = 'Solicitando servidor...';
  try{
    const key = el('key').value.trim();
    const plaintext = el('plaintext').value || '';
    const json = await p('/hash/encrypt/3des', { key, plaintext });
    el('output').textContent = JSON.stringify(json, null, 2);
  }catch(e){ el('output').textContent = 'Error: '+e.message }
});

el('btnDecrypt').addEventListener('click', async ()=>{
  el('output').textContent = 'Solicitando servidor...';
  try{
    const key = el('key').value.trim();
    const obj = JSON.parse(el('output').textContent || '{}');
    if(!obj.iv || !obj.ciphertext){ el('output').textContent = 'Pega un objeto de cifrado válido en la salida antes de descifrar.'; return; }
    const json = await p('/hash/decrypt/3des', { key, iv: obj.iv, ciphertext: obj.ciphertext });
    el('output').textContent = JSON.stringify(json, null, 2);
  }catch(e){ el('output').textContent = 'Error: '+e.message }
});
