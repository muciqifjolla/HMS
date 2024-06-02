import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { DataGrid } from '@mui/x-data-grid';
import CreateMedicine from './CreateMedicine';
import { Button, Box, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Typography } from '@mui/material';
import { Add, Delete, Edit } from '@mui/icons-material';
import Cookies from 'js-cookie';

function Medicine({
    showCreateForm,
    setShowCreateForm,
    setShowUpdateForm,
    setSelectedMedicineId,
}) {
    const [medicine, setMedicine] = useState([]);
    const [deleteMedicineId, setDeleteMedicineId] = useState(null);
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

    const columns = [
        { field: 'Medicine_ID', headerName: 'ID', flex: 1 },
        { field: 'M_name', headerName: 'Name', flex: 1  },
        { field: 'M_Quantity', headerName: 'Quantity', flex: 1  },
        { field: 'M_Cost', headerName: 'Cost', flex: 1  },
        {
            field: 'update',
            headerName: 'Update',
            width: 130,
            renderCell: (params) => (
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleUpdateButtonClick(params.row.Medicine_ID)}
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
                    onClick={() => handleDelete(params.row.Medicine_ID)}
                    startIcon={<Delete />}
                >
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

            <Box mt={4} display="flex" alignItems="center" justifyContent="space-between">
                <Typography variant="h6">
                    Medicines
                </Typography>
                {showCreateForm ? null : (
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleCreateFormToggle}
                        startIcon={<Add />}
                    >
                        Add Medicine
                    </Button>
                )}
            </Box>

            {showCreateForm && <CreateMedicine onClose={() => setShowCreateForm(false)} />}

            <Box mt={4} style={{ height: '100%', width: '100%' }}>
                <DataGrid
                    rows={medicine}
                    columns={columns}
                    pageSize={10}
                    rowsPerPageOptions={[10]}
                    getRowId={(row) => row.Medicine_ID}
                />
            </Box>
        </div>
    );
}

export default Medicine;
