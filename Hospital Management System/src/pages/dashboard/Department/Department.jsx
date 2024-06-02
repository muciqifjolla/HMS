import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { DataGrid } from '@mui/x-data-grid';
import CreateDepartment from './CreateDepartment';
import { Button, TextField, Box, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import Cookies from 'js-cookie';
import { Add, Delete, Edit, Update } from '@mui/icons-material';

function Department({ 
    showCreateForm, 
    setShowCreateForm,
    setShowUpdateForm, 
    setSelectedDepartmentIdId
}) {
    const [department, setDepartment] = useState([]);
    const [deleteDepartmentId, setDeleteDepartmentId] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const token = Cookies.get('token');

    useEffect(() => {
        axios.get('http://localhost:9004/api/department', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            .then((res) => {
                setDepartment(res.data);
            })
            .catch((err) => console.log(err));
    }, [token]);

    const handleUpdateButtonClick = (departmentId) => {
        setSelectedDepartmentIdId(departmentId);
        setShowUpdateForm((prevState) => prevState === departmentId ? null : departmentId);
        if (showCreateForm) {
            setShowCreateForm(false); 
        }
    };
    
    const handleDelete = (id) => {
        setDeleteDepartmentId(id);
    };

    const handleDeleteConfirm = async () => {
        try {
            await axios.delete(`http://localhost:9004/api/department/delete/${deleteDepartmentId}`);
            setDepartment(department.filter((item) => item.Dept_ID !== deleteDepartmentId));
                setShowUpdateForm(false);
                setShowCreateForm(false);
            }
             catch (err) {
            console.log(err);
        }
        setDeleteDepartmentId(null);
    };

    const handleCreateFormToggle = () => {
        setShowCreateForm(!showCreateForm);
        setShowUpdateForm(false); 
    };

    const handleSearchInputChange = (event) => {
        setSearchQuery(event.target.value);
    };
    
        const filteredDepartment = department.filter((item) =>
                item.Dept_name.toLowerCase().startsWith(searchQuery.toLowerCase())
            );
    
            const columns = [
                { field: 'Dept_ID', headerName: 'ID', width: 310 },
                { field: 'Dept_head', headerName: 'Department Head', width: 310 },
                { field: 'Dept_name', headerName: 'Department Name', width: 310 },
                { field: 'Emp_Count', headerName: 'Employee Count', width: 310 },
                {
                    field: 'update',
                    headerName: 'Update',
                    width: 130,
                    renderCell: (params) => (
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => handleUpdateButtonClick(params.row.Dept_ID)}
                        >
                            Update
                        </Button>
                    ),
                },
                {
            field: 'delete',
            headerName: 'Delete',
            width: 130,
            renderCell: (params) => (
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => handleDelete(params.row.Dept_ID)}
                    startIcon={<Delete />}
                >

                </Button>
            ),
        }
    ];
        
            return (
                <div className='container-fluid mt-4'>
                    {deleteDepartmentId && (
                        <Dialog
                            open={!!deleteDepartmentId}
                            onClose={() => setDeleteDepartmentId(null)}
                        >
                            <DialogTitle>Confirm Deletion</DialogTitle>
                            <DialogContent>
                                <DialogContentText>
                                    Are you sure you want to delete this department record?
                                </DialogContentText>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={() => setDeleteDepartmentId(null)} color="primary">
                                    Cancel
                                </Button>
                                <Button onClick={handleDeleteConfirm} color="secondary">
                                    Delete
                                </Button>
                            </DialogActions>
                        </Dialog>
                    )}
        
                    {!showCreateForm && (
                        <Box mt={4}>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleCreateFormToggle}
                                startIcon={<Add />}
                            >
                            </Button>
                        </Box>
                    )}
        
                    {showCreateForm && <CreateDepartment onClose={() => setShowCreateForm(false)} />}
        
                    <Box mt={4}>
                        <TextField
                            label="Search by name"
                            variant="outlined"
                            value={searchQuery}
                            onChange={handleSearchInputChange}
                            fullWidth
                        />
                    </Box>
        
                    <Box mt={4} style={{ height: '100%' , width: '100%' }}>
                        <DataGrid
                            rows={filteredDepartment}
                            columns={columns}
                            pageSize={10}
                            rowsPerPageOptions={[10]}
                            getRowId={(row) => row.Dept_ID}
                            autoHeight
                            hideFooterSelectedRowCount
                        />
                    </Box>
                </div>
            );
        }   

export default Department;
