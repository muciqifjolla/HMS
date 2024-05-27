import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { DataGrid } from '@mui/x-data-grid';
import CreatePatient from './CreatePatient';
import { Button, TextField, Box, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import Cookies from 'js-cookie';
import { Add } from '@mui/icons-material';


function Patient({ showCreateForm, setShowCreateForm, setShowUpdateForm, setSelectedPatientId }) {
    const [patients, setPatients] = useState([]);
    const [deletePatientId, setDeletePatientId] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const token = Cookies.get('token');

    const handleUpdateButtonClick = (patientId) => {
        setSelectedPatientId(patientId);
        setShowUpdateForm(true);
    };

    useEffect(() => {
        console.log("Token from Cookies:", token); // Debugging

        axios.get('http://localhost:9004/api/patient', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then((res) => {
            console.log("Fetched patients:", res.data); // Debugging
            setPatients(res.data);
        })
        .catch((err) => {
            console.log(err);
            console.log("Error response data:", err.response?.data); // Debugging
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
            console.log(err);
        }
        setDeletePatientId(null);
    };

    const handleCreateFormToggle = () => {
        setShowCreateForm(!showCreateForm);
        setShowUpdateForm(false);
    };

    const handleSearchInputChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const filteredPatients = patients.filter((patient) =>
        patient.Personal_Number?.toString().includes(searchQuery)
    );


    const columns = [
        { field: 'Patient_ID', headerName: 'ID', width: 90 },
        { field: 'Personal_Number', headerName: 'Personal Number', width: 150 },
        { field: 'Patient_Fname', headerName: 'Firstname', width: 150 },
        { field: 'Patient_Lname', headerName: 'Lastname', width: 150 },
        { 
            field: 'Birth_Date', 
            headerName: 'Birth Date', 
            width: 150, 
        },
        { field: 'Gender', headerName: 'Gender', width: 100 },
        { field: 'Blood_type', headerName: 'Blood Type', width: 110 },
        { field: 'Conditionn', headerName: 'Condition', width: 150 },
        { 
            field: 'Admission_Date', 
            headerName: 'Admission Date', 
            width: 150, 
        },
        { 
            field: 'Discharge_Date', 
            headerName: 'Discharge Date', 
            width: 150, 
        },
        { field: 'Email', headerName: 'Email', width: 200 },
        { field: 'Phone', headerName: 'Phone', width: 150 },
        {
            field: 'update',
            headerName: 'Update',
            width: 100,
            renderCell: (params) => (
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleUpdateButtonClick(params.row.Patient_ID)}
                >
                    Update
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
                >
                    Delete
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

            {showCreateForm ? null : (
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

            {showCreateForm && <CreatePatient onClose={() => setShowCreateForm(false)} />}

            <Box mt={4}>
                <TextField
                    label="Search by personal number"
                    variant="outlined"
                    value={searchQuery}
                    onChange={handleSearchInputChange}
                    fullWidth
                />
            </Box>

            <Box mt={4} style={{ height: '100%' , width: '100%' }}>
                <DataGrid
                    rows={filteredPatients}
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
