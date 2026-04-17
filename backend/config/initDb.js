const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

const setupDatabase = async () => {
    let connection;
    try {
        console.log('Connecting to database...');
        connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            multipleStatements: true // Essential for running multiple SQL statements
        });

        console.log('Reading schema.sql...');
        const schemaPath = path.join(__dirname, '../schema.sql');
        const schemaSql = fs.readFileSync(schemaPath, 'utf8');

        console.log('Executing schema...');
        await connection.query(schemaSql);

        console.log('Database setup completed successfully.');
    } catch (error) {
        console.error('Error setting up database:', error.message);
        if (error.code === 'ER_BAD_DB_ERROR') {
            console.error(`Hint: Make sure the database "${process.env.DB_NAME}" exists.`);
        }
    } finally {
        if (connection) {
            await connection.end();
        }
        process.exit();
    }
};

setupDatabase();
