import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { DataGrid } from '@mui/x-data-grid';
import CreateMedicine from './CreateMedicine';
import { Button, TextField, Box, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import Cookies from 'js-cookie';
import { Add } from '@mui/icons-material';

function Medicine({
    showCreateForm,
    setShowCreateForm,
    setShowUpdateForm,
    setSelectedMedicineId,
}) {
    const [medicine, setMedicine] = useState([]);
    const [deleteMedicineId, setDeleteMedicineId] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const token = Cookies.get('token');

    useEffect(() => {
        axios.get('http://localhost:9004/api/medicine', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then((res) => {
            setMedicine(res.data);
        })
        .catch((err) => console.log(err));
    }, [token]);

    const handleUpdateButtonClick = (medicineId) => {
        setSelectedMedicineId(medicineId);
        setShowUpdateForm(true);
        if (showCreateForm) {
            setShowCreateForm(false);
        }
    };

    const handleDelete = (id) => {
        setDeleteMedicineId(id);
    };

    const handleDeleteConfirm = async () => {
        try {
            await axios.delete(`http://localhost:9004/api/medicine/delete/${deleteMedicineId}`);
            setMedicine(medicine.filter((item) => item.Medicine_ID !== deleteMedicineId));
            setShowUpdateForm(false);
            setShowCreateForm(false);
        } catch (err) {
            console.log(err);
        }
        setDeleteMedicineId(null);
    };

    const handleCreateFormToggle = () => {
        setShowCreateForm(!showCreateForm);
        setShowUpdateForm(false);
    };

    const handleSearchInputChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const filteredMedicine = medicine.filter((med) =>
        med.M_name.toString().startsWith(searchQuery)
    // med.M_name.toLowerCase().startsWith(searchQuery.toLowerCase())
    );

    const columns = [
        { field: 'Medicine_ID', headerName: 'ID', width: 310 },
        { field: 'M_name', headerName: 'Name', width: 310 },
        { field: 'M_Quantity', headerName: 'Quantity', width: 310 },
        { field: 'M_Cost', headerName: 'Cost', width: 310 },
        {
            field: 'update',
            headerName: 'Update',
            width: 130,
            renderCell: (params) => (
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleUpdateButtonClick(params.row.Medicine_ID)}
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
                    onClick={() => handleDelete(params.row.Medicine_ID)}
                >
                    Delete
                </Button>
            ),
        }
    ];

    return (
        <div className='container-fluid mt-4'>
            {deleteMedicineId && (
                <Dialog
                    open={!!deleteMedicineId}
                    onClose={() => setDeleteMedicineId(null)}
                >
                    <DialogTitle>Confirm Deletion</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Are you sure you want to delete this medicine record?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setDeleteMedicineId(null)} color="primary">
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

            {showCreateForm && <CreateMedicine onClose={() => setShowCreateForm(false)} />}

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
                    rows={filteredMedicine}
                    columns={columns}
                    pageSize={10}
                    rowsPerPageOptions={[10]}
                    getRowId={(row) => row.Medicine_ID}
                    autoHeight
                    hideFooterSelectedRowCount
                />
            </Box>
        </div>
    );
}

export default Medicine;
