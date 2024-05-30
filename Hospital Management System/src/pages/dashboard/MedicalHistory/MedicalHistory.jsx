import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { DataGrid } from '@mui/x-data-grid';
import CreateMedicalHistory from './CreateMedicalHistory';
import { Button, TextField, Box, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import Cookies from 'js-cookie';
import { Add, Delete, Update } from '@mui/icons-material';

function MedicalHistory({
    showCreateForm,
    setShowCreateForm,
    showUpdateForm,
    setShowUpdateForm,
    setSelectedMedicalHistoryId,
}) {
    const [medicalHistorys, setMedicalHistorys] = useState([]);
    const [deleteMedicalHistoryId, setDeleteMedicalHistoryId] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [isDataLoaded, setIsDataLoaded] = useState(false);
    const [patients, setPatients] = useState([]);
    const token = Cookies.get('token');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const medicalHistoryRes = await axios.get('http://localhost:9004/api/medicalhistory', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                const patientsRes = await axios.get('http://localhost:9004/api/patient', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                const patientsData = patientsRes.data;

                const medicalHistorysDataWithNames = medicalHistoryRes.data.map(contact => {
                    const patient = patientsData.find(pat => pat.Patient_ID === contact.Patient_ID);
                    return {
                        ...contact,
                        Patient_Name: patient ? `${patient.Patient_Fname} ${patient.Patient_Lname}` : 'Unknown'
                    };
                });

                setMedicalHistorys(medicalHistorysDataWithNames);
                setPatients(patientsData);
                setIsDataLoaded(true);
            } catch (err) {
                console.error('Error fetching data:', err);
            }
        };

        fetchData();
    }, [token]);

    const handleUpdateButtonClick = (medicalHistoryId) => {
        setSelectedMedicalHistoryId(medicalHistoryId);
        setShowUpdateForm(true);
        if (showCreateForm) {
            setShowCreateForm(false);
        }
    };

    const handleDelete = (id) => {
        setDeleteMedicalHistoryId(id);
    };

    const handleDeleteConfirm = async () => {
        try {
            await axios.delete(`http://localhost:9004/api/medicalhistory/delete/${deleteMedicalHistoryId}`);
            setMedicalHistorys(medicalHistorys.filter((data) => data.Record_ID !== deleteMedicalHistoryId));
        } catch (err) {
            console.error('Error deleting medical history:', err);
        }
        setDeleteMedicalHistoryId(null);
    };

    const handleCreateFormToggle = () => {
        setShowCreateForm(!showCreateForm);
        setShowUpdateForm(false);
    };

    const handleSearchInputChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const filteredMedicalHistorys = medicalHistorys.filter((contact) => {
        const patientName = contact.Patient_Name.toLowerCase();
        return patientName.startsWith(searchQuery.toLowerCase());
    });

    const columns = [
        { field: 'Record_ID', headerName: 'ID', width: 100 },
        { field: 'Patient_Name', headerName: 'Patient Name', width: 200 },
        { field: 'Allergies', headerName: 'Allergies', width: 200 },
        { field: 'Pre_Conditions', headerName: 'Pre Conditions', width: 200 },
        {
            field: 'update',
            headerName: 'Update',
            width: 150,
            renderCell: (params) => (
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleUpdateButtonClick(params.row.Record_ID)}
                    startIcon={<Update />}
                >
                    Update
                </Button>
            )
        },
        {
            field: 'delete',
            headerName: 'Delete',
            width: 150,
            renderCell: (params) => (
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => handleDelete(params.row.Record_ID)}
                    startIcon={<Delete />}
                >
                    Delete
                </Button>
            )
        }
    ];

    return (
        <div className='container-fluid mt-4'>
            {deleteMedicalHistoryId && (
                <Dialog
                    open={!!deleteMedicalHistoryId}
                    onClose={() => setDeleteMedicalHistoryId(null)}
                >
                    <DialogTitle>Confirm Deletion</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Are you sure you want to delete this medical history record?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setDeleteMedicalHistoryId(null)} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={handleDeleteConfirm} color="secondary">
                            Delete
                        </Button>
                    </DialogActions>
                </Dialog>
            )}

            {!showCreateForm && (
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleCreateFormToggle}
                    startIcon={<Add />}
                >
                  
                </Button>
            )}

            {showCreateForm && <CreateMedicalHistory onClose={() => setShowCreateForm(false)} />}
            
            <Box mt={4}>
                <TextField
                    label="Search by Patient Name"
                    variant="outlined"
                    value={searchQuery}
                    onChange={handleSearchInputChange}
                    fullWidth
                />
            </Box>
            
            <Box mt={4} style={{ height: '100%' , width: '100%' }}>
                {isDataLoaded && (
                    <DataGrid
                        rows={filteredMedicalHistorys}
                        columns={columns}
                        pageSize={10}
                        rowsPerPageOptions={[10]}
                        getRowId={(row) => row.Record_ID}
                        autoHeight
                        hideFooterSelectedRowCount
                    />
                )}
            </Box>
        </div>
    );
}

export default MedicalHistory;
