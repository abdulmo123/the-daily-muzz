const fs = require('fs');
const path = require('path')
require('dotenv').config();
const pool = require('../db')
const nodemailer = require('nodemailer');

// email transporter
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT || 587,
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
})

