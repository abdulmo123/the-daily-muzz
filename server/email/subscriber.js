const db = require('../db')

// TODO: how to perform duplicate check (if email exists how to give different response message?)
async function addSubscriber(subscriber) {
    console.log('subscriber to be added ... ', subscriber);
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
                    message: "Email already subscribed!",
                    status: 409
                };
            }

            else {
                return {
                    success: true,
                    message: `Email: ${email} subscribed successfully!`,
                    status: 201
                };
            }
        } else if (process.env.DB_CLIENT === 'supabase') {
            const { data, error } = await db
                .from('subscribers')
                .insert({email: email}, {onConflict: 'email'});
            if (error) throw error;
            
        }
    } catch (err) {
        console.error('Error adding a subscriber:', err);
    }
}

async function removeSubscriber(subscriber) {
    console.log('subscriber to be deleted ...', subscriber);
    let email = subscriber.email;
    console.log('unsubscribe email ... ', email);

    try {
        if (process.env.DB_CLIENT === 'pg') {
            const query = `
                delete from tdm.subscribers
                where email = $1
                returning email;
            `;

            const result = await db.query(query, [email]);
            if (result.rows.length != 0) {
                return {
                    success: true,
                    message: `Email: ${email} unsubscribed successfully!`,
                    status: 200
                };
            } else {
                return {
                    success: false,
                    message: `Email ${email} was not a subscriber.`,
                    status: 404
                }
            }
        }
    } catch (err) {
        console.error('Error deleting subscriber:', err);
    }
}

module.exports = { addSubscriber, removeSubscriber };