const dotenv = require('dotenv');
const { createClient } = require('@supabase/supabase-js');
dotenv.config();

const { Pool } = require('pg');

let db;

if (process.env.DB_CLIENT === 'pg') {
    db = new Pool({
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        database: process.env.DB_NAME,
        password: process.env.DB_PASSWORD,
        port: process.env.DB_PORT
    });
} else if (process.env.DB_CLIENT === 'supabase') {
    db = createClient(
        process.env.SUPABASE_URL,
        process.env.SUPABASE_API_KEY
    );
} else {
    throw new Error('No client specified ... (use pg or supabase) ')
}

module.exports = db;