const express = require("express");
require("./mongo/config");

const userRouter = require("./routes/user");
const itemRouter = require("./routes/item");



const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(userRouter);
app.use(itemRouter);



app.listen(port, ()=> {
    console.log(`Server is up on port ${port}`);
})