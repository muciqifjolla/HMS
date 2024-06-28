import React, { useEffect, useState, Suspense, lazy } from 'react';
import axios from 'axios';
import { DataGrid } from '@mui/x-data-grid';
import { Button, Box, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Typography } from '@mui/material';
import Cookies from 'js-cookie';
import { Add, Delete, Edit } from '@mui/icons-material';
import {jwtDecode} from 'jwt-decode';

const CreateMedicalHistory = lazy(() => import('./CreateMedicalHistory'));
const UpdateMedicalHistory = lazy(() => import('./UpdateMedicalHistory'));

function MedicalHistory({ showCreateForm, setShowCreateForm, showUpdateForm, setShowUpdateForm, setSelectedMedicalHistoryId }) {
    const [medicalHistorys, setMedicalHistorys] = useState([]);
    const [deleteMedicalHistoryId, setDeleteMedicalHistoryId] = useState(null);
    const [userRole, setUserRole] = useState('');
    const token = Cookies.get('token');

    const handleUpdateButtonClick = (medicalHistoryId) => {
        setSelectedMedicalHistoryId(medicalHistoryId);
        setShowUpdateForm(true);
    };

    useEffect(() => {
        const fetchUserRole = async () => {
            try {
                const decodedToken = jwtDecode(token);
                const userEmail = decodedToken.email;
                
                const userResponse = await axios.get('http://localhost:9004/api/users', { headers: { 'Authorization': `Bearer ${token}` } });
                const currentUser = userResponse.data.find(user => user.email === userEmail);
                const role = currentUser.role;
                console.log('User Role:', role); // Debug log to verify the user role
                setUserRole(role);
            } catch (err) {
                console.error('Error fetching user role:', err.response ? err.response.data : err.message);
            }
        };

        fetchUserRole();
    }, [token]);

    useEffect(() => {
        const fetchMedicalHistories = async () => {
            try {
                const endpoint = 'http://localhost:9004/api/medicalhistory';
                const response = await axios.get(endpoint, { headers: { 'Authorization': `Bearer ${token}` } });
                const data = response.data.medicalHistories;

                const medicalHistoriesDataWithNames = data.map(history => ({
                    ...history,
                    Patient_Name: history.Patient ? `${history.Patient.Patient_Fname} ${history.Patient.Patient_Lname}` : 'Unknown Patient'
                }));

                setMedicalHistorys(medicalHistoriesDataWithNames);
            } catch (err) {
                console.error('Error fetching medical histories:', err.response ? err.response.data : err.message);
            }
        };

        fetchMedicalHistories();
    }, [token]);

    const handleDelete = (id) => {
        setDeleteMedicalHistoryId(id);
    };

    const handleDeleteConfirm = async () => {
        try {
            await axios.delete(`http://localhost:9004/api/medicalhistory/delete/${deleteMedicalHistoryId}`, { headers: { 'Authorization': `Bearer ${token}` } });
            setMedicalHistorys(medicalHistorys.filter(item => item.Record_ID !== deleteMedicalHistoryId));
            setShowUpdateForm(false);
            setShowCreateForm(false);
        } catch (err) {
            console.error('Error deleting medical history:', err.response ? err.response.data : err.message);
        }
        setDeleteMedicalHistoryId(null);
    };

    const handleCreateFormToggle = () => {
        setShowCreateForm(!showCreateForm);
        setShowUpdateForm(false);
    };

    const formatDate = (date) => {
        if (!date) return 'N/A';
        return new Intl.DateTimeFormat('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        }).format(new Date(date));
    };

    const columns = [
        { field: 'Record_ID', headerName: 'ID', flex: 1 },
        { field: 'Patient_Name', headerName: 'Patient Name', flex: 2 },
        { field: 'Allergies', headerName: 'Allergies', flex: 2 },
        { field: 'Pre_Conditions', headerName: 'Pre Conditions', flex: 2 },
        ...(userRole !== 'patient' ? [
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
        ] : [])
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
                {userRole !== 'patient' && !showCreateForm && (
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

            {showCreateForm && (
                <Suspense fallback={<div>Loading...</div>}>
                    <CreateMedicalHistory onClose={() => setShowCreateForm(false)} />
                </Suspense>
            )}

            <Box mt={4} style={{ height: '100%', width: '100%' }}>
                <DataGrid
                    rows={medicalHistorys}
                    columns={columns}
                    pageSize={10}
                    rowsPerPageOptions={[10]}
                    getRowId={(row) => row.Record_ID}
                />
            </Box>

            {showUpdateForm && (
                <Suspense fallback={<div>Loading...</div>}>
                    <UpdateMedicalHistory onClose={() => setShowUpdateForm(false)} />
                </Suspense>
            )}
        </div>
    );
}

export default MedicalHistory;
