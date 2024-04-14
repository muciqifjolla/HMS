const FindAllDepartments = async (req, res) => {
    try {
        const db = req.db;
        const sql = "SELECT * FROM department";

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
        console.error("Error occurred while fetching department:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

const FindSingleDepartment= async (req, res) => {
    try {
        const db = req.db;
        const sql = "SELECT * FROM department WHERE Dept_ID = ?";
        const departmentId = req.params.id;

        const queryPromise = () => {
            return new Promise((resolve, reject) => {
                db.query(sql, [departmentId], (err, data) => {
                    if (err) {
                        console.error("Error fetching department:", err);
                        res.status(500).json({ error: "Internal Server Error" });
                    } else {
                        if (data.length === 0) {
                            res.status(404).json({ error: "Department not found" });
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
        console.error("Error occurred while fetching department:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
  };

  const AddDepartment = async (req, res) => {
    try {
        const db = req.db;
        const sql = "INSERT INTO department (`Dept_head`, `Dept_name`, `Emp_Count`) VALUES (?, ?, ?)";
        const values = [
            req.body.Dept_head,
            req.body.Dept_name,
            req.body.Emp_Count,

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

        res.json({ success: true, message: "Department added successfully" });
    } catch (error) {
        console.error("Error adding department:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
  
const UpdateDepartment = async (req, res) => {
    try {
        const db = req.db;
        const { id } = req.params;
        const { Dept_head, Dept_name, Emp_Count } = req.body;
        
        if (!id || !Dept_head || !Dept_name || !Emp_Count ) {
            return res.status(400).json({ error: "ID, Dept_head, Dept_name, Emp_Count are required" });
        }
        
        const sql = "UPDATE department SET Dept_head = ?, Dept_name = ?, Emp_Count = ?  WHERE Dept_ID = ?";
        const values = [Dept_head, Dept_name, Emp_Count, id];

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
        res.json({ success: true, message: "Department updated successfully" });

    }catch (error) {
        console.error("Error updating department:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
  };

  const DeleteDepartment = async (req, res) => {
    try {
        const db = req.db;
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ error: "ID is required" });
        }

        const sql = "DELETE FROM department WHERE Dept_ID = ?";
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

        res.json({ success: true, message: "Department deleted successfully" });
    } catch (error) {
        console.error("Error deleting department:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};


module.exports = {
    FindAllDepartments,
    FindSingleDepartment,
    AddDepartment,
    UpdateDepartment,
    DeleteDepartment
};