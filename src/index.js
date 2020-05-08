const express = require("express");
const cors = require("cors");
require("./db/mongoose");
const userRouter = require("./router/user");
const taskRouter = require("./router/task");
const app = express();
const port = process.env.PORT || 5000;

//this line makes express parses JSON into object for us
app.use(cors());
app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

//fix the CORS error
// app.use((res, req, next) => {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Origin",
//     "X-Requested-With",
//     "Content-Type",
//     "Authorization"
//   );
//   if (req.method === "OPTIONS") {
//     res.header(
//       "Access-Control-Allow-Methods",
//       "PUT",
//       "POST",
//       "PATCH",
//       "DELETE",
//       "GET"
//     );
//     return res.status(200).send();
//   }
// });

app.listen(port, () => {
  console.log("server is up on port: " + port);
});
