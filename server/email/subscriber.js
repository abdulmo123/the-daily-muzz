const pool = require('../db')

async function addSubscriber(subscriber) {
    const query = `
        insert into tdm.subscribers (email)
        values($1)
        returning *;
    `;

    const email = subscriber.email
    try {
        const result = await pool.query(query, [email]);
        return result.row[0];
    } catch (err) {
        console.error('Error addign a subscriber:', err);
    }
}

module.exports = { addSubscriber };