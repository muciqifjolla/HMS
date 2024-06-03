import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { DataGrid } from '@mui/x-data-grid';
import CreateMedicalHistory from './CreateMedicalHistory';
import { Button, Box, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Typography } from '@mui/material';
import Cookies from 'js-cookie';
import { Add, Delete, Edit } from '@mui/icons-material';

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
    const token = Cookies.get('token');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const medicalHistoryRes = await axios.get('http://localhost:9004/api/medicalhistory', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const medicalHistorysDataWithNames = medicalHistoryRes.data.map(res => {
                    const patient = res.Patient;
                    return {
                        ...res,
                        Patient_Name: patient ? `${patient.Patient_Fname} ${patient.Patient_Lname}` : 'Unknown'
                    };
                });

                setMedicalHistorys(medicalHistorysDataWithNames);
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

    const filteredMedicalHistorys = medicalHistorys.filter((res) => {
        const patientName = res.Patient_Name.toLowerCase();
        return patientName.startsWith(searchQuery.toLowerCase());
    });

    const columns = [
        { field: 'Record_ID', headerName: 'ID', flex: 1 },
        { field: 'Patient_Name', headerName: 'Patient Name', flex: 2 },
        { field: 'Allergies', headerName: 'Allergies', flex: 2 },
        { field: 'Pre_Conditions', headerName: 'Pre Conditions', flex: 2 },
        {
            field: 'update',
            headerName: 'Update',
            flex: 1,
            renderCell: (params) => (
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleUpdateButtonClick(params.row.Record_ID)}
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
                    onClick={() => handleDelete(params.row.Record_ID)}
                    startIcon={<Delete />}
                >
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

            <Box mt={4} display="flex" alignItems="center">
                <Typography variant="h6" style={{ marginRight: 'auto' }}>
                    Medical Histories
                </Typography>
                {showCreateForm ? null : (
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleCreateFormToggle}
                        startIcon={<Add />}
                    >
                        Add Medical History
                    </Button>
                )}
            </Box>

            {showCreateForm && <CreateMedicalHistory onClose={() => setShowCreateForm(false)} />}

            <Box mt={4} style={{ height: '100%', width: '100%' }}>
                <DataGrid
                    rows={medicalHistorys}
                    columns={columns}
                    pageSize={10}
                    rowsPerPageOptions={[10]}
                    getRowId={(row) => row.Record_ID}
                    autoHeight
                />
            </Box>
        </div>
    );
}

export default MedicalHistory;
