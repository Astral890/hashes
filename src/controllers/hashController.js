import express from 'express';
import crypto from 'crypto';
import bcrypt from 'bcrypt';
import pkg from 'unix-crypt-td-js'; // npm install unix-crypt-td-js
const { sha256crypt } = pkg;

export const router = express.Router();


// SHA helpers
function shaX(alg, text) {
return crypto.createHash(alg).update(text, 'utf8').digest('hex');
}


// PBKDF2 helper
function pbkdf2Hash(text, salt = null, iterations = 100000, keylen = 64, digest='sha512'){
salt = salt || crypto.randomBytes(16).toString('hex');
const derived = crypto.pbkdf2Sync(text, salt, iterations, keylen, digest).toString('hex');
return { salt, iterations, derived, digest };
}


router.post('/sha256', (req, res)=>{
const { text } = req.body;
if(!text) return res.status(400).json({ error:'text required' });
res.json({ hash: shaX('sha256', text) });
});


router.post('/sha384', (req, res)=>{
const { text } = req.body;
res.json({ hash: shaX('sha384', text || '') });
});


router.post('/sha512', (req, res)=>{
const { text } = req.body;
res.json({ hash: shaX('sha512', text || '') });
});


router.post('/bcrypt', async (req, res)=>{
const { text, rounds } = req.body;
const r = rounds || 10;
const hash = await bcrypt.hash(text, r);
res.json({ hash });
});


router.post('/sha256crypt', (req, res)=>{
const { text } = req.body;
// sha256crypt requiere un salt; unix-crypt-td-js ofrece sha256_crypt
const salt = crypto.randomBytes(8).toString('base64').slice(0,16);
const hash = sha256crypt(text, salt);
res.json({ salt, hash });
});


router.post('/pbkdf2', (req, res)=>{
const { text, iterations } = req.body;
const it = iterations || 100000;
const result = pbkdf2Hash(text, null, it);
res.json(result);
});


// Verificación bcrypt
router.post('/verify/bcrypt', async (req,res)=>{
const { text, hash } = req.body;
const ok = await bcrypt.compare(text, hash);
res.json({ verified: !!ok });
});


// Verificación pbkdf2
router.post('/verify/pbkdf2', (req,res)=>{
const { text, salt, iterations, derived, digest } = req.body;
const it = iterations || 100000;
const keylen = Buffer.from(derived || '', 'hex').length;
const check = crypto.pbkdf2Sync(text, salt, it, keylen, digest || 'sha512').toString('hex');
res.json({ verified: check === derived });
});