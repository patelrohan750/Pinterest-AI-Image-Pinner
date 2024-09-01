const mysql = require('mysql2/promise');
const config = require('../config');

const createConnection = async()=>{
    try {
        const connection = await mysql.createConnection(config.db);
        console.log('Database connection established successfully.');
        return connection;
      } catch (error) {
        console.log(error);
        console.error('Failed to connect to the database:', error.message);
        throw error; // Re-throw the error after logging it
    }
}
const query = async(sql, params) => {
  const connection = await createConnection();
  try {
    const [results] = await connection.execute(sql, params);
    return results;
  } finally {
    await connection.end(); // Ensure the connection is closed after the query
  }
}

module.exports = {
  query
}