const assert=require('node:assert/strict'),fs=require('node:fs'),E=require('../learning-engine.js');
const html=fs.readFileSync(__dirname+'/../geometry-exam.html','utf8');const bank=JSON.parse(html.match(/const questions=(.*?);\nconst \$/s)[1]);
assert.equal(bank.length,61);assert(bank.every(q=>q.length===6));
const event=(id,ok,independent)=>({id:'q:'+id,topic:bank[id][0],focus:bank[id][5],ok,independent,source:'test',answer:'0',solution:bank[id][4]});
let s=E.blank();E.record(s,event(11,false,false));assert.equal(s.reviews.length,1);let next=E.recommend(s,bank,11);assert.equal(bank[next][0],'Dreieck');assert.equal(bank[next][5],'area');assert.notEqual(next,11);
E.record(s,event(11,true,false));assert.equal(E.topicState(s,'Dreieck').count,0);assert.equal(s.reviews.length,1);
E.record(s,event(next,true,true));assert.equal(s.reviews.length,0);assert.equal(E.topicState(s,'Dreieck').count,1);
E.record(s,event(next,true,true));assert.equal(E.topicState(s,'Dreieck').count,1);
E.record(s,event(11,true,true));E.record(s,event(52,true,true));assert.equal(E.topicState(s,'Dreieck').secure,false,'same skill alone is not readiness');
E.record(s,event(13,true,true));assert.equal(E.topicState(s,'Dreieck').secure,true);
E.record(s,event(12,false,false));assert.equal(E.topicState(s,'Dreieck').secure,false,'new errors reopen review');
assert.equal(E.restore(JSON.stringify(s)).reviews.length,1);assert.deepEqual(E.restore('{bad'),E.blank());
assert.match(E.feedback(bank[11],60),/Teilen durch 2/);assert.match(E.feedback(bank[8],45),/senkrechte Höhe 4/);assert.doesNotMatch(E.feedback(bank[48],45),/9 × 5/);
assert.equal(bank[E.recommend(s,bank,12,'Trapez')][0],'Trapez');
for(let i=0;i<bank.length;i++){const state=E.blank();E.record(state,event(i,false,false));const n=E.recommend(state,bank,i);assert.notEqual(n,i);assert.equal(bank[n][0],bank[i][0]);assert.equal(bank[n][5],bank[i][5],`matching follow-up for ${i}`)}
const mission=JSON.parse(html.match(/const missions=(.*?);\nconst assignments/s)[1])[3];assert.equal(mission.art,'nails');assert.deepEqual(mission.steps.map(q=>q[1]),[30,3,8]);
console.log('Passed: all 61 targeted follow-ups, misconception feedback, first-attempt mastery, repeat/hint safeguards, readiness regression, persistence, filters, salon maths.');

const all=E.blank();bank.forEach((q,i)=>E.record(all,event(i,true,true)));for(const topic of E.topics)assert(E.topicState(all,topic).secure,topic+' can reach secure');console.log('All eight topics can reach the readiness target.');
