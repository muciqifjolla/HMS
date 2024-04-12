

const FindAllStaff = async (req, res) => {
    try {
        const db = req.db;
        const sql = "SELECT * FROM staff";

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
        console.error("Error occurred while fetching staff:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

const FindSingleStaff = async (req, res) => {
    try {
        const db = req.db;
        const sql = "SELECT * FROM staff WHERE Emp_ID = ?";
        const staffId = req.params.id;

        const queryPromise = () => {
            return new Promise((resolve, reject) => {
                db.query(sql, [staffId], (err, data) => {
                    if (err) {
                        console.error("Error fetching staff:", err);
                        res.status(500).json({ error: "Internal Server Error" });
                    } else {
                        if (data.length === 0) {
                            res.status(404).json({ error: "Staff not found" });
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
        console.error("Error occurred while fetching staff:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
  };

  const AddStaff = async (req, res) => {
    try {
        const db = req.db;
        const sql = "INSERT INTO staff (`Emp_Fname`, `Emp_Lname`, `Joining_Date`,`Emp_type`,`Email`,`Address`,`Dept_ID`,`SSN`,`DOB`,`Date_Separation`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        const values = [
            req.body.Emp_Fname,
            req.body.Emp_Lname,
            req.body.Joining_Date,
            req.body.Emp_type,
            req.body.Email,
            req.body.Address,
            req.body.Dept_ID,
            req.body.SSN,
            req.body.DOB,
            req.body.Date_Separation,
            
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

        res.json({ success: true, message: "Staff added successfully" });
    } catch (error) {
        console.error("Error adding staff:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
  
const UpdateStaff = async (req, res) => {
    try {
        const db = req.db;
        const { id } = req.params;
        const { Emp_Fname, Emp_Lname, Joining_Date, Emp_type, Email,Address, Dept_ID, SSN, DOB, Date_Separation} = req.body;
        
        if (!id || !Emp_Fname || !Emp_Lname || !Joining_Date || !Emp_type || !Email || !Address || !Dept_ID || !SSN || !DOB || !Date_Separation) {
            return res.status(400).json({ error: "ID, name, quantity, and cost are required" });
        }
        
        const sql = "UPDATE staff SET Emp_Fname = ?, Emp_Lname = ?, Joining_Date = ?, Emp_type = ?, Email = ?, Address = ?, Dept_ID = ?, SSN = ?, DOB = ?, Date_Separation = ? WHERE Emp_ID = ?";
        const values = [Emp_Fname, Emp_Lname, Joining_Date, Emp_type,Email,Address,Dept_ID,SSN,DOB,Date_Separation, id];

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
        res.json({ success: true, message: "Staff updated successfully" });

    }catch (error) {
        console.error("Error updating staff:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
  };

  const DeleteStaff = async (req, res) => {
    try {
        const db = req.db;
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ error: "ID is required" });
        }

        const sql = "DELETE FROM staff WHERE Emp_ID = ?";
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

        res.json({ success: true, message: "Staff deleted successfully" });
    } catch (error) {
        console.error("Error deleting staff:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};


module.exports = {
    FindAllStaff,
    FindSingleStaff,
    AddStaff,
    UpdateStaff,
    DeleteStaff
};



