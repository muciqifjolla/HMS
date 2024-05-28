import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { DataGrid } from '@mui/x-data-grid';
import CreateVisit from './CreateVisit';
import UpdateVisit from './UpdateVisit';
import { Button, Box, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Typography } from '@mui/material';
import Cookies from 'js-cookie';
import { Add, Delete, Update } from '@mui/icons-material';

function Visit({ showCreateForm, setShowCreateForm, showUpdateForm, setShowUpdateForm, setSelectedVisitId }) {
    const [visits, setVisits] = useState([]);
    const [deleteVisitId, setDeleteVisitId] = useState(null);
    const token = Cookies.get('token');

    const handleUpdateButtonClick = (visitId) => {
        setSelectedVisitId(visitId);
        setShowUpdateForm(true);
    };

    useEffect(() => {
        console.log("Token from Cookies:", token); // Debugging

        axios.get('http://localhost:9004/api/visit', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then((res) => {
            console.log("Fetched visits:", res.data); // Debugging
            setVisits(res.data);
        })
        .catch((err) => {
            console.log(err);
            console.log("Error response data:", err.response?.data); // Debugging
        });
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
            console.log(err);
        }
        setDeleteVisitId(null);
    };

    const handleCreateFormToggle = () => {
        setShowCreateForm(!showCreateForm);
        setShowUpdateForm(false);
    };

    const columns = [
        { field: 'Visit_ID', headerName: 'ID', width: 100 },
        { field: 'Patient_ID', headerName: 'Patient ID', width: 150 },
        { field: 'Doctor_ID', headerName: 'Doctor ID', width: 150 },
        { field: 'date_of_visit', headerName: 'Date of Visit', width: 150 },
        { field: 'condition', headerName: 'Condition', width: 200 },
        { field: 'diagnosis', headerName: 'Diagnosis', width: 200 },
        { field: 'therapy', headerName: 'Therapy', width: 200 },
        {
            field: 'update',
            headerName: 'Update',
            width: 150,
            renderCell: (params) => (
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleUpdateButtonClick(params.row.Visit_ID)}
                    startIcon={<Update />}
                >
                    
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
