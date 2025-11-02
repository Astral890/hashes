const el = id => document.getElementById(id);
const server = 'http://localhost:3000';

async function post(path, body){
  const res = await fetch(server + path, {
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify(body)
  });
  if(!res.ok){
    const t = await res.text();
    throw new Error(res.status + ' ' + t);
  }
  return await res.json();
}

el('btnEncrypt').addEventListener('click', async ()=>{
  el('output').textContent = 'Solicitando servidor...';
  try{
    const mode = el('mode').value;
    const plaintext = el('plaintext').value || '';
    const key = el('key').value.trim();
    const path = mode === 'aes-128' ? '/hash/encrypt/aes-128' : '/hash/encrypt/aes-256';
    const json = await post(path, { key, plaintext });
    el('output').textContent = JSON.stringify(json, null, 2);
  }catch(e){ el('output').textContent = 'Error: '+e.message }
});

el('btnDecrypt').addEventListener('click', async ()=>{
  el('output').textContent = 'Solicitando servidor...';
  try{
    const mode = el('mode').value;
    const key = el('key').value.trim();
    const obj = JSON.parse(el('output').textContent || '{}');
    if(!obj.iv || !obj.ciphertext || !obj.tag) { el('output').textContent = 'Pega un objeto de cifrado válido en la salida antes de descifrar.'; return; }
    const path = mode === 'aes-128' ? '/hash/decrypt/aes-128' : '/hash/decrypt/aes-256';
    const json = await post(path, { key, iv: obj.iv, tag: obj.tag, ciphertext: obj.ciphertext });
    el('output').textContent = JSON.stringify(json, null, 2);
  }catch(e){ el('output').textContent = 'Error: '+e.message }
});
