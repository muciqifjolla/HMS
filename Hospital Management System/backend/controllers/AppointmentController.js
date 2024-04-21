const FindAllAppointments = async (req, res) => {
    try {
        const db = req.db;
        const sql = `
            SELECT 
                appointment.*, 
                CONCAT(patient.Patient_Fname, ' ', patient.Patient_Lname) AS patient_full_name,
                doctor.Doctor_ID AS doctor_id,
                CONCAT(staff.Emp_Fname, ' ', staff.Emp_Lname) AS doctor_full_name
            FROM 
                appointment 
            INNER JOIN 
                patient 
            ON 
                appointment.Patient_ID = patient.Patient_ID
            INNER JOIN
                doctor
            ON
                appointment.Doctor_ID = doctor.Doctor_ID
            INNER JOIN
                staff
            ON
                doctor.Emp_ID = staff.Emp_ID`;

        const queryPromise = () => {
            return new Promise((resolve, reject) => {
                db.query(sql, (err, data) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(data);
                    }
                });
            });
        };

        const data = await queryPromise();
        res.json(data);
    } catch (error) {
        console.error("Error occurred while fetching appointments:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};  
const FindSingleAppointment = async (req, res) => {
    try {
        const db = req.db;
        const sql = "SELECT * FROM appointment WHERE Appoint_ID = ?";
        const appointmentId = req.params.id;

        const queryPromise = () => {
            return new Promise((resolve, reject) => {
                db.query(sql, [appointmentId], (err, data) => {
                    if (err) {
                        console.error("Error fetching appointment:", err);
                        res.status(500).json({ error: "Internal Server Error" });
                    } else {
                        if (data.length === 0) {
                            res.status(404).json({ error: "Appointment not found" });
                        } else {
                            res.json(data[0]);
                        }
                    }
                });
            });
        };

        const data = await queryPromise();
        res.json(data);
    } catch (error) {
        console.error("Error occurred while fetching medicine:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
  };

  const AddAppointment = async (req, res) => {
    try {
        const db = req.db;
        const sql = "INSERT INTO appointment (`Scheduled_On`, `Date`, `Time`, `Doctor_ID`, `Patient_ID`) VALUES (?, ?, ?, ?, ?)";
        const values = [
            req.body.Scheduled_On,
            req.body.Date,
            req.body.Time,
            req.body.Doctor_ID,
            req.body.Patient_ID,
        ];

        const queryPromise = () => {
            return new Promise((resolve, reject) => {
                db.query(sql, values, (err, data) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(data);
                    }
                });
            });
        };

        await queryPromise();

        res.json({ success: true, message: "Appointment added successfully" });
    } catch (error) {
        console.error("Error adding medicine:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
  
const UpdateAppointment = async (req, res) => {
    try {
        const db = req.db;
        const { id } = req.params;
        const { Scheduled_On, Date, Time, Doctor_ID, Patient_ID  } = req.body;
        
        if (!id || !Scheduled_On || !Date || !Time || !Doctor_ID || !Patient_ID ) {
            return res.status(400).json({ error: "ID, Scheduled_On, Date, Time, Doctor_ID  and Patient_ID are required" });
        }
        
        const sql = "UPDATE appointment SET Scheduled_On = ?, Date = ?, Time = ?, Doctor_ID = ?, Patient_ID = ?  WHERE Appoint_ID = ?";
        const values = [Scheduled_On, Date, Time, Doctor_ID, Patient_ID,  id];

        const queryPromise = () => {
            return new Promise((resolve, reject) => {
                db.query(sql, values, (err, data) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(data);
                    }
                });
            });
        };

        await queryPromise();
        res.json({ success: true, message: "Appointment updated successfully" });

    }catch (error) {
        console.error("Error updating appointment:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
  };

  const DeleteAppointment = async (req, res) => {
    try {
        const db = req.db;
        const { id } = req.params;

        // Ensure that the ID is provided
        if (!id) {
            return res.status(400).json({ error: "ID is required" });
        }

        const sql = "DELETE FROM appointment WHERE Appoint_ID = ?";
        const values = [id];

        const queryPromise = () => {
            return new Promise((resolve, reject) => {
                db.query(sql, values, (err, result) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(result);
                    }
                });
            });
        };

        await queryPromise();

        res.json({ success: true, message: "Appointment deleted successfully" });
    } catch (error) {
        console.error("Error deleting appointment:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};


module.exports = {
    FindAllAppointments,
    FindSingleAppointment,
    AddAppointment,
    UpdateAppointment,
    DeleteAppointment
};



