const express = require('express');
const app = express()
const path = require("path");
var bodyParser = require("body-parser");

app.set("view engine","ejs");
app.set("views",__dirname);
app.use(bodyParser.urlencoded({extended:false}));
app.use(express.static(__dirname+"/public"));

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname+"/index.html"));
})
app.get('/adminlogin', function (req, res) {
    res.sendFile(path.join(__dirname+"/login.html"));
})
app.get('/candidateregister', function (req, res) {
    res.sendFile(path.join(__dirname+"/register.html"));
})

app.get("/admin", function (req, res) {

    var mysql = require("mysql");
    var connection = mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",
      database: "vikram",
    });
    connection.connect();
    console.log("connected to database");
 
    connection.query("SELECT * FROM candidate_info", function (err, result) {

        if(err) throw err;
        res.render("admin",{bdata:result});
    });
    connection.end();
    // res.sendFile(path.join(__dirname + "/home.html"));
  });
  
 
app.post("/candidate_register",(req,res)=>{
    const name = req.body.name;
    const email = req.body.email;
    const phone = req.body.phone;
    const age = req.body.age;
    const gender = req.body.gender;
    const jobID = req.body.jobID;
    const college =req.body.college

    var data = {
        name:name,
        email:email,
        phone:phone,
        age:age,
        gender:gender,
        jobID:jobID,
        college:college
    };
    var mysql = require("mysql");
    var connection = mysql.createConnection({
        host:"localhost",
        user:"root",
        password:"",
        database:"vikram"
    });
    connection.connect();

    connection.query("INSERT INTO candidate_info SET?",data, function(err,result,fields){
        {
            if(err) throw err;
            else
                console.log("data inserted");
                
        };
    });
    connection.end();
    alert("Successfully registered for the internship");
    res.sendFile(path.join(__dirname+"/index.html"));
});

app.post("/adminauth",(req,res)=>{
    
    const email = req.body.email;
    const password = req.body.password;
    
    var mysql = require("mysql");
    var connection = mysql.createConnection({
        host:"localhost",
        user:"root",
        password:"",
        database:"vikram"
    });
    connection.connect();
    
    connection.query("SELECT * FROM admin WHERE email =?",email, function(err,result){
        if(err) throw err;
        else{
            if(result.length == 0)
            {
                console.log ("user not available");
                res.sendFile(path.join(__dirname+"/login.html"));
            }
            else if(result[0].Password == password)
            {
                console.log("login succesfull");
                res.sendFile(path.join(__dirname+"/home.html"));
            }
            else{
                console.log("email/password error");
                res.sendFile(path.join(__dirname+"/login.html"));
            }
        }    
    });
    connection.end();
});

app.get("/delete/(:ID)", function (req, res) {
    var did = req.params.ID; 
    console.log(did);
    var mysql = require("mysql"); 
    var connection = mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",
      database: "vikram",
    });
    connection.connect();
    var sql = "DELETE FROM candidate_info WHERE ID=?";
    connection.query(sql, did, function (err, result) {
      console.log("deleted record");
    });
    connection.end();
    res.redirect(req.get("referer"));
  });

app.get("/edit/(:ID)/(:s)", function (req, res) {
    var id = req.params.ID; 
    console.log(id);
    var sel = req.params.s;
    if (sel == 0) {
      sel = 1;
    } else {
      sel = 0;
    }
    var mysql = require("mysql");
    var connection = mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",
      database: "vikram",
    });
    let udata = [sel, id];
    connection.connect();
    connection.query(
        "UPDATE candidate_info SET selected=? WHERE ID=?",
        udata,
        function (err, res) {
          if (err) throw err;
          console.log("updated");
        }
      );
      connection.end();
      res.redirect(req.get("referer"));
    });
    
  
app.listen(3000);
console.log("server running");