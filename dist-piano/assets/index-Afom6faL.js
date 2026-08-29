(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))o(e);new MutationObserver(e=>{for(const s of e)if(s.type==="childList")for(const n of s.addedNodes)n.tagName==="LINK"&&n.rel==="modulepreload"&&o(n)}).observe(document,{childList:!0,subtree:!0});function i(e){const s={};return e.integrity&&(s.integrity=e.integrity),e.referrerPolicy&&(s.referrerPolicy=e.referrerPolicy),e.crossOrigin==="use-credentials"?s.credentials="include":e.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function o(e){if(e.ep)return;e.ep=!0;const s=i(e);fetch(e.href,s)}})();const j={grand:{name:"Sodor Grand",oscTypes:["sine","sine","sine","sine","sine","sine","sine"],gains:[.35,.2,.14,.09,.06,.04,.025],detune:[0,1200,1904,2404,2791,3110,3379],decayRates:[1,1.4,2,2.8,3.8,5,6.5],hammerNoise:.08,filterType:"lowpass",filterFreq:5e3,filterEndFreq:1e3,attack:.003,decay:2.5,sustain:.008,release:.6},electric:{name:"Electric Whistle",oscTypes:["sine","triangle"],gains:[.4,.4],detune:[0,1200],attack:.01,decay:1,sustain:.3,release:.5},synth:{name:"Tidmouth Synth",oscTypes:["sawtooth","square"],gains:[.3,.2],detune:[0,5],filterType:"lowpass",filterFreq:1200,filterEndFreq:400,attack:.1,decay:.5,sustain:.5,release:1.2},organ:{name:"Vicarstown Organ",oscTypes:["sine","sine","sine"],gains:[.4,.2,.2],detune:[0,1200,1900],attack:.05,decay:.1,sustain:1,release:.8},whistle:{name:"Steam Whistle",oscTypes:["sine","triangle"],gains:[.4,.4],detune:[0,2],filterType:"highpass",filterFreq:800,attack:.2,decay:.3,sustain:.7,release:.5},bell:{name:"Station Bell",oscTypes:["sine","sine","triangle"],gains:[.4,.3,.2],detune:[0,1200,2400],attack:.002,decay:2,sustain:.01,release:2}};class X{constructor(){this.ctx=null,this.masterGainNode=null,this.compressor=null,this._volume=.8,this.activeVoices=[],this.maxPolyphony=32}get volume(){return this._volume}set volume(t){this._volume=Math.max(0,Math.min(1,t)),this.masterGainNode&&this.ctx&&this.masterGainNode.gain.setValueAtTime(this._volume,this.ctx.currentTime)}initCtx(){return this.ctx||(this.ctx=new(window.AudioContext||window.webkitAudioContext),this.masterGainNode=this.ctx.createGain(),this.masterGainNode.gain.setValueAtTime(this._volume,this.ctx.currentTime),this.compressor=this.ctx.createDynamicsCompressor(),this.compressor.threshold.setValueAtTime(-18,this.ctx.currentTime),this.compressor.knee.setValueAtTime(12,this.ctx.currentTime),this.compressor.ratio.setValueAtTime(4,this.ctx.currentTime),this.compressor.attack.setValueAtTime(.003,this.ctx.currentTime),this.compressor.release.setValueAtTime(.15,this.ctx.currentTime),this.masterGainNode.connect(this.compressor),this.compressor.connect(this.ctx.destination)),this.ctx.state==="suspended"&&this.ctx.resume(),this.ctx}get output(){return this.masterGainNode}dampVoice(t,i){t.gainNode.gain.cancelScheduledValues(i),t.gainNode.gain.setValueAtTime(t.gainNode.gain.value,i),t.gainNode.gain.exponentialRampToValueAtTime(1e-4,i+.03),t.oscillators.forEach(e=>{try{e.stop(i+.03+.01)}catch{}}),t.sources.forEach(e=>{try{e.stop(i+.03+.01)}catch{}})}managePolyphony(t,i){const o=t.currentTime;for(this.activeVoices=this.activeVoices.filter(e=>e.keyIndex===i?(this.dampVoice(e,o),!1):!0),this.activeVoices=this.activeVoices.filter(e=>e.stopTime>o);this.activeVoices.length>=this.maxPolyphony;){const e=this.activeVoices.shift();this.dampVoice(e,o)}}getFrequency(t){return 27.5*Math.pow(2,t/12)}playNote(t,i="grand",o=1.2){const e=this.initCtx();if(this.managePolyphony(e,t),i==="grand"){this.playGrandPiano(e,t,o);return}const s=j[i],n=e.currentTime,a=this.getFrequency(t),c=!!s.decayRates,r=e.createGain();if(s.filterType){const l=e.createBiquadFilter();l.type=s.filterType,l.frequency.setValueAtTime(s.filterFreq||2e3,n),s.filterEndFreq&&l.frequency.exponentialRampToValueAtTime(s.filterEndFreq,n+s.decay),r.connect(l),l.connect(this.output)}else r.connect(this.output);if(c?(r.gain.setValueAtTime(1,n),r.gain.setValueAtTime(1,n+o),r.gain.exponentialRampToValueAtTime(.001,n+o+s.release)):(r.gain.setValueAtTime(0,n),r.gain.linearRampToValueAtTime(.4,n+s.attack),r.gain.exponentialRampToValueAtTime(s.sustain*.4,n+s.attack+s.decay),r.gain.exponentialRampToValueAtTime(.001,n+o+s.release)),s.hammerNoise&&s.hammerNoise>0){const l=Math.floor(e.sampleRate*.025),f=e.createBuffer(1,l,e.sampleRate),m=f.getChannelData(0);for(let w=0;w<l;w++)m[w]=Math.random()*2-1;const p=e.createBufferSource();p.buffer=f;const d=e.createBiquadFilter();d.type="bandpass",d.frequency.setValueAtTime(Math.min(a*3,8e3),n),d.Q.setValueAtTime(1,n);const y=e.createGain();y.gain.setValueAtTime(s.hammerNoise,n),y.gain.exponentialRampToValueAtTime(.001,n+.04),p.connect(d),d.connect(y),y.connect(r),p.start(n),p.stop(n+.05)}s.oscTypes.forEach((l,f)=>{const m=e.createOscillator(),p=e.createGain();if(m.type=l,m.frequency.setValueAtTime(a,n),s.detune&&s.detune[f]!==void 0&&m.detune.setValueAtTime(s.detune[f],n),c){const d=s.decayRates[f]||1,y=s.gains[f],w=Math.max(1e-4,y*s.sustain);p.gain.setValueAtTime(0,n),p.gain.linearRampToValueAtTime(y,n+s.attack),p.gain.exponentialRampToValueAtTime(w,n+s.attack+s.decay/d),p.gain.exponentialRampToValueAtTime(1e-4,n+o+s.release)}else p.gain.setValueAtTime(s.gains[f],n);m.connect(p),p.connect(r),m.start(n),m.stop(n+o+s.release)})}playGrandPiano(t,i,o){const e=t.currentTime,s=this.getFrequency(i),n=i/87,a=[],c=[],r=this.activeVoices.length,l=r>16?.7:r>8?.85:1,f=1e-4+n*n*.004,m=2+5*Math.pow(1-n,1.8),p=Math.min(m,o*1.5+.8),d=o<.3||r>20||i<10?1:i<20?2:3,y=.3+n*1,w=t.sampleRate/2,A=Math.max(4,Math.min(12,Math.floor((w-200)/s))),C=o<.4||r>16?Math.min(A,r>24?4:6):A,E=Math.min(1.5,o*.6+.15),V=e+o+E+.1,q=t.createBiquadFilter();q.type="lowpass",q.frequency.setValueAtTime(Math.min(s*12,12e3),e),q.frequency.exponentialRampToValueAtTime(Math.max(s*4,1e3),e+p*.5),q.Q.setValueAtTime(.5,e),q.connect(this.output);const T=t.createGain(),P=(o<.5?.35*(.6+o*.8):.35)*l;T.gain.setValueAtTime(P,e),T.gain.setValueAtTime(P,e+o),T.gain.exponentialRampToValueAtTime(.001,e+o+E),T.connect(q);const G=[0,.4,.28,.2,.13,.09,.065,.045,.032,.022,.016,.011,.008];for(let b=0;b<d;b++){const R=d===1?0:d===2?(b-.5)*y:(b-1)*y,S=t.createGain();S.gain.setValueAtTime(1/d,e),S.connect(T);for(let h=1;h<=C;h++){const v=h*s*Math.sqrt(1+f*h*h);if(v>=w-100)break;const x=t.createOscillator(),k=t.createGain();x.type="sine",x.frequency.setValueAtTime(v,e),x.detune.setValueAtTime(R,e);const L=h<G.length?G[h]:.008/Math.pow(h-11,.6),z=p/(1+(h-1)*.4),O=.003,K=Math.min(.5,z*.15),_=L*.65,H=Math.max(1e-4,L*.05),D=e+O+K,U=Math.min(e+O+z,V-.05);k.gain.setValueAtTime(0,e),k.gain.linearRampToValueAtTime(L,e+O),D<V-.05&&(k.gain.exponentialRampToValueAtTime(_,D),U>D+.02&&k.gain.exponentialRampToValueAtTime(H,U)),k.gain.exponentialRampToValueAtTime(1e-5,V),x.connect(k),k.connect(S),x.start(e),x.stop(V),a.push(x)}}const u=Math.floor(t.sampleRate*.01),g=t.createBuffer(1,u,t.sampleRate),I=g.getChannelData(0);for(let b=0;b<u;b++)I[b]=(Math.random()*2-1)*(1-b/u);const M=t.createBufferSource();M.buffer=g;const N=t.createBiquadFilter();N.type="bandpass",N.frequency.setValueAtTime(Math.min(s*4,8e3),e),N.Q.setValueAtTime(1,e);const B=t.createGain();if(B.gain.setValueAtTime(.04+n*.03,e),B.gain.exponentialRampToValueAtTime(.001,e+.015),M.connect(N),N.connect(B),B.connect(T),M.start(e),M.stop(e+.018),c.push(M),o>=.2&&r<16){const b=Math.floor(t.sampleRate*.03),R=t.createBuffer(1,b,t.sampleRate),S=R.getChannelData(0);for(let k=0;k<b;k++)S[k]=(Math.random()*2-1)*Math.pow(1-k/b,2);const h=t.createBufferSource();h.buffer=R;const v=t.createBiquadFilter();v.type="bandpass",v.frequency.setValueAtTime(Math.min(s*2,2500),e),v.Q.setValueAtTime(.6,e);const x=t.createGain();x.gain.setValueAtTime(.06,e),x.gain.exponentialRampToValueAtTime(.001,e+.04),h.connect(v),v.connect(x),x.connect(T),h.start(e),h.stop(e+.05),c.push(h)}this.activeVoices.push({keyIndex:i,gainNode:T,stopTime:V,oscillators:a,sources:c})}close(){this.ctx&&(this.activeVoices=[],this.ctx.close(),this.ctx=null,this.compressor=null)}}const Q=F=>{var l,f;const i=new DOMParser().parseFromString(F,"text/xml"),o=[],e=((l=i.querySelector("work-title"))==null?void 0:l.textContent)||((f=i.querySelector("movement-title"))==null?void 0:f.textContent)||"Imported Melody";let s=120;const n=i.querySelector("sound[tempo]");n&&(s=parseFloat(n.getAttribute("tempo")||"120"));let a=60/s;const c={C:0,D:2,E:4,F:5,G:7,A:9,B:11};return i.querySelectorAll("part").forEach(m=>{let p=0,d=1;m.querySelectorAll("measure").forEach(w=>{var E,V,q,T,P,G;let A=0,C=0;for(const u of Array.from(w.children))if(u.tagName==="attributes"){const g=u.querySelector("divisions");g&&(d=parseInt(g.textContent||"1",10))}else if(u.tagName==="direction"){const g=u.querySelector("sound[tempo]");g&&(a=60/parseFloat(g.getAttribute("tempo")||"120"))}else if(u.tagName==="sound"){const g=u.getAttribute("tempo");g&&(a=60/parseFloat(g))}else if(u.tagName==="forward"){const g=parseInt(((E=u.querySelector("duration"))==null?void 0:E.textContent)||"0",10);A+=g,C=Math.max(C,A)}else if(u.tagName==="backup"){const g=parseInt(((V=u.querySelector("duration"))==null?void 0:V.textContent)||"0",10);A-=g}else if(u.tagName==="note"){const g=u.querySelector("rest")!==null,I=u.querySelector("chord")!==null,M=parseInt(((q=u.querySelector("duration"))==null?void 0:q.textContent)||"0",10),N=(T=u.querySelector("pitch > step"))==null?void 0:T.textContent,B=parseInt(((P=u.querySelector("pitch > octave"))==null?void 0:P.textContent)||"4",10),b=parseInt(((G=u.querySelector("pitch > alter"))==null?void 0:G.textContent)||"0",10),R=u.querySelector('tie[type="stop"]')!==null;if(!g&&N){const S=B*12+c[N]+b-9,h=M/d*a*.8;if(S>=0&&S<88)if(R){const v=[...o].reverse().find(x=>x.keyIndex===S);v&&(v.duration=(v.duration||0)+h)}else o.push({keyIndex:S,time:p+A/d*a,duration:h})}I||(A+=M,C=Math.max(C,A))}p+=C/d*a})}),{id:`imported-${Date.now()}`,title:e,thumbnail:"🎼",notes:o.sort((m,p)=>m.time-p.time)}},W=["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"];class Y{constructor(t){this.soundType="grand",this.activeKeys=new Set,this.isAutoPlaying=!1,this.tempoMultiplier=1,this.stopAutoPlayRequested=!1,this.currentScore=null,this.keyElements=new Map,this.onExit=null,this.container=t,this.audio=new X,this.render()}setSoundType(t){this.soundType=t,this.updateUI()}async loadMusicXml(t){try{return this.currentScore=Q(t),this.updateUI(),this.currentScore}catch(i){throw console.error("Failed to parse MusicXML:",i),i}}async playScore(t){const i=t||this.currentScore;if(!(!i||this.isAutoPlaying)){this.isAutoPlaying=!0,this.stopAutoPlayRequested=!1,this.updateUI();for(let o=0;o<i.notes.length&&!this.stopAutoPlayRequested;o++){const e=i.notes[o];this.playNote(e.keyIndex,(e.duration||.8)/this.tempoMultiplier);const s=i.notes[o+1];if(s){const n=(s.time-e.time)*1e3/this.tempoMultiplier;await new Promise(a=>{const c=setTimeout(a,n),r=setInterval(()=>{this.stopAutoPlayRequested&&(clearTimeout(c),clearInterval(r),a())},50)})}}this.isAutoPlaying=!1,this.updateUI()}}stopScore(){this.stopAutoPlayRequested=!0}playNote(t,i=2.5){this.audio.playNote(t,this.soundType,i),this.highlightKey(t)}highlightKey(t){const i=this.keyElements.get(t);i&&(i.classList.contains("sp-black-key"),i.classList.add("sp-active"),setTimeout(()=>i.classList.remove("sp-active"),250))}render(){this.container.innerHTML=`
      <style>
        .sp-root {
          display: flex;
          flex-direction: column;
          width: 100%;
          height: 100%;
          background: #020617;
          border-radius: 40px;
          overflow: hidden;
          border: 4px solid #1e293b;
          box-shadow: 0 25px 50px -12px rgba(0,0,0,0.6);
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          user-select: none;
          box-sizing: border-box;
        }
        .sp-root *, .sp-root *::before, .sp-root *::after {
          box-sizing: border-box;
        }

        /* Top Console */
        .sp-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 24px;
          background: linear-gradient(to bottom, #0f172a, #020617);
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }
        .sp-header-left {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .sp-icon {
          width: 40px;
          height: 40px;
          background: #db2777;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          box-shadow: 0 4px 6px rgba(0,0,0,0.3);
          transition: background 0.3s;
        }
        .sp-icon.sp-playing {
          background: #10b981;
          animation: sp-pulse 2s infinite;
        }
        @keyframes sp-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        .sp-icon svg {
          width: 24px;
          height: 24px;
        }
        .sp-title {
          font-size: 22px;
          font-weight: 900;
          color: white;
          line-height: 1.1;
        }
        .sp-subtitle {
          font-size: 10px;
          font-weight: 700;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.3em;
          margin-top: 4px;
        }
        .sp-controls-row {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 16px;
          margin-top: 8px;
        }
        .sp-sound-btns {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
        .sp-sound-btn {
          padding: 6px 12px;
          border-radius: 8px;
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          cursor: pointer;
          transition: all 0.2s;
          background: #1e293b;
          color: #94a3b8;
          border: 1px solid rgba(255,255,255,0.05);
        }
        .sp-sound-btn:hover {
          background: #334155;
          color: #e2e8f0;
        }
        .sp-sound-btn.sp-selected {
          background: #db2777;
          color: white;
          border-color: #f472b6;
          box-shadow: 0 0 15px rgba(236,72,153,0.4);
        }
        .sp-action-group {
          display: flex;
          align-items: center;
          gap: 8px;
          border-left: 1px solid rgba(255,255,255,0.1);
          padding-left: 16px;
        }
        .sp-btn {
          padding: 6px 16px;
          border-radius: 8px;
          font-size: 10px;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          gap: 8px;
          border: 1px solid rgba(255,255,255,0.05);
        }
        .sp-btn svg { width: 12px; height: 12px; }
        .sp-btn-import {
          background: #1e293b;
          color: #cbd5e1;
        }
        .sp-btn-import:hover { background: #334155; }
        .sp-btn-play {
          background: #059669;
          color: white;
          box-shadow: 0 4px 6px rgba(5,150,105,0.2);
        }
        .sp-btn-play:hover { background: #10b981; }
        .sp-btn-stop {
          background: #dc2626;
          color: white;
          box-shadow: 0 4px 6px rgba(220,38,38,0.2);
        }
        .sp-btn-stop:hover { background: #ef4444; }
        .sp-btn-exit {
          padding: 8px 24px;
          background: #1e293b;
          color: white;
          font-weight: 900;
          border-radius: 8px;
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          cursor: pointer;
          border: 1px solid rgba(255,255,255,0.1);
          transition: all 0.2s;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .sp-btn-exit:hover { background: #7f1d1d; }
        .sp-btn-exit svg { width: 16px; height: 16px; }

        .sp-knob-group {
          display: flex;
          align-items: center;
          gap: 6px;
          border-left: 1px solid rgba(255,255,255,0.1);
          padding-left: 16px;
        }
        .sp-knob-label {
          font-size: 9px;
          font-weight: 700;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          min-width: 32px;
        }
        .sp-knob-btn {
          width: 24px;
          height: 24px;
          border-radius: 6px;
          background: #1e293b;
          color: #94a3b8;
          border: 1px solid rgba(255,255,255,0.05);
          cursor: pointer;
          font-size: 16px;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
          line-height: 1;
          padding: 0;
        }
        .sp-knob-btn:hover {
          background: #334155;
          color: #e2e8f0;
        }
        .sp-knob-value {
          font-size: 11px;
          font-weight: 700;
          color: #e2e8f0;
          min-width: 36px;
          text-align: center;
        }

        /* Piano Bed */
        .sp-piano-bed {
          flex: 1;
          background: #0f172a;
          padding: 8px 24px 24px;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        .sp-keys-frame {
          width: 100%;
          aspect-ratio: 52/9;
          background: #1e293b;
          border-radius: 12px;
          padding: 4px;
          box-shadow: inset 0 2px 4px rgba(0,0,0,0.3);
          overflow: hidden;
        }
        .sp-keys-inner {
          position: relative;
          width: 100%;
          height: 100%;
        }
        .sp-white-keys {
          display: flex;
          height: 100%;
        }
        .sp-white-key {
          flex: 1;
          position: relative;
          border-radius: 0 0 6px 6px;
          border-left: 1px solid rgba(148,163,184,0.6);
          border-right: 1px solid rgba(148,163,184,0.6);
          cursor: pointer;
          background: #f8f8f2;
          box-shadow: inset 0 -3px 4px rgba(0,0,0,0.08), 0 2px 4px rgba(0,0,0,0.1);
          transition: background 0.08s;
        }
        .sp-white-key:hover { background: #f0f0ea; }
        .sp-white-key:active { background: #e8e8e0; }
        .sp-white-key.sp-active {
          background: #fce7f3;
          box-shadow: inset 0 -2px 3px rgba(219,39,119,0.15), 0 2px 4px rgba(0,0,0,0.1);
        }
        .sp-key-label {
          position: absolute;
          bottom: 8px;
          left: 0;
          width: 100%;
          text-align: center;
          pointer-events: none;
          opacity: 0.4;
          font-size: 7px;
          font-weight: 900;
          color: #0f172a;
          text-transform: uppercase;
        }
        .sp-black-key {
          position: absolute;
          top: 0;
          height: 62%;
          border-radius: 0 0 4px 4px;
          cursor: pointer;
          z-index: 2;
          background: linear-gradient(to bottom, #333, #222, #111);
          box-shadow: 2px 5px 8px rgba(0,0,0,0.6), inset 0 -1px 2px rgba(255,255,255,0.05);
          transition: background 0.08s;
        }
        .sp-black-key:hover {
          background: linear-gradient(to bottom, #3a3a3a, #2a2a2a, #1a1a1a);
        }
        .sp-black-key:active {
          background: linear-gradient(to bottom, #2a2a2a, #1a1a1a, #0a0a0a);
        }
        .sp-black-key.sp-active {
          background: linear-gradient(to bottom, #f472b6, #ec4899, #be185d);
          box-shadow: 0 2px 4px rgba(0,0,0,0.4), 0 0 15px rgba(236,72,153,0.8);
        }

        /* Bottom Status Bar */
        .sp-footer {
          padding: 24px;
          background: rgba(2,6,23,0.8);
          border-top: 1px solid rgba(255,255,255,0.05);
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 48px;
        }
        .sp-status-item {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .sp-status-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          animation: sp-pulse 2s infinite;
        }
        .sp-status-dot.sp-green { background: #10b981; }
        .sp-status-dot.sp-blue { background: #3b82f6; }
        .sp-status-dot.sp-pink { background: #ec4899; }
        .sp-status-label {
          font-size: 10px;
          font-weight: 700;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.15em;
        }

        @media (max-width: 768px) {
          .sp-header { padding: 12px; flex-wrap: wrap; gap: 8px; }
          .sp-title { font-size: 16px; }
          .sp-piano-bed { padding: 4px 8px 8px; }
          .sp-footer { padding: 12px; gap: 24px; }
          .sp-action-group, .sp-knob-group { border-left: none; padding-left: 0; }
        }
      </style>
      <div class="sp-root">
        <div class="sp-header">
          <div class="sp-header-left">
            <div class="sp-icon" id="sp-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>
              </svg>
            </div>
            <div>
              <div class="sp-title" id="sp-title">SODOR PIANO STUDIO</div>
              <div class="sp-subtitle" id="sp-subtitle">Integrated Synthesis System</div>
              <div class="sp-controls-row">
                <div class="sp-sound-btns" id="sp-sound-selector"></div>
                <div class="sp-knob-group">
                  <span class="sp-knob-label">Vol</span>
                  <button class="sp-knob-btn" id="sp-vol-down">&minus;</button>
                  <span class="sp-knob-value" id="sp-vol-value">80%</span>
                  <button class="sp-knob-btn" id="sp-vol-up">+</button>
                </div>
                <div class="sp-knob-group">
                  <span class="sp-knob-label">Tempo</span>
                  <button class="sp-knob-btn" id="sp-tempo-down">&minus;</button>
                  <span class="sp-knob-value" id="sp-tempo-value">1.0&times;</span>
                  <button class="sp-knob-btn" id="sp-tempo-up">+</button>
                </div>
                <div class="sp-action-group">
                  <input type="file" id="sp-xml-import" style="display:none" accept=".musicxml,.xml">
                  <button class="sp-btn sp-btn-import" id="sp-import-btn">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
                    </svg>
                    Import XML
                  </button>
                  <button class="sp-btn sp-btn-play" id="sp-play-btn" style="display:none">
                    <svg viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                    Play Song
                  </button>
                  <button class="sp-btn sp-btn-stop" id="sp-stop-btn" style="display:none">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                    Stop
                  </button>
                  <button class="sp-btn-exit" id="sp-exit-btn">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                    Exit Studio
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="sp-piano-bed">
          <div class="sp-keys-frame">
            <div class="sp-keys-inner" id="sp-keys-bed">
              <div class="sp-white-keys" id="sp-white-keys"></div>
            </div>
          </div>
        </div>

        <div class="sp-footer">
          <div class="sp-status-item">
            <div class="sp-status-dot sp-green"></div>
            <span class="sp-status-label">A0 Range Limit</span>
          </div>
          <div class="sp-status-item">
            <div class="sp-status-dot sp-blue"></div>
            <span class="sp-status-label">Multi-Touch Ready</span>
          </div>
          <div class="sp-status-item">
            <div class="sp-status-dot sp-pink"></div>
            <span class="sp-status-label">C8 Range Limit</span>
          </div>
        </div>
      </div>
    `,this.setupEvents(),this.renderKeys(),this.renderSoundSelector()}setupEvents(){const t=this.container.querySelector("#sp-import-btn"),i=this.container.querySelector("#sp-exit-btn"),o=this.container.querySelector("#sp-xml-import"),e=this.container.querySelector("#sp-play-btn"),s=this.container.querySelector("#sp-stop-btn");i.onclick=()=>{this.onExit?this.onExit():console.log("Exit Studio clicked")},t.onclick=()=>o.click(),o.onchange=l=>{const f=l.target.files[0];if(!f)return;const m=new FileReader;m.onload=async p=>{var y;const d=(y=p.target)==null?void 0:y.result;await this.loadMusicXml(d)},m.readAsText(f)},e.onclick=()=>this.playScore(),s.onclick=()=>this.stopScore();const n=this.container.querySelector("#sp-vol-down"),a=this.container.querySelector("#sp-vol-up"),c=this.container.querySelector("#sp-tempo-down"),r=this.container.querySelector("#sp-tempo-up");n.onclick=()=>{this.audio.volume=Math.round((this.audio.volume-.1)*10)/10,this.updateUI()},a.onclick=()=>{this.audio.volume=Math.round((this.audio.volume+.1)*10)/10,this.updateUI()},c.onclick=()=>{this.tempoMultiplier=Math.max(.25,Math.round((this.tempoMultiplier-.25)*4)/4),this.updateUI()},r.onclick=()=>{this.tempoMultiplier=Math.min(2,Math.round((this.tempoMultiplier+.25)*4)/4),this.updateUI()}}renderKeys(){const t=this.container.querySelector("#sp-white-keys"),i=this.container.querySelector("#sp-keys-bed");t.innerHTML="",this.keyElements.clear();let o=0;const e=[],s=[];for(let a=0;a<88;a++){const c=(a+9)%12,r=W[c],l=Math.floor((a+9)/12);r.includes("#")?s.push({i:a,noteName:r,octave:l,whiteBefore:o}):(e.push({i:a,noteName:r,octave:l}),o++)}e.forEach(a=>{const c=document.createElement("div");if(c.className="sp-white-key",c.onmousedown=()=>this.playNote(a.i),c.ontouchstart=r=>{r.preventDefault(),this.playNote(a.i)},a.noteName==="C"||a.i===0||a.i===87){const r=document.createElement("div");r.className="sp-key-label",r.textContent=`${a.noteName}${a.octave}`,c.appendChild(r)}t.appendChild(c),this.keyElements.set(a.i,c)});const n=1/52*100*.6;s.forEach(a=>{const c=document.createElement("div");c.className="sp-black-key";const r=a.whiteBefore/52*100;c.style.left=`${r-n/2}%`,c.style.width=`${n}%`,c.onmousedown=()=>this.playNote(a.i),c.ontouchstart=l=>{l.preventDefault(),this.playNote(a.i)},i.appendChild(c),this.keyElements.set(a.i,c)})}renderSoundSelector(){const t=this.container.querySelector("#sp-sound-selector"),i=Object.keys(j);t.innerHTML=i.map(o=>`<button class="sp-sound-btn ${this.soundType===o?"sp-selected":""}" data-type="${o}">${j[o].name}</button>`).join(""),t.querySelectorAll("button").forEach(o=>{o.onclick=()=>this.setSoundType(o.getAttribute("data-type"))})}updateUI(){const t=this.container.querySelector("#sp-play-btn"),i=this.container.querySelector("#sp-stop-btn"),o=this.container.querySelector("#sp-title"),e=this.container.querySelector("#sp-subtitle"),s=this.container.querySelector("#sp-icon");this.isAutoPlaying?(s.classList.add("sp-playing"),e.textContent="Automated Performance System"):(s.classList.remove("sp-playing"),e.textContent="Integrated Synthesis System"),this.currentScore&&(t.style.display=this.isAutoPlaying?"none":"flex",i.style.display=this.isAutoPlaying?"flex":"none",o.textContent=this.isAutoPlaying?`PLAYING: ${this.currentScore.title}`:`SCORE: ${this.currentScore.title}`);const n=this.container.querySelector("#sp-vol-value"),a=this.container.querySelector("#sp-tempo-value");n&&(n.textContent=`${Math.round(this.audio.volume*100)}%`),a&&(a.textContent=`${this.tempoMultiplier.toFixed(2).replace(/0$/,"")}×`),this.renderSoundSelector()}}const $=document.getElementById("piano-container");$&&new Y($);
