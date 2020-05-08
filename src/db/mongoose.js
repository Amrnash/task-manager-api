const mongoose = require("mongoose");

const connectionURI =
  "mongodb+srv://AmrNashaat:Aa0235472091@cluster0-obvn1.mongodb.net/task-manager-api?retryWrites=true&w=majority";
mongoose.connect(connectionURI, {
  useNewUrlParser: true,
  useCreateIndex: true,
});
