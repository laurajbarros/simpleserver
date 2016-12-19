//============================
// VARS
//============================
	// server 
var express = require("express"),
 	app = express(),
 	//DB
	mongoose= require("mongoose"),
	//other
	bodyParser = require("body-parser"),
	ejs = require("ejs");

//============================
// CONFIG: DB 
//============================
mongoose.connect("mongodb://laurajbarros:voting-server@ds139278.mlab.com:39278/voting-server");
// mongoose.connect("mongodb://localhost/vote");
mongoose.Promise = global.Promise; 

//============================
// CONFIG: Vote
//============================
///// Gravar grade no BD
var votingSchema = new mongoose.Schema({
name: String,
date: String,
email: String,
finalvote: String
})

var Vote = mongoose.model("Vote",votingSchema);

//============================
// CONFIG: Express, ejs & Body Parser
//============================
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname + "/public"));
app.use(express.static(__dirname + "/controllers"));
app.locals.moment = require('moment');

//============================
// ROUTERS
//============================

//get
app.get("/", function(req,res){
	Vote.find({},function(err,votes){
		if(err){
			console.log("deuruim /");
		} else {

			res.render("todos",{votes:votes});
		}
	})
})

//delete all
app.post("/deleteitall", function(req,res){
	console.log("we got here")
	Vote.remove({},function(err,votes){
		if(err){
			console.log("didnt delete");
		} else {
			res.redirect("/");
		}
	})
})

//vote
app.post("/vote",function(req,res){
	var voting = req.body;
	voting.date = Date();
	if(voting.vote1){
		voting.finalvote = "vote1";
	} else if(voting.vote2){
		voting.finalvote = "vote2";
	} else if(voting.vote3){
		voting.finalvote = "vote3";
	} else if(voting.vote4){
		voting.finalvote = "vote4";
	} else if(voting.vote5){
		voting.finalvote = "vote5";
	} else if(voting.vote6){
		voting.finalvote = "vote6";
	} else if(voting.vote7){
		voting.finalvote = "vote7";
	} else if(voting.vote8){
		voting.finalvote = "vote8";
	} else if(voting.vote9){
		voting.finalvote = "vote9";
	} else if(voting.vote10){
		voting.finalvote = "vote10";
	}
	Vote.findOne({"email": req.body.email}, function(err, foundClient){
       if(err){
           res.redirect("http://win.crispgolf.com/failedvote/");
       } else {
       		if(foundClient){
       			console.log("there is already a client");
				res.redirect("http://win.crispgolf.com/failedvote/");
       		} else {
       			Vote.create(voting, function(err,grade){
					if(err){
						console.log("deu ruim");
					} else {
						console.log("added to database")
						res.redirect("http://win.crispgolf.com/successfulvote/");
					}
				});
       		}
       }
   }) 
});

//============================
// Server listener
//============================
app.listen(process.env.PORT, process.env.IP, function(){
   console.log("StudyPlan está no ar"); 
});

