(function(root){
const choose=(a,b)=>!a?b:!b?a:(a.at||0)>(b.at||0)?a:(a.at||0)<(b.at||0)?b:JSON.stringify(a)>JSON.stringify(b)?a:b;
function merge(a,b){if(!a)return b;if(!b)return a;const A=a.learning||{},B=b.learning||{},records={};for(const key of new Set([...Object.keys(A.records||{}),...Object.keys(B.records||{})]))records[key]=choose(A.records?.[key],B.records?.[key]);
const pending=new Map();for(const s of [A,B])for(const r of s.reviews||[]){const at=r.at||s.records?.[r.id]?.at||0;const prev=pending.get(r.id);if(!prev||at>prev.at)pending.set(r.id,{...r,at})}
const reviews=[...pending.values()].filter(r=>!Object.entries(records).some(([id,v])=>id!==r.id&&v.secure&&v.topic===r.topic&&v.focus===r.focus&&v.at>=r.at)).sort((x,y)=>x.at-y.at||x.id.localeCompare(y.id));
const events=new Map();for(const e of [...(A.events||[]),...(B.events||[])])events.set(JSON.stringify([e.id,e.at,e.answer,e.source,e.ok,e.independent]),e);
const assignments={};for(const key of new Set([...Object.keys(a.assignments||{}),...Object.keys(b.assignments||{})]))assignments[key]=choose(a.assignments?.[key],b.assignments?.[key]);
return {version:1,learning:{version:2,records,reviews,events:[...events.values()].sort((x,y)=>y.at-x.at||JSON.stringify(x).localeCompare(JSON.stringify(y))).slice(0,40),exam:choose(A.exam,B.exam)||null,missionSteps:[...new Set([...(A.missionSteps||[]),...(B.missionSteps||[])])].sort(),recognition:[...new Set([...(A.recognition||[]),...(B.recognition||[])])].sort()},assignments,cursor:choose(a.cursor,b.cursor)||null,examSession:choose(a.examSession,b.examSession)||null};}
root.ProgressMerge={merge};if(typeof module!=='undefined')module.exports=root.ProgressMerge;
})(typeof globalThis!=='undefined'?globalThis:this);
