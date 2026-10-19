"use strict";
const $=s=>document.querySelector(s);
const store={get(k,d){try{return JSON.parse(localStorage.getItem(k))??d}catch(e){return d}},set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}};
const today=()=>new Date().toISOString().slice(0,10);

// Portada: cuenta de pasos
setTimeout(()=>{$("#arc").style.strokeDashoffset=327*.2;let n=0;const i=setInterval(()=>{n=Math.min(8000,n+160);$("#steps").textContent=n.toLocaleString("es-CL");if(n>=8000)clearInterval(i)},40)},300);

// Simulador de pasos
function pasos(){const p=+$("#sl").value,m=Math.round(p/100),h=Math.floor(m/60);
$("#sv").textContent=p.toLocaleString("es-CL");$("#km").textContent=(p*.75/1000).toFixed(1).replace(".",",")+" km";
$("#mn").textContent=(h?h+" h ":"")+m%60+" min";
const [t,x]=p<4000?["Buen inicio","Cada paso suma. Intenta añadir 500 pasos por semana."]:p<6000?["Vas avanzando","Estás cerca de la zona donde los estudios muestran grandes beneficios."]:p<8000?["Zona de beneficio","Desde aquí baja el riesgo de enfermedad y mortalidad según estudios."]:["Excelente","Mantener este nivel en el tiempo es lo más importante."];
$("#lv").textContent=t;$("#lt").textContent=x}
$("#sl").addEventListener("input",pasos);pasos();

// Hábitos con racha
const hb=$("#habits");let log=store.get("log",{});
hb.innerHTML=DATA.habits.map((h,i)=>`<div class="card habit"><input type="checkbox" id="h${i}"><div><label for="h${i}">${h[0]}</label><p>${h[1]}</p><button class="link" data-v="${h[2]}" type="button">Ver demostración</button></div></div>`).join("");
(log[today()]||[]).forEach(i=>{$("#h"+i).checked=true});
function racha(){let n=0,d=new Date();if((log[today()]||[]).length<3)d.setDate(d.getDate()-1);
while((log[d.toISOString().slice(0,10)]||[]).length>=3){n++;d.setDate(d.getDate()-1)}return n}
function hupd(){const c=(log[today()]||[]).length;$("#fill").style.width=c/DATA.habits.length*100+"%";$("#pct").textContent=c+" de "+DATA.habits.length;$("#streak").textContent=racha()}
hb.addEventListener("change",e=>{if(e.target.type!=="checkbox")return;log[today()]=[...hb.querySelectorAll("input")].flatMap((x,i)=>x.checked?[i]:[]);store.set("log",log);hupd()});hupd();
// Videos: coloca tus .mp4 en site/videos/
hb.addEventListener("click",e=>{const b=e.target.closest("[data-v]");if(!b)return;
$("#vbox").innerHTML=`<video controls playsinline preload="metadata" src="videos/${b.dataset.v}.mp4"></video>`;
$("#vbox video").onerror=()=>{$("#vbox").innerHTML='<div class="novid">Este video estará disponible pronto.</div>'};$("#dlg").showModal()});
$("#close").onclick=()=>$("#dlg").close();$("#dlg").addEventListener("close",()=>$("#vbox").innerHTML="");

// Calculadora (misma lógica que python/zonas.py)
const fcMax=a=>Math.floor(208-.7*a+.5);
function zona(a,r){const m=fcMax(a);if(r>=35&&r<=120&&r<m){const k=m-r;return{m,lo:Math.floor(r+k*.4+.5),hi:Math.floor(r+k*.6+.5),how:"Método: reserva cardíaca (Karvonen) entre 40 % y 60 %."}}
return{m,lo:Math.floor(m*.6+.5),hi:Math.floor(m*.7+.5),how:"Método: 60 % a 70 % del pulso máximo. Agrega tu pulso en reposo para un cálculo más personal."}}
function grafico(z,n){const c=$("#cv"),g=c.getContext("2d"),W=c.width,H=c.height,x=p=>(p-40)/60*(W-40)+20;g.clearRect(0,0,W,H);
const lo=z.lo/z.m*100,hi=z.hi/z.m*100;g.fillStyle="#9BE7C455";g.fillRect(x(lo),10,x(hi)-x(lo),H-50);
g.beginPath();for(let p=40;p<=100;p++){const y=H-40-Math.exp(-.5*((p-62)/13)**2)*(H-70);p==40?g.moveTo(x(p),y):g.lineTo(x(p),y)}
g.strokeStyle="#FFCB47";g.lineWidth=4;g.stroke();g.fillStyle="#fff";g.font="14px Nunito,sans-serif";g.textAlign="center";
[40,60,80,100].forEach(p=>g.fillText(p+"% del pulso máx.",x(p),H-12));g.fillText("Tu zona",(x(lo)+x(hi))/2,26);
if(n){const p=Math.min(100,Math.max(40,n/z.m*100));g.fillStyle="#E4506D";g.beginPath();g.arc(x(p),H-40,8,0,7);g.fill()}}
$("#f").addEventListener("submit",e=>{e.preventDefault();const a=+$("#age").value,r=+$("#rest").value,n=+$("#now").value;
if(!a||a<18||a>90){$("#age").focus();return alert("Ingresa una edad entre 18 y 90 años.")}
const z=zona(a,r);$("#lo").textContent=z.lo;$("#hi").textContent=z.hi;$("#how").textContent=z.how+" Pulso máximo estimado: "+z.m+" lat/min.";
$("#ten").textContent="En 10 segundos, cuenta entre "+Math.round(z.lo/6)+" y "+Math.round(z.hi/6)+" latidos.";
$("#msg").textContent=!n?"":n<z.lo?"Estás bajo tu zona. Puedes subir un poco el ritmo.":n>z.hi?"Estás sobre tu zona. Baja el ritmo hasta poder conversar.":"¡Estás en tu zona! Mantén este ritmo.";
$("#res").hidden=false;grafico(z,n)});

// Minutos semanales
const DIAS=["Lun","Mar","Mié","Jue","Vie","Sáb","Dom"];let wk=store.get("wk",[0,0,0,0,0,0,0]);
$("#day").innerHTML=DIAS.map((d,i)=>`<option value="${i}">${d}</option>`).join("");
function wupd(){$("#wk").innerHTML=wk.map((m,i)=>`<div>${DIAS[i]}<br>${m}'</div>`).join("");const t=wk.reduce((a,b)=>a+b,0);$("#tot").textContent=t;$("#wfill").style.width=Math.min(100,t/150*100)+"%"}
$("#mf").addEventListener("submit",e=>{e.preventDefault();const m=+$("#min").value;if(m>0){wk[+$("#day").value]+=m;store.set("wk",wk);$("#min").value="";wupd()}});
$("#rw").onclick=()=>{wk=[0,0,0,0,0,0,0];store.set("wk",wk);wupd()};wupd();

// Quiz mito o realidad
let qi=0,pt=0;
function quiz(){const q=DATA.quiz[qi],el=$("#qz");
if(!q){el.innerHTML=`<h3>Obtuviste ${pt} de ${DATA.quiz.length}</h3><button class="btn" id="rq">Intentar de nuevo</button>`;$("#rq").onclick=()=>{qi=pt=0;quiz()};return}
el.innerHTML=`<h3>${qi+1}. ${q[0]}</h3><button class="btn o" data-a="1">Realidad</button><button class="btn o" data-a="0">Mito</button><p id="fb" aria-live="polite"></p>`}
$("#qz").addEventListener("click",e=>{const b=e.target.closest("[data-a]");if(!b)return;const q=DATA.quiz[qi],ok=(b.dataset.a==="1")===q[1];if(ok)pt++;
$("#qz").querySelectorAll(".o").forEach(x=>x.disabled=true);
$("#fb").innerHTML=`<span class="${ok?"ok":"bad"}">${ok?"¡Correcto!":"No exactamente."}</span> ${q[2]} <button class="link" id="nx">Siguiente</button>`;$("#nx").onclick=()=>{qi++;quiz()}});quiz();
