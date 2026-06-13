import mysql from 'mysql2/promise';
const url = process.env.DATABASE_URL;
const c = await mysql.createConnection(url);
const [r] = await c.execute("UPDATE categories SET image='/images/cat-biryani.jpg' WHERE slug='biryani'");
console.log('biryani category updated rows:', r.affectedRows);
await c.end();
