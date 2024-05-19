const Department = require('../models/Department');

    const FindAllDepartments = async (req, res) => {
        try {
            const departments = await Department.findAll();
            res.json(departments);
        } catch (error) {
            console.error('Error fetching all departments:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    };

    const FindSingleDepartment = async (req, res) => {
        try {
            const department = await Department.findByPk(req.params.id);
            if (!department) {
                res.status(404).json({ error: 'Department not found' });
                return;
            }
            res.json(department);
        } catch (error) {
            console.error('Error fetching single department:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    };

    const AddDepartment = async (req, res) => {
        try {
            const { Dept_head, Dept_name, Emp_Count } = req.body;
            // Validate input fields
        if (!Dept_head || !Dept_name || !Emp_Count) {
            return res.status(400).json({ error: 'All fields are required' });
        }
        
        if (Dept_head.length < 2) {
            return res.status(400).json({ error: 'Department head must be at least 2 characters long' });
        }

        if (Dept_name.length < 2) {
            return res.status(400).json({ error: 'Department name must be at least 2 characters long' });
        }

        if (parseInt(Emp_Count) < 1 || isNaN(parseInt(Emp_Count))) {
            return res.status(400).json({ error: 'Employee count must be at least 1' });
        }

        // Check if the department already exists
        const existingDepartment = await Department.findOne({ where: { Dept_name } });
        if (existingDepartment) {
            return res.status(400).json({ error: 'Department with the same name already exists1' });
        } 

            const newDepartment = await Department.create({
                Dept_head,
                Dept_name,
                Emp_Count,
            });
            res.json({ success: true, message: 'Department added successfully', data: newDepartment });
        } catch (error) {
            console.error('Error adding department:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    };
  
    const UpdateDepartment = async (req, res) => {
        try {
            const { Dept_head, Dept_name, Emp_Count } = req.body;
           
            // Validate input fields
        if (!Dept_head || !Dept_name || !Emp_Count) {
            return res.status(400).json({ error: 'All fields are required' });
        }
        
        if (Dept_head.length < 2) {
            return res.status(400).json({ error: 'Department head must be at least 2 characters long' });
        }

        if (Dept_name.length < 2) {
            return res.status(400).json({ error: 'Department name must be at least 2 characters long' });
        }

        if (parseInt(Emp_Count) < 1 || isNaN(parseInt(Emp_Count))) {
            return res.status(400).json({ error: 'Emplyee Count must be at least 1' });
        }

            const updated = await Department.update(
                { Dept_head, Dept_name, Emp_Count },
                { where: { Dept_ID: req.params.id } }
            );
            if (updated[0] === 0) {
                res.status(404).json({ error: 'Department not found or not updated' });
                return;
            }
            res.json({ success: true, message: 'Department updated successfully' });
        } catch (error) {
            console.error('Error updating department:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    };

    const DeleteDepartment = async (req, res) => {
        try {
            const deleted = await Department.destroy({
                where: { Dept_ID: req.params.id },
            });
            if (deleted === 0) {
                res.status(404).json({ error: 'Department not found' });
                return;
            }
            res.json({ success: true, message: 'Department deleted successfully' });
        } catch (error) {
            console.error('Error deleting department:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    };
    


module.exports = {
    FindAllDepartments,
    FindSingleDepartment,
    AddDepartment,
    UpdateDepartment,
    DeleteDepartment
};