// TODO: use later

// const { Pool } = require('pg');
// const { createClient } = require('@supabase/supabase-js');
// require('dotenv').config();

// let client;

// if (process.env.DB_CLIENT === 'pg') {
//     client = new Pool({
//         user: process.env.DB_USER,
//         host: process.env.DB_HOST,
//         database: process.env.DB_NAME,
//         password: process.env.DB_PASSWORD,
//         port: process.env.DB_PORT || 5432,
//     });
// } 
// else if (process.env.DB_CLIENT === 'supabase') {
//     client = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_API_KEY);
// }
