import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { DataGrid } from '@mui/x-data-grid';
import CreateNurse from './CreateNurse';
import UpdateNurse from './UpdateNurse';
import { Button, Box, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Typography } from '@mui/material';
import Cookies from 'js-cookie';
import { Add, Delete, Edit } from '@mui/icons-material';

function Nurse() {
    const [nurseData, setNurseData] = useState([]);
    const [deleteNurseId, setDeleteNurseId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [showUpdateForm, setShowUpdateForm] = useState(false);
    const [selectedNurseId, setSelectedNurseId] = useState(null);
    const token = Cookies.get('token');

    const handleUpdateButtonClick = (nurseId) => {
        setSelectedNurseId(nurseId);
        setShowUpdateForm(true);
        setShowCreateForm(false);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const nurseResponse = await axios.get('http://localhost:9004/api/nurse', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const patientResponse = await axios.get('http://localhost:9004/api/patient', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const staffResponse = await axios.get('http://localhost:9004/api/staff', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (nurseResponse.status === 200 && patientResponse.status === 200 && staffResponse.status === 200) {
                    const nursesData = nurseResponse.data;
                    const patientsData = patientResponse.data;
                    const staffsData = staffResponse.data;

                    const nursesWithNames = nursesData.map(nurse => {
                        const patient = patientsData.find(p => nurse.Patient_ID === p.Patient_ID);
                        const staff = staffsData.find(s => nurse.Emp_ID === s.Emp_ID);
                        return {
                            ...nurse,
                            Patient_Name: patient ? `${patient.Patient_Fname} ${patient.Patient_Lname}` : 'Unknown',
                            Staff_Name: staff ? `${staff.Emp_Fname} ${staff.Emp_Lname}` : 'Unknown'
                        };
                    });
                    setNurseData(nursesWithNames);
                    setLoading(false);
                } else {
                    setError('Failed to fetch all necessary data.');
                    setLoading(false);
                }
            } catch (error) {
                console.error('Error fetching nurse details:', error);
                setError('Error fetching nurse details.');
                setLoading(false);
            }
        };

        fetchData();
    }, [token]);

    const handleDelete = (id) => {
        setDeleteNurseId(id);
    };

    const handleDeleteConfirm = async () => {
        try {
            await axios.delete(`http://localhost:9004/api/nurse/delete/${deleteNurseId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setNurseData(prevNurses => prevNurses.filter(nurse => nurse.Nurse_ID !== deleteNurseId));
            setShowUpdateForm(false);
            setShowCreateForm(false);
        } catch (error) {
            console.error('Error deleting nurse:', error);
            alert('Error deleting nurse.');
        } finally {
            setDeleteNurseId(null);
        }
    };

    const handleCreateFormToggle = () => {
        setShowCreateForm(!showCreateForm);
        setShowUpdateForm(false);
    };

    const handleCloseUpdateForm = () => {
        setShowUpdateForm(false);
        setSelectedNurseId(null);
    };

    const columns = [
        { field: 'Nurse_ID', headerName: 'ID', flex: 1 },
        { field: 'Patient_Name', headerName: 'Patient Name', flex: 2 },
        { field: 'Staff_Name', headerName: 'Staff Name', flex: 2 },
        {
            field: 'update',
            headerName: 'Update',
            flex: 1,
            renderCell: (params) => (
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleUpdateButtonClick(params.row.Nurse_ID)}
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
                    onClick={() => handleDelete(params.row.Nurse_ID)}
                    startIcon={<Delete />}
                >
                </Button>
            )
        }
    ];

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className='container-fluid mt-4'>
            {deleteNurseId && (
                <Dialog
                    open={!!deleteNurseId}
                    onClose={() => setDeleteNurseId(null)}
                >
                    <DialogTitle>Confirm Deletion</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Are you sure you want to delete this nurse record?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setDeleteNurseId(null)} color="primary">
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
                    Nurses
                </Typography>
                {!showCreateForm && (
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleCreateFormToggle}
                        startIcon={<Add />}
                    >
                        Add Nurse
                    </Button>
                )}
            </Box>

            {showCreateForm && <CreateNurse onClose={() => setShowCreateForm(false)} />}
            {showUpdateForm && <UpdateNurse id={selectedNurseId} onClose={handleCloseUpdateForm} />}

            <Box mt={4} style={{ height: '100%', width: '100%' }}>
                <DataGrid
                    rows={nurseData}
                    columns={columns}
                    pageSize={10}
                    rowsPerPageOptions={[10]}
                    getRowId={(row) => row.Nurse_ID}
                />
            </Box>
        </div>
    );
}

export default Nurse;
