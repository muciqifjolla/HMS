const FindAllPatients = async (req, res) => {
    try {
        const db = req.db;
        const sql = "SELECT * FROM patient";

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
        console.error("Error occurred while fetching patient:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

const FindSinglepatientPatient= async (req, res) => {
    try {
        const db = req.db;
        const sql = "SELECT * FROM patient WHERE Patient_ID = ?";
        const patientId = req.params.id;

        const queryPromise = () => {
            return new Promise((resolve, reject) => {
                db.query(sql, [patientId], (err, data) => {
                    if (err) {
                        console.error("Error fetching patient:", err);
                        res.status(500).json({ error: "Internal Server Error" });
                    } else {
                        if (data.length === 0) {
                            res.status(404).json({ error: "Patient not found" });
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
        console.error("Error occurred while fetching patient:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
  };

  const AddPatient = async (req, res) => {
    try {
        const db = req.db;
        const sql = "INSERT INTO patient (`Patient_Fname`, `Patient_Lname`, `Blood_type`, `Email`, `Gender`, Conditionn, Admission_Date, Discharge_Date, Phone) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
        const values = [
            req.body.Patient_Fname,
            req.body.Patient_Lname,
            req.body.Blood_type,
            req.body.Email,
            req.body.Gender,
            req.body.Conditionn,
            req.body.Admission_Date,
            req.body.Discharge_Date,
            req.body.Phone

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

        res.json({ success: true, message: "Patient added successfully" });
    } catch (error) {
        console.error("Error adding patient:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
  
const UpdatePatient = async (req, res) => {
    try {
        const db = req.db;
        const { id } = req.params;
        const { Patient_Fname, Patient_Lname, Blood_type, Email, Gender, Conditionn, Admission_Date, Discharge_Date, Phone} = req.body;
        
        if (!id || !Patient_Fname || !Patient_Lname || !Blood_type || !Email || !Gender || !Conditionn || !Admission_Date || !Discharge_Date || !Phone ) {
            return res.status(400).json({ error: "ID, Patient_Fname, Patient_Lname, Blood_type, Email, Gender, Conditionn, Admission_Date, Discharge_Date, Phone are required" });
        }
        
        const sql = "UPDATE patient SET Patient_Fname = ?, Patient_Lname = ?, Blood_type = ?, Email = ?, Gender = ?, Conditionn = ?, Admission_Date = ?, Discharge_Date = ?, Phone = ?  WHERE Patient_ID = ?";
        const values = [Patient_Fname, Patient_Lname, Blood_type, Email, Gender, Conditionn, Admission_Date, Discharge_Date, Phone, id];

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
        res.json({ success: true, message: "Patient updated successfully" });

    }catch (error) {
        console.error("Error updating patient:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
  };

  const DeletePatient = async (req, res) => {
    try {
        const db = req.db;
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ error: "ID is required" });
        }

        const sql = "DELETE FROM patient WHERE Patient_ID = ?";
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

        res.json({ success: true, message: "Patient deleted successfully" });
    } catch (error) {
        console.error("Error deleting patient:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};


module.exports = {
    FindAllPatients,
    FindSinglepatientPatient,
    AddPatient,
    UpdatePatient,
    DeletePatient
};



