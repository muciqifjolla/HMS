import React, { useEffect, useState, lazy, Suspense } from 'react';
import axios from 'axios';
import { DataGrid } from '@mui/x-data-grid';
import { Button, Box, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Typography } from '@mui/material';
import Cookies from 'js-cookie';
import { Add, Delete, Edit } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

// Lazy load components
const CreateDoctor = lazy(() => import('./CreateDoctor'));

function Doctor({
    showCreateForm,
    setShowCreateForm,
    showUpdateForm,
    setShowUpdateForm,
    setSelectedDoctorId,
}) {
    const [doctors, setDoctors] = useState([]);
    const [deleteDoctorId, setDeleteDoctorId] = useState(null);
    const [staff, setStaff] = useState(null);
    const token = Cookies.get('token'); 
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();
    const [isDataLoaded, setIsDataLoaded] = useState(false); 

    useEffect(() => {
        const fetchData = async () => {
            try {
                const doctorsRes = await axios.get('http://localhost:9004/api/doctors', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const doctorsDataWithNames = doctorsRes.data.map(doctor => {
                    const staff = doctor.Staff;
                    return {
                        ...doctor,
                        Emp_Name: staff ? `${staff.Emp_Fname} ${staff.Emp_Lname}` : 'Unknown'
                    };
                });
                setDoctors(doctorsDataWithNames);
                setIsDataLoaded(true);
            } catch (err) {
                console.error('Error fetching data:', err);
            }
        };

        fetchData();
    }, [token]);
    


    const handleUpdateButtonClick = (doctorId) => {
        setSelectedDoctorId(doctorId);
        setShowUpdateForm((prevState) => (prevState === doctorId ? null : doctorId));
        if (showCreateForm) {
            setShowCreateForm(false); 
        }
    };

    const handleDelete = (id) => {
        setDeleteDoctorId(id);
    };

    const handleDeleteConfirm = async () => {
        try {
            await axios.delete(`http://localhost:9004/api/doctros/delete/${deleteDoctorId}`);
            setDoctors(doctors.filter((data) => data.Doctor_ID !== deleteDoctorId));
        } catch (err) {
            console.error('Error deleting doctor:', err);
        }
        setDeleteDoctorId(null);
    };

    const handleCreateFormToggle = () => {
        setShowCreateForm(!showCreateForm);
        setShowUpdateForm(false); 
    };

    const handleCloseCreateForm = () => {
        setShowCreateForm(false); 
    };
    const filteredDoctors = doctors.filter((doctor) => {
        const doctorFullName = `${doctor.Staff.Emp_Fname} ${doctor.Staff.Emp_Lname}`.toLowerCase();
        const searchQueryLower = searchQuery.toLowerCase();

        return (
            doctorFullName.includes(searchQueryLower)
        );
    });


    const columns = [
        { field: 'Doctor_ID', headerName: 'ID', flex: 1 },
        { field: 'Qualifications', headerName: 'Qualifications', flex: 2 },
        { field: 'Emp_Name', headerName: 'Doctor Name', flex: 2 },
        { field: 'Specialization', headerName: 'Specialization', flex: 2 },
        {
            field: 'update',
            headerName: 'Update',
            flex: 1,
            renderCell: (params) => (
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleUpdateButtonClick(params.row.Doctor_ID)}
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
                    onClick={() => handleDelete(params.row.Doctor_ID)}
                    startIcon={<Delete />}
                >
                </Button>
            )
        }
    ];

    return (
        <div className='container-fluid mt-4'>
            {deleteDoctorId && (
                <Dialog
                    open={!!deleteDoctorId}
                    onClose={() => setDeleteDoctorId(null)}
                >
                    <DialogTitle>Confirm Deletion</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Are you sure you want to delete this doctor record?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setDeleteDoctorId(null)} color="primary">
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
                    Doctors
                </Typography>
                {!showCreateForm && (
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleCreateFormToggle}
                        startIcon={<Add />}
                    >
                        Add Doctor
                    </Button>
                )}
            </Box>

            <Suspense fallback={<div>Loading...</div>}>
                {showCreateForm && <CreateDoctor onClose={handleCloseCreateForm} />}
            </Suspense>

            <Box mt={4} style={{ height: '100%', width: '100%' }}>
                <DataGrid
                    rows={doctors}
                    columns={columns}
                    pageSize={10}
                    rowsPerPageOptions={[10]}
                    getRowId={(row) => row.Doctor_ID}
                />
            </Box>
        </div>
    );
}

export default Doctor;