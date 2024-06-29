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
if (db) {
await db.read();
db.data = db.data || {};
db.data.bot = db.data.bot || {};
db.write();
} else {
db.write();
}

export async function before (m, {conn}) {
if (!m.isGroup) return; 

let bot = db.data.bot[conn.user.jid];
if (typeof bot != 'object') db.data.bot[conn.user.jid] = {}
if (bot) {
let chats = db.data.bot[conn.user.jid].chats
if (typeof chats != 'object') db.data.bot[conn.user.jid].chats = {}
if (chats) {
let groups = db.data.bot[conn.user.jid].chats.groups
if (typeof groups != 'object') db.data.bot[conn.user.jid].chats.groups = {}
if (groups) {
let chat = db.data.bot[conn.user.jid].chats.groups[m.chat];
if (typeof chat != 'object') db.data.bot[conn.user.jid].chats.groups[m.chat] = {}
if (chat) {
let users = db.data.bot[conn.user.jid].chats.groups[m.chat].users
if (typeof users != 'object') db.data.bot[conn.user.jid].chats.groups[m.chat].users = {}
if (users) {
let user = db.data.bot[conn.user.jid].chats.groups[m.chat].users[m.sender]
if (typeof user != 'object') db.data.bot[conn.user.jid].chats.groups[m.chat].users[m.sender] = {}
if (user) {
if (!('msgcount' in user)) user.msgcount = {};
if (!isNumber(user.msgcount.count)) {user.msgcount.count = 0;}
if (!isNumber(user.msgcount.time)) {user.msgcount.time = 0;}
if (m.mtype) {
user.msgcount.count++;
console.log('count: ', user)
}
if(/^resetcount|rc$/i.test(m.text) && isAdmin) {
let resp = ''
try {
const currentTime = Date.now();
const date = new Date(currentTime);
const day = date.getDate();
const monthNames = [
'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
];
const month = monthNames[date.getMonth()];
const year = date.getFullYear();
const formattedDate = `${day} de ${month} de ${year}`;
for (let user in users) {
users[user].msgcount.count = 0;
users[user].msgcount.time = currentTime;
}
// Guardar los cambios en la base de datos
await db.write();
resp = `Se ha reiniciado el contador con fecha => ${formattedDate}`;
} catch (e) {
resp = `${e.stack}`
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

await db.write();
} else {
db.data.bot[conn.user.jid].chats.groups[m.chat].users[m.sender] = {
msgcount: {count: 0, time: 0}
};

}

} else {
db.data.bot[conn.user.jid].chats.groups[m.chat].users = {
[m.sender]: {}
}
}
} else {
db.data.bot[conn.user.jid].chats.groups[m.chat] = {
users: {}
}
}
} else {
db.data.bot[conn.user.jid].chats.groups = {
[m.chat]: {}
}
}
} else {
db.data.bot[conn.user.jid].chats = {
groups: {}
}
}
} else {
db.data.bot[conn.user.jid] = {
chats: {}
}
}
await db.write();

}
