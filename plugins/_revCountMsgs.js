/**
 * Plugin desarrollado por el proyecto del bot ANI MX SCANS de ReyEndymion
 * https://github.com/ReyEndymion
 */

//en sus proyectos debe ir ofuscado por que mi objetivo es difundir mi bot a travez de los devs o editores que quieran o puedan participar en un futuro en mi proyecto

import { Low, JSONFile } from 'lowdb';
const isNumber = (x) => typeof x === 'number' && !isNaN(x);

const databaseFile = './countMessagesReg.json';
const adapter = new JSONFile(databaseFile);
const db = new Low(adapter);

async function handler (m, {conn, args, participants, isAdmin}) {
await db.read();
let participantIds = new Set(participants.map(u => u.id));
let users = db.data.bot[conn.user.jid].chats.groups[m.chat].users
for (const participant of participants) {
let userId = await participant.id;
if (!(userId in users)) {
db.data.bot[conn.user.jid].chats.groups[m.chat].users[userId] = {
msgcount: {
count: 0,
time: 0
}
};
await db.write();
console.log(`Usuario ${userId} inicializado en la base de datos.`);
}
//
}
for (let userId in users) {
if (!participantIds.has(userId) || typeof users[userId] !== 'object' || users[userId] === null) {
}
}
let resp = ''
try {
if (/\d+/g.test(args[0]) && isAdmin) {
let rawNumber = args.toString().replace(/,/g, '').match(/\d+/g).toString();
let numero;
if (rawNumber.startsWith(52) && !rawNumber.startsWith('521')) {
numero = rawNumber.replace(/^52/, '521');
} else {
numero = rawNumber;
}
let who = args ? numero + '@s.whatsapp.net' : m.mentionedJid.toString();
if (!(who in users)) {
db.data.bot[conn.user.jid].chats.groups[m.chat].users[who] = {};
} else {
if (!('msgcount' in users[who])) users[who].msgcount = {};
if (!isNumber(users[who].msgcount.count)) {
users[who].msgcount.count = 0;
}
if (!isNumber(users[who].msgcount.time)) {
users[who].msgcount.time = 0;
}
}
let data = { msgcount: { count: 0, time: 0 } };
if (!(who in users)) db.data.bot[conn.user.jid].chats.groups[m.chat].users[who] = data;
let count = users[who].msgcount.count;
resp = `@${who.split('@')[0]} tiene ${count} mensajes`;
} else if (/t|todos/i.test(args[0]) && isAdmin) {
resp = `Total de usuarios: ${participants.length}\n\n`;
for (let usuario in users) {
let user = users[usuario];
let tag = usuario.split('@')[0];
let count = user.msgcount ? user.msgcount.count : 0;
resp += `@${tag} tiene ${count} mensajes\n`;
}
} else {
console.log('revcontador:', participants);
let who;

if (isAdmin) {
if (m.quoted && m.quoted.sender) {
who = m.quoted.sender;
} else {
who = m.sender;
}
} else {
who = m.sender;
}
if (!(who in users)) {
db.data.bot[conn.user.jid].chats.groups[m.chat].users[who] = {};
} else {
if (!('msgcount' in users[who])) users[who].msgcount = {};
if (!isNumber(users[who].msgcount.count)) {
users[who].msgcount.count = 0;
}
if (!isNumber(users[who].msgcount.time)) {
users[who].msgcount.time = 0;
}
}
let count = users[who].msgcount.count;
resp = `@${who.split('@')[0]} tiene ${count} mensajes`;
}
} catch (error) {
resp = `${error.stack}`
}
let txt = '';
let count = 0;
if (resp === undefined) return
for (const c of resp) {
await new Promise(resolve => setTimeout(resolve, 15));
txt += c;
count++;
if (count % 10 === 0) {
await conn.sendPresenceUpdate('composing' , m.chat);
}
}
return conn.sendMessage(m.chat, {text: resp, mentions: conn.parseMention(resp)}, {quoted: m, ephemeralExpiration: 24*60*100, disappearingMessagesInChat: 24*60*100})
}
//handler.admin = true
handler.command = /^revcount/
export default handler