const express = require("express");
const cors = require("cors");
require("dotenv").config();
const bodyParser = require('body-parser');


const fileUpload = require('express-fileupload');

const { getExpirationTime } = require('./controllers/AuthController'); // Import the shared module

const sequelize = require("./config/database");
const MedicineRoute = require("./routes/MedicineRoutes");
const Emergency_ContactRoute = require("./routes/Emergency_ContactRoutes");
const AppointmentRoutes = require('./routes/AppointmentRoutes');
const PatientRoutes = require('./routes/PatientRoutes');
const DepartmentRoutes = require('./routes/DepartmentRoutes');
const InsuranceRoutes = require('./routes/InsuranceRoutes');
const StaffRoutes = require('./routes/StaffRoutes');
const MedicalHistoryRoutes = require('./routes/MedicalHistoryRoutes');
const RoomRoutes = require('./routes/RoomRoutes');
const NurseRoutes = require('./routes/NurseRoutes');
const UserRoutes = require('./routes/UserRoutes');
const RatingRoutes = require('./routes/RatingRoutes');
const DoctorRoutes = require('./routes/DoctorRoutes');
const LoginRoutes = require('./routes/Login');
const RegisterRoutes = require('./routes/Register');
const ReportRoutes = require('./routes/ReportRoutes');

const app = express();

// Middleware to parse JSON data
app.use(express.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(fileUpload());

const PORT = process.env.PORT || 9004;

// Ensure database connection is established
// sequelize.authenticate().then(() => {
//     console.log("Database connected");
// }).catch((err) => {
//     console.error("Unable to connect to the database:", err);
// });

// Define your routes
app.use("/api", MedicineRoute);
app.use("/api", Emergency_ContactRoute);
app.use("/api", AppointmentRoutes);
app.use("/api", PatientRoutes);
app.use("/api", DepartmentRoutes);
app.use("/api", InsuranceRoutes);
app.use("/api", StaffRoutes);
app.use("/api", MedicalHistoryRoutes);
app.use("/api", RoomRoutes);
app.use("/api", NurseRoutes);
app.use("/api", UserRoutes);
app.use("/api", RatingRoutes);
app.use("/api", DoctorRoutes);
app.use("/api", LoginRoutes);
app.use("/api", RegisterRoutes);



// Endpoint to check the refresh token expiration time
app.get('/api/expiration', (req, res) => {
    const expirationTime = getExpirationTime();
    if (!expirationTime) {
        return res.status(200).json({ message: 'Refresh token is expired or not set', expirationTime: null });
    }
    res.status(200).json({ message: 'Refresh token is active', expirationTime: new Date(expirationTime).toLocaleString() });
});

// Other routes
app.use("/api", ReportRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app;