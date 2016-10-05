//============================
// VARS
//============================
var express = require("express"),
 	app = express(),
	mongoose= require("mongoose"),
	bodyParser = require("body-parser"),
	ejs = require("ejs");
	var moment = require('moment');

//============================
// DB CONFIG
//============================
mongoose.connect("mongodb://localhost/todos");
mongoose.Promise = global.Promise; 

///// Gravar itens no BD
var itemSchema = new mongoose.Schema({
item: String,
duedate: {type:Date, default: Date.now},
priority: String,
})//	Isso aqui determina a estrutura dos dados que podem existir

var Item = mongoose.model("Item",itemSchema); 
//============================
// CONFIG
//============================
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname + "/public"));
app.use(express.static(__dirname + "/controllers"));
app.locals.moment = require('moment');

//============================
// ROUTERS
//============================

app.get("/",function(req,res){
	Item.find({},function(err,allitems){
		if(err){
			console.log("deuruim /");
		} else {
//		var duedates = (moment(allitems[0].duedate)).format();
//		console.log(duedates);
		res.render("todos",{allitems:allitems});
		}
	})
	});

app.get("/calendar",function(req,res){
	Item.find({},function(err,allitems2){
		if(err){
			console.log("deuruim calendar");
		} else {
		res.render("calendar",{allitems:allitems2});
		console.log(allitems2);
		}
	})
});


app.get("/items",function(req,res){
	res.render("items");
	});

app.get("/modal",function(req,res){
	res.render("modal");
	});

app.post("/additem",function(req,res){
	var priorityadded = (req.body.priority);
	var dateadded = (req.body.date3) ;
    var itemadded = req.body.item;
	var newItem = {item: itemadded, duedate:dateadded, priority:priorityadded}
	Item.create(newItem, function(err,item){
		if(err){
			console.log("deu ruim");
		} else {
			res.redirect("/");
		}
	});
	});

app.post("/delete",function(req,res){
	var itemtodelete = req.body.id;
	console.log(itemtodelete);
	Item.findByIdAndRemove(itemtodelete,function(err){
		if(err){
			console.log("deu ruim delete");
		}
	});
	});





//============================
// Server listener
//============================
app.listen(3001, process.env.IP, function(){
   console.log("ToDos tá no ar"); 
});

