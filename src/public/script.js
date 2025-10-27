async function hashText(algorithm, text) {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest(algorithm, data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

async function handleHash(algorithm, inputId, outputId) {
  const text = document.getElementById(inputId).value;
  const hash = await hashText(algorithm, text);
  document.getElementById(outputId).innerText = hash;
}
