const pool = require('../db')

async function addSubscriber(subscriber) {
    const query = `
        insert into tdm.subscribers (email)
        values($1)
        ON CONFLICT (email) DO NOTHING
        returning *;
    `;

    const email = subscriber.email
    try {
        const result = await pool.query(query, [email]);
        if (result.rows.length === 0) {
            return { success: false, message: "Email already subscribed!"};
        }
        return { success: true, email: result.rows[0] };
    } catch (err) {
        console.error('Error adding a subscriber:', err);
    }
}

module.exports = { addSubscriber };