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
	ejs = require("ejs"),
	moment = require('moment'),
	// user auth
	User = require("./models/user"), 
	passport = require("passport"),
	LocalStrategy = require("passport-local"),
	passportLocalMongoose = require("passport-local-mongoose");


//============================
// CONFIG: user auth
//============================
	app.use(require("express-session")({
		secret: "Todo app is my first app ever",
		resave: false,
		saveUninitialized:false
	}));

	app.use(passport.initialize());
	app.use(passport.session());
	passport.use(new LocalStrategy(User.authenticate()))
	passport.serializeUser(User.serializeUser());
	passport.deserializeUser(User.deserializeUser());
//============================
// CONFIG: DB 
//============================
mongoose.connect("mongodb://localhost/todos");
mongoose.Promise = global.Promise; 

///// Gravar itens no BD
var itemSchema = new mongoose.Schema({
item: String,
duedate: {type:Date, default: Date.now},
priority: String,
username: String
})//	Isso aqui determina a estrutura dos dados que podem existir

var Item = mongoose.model("Item",itemSchema); 
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

app.get("/",isLoggedIn, function(req,res){
	Item.find({"username":req.user.username},function(err,allitems){
		if(err){
			console.log("deuruim /");
		} else {
		res.render("todos",{allitems:allitems, username:req.user.username});
		}
	})

	});

app.get("/calendar",isLoggedIn,function(req,res){
	Item.find({"username":req.user.username},function(err,allitems2){
		if(err){
			console.log("deuruim calendar");
		} else {
		res.render("calendar",{allitems:allitems2,username:req.user.username});
		console.log(allitems2);
		}
	})
});


app.get("/items",isLoggedIn,function(req,res){
	res.render("items", {username:req.user.username});
	});


app.post("/additem",isLoggedIn,function(req,res){
	var priorityadded = (req.body.priority);
	var dateadded = (req.body.date3) ;
    var itemadded = req.body.item;
	var usernameadded = req.user.username;
	var newItem = {item: itemadded, duedate:dateadded, priority:priorityadded, username: usernameadded}
	Item.create(newItem, function(err,item){
		if(err){
			console.log("deu ruim");
		} else {
			res.redirect("/");
		}
	});
	});

app.post("/delete",isLoggedIn,function(req,res){
	var itemtodelete = req.body.id;
	console.log(itemtodelete);
	Item.findByIdAndRemove(itemtodelete,function(err){
		if(err){
			console.log("deu ruim delete");
		}
	});
	});


//============================
// Auth ROUTERS
//============================

app.get("/register",function(req,res){
	res.render("register");
})

app.post("/register",function(req,res){
	req.body.username;
	req.body.password;
	User.register(new User({username: req.body.username}),req.body.password,function(err,user){
		if(err){
			console.log(err);
			return res.render("register");
		}
		passport.authenticate("local")(req,res,function(){
			res.redirect("/");
		})
	})
})
//============================
// Login ROUTERS
//============================

function isLoggedIn(req,res,next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
}


app.get("/login",function(req,res){
	res.render("login");
})

app.post("/login", passport.authenticate("local",{
		successRedirect:"/",
		failureRedirect:"/login"
}),	function(req,res){
	}
);

app.get("/logout",function(req,res){
	req.logout();
	res.redirect("/");
});

//============================
// Server listener
//============================
app.listen(3001, process.env.IP, function(){
   console.log("ToDos tá no ar"); 
});

