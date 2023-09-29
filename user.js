const express = require("express");
const env = require("dotenv").config();
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const jwt_secret = process.env.JWT_SECRET; 
const { mongoConnect } = require("./mongodb");
const mongodb = require("mongodb");

router.post("/signup", async (req, res) => {
  const connection = await mongoConnect();
  const hash = await bcrypt.hash(req.body.password, 10);
  req.body.password = hash;
  req.body.profile = {};
  const user = await connection.collection("user").insertOne(req.body);
  res.status(201).send(user);
});
router.post("/signin", async (req, res) => {
  const connection = await mongoConnect();

  const user = await connection
    .collection("user")
    .findOne({ email: req.body.email });
  if (user) {
    const compare = await bcrypt.compare(req.body.password, user.password);
    if (compare) {
        console.log(jwt_secret);
        const token  = await jwt.sign({_id:user._id},jwt_secret,{expiresIn:"24h"}) ;
        res.status(201).send({"message":"success",token,user});
    } else {
        res.status(404).send("credential wrong");
    }
  } else {
    res.status(404).send("user Not found");
  }
});

router.get("/getUser/:id",async(req,res)=>{
    const connection = await mongoConnect();
    // console.log(req.params.id)
    const user = await connection
      .collection("user")
      .findOne({ _id:new mongodb.ObjectId(req.params.id) });
    //   console.log(user);
      res.status(200).send(user);
})


router.get("/getUserByMail/:mail",async(req,res)=>{
    const connection = await mongoConnect();
    console.log(req.params.mail)
    const user = await connection
      .collection("user")
      .findOne({ email:req.params.mail });
    //   console.log(user);
      res.status(200).send(user);
})

router.put("/addProfile/:id",async(req,res)=>{
    const connection = await mongoConnect();
    const user =await connection.collection('user').updateOne({_id: new mongodb.ObjectId(req.params.id)},{$set:{profile:req.body}});
    res.status(201).send(user);
})

module.exports = router;