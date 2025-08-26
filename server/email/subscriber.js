const db = require('../db')

async function addSubscriber(subscriber) {
    console.log('subscriber ... ', subscriber);
    let email = subscriber.email;
    try {
        if (process.env.DB_CLIENT === 'pg') {
            const query = `
                insert into tdm.subscribers (email)
                values($1)
                ON CONFLICT (email) DO NOTHING
                returning email;
            `;

            const result = await db.query(query, [email]);
            if (result.rows.length === 0) {
                return {
                    success: false,
                    message: "Email already subscribed!"
                };
            }

            return {
                success: true,
                email: result.rows[0]
            };
        } else if (process.env.DB_CLIENT === 'supabase') {
            const { data, error } = await db
                .from('subscribers')
                .insert({email: email});
            if (error) throw error;
            
        }
    } catch (err) {
        console.error('Error adding a subscriber:', err);
    }
}

module.exports = { addSubscriber };