// var express = require("express"),
//  	app = express(),
// 	mongoose= require("mongoose"),
// 	bodyParser = require("body-parser"),
// 	ejs = require("ejs");
//============================
// DB CONFIG
//============================


//============================
// FrontEnd Listeners
//============================
console.log("hello connected");
//Click to delete Todo
	$("table").on("click", "td", function(event){
	    $(this.parentElement).fadeOut(500,function(){
		$(this).remove();
		});
		event.stopPropagation();
		console.log(this.id);
        //$.post("/delete", {id: $(this).text()});
        $.post("/delete", {id: (this).id});
	});

			
//	

