//============================
// VARS
//============================
var express = require("express"),
 	app = express(),
	mongoose= require("mongoose"),
	bodyParser = require("body-parser"),
	ejs = require("ejs");

//============================
// DB CONFIG
//============================
mongoose.connect("mongodb://localhost/todos");
mongoose.Promise = global.Promise; 

///// Gravar itens no BD
var itemSchema = new mongoose.Schema({
item: String,
})//	Isso aqui determina a estrutura dos dados que podem existir

var Item = mongoose.model("Item",itemSchema); 
//============================
// CONFIG
//============================
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname + "/public"))
app.use(express.static(__dirname + "/controllers"))
//============================
// ROUTERS
//============================

app.get("/",function(req,res){
	Item.find({},function(err,allitems){
		if(err){
			console.log(err);
		} else {
		res.render("todos",{allitems:allitems});
		}
	})
	});

app.get("/items",function(req,res){
	res.render("items");
	});

app.post("/additem",function(req,res){
	console.log(req.body);
    var itemadded = req.body.item;
	var newItem = {item: itemadded}
	Item.create(newItem, function(err,item){
		if(err){
			console.log(err);
		} else {
			res.redirect("/");
		}
	});
	});

app.post("/delete",function(req,res){
	var itemtodelete = req.body.name;
	Item.findOneAndRemove({item:itemtodelete},function(err){
		if(err){
			console.log(err);
		}
	});
	});

//============================
// Server listener
//============================
app.listen(3001, process.env.IP, function(){
   console.log("ToDos tá no ar"); 
});

