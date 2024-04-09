


const FindAllMedicine = async (req, res) => {
    try {
        const db = req.db;
        const sql = "SELECT * FROM medicine";

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
        console.error("Error occurred while fetching medicine:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

const FindSingleMedicine = async (req, res) => {
    try {
        const db = req.db;
        const sql = "SELECT * FROM medicine WHERE Medicine_ID = ?";
        const medicineId = req.params.id;

        const queryPromise = () => {
            return new Promise((resolve, reject) => {
                db.query(sql, [medicineId], (err, data) => {
                    if (err) {
                        console.error("Error fetching medicine:", err);
                        res.status(500).json({ error: "Internal Server Error" });
                    } else {
                        if (data.length === 0) {
                            res.status(404).json({ error: "Medicine not found" });
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

  const AddMedicine = async (req, res) => {
    try {
        const db = req.db;
        const sql = "INSERT INTO medicine (`M_name`, `M_Quantity`, `M_Cost`) VALUES (?, ?, ?)";
        const values = [
            req.body.name,
            parseInt(req.body.quantity),
            parseFloat(req.body.cost)
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

        res.json({ success: true, message: "Medicine added successfully" });
    } catch (error) {
        console.error("Error adding medicine:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
  
const UpdateMedicine = async (req, res) => {
    try {
        const db = req.db;
        const { id } = req.params;
        const { name, quantity, cost } = req.body;
        
        if (!id || !name || !quantity || !cost) {
            return res.status(400).json({ error: "ID, name, quantity, and cost are required" });
        }
        
        const sql = "UPDATE medicine SET M_name = ?, M_Quantity = ?, M_Cost = ? WHERE Medicine_ID = ?";
        const values = [name, quantity, cost, id];

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
        res.json({ success: true, message: "Medicine updated successfully" });

    }catch (error) {
        console.error("Error updating medicine:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
  };

  const DeleteMedicine = async (req, res) => {
    try {
        const db = req.db;
        const { id } = req.params;

        // Ensure that the ID is provided
        if (!id) {
            return res.status(400).json({ error: "ID is required" });
        }

        const sql = "DELETE FROM medicine WHERE Medicine_ID = ?";
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

        res.json({ success: true, message: "Medicine deleted successfully" });
    } catch (error) {
        console.error("Error deleting medicine:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};


module.exports = {
    FindAllMedicine,
    FindSingleMedicine,
    AddMedicine,
    UpdateMedicine,
    DeleteMedicine
};



