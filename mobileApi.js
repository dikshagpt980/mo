let express = require("express");
let app = express();
app.use(express.json());
app.use(function(req,res,next){
    res.header("Access-Control-Allow-Origin","*");
    res.header(
        "Access-Control-Allow-Methods",
        "GET,POST,OPTIONS,PUT,PATCH,DELETE,HEAD"
    );
    res.header(
        "Access-Control-Allow-Headers",
        "Origin ,X-Requested-With, Content-Type, Accept"
    );
    next();
});

// const port = 2410;

var port = process.env.PORT || 2410;
app.listen(port ,()=> console.log(`Node app listening on port ${port}!`));

let mysql = require("mysql");
let connData = {
    host : "localhost",
    user : "root",
    password : "",
    database : "testDB"
}

let {mobileData} = require("./mobiles.js");

app.get("/svr/mobiles/reset",function(req,res){
    let connection = mysql.createConnection(connData);
    let sql1 = "DELETE FROM mobileData";
    connection.query(sql1,function(err,result){
        if(err) console.log(err);
        else{
            let arr = mobileData.map((s)=>[s.name,s.price,s.brand,s.RAM,s.ROM,s.OS]);
            let sql = "Insert INTO mobileData(name,price,brand,RAM,ROM,OS) VALUES ?";
            connection.query(sql,[arr],function(err1,result1){
                if(err) console.log(err1);
                else res.send(result1);
            });
        }
    })
});

app.get("/svr/mobiles",function(req,res){ 
    let {brand="",ram="",rom="",os=""} = req.query;
    let connection = mysql.createConnection(connData);
    if(brand || ram || rom || os){
        let sql1 = "SELECT * FROM mobileData WHERE ";
        let a = [];
        let str = "";
        if(brand){
            let br1 = brand.split(',');
            a = a.concat(br1);
            let br2 = br1.map((s,index)=>index>0?`OR brand = ?`:`brand = ?`)
            let br = br2.join(" ");
            console.log(a);
            str += `(${br})`;
        }
        if(ram){
            let br1 = ram.split(',');
            a = a.concat(br1);
            let br2 = br1.map((s,index)=>index>0?`OR RAM = ?`:`RAM = ?`)
            let br = br2.join(" ");
            console.log(a);
            str += str? ` AND (${br}) `:`(${br})`;
        }
        if(rom){
            let br1 = rom.split(',');
            a = a.concat(br1);
            let br2 = br1.map((s,index)=>index>0?`OR ROM = ?`:`ROM = ?`)
            let br = br2.join(" ");
            str += str? ` AND (${br}) `:`(${br})`;
        }
        sql1 += str;
        console.log(sql1)
        connection.query(sql1,a,function(err,result){
            if(err) console.log(err)
            else{
                res.send(result)
            }
        });
    }
    else{
        let sql = "SELECT * FROM mobileData";
        connection.query(sql,function(err,result){
            if(err) console.log(err)
            else res.send(result);
        });
    }
});

app.get("/svr/mobiles/:name",function(req,res){
    let name = req.params.name
    let connection = mysql.createConnection(connData);
    let sql = "SELECT * FROM mobileData WHERE name=?";
    connection.query(sql,name,function(err,result){
        if(err) console.log(err)
        else res.send(result);
    });
});

app.get("/svr/mobiles/brand/:br",function(req,res){
    let brand = req.params.br;
    let connection = mysql.createConnection(connData);
    let sql = "SELECT * FROM mobileData WHERE brand=?";
    connection.query(sql,brand,function(err,result){
        if(err) console.log(err)
        else res.send(result);
    });
});

app.get("/svr/mobiles/ram/:rm",function(req,res){
    let ram = req.params.rm;
    let connection = mysql.createConnection(connData);
    let sql = "SELECT * FROM mobileData WHERE RAM=?";
    connection.query(sql,ram,function(err,result){
        if(err) console.log(err)
        else res.send(result);
    });
});

app.get("/svr/mobiles/rom/:ro",function(req,res){
    let rom = req.params.ro;
    let connection = mysql.createConnection(connData);
    let sql = "SELECT * FROM mobileData WHERE ROM=?";
    connection.query(sql,rom,function(err,result){
        if(err) console.log(err)
        else res.send(result);
    });
});

app.get("/svr/mobiles/os/:os",function(req,res){
    let os = req.params.os;
    let connection = mysql.createConnection(connData);
    let sql = "SELECT * FROM mobileData WHERE OS=?";
    connection.query(sql,os,function(err,result){
        if(err) console.log(err)
        else res.send(result);
    });
});

app.post("/svr/mobiles",function(req,res){
    let body = req.body;
    let arr = [body.name,body.price,body.brand,body.RAM,body.ROM,body.OS];
    console.log(arr);
    let connection = mysql.createConnection(connData);
    let sql = "INSERT INTO mobileData(name,price,brand,RAM,ROM,OS) VALUES (?)";
    connection.query(sql,[arr],function(err,result){
        if(err) console.log(err);
        else res.send(result);
    })
})

app.put("/svr/mobiles/:name",function(req,res){
    let name = req.params.name; 
    let body = req.body;
    console.log(name,body);
    let connection = mysql.createConnection(connData);
    let sql = "UPDATE mobileData SET ? WHERE name=?";
    connection.query(sql,[body,name],function(err,result){
        if(err) console.log(err);
        else res.send(result);
    })
})

app.delete("/svr/mobiles/:name",function(req,res){
    let name = req.params.name; 
    let connection = mysql.createConnection(connData);
    let sql = "DELETE from mobileData WHERE name=?";
    connection.query(sql,name,function(err,result){
        if(err) console.log(err);
        else res.send(result);
    })
})

