const allowed=new Set(['https://www.josephpress.com','https://josephpress.com','https://jpress123.github.io']);
const hex=bytes=>Array.from(new Uint8Array(bytes),b=>b.toString(16).padStart(2,'0')).join('');
export default {async fetch(request,env){
const u=new URL(request.url),origin=request.headers.get('Origin');
const headers={'Content-Type':'application/json','Cache-Control':'no-store','X-Content-Type-Options':'nosniff','Vary':'Origin'};
if(origin&&allowed.has(origin))Object.assign(headers,{'Access-Control-Allow-Origin':origin,'Access-Control-Allow-Methods':'GET, PUT, OPTIONS','Access-Control-Allow-Headers':'Authorization, Content-Type','Access-Control-Max-Age':'3600'});
const reply=(data,status=200)=>new Response(JSON.stringify(data),{status,headers});
if(u.pathname==='/health')return reply({ok:true,storage:!!env.BUCKET,protocol:1});
if(origin&&!allowed.has(origin))return reply({error:'origin'},403);
if(request.method==='OPTIONS')return new Response(null,{status:204,headers});
if(u.pathname!=='/v1/progress')return reply({service:'Encrypted learning progress relay',protocol:1},404);
const auth=request.headers.get('Authorization')||'';if(!/^Bearer [a-f0-9]{64}$/.test(auth))return reply({error:'unauthorized'},401);
if(!env.BUCKET)return reply({error:'storage unavailable'},503);
const namespace=hex(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(auth.slice(7))));const prefix='progress/'+namespace+'/';
if(request.method==='GET'){const listed=await env.BUCKET.list({prefix,limit:64});if(listed.truncated)return reply({error:'too many devices'},409);const entries=await Promise.all(listed.objects.map(async obj=>{const value=await env.BUCKET.get(obj.key);return value?JSON.parse(await value.text()):null}));return reply({version:1,devices:entries.filter(Boolean)})}
if(request.method!=='PUT')return reply({error:'method'},405);
if(Number(request.headers.get('Content-Length')||0)>160000)return reply({error:'too large'},413);
const reader=request.body?.getReader();if(!reader)return reply({error:'body'},400);let chunks=[],size=0;while(true){const {done,value}=await reader.read();if(done)break;size+=value.byteLength;if(size>160000){await reader.cancel();return reply({error:'too large'},413)}chunks.push(value)}
const bytes=new Uint8Array(size);let offset=0;for(const chunk of chunks){bytes.set(chunk,offset);offset+=chunk.length}
let body;try{body=JSON.parse(new TextDecoder().decode(bytes))}catch{return reply({error:'json'},400)}
if(body.version!==1||!/^[a-f0-9-]{36}$/.test(body.device||'')||!Number.isSafeInteger(body.revision)||body.revision<1||!/^[A-Za-z0-9_-]{16}$/.test(body.iv||'')||!/^[-_A-Za-z0-9]{24,150000}$/.test(body.ciphertext||''))return reply({error:'format'},400);
const key=prefix+body.device+'.json';const existing=await env.BUCKET.get(key);let current=existing?JSON.parse(await existing.text()):null;
if(current&&body.revision<=current.revision)return reply({error:'revision',revision:current.revision},409);
if(!existing){const listed=await env.BUCKET.list({prefix,limit:64});if(listed.objects.length>=64)return reply({error:'device limit'},409)}
const clean={version:1,device:body.device,revision:body.revision,iv:body.iv,ciphertext:body.ciphertext};
const stored=await env.BUCKET.put(key,JSON.stringify(clean),{onlyIf:existing?{etagMatches:existing.etag}:new Headers({'If-None-Match':'*'}),httpMetadata:{contentType:'application/json',cacheControl:'no-store'}});
if(!stored)return reply({error:'conflict'},409);return reply({ok:true,revision:body.revision});
}};
