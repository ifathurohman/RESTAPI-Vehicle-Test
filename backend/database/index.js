const mongoose = require("mongoose");
const { dbHost, dbPass, dbName, dbPort, dbUser } = require("../app/config");

let connectionString;

if ((process.env.NODE_ENV === "production")) {
  connectionString = `mongodb://${dbUser}:${dbPass}@ac-yetqsya-shard-00-00.tq3pyhw.mongodb.net:27017,ac-yetqsya-shard-00-01.tq3pyhw.mongodb.net:27017,ac-yetqsya-shard-00-02.tq3pyhw.mongodb.net:27017/?replicaSet=atlas-zwpb65-shard-0&ssl=true&authSource=admin&retryWrites=true&w=majority&appName=Cluster0`;
} else {
  connectionString = `mongodb://${dbUser}:${dbPass}@${dbHost}:${dbPort}/${dbName}?authSource=admin`;
}

// Connect to MongoDB
mongoose.connect(connectionString, {});

const db = mongoose.connection;

module.exports = db;
