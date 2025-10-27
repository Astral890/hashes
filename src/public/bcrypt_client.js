// bcrypt_client.js
const el = id => document.getElementById(id);

async function serverBcrypt(serverUrl, text, rounds=10){
  const res = await fetch(serverUrl.replace(/\/$/,'') + '/hash/bcrypt', {
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({ text, rounds })
  });
  if(!res.ok) throw new Error('Error en servidor: ' + res.status);
  return (await res.json()).hash;
}

async function serverVerifyBcrypt(serverUrl, text, hash){
  const res = await fetch(serverUrl.replace(/\/$/,'') + '/verify/bcrypt', {
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({ text, hash })
  });
  if(!res.status==400){
    return "No Coincide";
  }else{
    return "Coincide";
  }
}

document.getElementById('btnHash').addEventListener('click', async ()=>{
  const server ='http://localhost:3000';
  const pwd = el('password').value || '';
  el('outputHash').textContent = 'Solicitando servidor...';
  try{
    const h = await serverBcrypt(server, pwd, 10);
    el('outputHash').textContent = h;
  }catch(e){ el('outputHash').textContent = 'Error: '+e.message }
});

document.getElementById('btnVerify').addEventListener('click', async ()=>{
  const server ='http://localhost:3000';
  const pwd = el('verifyHash').value || '';
  const hash = el('outputHash').value || '';
  el('verifyRes').textContent = 'Verificando...';
  try{
    const ok = await serverVerifyBcrypt(server, pwd, hash);
    el('verifyRes').textContent = ok;
  }catch(e){ el('verifyRes').textContent = 'Error: '+e.message }
});
