const mongoose = require("mongoose");
const { dbHost, dbPass, dbName, dbPort, dbUser } = require("../app/config");

// -- connection to mongo local
// mongoose.connect(`mongodb://localhost:27017/${dbName}`, {
// });

let connectionString;

if ((process.env.NODE_ENV === "production")) {
  connectionString = `mongodb+srv://${dbUser}:${dbPass}@${dbHost}/${dbName}?retryWrites=true&w=majority&appName=Cluster0`;
} else {
  connectionString = `mongodb://${dbUser}:${dbPass}@${dbHost}:${dbPort}/${dbName}?authSource=admin`;
}

// Connect to MongoDB
mongoose.connect(connectionString, {});

const db = mongoose.connection;

module.exports = db;
