import React, { useEffect, useState, Suspense, lazy } from 'react';
import axios from 'axios';
import { DataGrid } from '@mui/x-data-grid';
import { Button, Box, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Typography } from '@mui/material';
import Cookies from 'js-cookie';
import { Add, Delete, Edit } from '@mui/icons-material';
import {jwtDecode} from 'jwt-decode';

const CreateAppointment = lazy(() => import('./CreateAppointment'));
const UpdateAppointment = lazy(() => import('./UpdateAppointment'));

function Appointment({ showCreateForm, setShowCreateForm, showUpdateForm, setShowUpdateForm, setSelectedAppointmentId }) {
    const [appointments, setAppointments] = useState([]);
    const [deleteAppointmentId, setDeleteAppointmentId] = useState(null);
    const [userRole, setUserRole] = useState('');
    const token = Cookies.get('token');

    const handleUpdateButtonClick = (appointmentId) => {
        setSelectedAppointmentId(appointmentId);
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
        const fetchAppointments = async () => {
            try {
                const endpoint = 'http://localhost:9004/api/appointment';
                const response = await axios.get(endpoint, { headers: { 'Authorization': `Bearer ${token}` } });
                const data = response.data.appointments;

                const appointmentsDataWithNames = data.map(appointment => ({
                    ...appointment,
                    Patient_Name: appointment.Patient ? `${appointment.Patient.Patient_Fname} ${appointment.Patient.Patient_Lname}` : 'Unknown Patient',
                    Doctor_Name: appointment.Doctor && appointment.Doctor.Staff ? `${appointment.Doctor.Staff.Emp_Fname} ${appointment.Doctor.Staff.Emp_Lname}` : 'Unknown Doctor'
                }));

                setAppointments(appointmentsDataWithNames);
            } catch (err) {
                console.error('Error fetching appointments:', err.response ? err.response.data : err.message);
            }
        };

        fetchAppointments();
    }, [token]);

    const handleDelete = (id) => {
        setDeleteAppointmentId(id);
    };

    const handleDeleteConfirm = async () => {
        try {
            await axios.delete(`http://localhost:9004/api/appointment/delete/${deleteAppointmentId}`, { headers: { 'Authorization': `Bearer ${token}` } });
            setAppointments(appointments.filter(item => item.Appoint_ID !== deleteAppointmentId));
            setShowUpdateForm(false);
            setShowCreateForm(false);
        } catch (err) {
            console.error('Error deleting appointment:', err.response ? err.response.data : err.message);
        }
        setDeleteAppointmentId(null);
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
        { field: 'Appoint_ID', headerName: 'ID', flex: 1 },
        { field: 'Patient_Name', headerName: 'Patient Name', flex: 2 },
        { field: 'Doctor_Name', headerName: 'Doctor Name', flex: 2 },
        { 
            field: 'Scheduled_On', 
            headerName: 'Scheduled On', 
            flex: 2,
            renderCell: (params) => formatDate(params.row.Scheduled_On)
        },
        { 
            field: 'Date', 
            headerName: 'Date', 
            flex: 2,
            renderCell: (params) => formatDate(params.row.Date)
        },
        { field: 'Time', headerName: 'Time', flex: 2 },
        ...(userRole !== 'patient' ? [
            {
                field: 'update',
                headerName: 'Update',
                flex: 1,
                renderCell: (params) => (
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleUpdateButtonClick(params.row.Appoint_ID)}
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
                        onClick={() => handleDelete(params.row.Appoint_ID)}
                        startIcon={<Delete />}
                    >
                    </Button>
                )
            }
        ] : [])
    ];

    return (
        <div className='container-fluid mt-4'>
            {deleteAppointmentId && (
                <Dialog
                    open={!!deleteAppointmentId}
                    onClose={() => setDeleteAppointmentId(null)}
                >
                    <DialogTitle>Confirm Deletion</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Are you sure you want to delete this appointment record?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setDeleteAppointmentId(null)} color="primary">
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
                    Appointments
                </Typography>
                {userRole !== 'patient' && !showCreateForm && (
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleCreateFormToggle}
                        startIcon={<Add />}
                    >
                        Add Appointment
                    </Button>
                )}
            </Box>

            {showCreateForm && (
                <Suspense fallback={<div>Loading...</div>}>
                    <CreateAppointment onClose={() => setShowCreateForm(false)} />
                </Suspense>
            )}

            <Box mt={4} style={{ height: '100%', width: '100%' }}>
                <DataGrid
                    rows={appointments}
                    columns={columns}
                    pageSize={10}
                    rowsPerPageOptions={[10]}
                    getRowId={(row) => row.Appoint_ID}
                />
            </Box>

            {showUpdateForm && (
                <Suspense fallback={<div>Loading...</div>}>
                    <UpdateAppointment onClose={() => setShowUpdateForm(false)} />
                </Suspense>
            )}
        </div>
    );
}

export default Appointment;
