const express = require("express");
const app = express();
const cors = require("cors");
const user = require("./user");

app.use(express.json());
app.use(cors({
    origin:"http://localhost:3000"
}))

app.use("/user",user)


app.listen(process.env.PORT || 5000 ,()=>{
    console.log("connected")
});