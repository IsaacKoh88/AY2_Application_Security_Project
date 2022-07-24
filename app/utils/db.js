import mysql from 'serverless-mysql'
require('dotenv').config();

/** Edit your database mysql server connection configuration in .env file */
const connection = mysql({
    config: {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME, 
    }
});

export default async function executeQuery({ query, values }) {
    try {
        const results = await connection.query(query, values);
        await connection.end();
        return results;
    } catch (error) {
        console.log(error)
        return { error };
    }
}