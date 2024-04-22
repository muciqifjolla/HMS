const express = require("express");
const cors = require("cors");
require("dotenv").config();

const sequelize = require("./config/database");
const MedicineRoute = require("./routes/MedicineRoutes");
const Emergency_ContactRoute = require("./routes/Emergency_ContactRoutes");
// Other routes if needed...

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 9004;

// Ensure database connection is established
//MOS E HEK QITA POSHT PREJ RRESHTIT 17-22 se bohet berllog 
// sequelize.authenticate().then(() => {
//     console.log("Database connected");
// }).catch((err) => {
//     console.error("Unable to connect to the database:", err);
// });

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

app.use("/api", MedicineRoute);
app.use("/api", Emergency_ContactRoute);
// Other routes if needed...

module.exports = app;
