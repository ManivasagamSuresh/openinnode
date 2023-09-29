const mongodb = require("mongodb");
const env = require("dotenv").config();
const url = process.env.MONGO_URL;
const mongoClient =new mongodb.MongoClient(url)
let db
let connect


const mongoConnect = async()=>{
    connect = await mongoClient.connect();
    db = connect.db("OPENIN");
    console.log("dbconnected");
    return db;
}
const MongoDisconnet = async()=>{
    const disconnect =  await connect.close();
    return disconnect;

}

module.exports = {mongoConnect,MongoDisconnet,db,connect};