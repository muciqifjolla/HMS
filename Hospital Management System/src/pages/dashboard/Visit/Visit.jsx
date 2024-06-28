import React, { useEffect, useState, Suspense, lazy } from 'react';
import axios from 'axios';
import { DataGrid } from '@mui/x-data-grid';
import { Button, Box, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Typography } from '@mui/material';
import Cookies from 'js-cookie';
import { Add, Delete, Edit } from '@mui/icons-material';
import "react-datetime/css/react-datetime.css";
import {jwtDecode} from 'jwt-decode';

const CreateVisit = lazy(() => import('./CreateVisit'));
const UpdateVisit = lazy(() => import('./UpdateVisit'));

function Visit({ showCreateForm, setShowCreateForm, showUpdateForm, setShowUpdateForm, setSelectedVisitId }) {
    const [visits, setVisits] = useState([]);
    const [deleteVisitId, setDeleteVisitId] = useState(null);
    const [userRole, setUserRole] = useState('');
    const token = Cookies.get('token');

    const handleUpdateButtonClick = (visitId) => {
        setSelectedVisitId(visitId);
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
                setUserRole(role);
            } catch (err) {
                console.error('Error fetching user role:', err.response ? err.response.data : err.message);
            }
        };

        fetchUserRole();
    }, [token]);

    useEffect(() => {
        const fetchVisits = async () => {
            try {
                const userResponse = await axios.get('http://localhost:9004/api/users', { headers: { 'Authorization': `Bearer ${token}` } });
                const userRole = userResponse.data.role;

                const endpoint = userRole === 'admin' ? 'http://localhost:9004/api/visit' : 'http://localhost:9004/api/doctor/data';
                
                const response = await axios.get(endpoint, { headers: { 'Authorization': `Bearer ${token}` } });
                const data = userRole === 'admin' ? response.data : response.data.visits;

                const visitsDataWithNames = data.map(visit => ({
                    ...visit,
                    Patient_Name: visit.Patient ? `${visit.Patient.Patient_Fname} ${visit.Patient.Patient_Lname}` : 'Unknown Patient',
                    Doctor_Name: visit.Doctor_Name || 'Unknown Doctor'
                }));

                setVisits(visitsDataWithNames);
            } catch (err) {
                console.error('Error fetching visits:', err.response ? err.response.data : err.message);
            }
        };

        fetchVisits();
    }, [token]);

    const handleDelete = (id) => {
        setDeleteVisitId(id);
    };

    const handleDeleteConfirm = async () => {
        try {
            await axios.delete(`http://localhost:9004/api/visit/delete/${deleteVisitId}`, { headers: { 'Authorization': `Bearer ${token}` } });
            setVisits(visits.filter(item => item.Visit_ID !== deleteVisitId));
            setShowUpdateForm(false);
            setShowCreateForm(false);
        } catch (err) {
            console.error('Error deleting visit:', err.response ? err.response.data : err.message);
        }
        setDeleteVisitId(null);
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
        { field: 'Visit_ID', headerName: 'ID', flex: 1 },
        { field: 'Patient_Name', headerName: 'Patient Name', flex: 2 },
        { field: 'Doctor_Name', headerName: 'Doctor Name', flex: 2 },
        { 
            field: 'date_of_visit', 
            headerName: 'Date of Visit', 
            flex: 2,
            renderCell: (params) => formatDate(params.row.date_of_visit)
        },
        { field: 'condition', headerName: 'Condition', flex: 2 },
        { field: 'diagnosis', headerName: 'Diagnosis', flex: 2 },
        { field: 'therapy', headerName: 'Therapy', flex: 2 },
        {
            field: 'update',
            headerName: 'Update',
            flex: 1,
            renderCell: (params) => (
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleUpdateButtonClick(params.row.Visit_ID)}
                    startIcon={<Edit />}
                >
                </Button>
            )
        },
        ...(userRole !== 'doctor' ? [
            {
                field: 'delete',
                headerName: 'Delete',
                flex: 1,
                renderCell: (params) => (
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => handleDelete(params.row.Visit_ID)}
                        startIcon={<Delete />}
                    >
                    </Button>
                )
            }
        ] : [])
    ];

    return (
        <div className='container-fluid mt-4'>
            {deleteVisitId && (
                <Dialog
                    open={!!deleteVisitId}
                    onClose={() => setDeleteVisitId(null)}
                >
                    <DialogTitle>Confirm Deletion</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Are you sure you want to delete this visit record?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setDeleteVisitId(null)} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={handleDeleteConfirm} color="secondary">
                            Delete
                        </Button>
                    </DialogActions>
                </Dialog>
            )}

            {userRole !== 'doctor' && (
                <Box mt={4} display="flex" alignItems="center">
                    <Typography variant="h6" style={{ marginRight: 'auto' }}>
                        Visits
                    </Typography>
                    {showCreateForm ? null : (
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleCreateFormToggle}
                            startIcon={<Add />}
                        >
                            Add Visit
                        </Button>
                    )}
                </Box>
            )}

            {showCreateForm && (
                <Suspense fallback={<div>Loading...</div>}>
                    <CreateVisit onClose={() => setShowCreateForm(false)} />
                </Suspense>
            )}

            <Box mt={4} style={{ height: '100%', width: '100%' }}>
                <DataGrid
                    rows={visits}
                    columns={columns}
                    pageSize={10}
                    rowsPerPageOptions={[10]}
                    getRowId={(row) => row.Visit_ID}
                />
            </Box>

            {showUpdateForm && (
                <Suspense fallback={<div>Loading...</div>}>
                    <UpdateVisit onClose={() => setShowUpdateForm(false)} />
                </Suspense>
            )}
        </div>
    );
}

export default Visit;
