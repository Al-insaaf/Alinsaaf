const V='v2',SH=['./','index.html','manifest.json','icon-192.png','icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open('shell-'+V).then(c=>c.addAll(SH)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>/^(shell|lib|img)-/.test(k)&&!k.endsWith('-'+V)).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET')return;const u=new URL(r.url);
 if(u.hostname.endsWith('.supabase.co')){if(u.pathname.includes('/storage/v1/object/public/'))e.respondWith(caches.match(r).then(m=>m||fetch(r).then(res=>{const cp=res.clone();caches.open('img-'+V).then(c=>c.put(r,cp));return res})));return}
 if(r.mode==='navigate'||u.origin===location.origin){e.respondWith(fetch(r).then(res=>{const cp=res.clone();caches.open('shell-'+V).then(c=>c.put(r,cp));return res}).catch(()=>caches.match(r,{ignoreSearch:true}).then(m=>m||caches.match('index.html'))));return}
 if(/jsdelivr|googleapis|gstatic|cdnjs/.test(u.hostname))e.respondWith(caches.match(r).then(m=>m||fetch(r).then(res=>{const cp=res.clone();caches.open('lib-'+V).then(c=>c.put(r,cp));return res})))});
