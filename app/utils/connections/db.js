import mysql from 'mysql2/promise';
require('dotenv').config();

export default async function executeQuery({ query, values }) {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME, 
        });
    
        const [results, fields] = await connection.query(query, values);
        await connection.end()
        return results
    } catch (error) {
        console.log(error)
        throw error
    }
}