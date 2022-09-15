//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
var _ = require('lodash');
const { lowerCase } = require("lodash");
const mongoose = require("mongoose");

const homeStartingContent = "Welcome to my Blog Page. I write about my daily life here. Start knowing me by wandering in this blog....";
const aboutContent = "Hello !\n I am Kedar Deshpande from India. I am pursuing iMTech in ECE from IIIT Bangalore.";
const contactContent = "Contact me on my email: kdeshpande2001@gmail.com";
let posts=[];

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
mongoose.connect('mongodb://localhost:27017/blogDB');


const postSchema={
  title: String,
  content: String
};
const Post = mongoose.model("Post",postSchema);



app.get("/",function(req,res){
  Post.find({},function(err,postArray){
    if(!err && postArray)
      posts=postArray;
      const jsobjHome = {
        homeStartingContent: homeStartingContent,
        posts: posts
      };
    res.render("home",jsobjHome);
  });
  
});
app.get("/about",function(req,res){
  const jsobjAbout = {
      aboutContent: aboutContent
    };
  res.render("about",jsobjAbout);
});
app.get("/contact",function(req,res){
  const jsobjContact = {
      contactContent: contactContent
    };
  res.render("contact",jsobjContact);
});
app.get("/compose",function(req,res){
  res.render("compose");
});

app.get("/posts/:postId",function(req,res){
  
  Post.findOne({_id: req.params.postId},function(err,post){
    if(!err && post)
    res.render("post",post);
  });
});

app.post("/compose",function(req,res){
  const newPost = {
    title: req.body.postTitle,
    content: req.body.postContent
  };
  
  const post=new Post(newPost);
  post.save(function(err){
    if(!err)
    res.redirect("/");
  });
  
});
//sudo chown mongodb:mongodb /tmp/mongodb-27017.sock











app.listen(3000, function() {
  console.log("Server started on port 3000");
});
