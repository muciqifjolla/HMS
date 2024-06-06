import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { DataGrid } from '@mui/x-data-grid';
import CreateNurse from './CreateNurse';
import UpdateNurse from './UpdateNurse';
import { Button, Box, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Typography } from '@mui/material';
import Cookies from 'js-cookie';
import { Add, Delete, Edit } from '@mui/icons-material';

function Nurse({ showCreateForm, setShowCreateForm, showUpdateForm, setShowUpdateForm, setSelectedNurseId }) {
    const [nurses, setNurses] = useState([]);
    const [deleteNurseId, setDeleteNurseId] = useState(null);
    const token = Cookies.get('token');

    const handleUpdateButtonClick = (nurseId) => {
        setSelectedNurseId(nurseId);
        setShowUpdateForm(true);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [nurseRes, patientRes, staffRes] = await Promise.all([
                    axios.get('http://localhost:9004/api/nurse', { headers: { 'Authorization': `Bearer ${token}` } }),
                    axios.get('http://localhost:9004/api/patient', { headers: { 'Authorization': `Bearer ${token}` } }),
                    axios.get('http://localhost:9004/api/staff', { headers: { 'Authorization': `Bearer ${token}` } })
                ]);

                const patients = patientRes.data;
                const staff = staffRes.data;

                const nursesDataWithNames = nurseRes.data.map(nurse => {
                    const patient = patients.find(p => p.Patient_ID === nurse.Patient_ID);
                    const employee = staff.find(s => s.Emp_ID === nurse.Emp_ID);
                    return {
                        ...nurse,
                        Patient_Name: patient ? `${patient.Patient_Fname} ${patient.Patient_Lname}` : 'Unknown',
                        Employee_Name: employee ? `${employee.Emp_Fname} ${employee.Emp_Lname}` : 'Unknown'
                    };
                });

                setNurses(nursesDataWithNames);
            } catch (err) {
                console.error(err);
            }
        };
        fetchData();
    }, [token]);

    const handleDelete = (id) => {
        setDeleteNurseId(id);
    };

    const handleDeleteConfirm = async () => {
        try {
            await axios.delete(`http://localhost:9004/api/nurse/delete/${deleteNurseId}`, { headers: { 'Authorization': `Bearer ${token}`} });
            setNurses(nurses.filter(item => item.Nurse_ID !== deleteNurseId));
            setShowUpdateForm(false);
            setShowCreateForm(false);
        } catch (err) {
            console.error(err);
        }
        setDeleteNurseId(null);
    };

    const handleCreateFormToggle = () => {
        setShowCreateForm(!showCreateForm);
        setShowUpdateForm(false);
    };

    const columns = [
        { field: 'Nurse_ID', headerName: 'ID', flex: 1 },
        { field: 'Patient_Name', headerName: 'Patient Name', flex: 2 },
        { field: 'Employee_Name', headerName: 'Employee Name', flex: 2 },
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
                {showCreateForm ? null : (
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
            {showUpdateForm && <UpdateNurse onClose={() => setShowUpdateForm(false)} />}

            <Box mt={4} style={{ height: '100%', width: '100%' }}>
                <DataGrid
                    rows={nurses}
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
