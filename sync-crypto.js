(function(root){
const enc=new TextEncoder(),dec=new TextDecoder();
function b64(bytes){let raw='';const array=new Uint8Array(bytes);for(let i=0;i<array.length;i+=8192)raw+=String.fromCharCode(...array.subarray(i,i+8192));return btoa(raw).replaceAll('+','-').replaceAll('/','_').replaceAll('=','')}
function unb64(s){return Uint8Array.from(atob(s.replaceAll('-','+').replaceAll('_','/')),c=>c.charCodeAt(0))}
const hex=bytes=>Array.from(new Uint8Array(bytes),b=>b.toString(16).padStart(2,'0')).join('');
async function keys(secret){if(!/^[A-Za-z0-9_-]{43}$/.test(secret))throw Error('invalid key');const key=await crypto.subtle.importKey('raw',unb64(secret),'HKDF',false,['deriveKey','deriveBits']);const args=info=>({name:'HKDF',hash:'SHA-256',salt:enc.encode('elia-progress-v1'),info:enc.encode(info)});return {encryption:await crypto.subtle.deriveKey(args('encryption'),key,{name:'AES-GCM',length:256},false,['encrypt','decrypt']),auth:hex(await crypto.subtle.deriveBits(args('authorization'),key,256))}}
async function encrypt(value,key,device,revision){const iv=crypto.getRandomValues(new Uint8Array(12));const ciphertext=await crypto.subtle.encrypt({name:'AES-GCM',iv,additionalData:enc.encode(device+':'+revision)},key,enc.encode(JSON.stringify(value)));return {version:1,device,revision,iv:b64(iv),ciphertext:b64(ciphertext)}}
async function decrypt(body,key){const bytes=await crypto.subtle.decrypt({name:'AES-GCM',iv:unb64(body.iv),additionalData:enc.encode(body.device+':'+body.revision)},key,unb64(body.ciphertext));return JSON.parse(dec.decode(bytes))}
root.SyncCrypto={keys,encrypt,decrypt,createSecret:()=>b64(crypto.getRandomValues(new Uint8Array(32)))};
})(typeof globalThis!=='undefined'?globalThis:this);
