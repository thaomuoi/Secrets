//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const app = express();


console.log(process.env.API_KEY);

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser: true});

const userSchema = new mongoose.Schema({
	email: String,
	password: String
}); 


userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: ["password"] });


const User = mongoose.model("User", userSchema);

app.get("/", function(req,res){
	res.render("home");
});

app.get("/login", function(req,res){
	res.render("login");
});

app.get("/register", function(req,res){
	res.render("register");
});



app.post("/register", function(req,res){
	const user = new User ({
		email: req.body.username,
		password: req.body.password
	});

	user.save(function(err){
		if(err){
			console.log(err);
		}else{
			res.render("secrets");
		}
	});
});

app.post("/login", function(req,res){
	const name = req.body.username;
	const pass = req.body.password;

	User.findOne({email: name}, function(err, foundAccount){
		if(err){
			console.log(err);
		}else{
			if(foundAccount) {
				if(foundAccount.password === pass){
					res.render("secrets");
				}
			}
			
		}
	});
});


app.listen(3000, function(){
	console.log("Server run on port 3000");
});