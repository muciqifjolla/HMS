import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { DataGrid } from '@mui/x-data-grid';
import CreateStaff from './CreateStaff';
import { Button, Box, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Typography } from '@mui/material';
import Cookies from 'js-cookie';
import { Add, Delete, Edit } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

function Staff({
    showCreateForm,
    setShowCreateForm,
    showUpdateForm,
    setShowUpdateForm,
    setSelectedStaffId,
}) {
    const [staff, setStaff] = useState([]);
    const [deleteStaffId, setDeleteStaffId] = useState(null);
    const [departments, setDepartments] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredStaff, setFilteredStaff] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [recordsPerPage] = useState(7);
    const token = Cookies.get('token');
    const navigate = useNavigate();
    console.log(staff);

    useEffect(() => {
      
        axios.get('http://localhost:9004/api/staff', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(res => {
                console.log("Staff data:", res.data);
                setStaff(res.data);
                setFilteredStaff(res.data);
            })
            .catch(err => console.error('Error fetching staff:', err));

        axios.get('http://localhost:9004/api/department', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(res => {
                console.log("Departments data:", res.data);
                setDepartments(res.data);
            })
            .catch(err => console.error('Error fetching departments:', err));

    }, [token]);

    const handleUpdateButtonClick = (staffId) => {
        setSelectedStaffId(staffId);
        setShowUpdateForm((prevState) => prevState === staffId ? null : staffId);
        if (showCreateForm) {
            setShowCreateForm(false);
        }
    };

    const handleDelete = (id) => {
        setDeleteStaffId(id);
    };

    const handleDeleteConfirm = async () => {
        try {
           await axios.delete(`http://localhost:9004/api/staff/delete/${deleteStaffId}`);

            setStaff(staff.filter((data) => data.Emp_ID !== deleteStaffId));
            setFilteredStaff(filteredStaff.filter((data) => data.Emp_ID !== deleteStaffId));
            if (showCreateForm) {
                setShowCreateForm(false);
            }
            if (showUpdateForm) {
                setShowUpdateForm(false);
            }
        } catch (err) {
            console.error('Error deleting staff:', err);
        }
        setDeleteStaffId(null);
    };

    const handleCreateFormToggle = () => {
        setShowCreateForm(!showCreateForm);
        setShowUpdateForm(false);
    };

    const handleCloseCreateForm = () => {
        setShowCreateForm(false);
    };

    const getDepartmentName = (departmentId) => {
        console.log("Department ID:", departmentId);
        console.log("Departments:", departments);

        const department = departments.find(dept => dept.Dept_ID === departmentId);
        console.log("Found Department:", department);

        if (department) {
            return `${department.Dept_name}`;
        } else {
            return 'Unknown';
        }
    };

    const columns = [
        { field: 'Emp_ID', headerName: 'ID', flex: 1 },
        { field: 'Emp_Fname', headerName: 'Name', flex: 1 },
        { field: 'Emp_Lname', headerName: 'Surname', flex: 1 },
        {
            field: 'Joining_Date',
            headerName: 'Joining Date',
            flex: 1,
        },
        { field: 'Emp_type', headerName: 'Employee Type', flex: 1 },
        { field: 'Email', headerName: 'Email', flex: 2 },
        { field: 'Address', headerName: 'Address', flex: 2 },
        { field: 'Dept_ID', headerName: 'Department ID', flex: 1 },
        { field: 'SSN', headerName: 'SSN', flex: 1 },
        {
            field: 'DOB',
            headerName: 'Date of Birth',
            flex: 1,
        },
        {
            field: 'Date_Separation',
            headerName: 'Date of Separation',
            flex: 1,
        },
        {
            field: 'update',
            headerName: 'Update',
            flex: 1,
            renderCell: (params) => (
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleUpdateButtonClick(params.row.Emp_ID)}
                    startIcon={<Edit />}
                >
                </Button>
            )
        },
        {
            field: 'delete',
            headerName: 'Delete',
            flex: 1,
            renderCell: (params) => (
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => handleDelete(params.row.Emp_ID)}
                    startIcon={<Delete />}
                >
                    
                </Button>
            )
        },
    ];

    return (
        <div className="container-fluid mt-4">
            {deleteStaffId && (
                <Dialog
                    open={!!deleteStaffId}
                    onClose={() => setDeleteStaffId(null)}
                >
                    <DialogTitle>Confirm Deletion</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Are you sure you want to delete this staff record?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setDeleteStaffId(null)} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={handleDeleteConfirm} color="secondary">
                            Delete
                        </Button>
                    </DialogActions>
                </Dialog>
            )}

            <Box mt={4} display="flex" alignItems="center">
                <Typography variant="h6" style={{ marginRight: 'auto' }}>
                    Staff
                </Typography>
                {showCreateForm ? null : (
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleCreateFormToggle}
                        startIcon={<Add />}
                    >
                        Add Staff
                    </Button>
                )}
            </Box>

            {showCreateForm && <CreateStaff onClose={() => setShowCreateForm(false)} />}

            <Box mt={4} style={{ height: '100%', width: '100%' }}>
                <DataGrid
                    rows={staff}
                    columns={columns}
                    pageSize={10}
                    rowsPerPageOptions={[10]}
                    getRowId={(row) => row.Emp_ID}
                    autoHeight
                />
            </Box>
        </div>
    );
}

export default Staff;
