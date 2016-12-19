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
email: String,
vote1: String,
vote2: String,
vote3: String,
vote4: String,
vote5: String,
vote6: String,
vote7: String,
vote8: String,
vote9: String,
vote10: String
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

app.get("/", function(req,res){
	Vote.find({},function(err,votes){
		if(err){
			console.log("deuruim /");
		} else {
			res.render("todos",{votes:votes});
		}
	})
})

app.post("/vote",function(req,res){
	console.log(req.body);
 	var voting = req.body;
	Vote.create(voting, function(err,grade){
		if(err){
			console.log("deu ruim");
		} else {
			console.log("added to database")
			res.redirect("/");
		}
	});
});

//============================
// Server listener
//============================
app.listen(process.env.PORT, process.env.IP, function(){
   console.log("StudyPlan está no ar"); 
});

