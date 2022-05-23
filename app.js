const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const nodemailer=require("nodemailer");
const ejs = require("ejs");
const app = express();

mongoose.connect("mongodb://localhost/ExpenseDB");


app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:true}));

let itemname=[];
let amounts=[]; 
let limit,sum;
let items;
let leftamt,addItem,username;

const ExpenseSchema = new mongoose.Schema({
    name:String,
    email:
    {
       type: String,
       unique:true
    },
    password:String,
    amounts:Number,
    itemname:String,
    leftamount:Number
    
});
const expenseModel = new mongoose.model("Expense",ExpenseSchema);


app.get("/purse_remain",function(req,res){

    if(limit>0)
    {   
        leftamt=limit;
        for(let i =0;i<(amounts.length);i++)
        {
            if(i%2!=0)
            {
             leftamt= leftamt-(-amounts[i]);
             sum+=(-amounts[i]);
            }
        }
        if(leftamt<=0.1*limit)
        {
            var transporter = nodemailer.createTransport({
                service:"gmail",
                auth:{
                    user:"moneyger71@gmail.com",
                    pass:"Moneygr_71"
                }
            });
            const  mailOptions={
                from:"moneyger71@gmail.com",
                to:username,
                subject:"MONEYGER WARNING",
                text:"Reminder!!You have almost reached your monthly limit"
            };
            transporter.sendMail(mailOptions,function(error,info){
                if(error)
                console.log(error);
                else
                console.log("Email Sent!");
            });
        }
        if(leftamt-sum<0)
        res.send("<h1>WARNING!!The amount you have entered is greater than the remaining amount. </h1>")
        console.log(leftamt-sum)
        res.render("purse_remain",{amt:leftamt});
    }
    else
    res.redirect("set_limit");
});

app.get("/set_limit",function(req,res){
    res.render("set_limit");
});

app.post("/set_limit",function(req,res){
    const setFirstLimit=req.body.setlimit;
    limit=setFirstLimit;
    res.redirect("purse_remain");
});
app.get("/add",function(req,res){
    res.render("add",{});
});
app.get("/moneygr",function(req,res){
    res.sendFile(__dirname+"/views/moneygr.html");
});
app.post("/add",function(req,res){

    addItem=req.body.addItem;
      itemname=req.body.items,
     amounts.push(itemname,addItem);
 
    res.redirect("purse_remain");
});
app.get("/details",function(req,res){
    res.render("details",{amountArray:amounts});
});
app.post("/signup",function(req,res){
   const pssword=req.body.pwd;
   const cpassword=req.body.cpwd;
    
    if(pssword===cpassword)
    { 
        const user = new expenseModel({
            thename :req.body.name,
            email:req.body.email,
            password:pssword,
        });
        user.save();
        res.render("registered");
    }else
    res.send("ERROR!!")
   
});
app.post("/login",function(req,res){
    password=req.body.pwd;
    username=req.body.username;
    expenseModel.findOne({email:username},function(err,foundUsers){
            if(foundUsers)
            {
                if(foundUsers.password==password)
                res.redirect("purse_remain");
                else
                res.send("Invalid Credentials");
            }
            else
            res.send("User not found");
        
    })
});
app.listen(3000,function(req,res){
   
    console.log("Server is running on port 3000");
})