const express = require("express");
const cors = require("cors");
require("dotenv").config();

const sequelize = require("./config/database");
const MedicineRoute = require("./routes/MedicineRoutes");
const Emergency_ContactRoute = require("./routes/Emergency_ContactRoutes");
const AppointmentRoutes = require('./routes/AppointmentRoutes');
const PatientRoutes = require('./routes/PatientRoutes');
const DepartmentRoutes = require('./routes/DepartmentRoutes');
const InsuranceRoutes = require('./routes/InsuranceRoutes');
const StaffRoutes = require('./routes/StaffRoutes');
<<<<<<< Updated upstream
const MedicalHistoryRoutes = require('./routes/MedicalHistoryRoutes');
=======
<<<<<<< HEAD
const RoomRoutes = require('./routes/RoomRoutes');

=======
const MedicalHistoryRoutes = require('./routes/MedicalHistoryRoutes');
>>>>>>> 9e117cc9e52bfb73d2d7766bc951bd508288b675
>>>>>>> Stashed changes
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
app.use("/api", AppointmentRoutes);
app.use("/api", PatientRoutes);
app.use("/api", DepartmentRoutes);
app.use("/api", InsuranceRoutes);
app.use("/api", StaffRoutes);
<<<<<<< Updated upstream
app.use("/api", MedicalHistoryRoutes);
=======
<<<<<<< HEAD
app.use("/api", RoomRoutes);
=======
app.use("/api", MedicalHistoryRoutes);
>>>>>>> 9e117cc9e52bfb73d2d7766bc951bd508288b675
>>>>>>> Stashed changes

// Other routes if needed...

module.exports = app;
