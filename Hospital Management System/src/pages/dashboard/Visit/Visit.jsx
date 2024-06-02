import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { DataGrid } from '@mui/x-data-grid';
import CreateVisit from './CreateVisit';
import UpdateVisit from './UpdateVisit';
import { Button, Box, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Typography } from '@mui/material';
import Cookies from 'js-cookie';
import { Add, Delete, Edit } from '@mui/icons-material';

function Visit({ showCreateForm, setShowCreateForm, showUpdateForm, setShowUpdateForm, setSelectedVisitId }) {
    const [visits, setVisits] = useState([]);
    const [deleteVisitId, setDeleteVisitId] = useState(null);
    const token = Cookies.get('token');

    const handleUpdateButtonClick = (visitId) => {
        setSelectedVisitId(visitId);
        setShowUpdateForm(true);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [visitRes, patientRes, doctorRes] = await Promise.all([
                    axios.get('http://localhost:9004/api/visit', { headers: { 'Authorization': `Bearer ${token}` } }),
                    axios.get('http://localhost:9004/api/patient', { headers: { 'Authorization': `Bearer ${token}` } }),
                    axios.get('http://localhost:9004/api/doctor', { headers: { 'Authorization': `Bearer ${token}` } })
                ]);
                
                const patients = patientRes.data;
                const doctors = doctorRes.data;
                
                const visitsDataWithNames = visitRes.data.map(visit => {
                    const patient = patients.find(p => p.Patient_ID === visit.Patient_ID);
                    const doctor = doctors.find(d => d.Doctor_ID === visit.Doctor_ID);
                    return {
                        ...visit,
                        Patient_Name: patient ? `${patient.Patient_Fname} ${patient.Patient_Lname}` : 'Unknown',
                        Doctor_Name: doctor ? `${doctor.Staff.Emp_Fname} ${doctor.Staff.Emp_Lname}` : 'Unknown'
                    };
                });

                setVisits(visitsDataWithNames);
            } catch (err) {
                console.error(err);
            }
        };
        fetchData();
    }, [token]);

    const handleDelete = (id) => {
        setDeleteVisitId(id);
    };

    const handleDeleteConfirm = async () => {
        try {
            await axios.delete(`http://localhost:9004/api/visit/delete/${deleteVisitId}`);
            setVisits(visits.filter(item => item.Visit_ID !== deleteVisitId));
            setShowUpdateForm(false);
            setShowCreateForm(false);
        } catch (err) {
            console.error(err);
        }
        setDeleteVisitId(null);
    };

    const handleCreateFormToggle = () => {
        setShowCreateForm(!showCreateForm);
        setShowUpdateForm(false);
    };

    const columns = [
        { field: 'Visit_ID', headerName: 'ID', flex: 1 },
        { field: 'Patient_Name', headerName: 'Patient Name', flex: 2 },
        { field: 'Doctor_Name', headerName: 'Doctor Name', flex: 2 },
        { field: 'date_of_visit', headerName: 'Date of Visit', flex: 2 },
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

            {showCreateForm && <CreateVisit onClose={() => setShowCreateForm(false)} />}

            <Box mt={4} style={{ height: '100%', width: '100%' }}>
                <DataGrid
                    rows={visits}
                    columns={columns}
                    pageSize={10}
                    rowsPerPageOptions={[10]}
                    getRowId={(row) => row.Visit_ID}
                />
            </Box>
        </div>
    );
}

export default Visit;
