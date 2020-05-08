const MongoClient = require("mongodb").MongoClient;

const connectionURI =
  "mongodb+srv://AmrNashaat:Aa0235472091@cluster0-obvn1.mongodb.net/test?retryWrites=true&w=majority";
const databaseName = "task-manager";

const client = new MongoClient(connectionURI, { useNewUrlParser: true });

client.connect((err) => {
  if (err) return console.log("unable to connect to db !");
  const db = client.db(databaseName);
});
