const express  = require("express"); 
const cors = require("cors");
require("dotenv").config();
const db = require("./db");
const MedicineRoute = require("./routes/MedicineRoutes");
const AppointmentRoute = require("./routes/AppointmentRoutes");
 


const app  = express();
app.use(express.json());
app.use(cors());
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

app.use((req, res, next) => {
    req.db = db;
    next();
});

app.use("/api", MedicineRoute);
app.use("/api", AppointmentRoute);


module.exports = app;


