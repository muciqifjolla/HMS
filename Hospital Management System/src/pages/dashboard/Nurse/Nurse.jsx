import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { DataGrid } from '@mui/x-data-grid';
import CreateNurse from './CreateNurse';
import { Button, TextField, Box, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import Cookies from 'js-cookie';
import { Add, Delete, Edit } from '@mui/icons-material';

function Nurse({
    showCreateForm,
    setShowCreateForm,
    setShowUpdateForm,
    setSelectedNurseId,
}) {
    const [nurse, setNurse] = useState([]);
    const [deleteNurseId, setDeleteNurseId] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const token = Cookies.get('token');

    useEffect(() => {
        axios.get('http://localhost:9004/api/nurse', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then((res) => {
            setNurse(res.data);
        })
        .catch((err) => console.log(err));
    }, [token]);

    const handleUpdateButtonClick = (nurseId) => {
        setSelectedNurseId(nurseId);
        setShowUpdateForm(true);
        if (showCreateForm) {
            setShowCreateForm(false);
        }
    };

    const handleDelete = (id) => {
        setDeleteNurseId(id);
    };

    const handleDeleteConfirm = async () => {
        try {
            await axios.delete(`http://localhost:9004/api/nurse/delete/${deleteNurseId}`);
            setNurse(nurse.filter((item) => item.Nurse_ID !== deleteNurseId));
            setShowUpdateForm(false);
            setShowCreateForm(false);
        } catch (err) {
            console.log(err);
        }
        setDeleteNurseId(null);
    };

    const handleCreateFormToggle = () => {
        setShowCreateForm(!showCreateForm);
        setShowUpdateForm(false);
    };

    const handleSearchInputChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const filteredNurse = nurse.filter((nurse) => {
        const Patient_ID = nurse.Patient_ID.toString();
        for (let i = 0; i < searchQuery.length; i++) {
            if (isNaN(parseInt(searchQuery[i]))) {
                return false; // Nëse një karakter nuk është një numër, kthejë false
            }
        }
        return Patient_ID.startsWith(searchQuery);
    });

    const columns = [
        { field: 'Nurse_ID', headerName: 'ID', width: 310 },
        { field: 'Patient_ID', headerName: 'Patient ID', width: 310 },
        { field: 'Emp_ID', headerName: 'Employee Id', width: 310 },
        {
            field: 'update',
            headerName: 'Update',
            width: 130,
            renderCell: (params) => (
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleUpdateButtonClick(params.row.Nurse_ID)}
                    startIcon={<Edit />}
                >
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
                    onClick={() => handleDelete(params.row.Nurse_ID)}
                    startIcon={<Delete />}
                >
                </Button>
            ),
        }
    ];

    return (
        <div className='container-fluid mt-4'>
            {deleteNurseId && (
                <Dialog
                    open={!!deleteNurseId}
                    onClose={() => setDeleteNurseId(null)}
                >
                    <DialogTitle>Confirm Deletion</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Are you sure you want to delete this Nurse record?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setDeleteNurseId(null)} color="primary">
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

            {showCreateForm && <CreateNurse onClose={() => setShowCreateForm(false)} />}

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
                    rows={filteredNurse}
                    columns={columns}
                    pageSize={10}
                    rowsPerPageOptions={[10]}
                    getRowId={(row) => row.Nurse_ID}
                    autoHeight
                    hideFooterSelectedRowCount
                />
            </Box>
        </div>
    );
}
export default Nurse;
