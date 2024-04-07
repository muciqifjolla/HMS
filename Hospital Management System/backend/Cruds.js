const express  = require("express"); //importimi i express modulit
const cors = require("cors");//importimi i cors modulit
const mysql = require("mysql");//importimi i mysql modulit


const app  = express();//instance e exppress modulit
app.use(express.json());
app.use(cors());


//lidhja me db
const db = mysql.createConnection({

    host:"localhost",
    user:"root",
    password:"",
    database:"hms"
})



//crudi per me lexu te dhana
app.get("/medicine", (req, res) =>{
    const sql = "SELECT * FROM medicine";
    db.query(sql, (err, data)=>{

        if(err) return res.json("Error");
        return res.json(data); 
    })
})

app.get("/medicine/:id", (req, res) => {
    const id = req.params.id;
    const sql = "SELECT * FROM medicine WHERE Medicine_ID = ?";
    db.query(sql, [id], (err, data) => {
        if (err) {
            console.error("Error fetching medicine:", err);
            return res.status(500).json({ error: "Internal Server Error" });
        }
        return res.json(data);
    });
});

//crudi per me add te dhana
app.post('/medicine/create', (req, res)=>{
    const sql = "INSERT INTO medicine (`M_name`, `M_Quantity`, `M_Cost`) VALUES (?, ?, ?)";
    const values = [
        req.body.name,
        parseInt(req.body.quantity),
        parseFloat(req.body.cost)
    ];
    db.query(sql, values, (err, data)=>{ 
        if(err)return res.json("Error");
        return res.json(data);
    });
});


//crudi per me update te dhana
app.put('/medicine/update/:id', (req, res) => {//qito sjon quotes qeshtu ' po qeshtu `
    const sql = "UPDATE medicine SET `M_name`=?, `M_Quantity`=?, `M_Cost`=? WHERE Medicine_ID=?";

    const values = [    
        req.body.name,
        parseInt(req.body.quantity),
        parseFloat(req.body.cost),
        req.params.id
    ];
    db.query(sql, values, (err, result) => {
        if(err)return res.json("Error");
        return res.json(result);
    });
});


//crudi per me delete te dhana
app.delete('/medicine/:id', (req, res) => {
    const sql = "DELETE FROM medicine WHERE Medicine_ID=?";
    const id = req.params.id;
    db.query(sql, id, (err, data) => {
        if (err) return res.json("Error");
        return res.json(data);
    });
});



//testimi me back a u lidhe
app.listen(9004,() =>{
    console.log("listening");
})