import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { DataGrid } from '@mui/x-data-grid';
import CreatePatient from './CreatePatient';
import { Button, Box, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Typography } from '@mui/material';
import Cookies from 'js-cookie';
import { Add, Delete, Edit } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

function Patient({ showCreateForm, setShowCreateForm, setShowUpdateForm, setSelectedPatientId }) {
    const [patients, setPatients] = useState([]);
    const [deletePatientId, setDeletePatientId] = useState(null);
    const token = Cookies.get('token');
    const navigate = useNavigate();

    const handleUpdateButtonClick = (patientId) => {
        setSelectedPatientId(patientId);
        setShowUpdateForm(true);
    };

    const handleCreateRoomButtonClick = (patientId) => {
        setShowCreateForm(true);
        navigate('/dashboard/room', { state: { patientId, showCreateForm: true } });
    };

    useEffect(() => {
        axios.get('http://localhost:9004/api/patient', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then((res) => {
            setPatients(res.data);
        })
        .catch((err) => {
            console.error(err);
        });
    }, [token]);

    const handleDelete = (id) => {
        setDeletePatientId(id);
    };

    const handleDeleteConfirm = async () => {
        try {
            await axios.delete(`http://localhost:9004/api/patient/delete/${deletePatientId}`);
            setPatients(patients.filter(item => item.Patient_ID !== deletePatientId));
            setShowUpdateForm(false);
            setShowCreateForm(false);
        } catch (err) {
            console.error(err);
        }
        setDeletePatientId(null);
    };

    const handleCreateFormToggle = () => {
        setShowCreateForm(!showCreateForm);
        setShowUpdateForm(false);
    };

    const columns = [
        { field: 'Patient_ID', headerName: 'ID', width: 60 },
        { field: 'Personal_Number', headerName: 'Personal Number', width: 150 },
        { field: 'Patient_Fname', headerName: 'Firstname', width: 120 },
        { field: 'Patient_Lname', headerName: 'Lastname', width: 120 },
        { 
            field: 'Birth_Date', 
            headerName: 'Birth Date', 
            width: 120, 
        },
        { field: 'Gender', headerName: 'Gender', width: 100 },
        { field: 'Blood_type', headerName: 'Blood Type', width: 110 },
        { field: 'Email', headerName: 'Email', width: 200 },
        { field: 'Phone', headerName: 'Phone', width: 120 },
        {
            field: 'update',
            headerName: 'Update',
            width: 100,
            renderCell: (params) => (
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleUpdateButtonClick(params.row.Patient_ID)}
                    startIcon={<Edit />}
                >
                </Button>
            )
        },
        {
            field: 'delete',
            headerName: 'Delete',
            width: 100,
            renderCell: (params) => (
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => handleDelete(params.row.Patient_ID)}
                    startIcon={<Delete />}
                >
                </Button>
            )
        },
        {
            field: 'createRoom',
            headerName: 'Create Room',
            width: 150,
            renderCell: (params) => (
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => handleCreateRoomButtonClick(params.row.Patient_ID)}
                >
                    + Room
                </Button>
            )
        }
    ];

    return (
        <div className='container-fluid mt-4'>
            {deletePatientId && (
                <Dialog
                    open={!!deletePatientId}
                    onClose={() => setDeletePatientId(null)}
                >
                    <DialogTitle>Confirm Deletion</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Are you sure you want to delete this patient record?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setDeletePatientId(null)} color="primary">
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
                    Patients
                </Typography>
                {showCreateForm ? null : (
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleCreateFormToggle}
                        startIcon={<Add />}
                    >
                        Add Patient
                    </Button>
                )}
            </Box>

            {showCreateForm && <CreatePatient onClose={() => setShowCreateForm(false)} />}

            <Box mt={4} style={{ height: '100%', width: '100%' }}>
                <DataGrid
                    rows={patients}
                    columns={columns}
                    pageSize={10}
                    rowsPerPageOptions={[10]}
                    getRowId={(row) => row.Patient_ID}
                />
            </Box>
        </div>
    );
}

export default Patient;
