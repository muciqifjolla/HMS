import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { DataGrid } from '@mui/x-data-grid';
import CreateAppointment from './CreateAppointment';
import {
    Button,
    TextField,
    Box,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from '@mui/material';
import Cookies from 'js-cookie';
import { Add } from '@mui/icons-material';

function Appointment({
    showCreateForm,
    setShowCreateForm,
    showUpdateForm,
    setShowUpdateForm,
    setSelectedAppointmentId,
}) {
    const [appointments, setAppointments] = useState([]);
    const [deleteAppointmentId, setDeleteAppointmentId] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [isDataLoaded, setIsDataLoaded] = useState(false);
    const [patients, setPatients] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [staff, setStaff] = useState([]);
    const token = Cookies.get('token');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const appointmentsRes = await axios.get('http://localhost:9004/api/appointment', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                const patientsRes = await axios.get('http://localhost:9004/api/patient', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                const doctorsRes = await axios.get('http://localhost:9004/api/doctor', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                const staffRes = await axios.get('http://localhost:9004/api/staff', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                const patientsData = patientsRes.data;
                const doctorsData = doctorsRes.data;
                const staffData = staffRes.data;

                const appointmentsDataWithNames = appointmentsRes.data.map(appointment => {
                    const patient = patientsData.find(pat => pat.Patient_ID === appointment.Patient_ID);
                    const doctor = doctorsData.find(doc => doc.Doctor_ID === appointment.Doctor_ID);
                    const doctorStaff = doctor ? staffData.find(st => st.Emp_ID === doctor.Emp_ID) : null;
                    return {
                        ...appointment,
                        Patient_Name: patient ? `${patient.Patient_Fname} ${patient.Patient_Lname}` : 'Unknown',
                        Doctor_Name: doctorStaff ? `${doctorStaff.Emp_Fname} ${doctorStaff.Emp_Lname}` : 'Unknown'
                    };
                });

                setAppointments(appointmentsDataWithNames);
                setPatients(patientsData);
                setDoctors(doctorsData);
                setStaff(staffData);
                setIsDataLoaded(true);
            } catch (err) {
                console.error('Error fetching data:', err);
            }
        };

        fetchData();
    }, [token]);

    const handleUpdateButtonClick = (appointmentId) => {
        setSelectedAppointmentId(appointmentId);
        setShowUpdateForm(true);
        if (showCreateForm) {
            setShowCreateForm(false);
        }
    };

    const handleDelete = (id) => {
        setDeleteAppointmentId(id);
    };

    const handleDeleteConfirm = async () => {
        try {
            await axios.delete(`http://localhost:9004/api/appointment/delete/${deleteAppointmentId}`);
            setAppointments(appointments.filter((data) => data.Appoint_ID !== deleteAppointmentId));
        } catch (err) {
            console.error('Error deleting appointment:', err);
        }
        setDeleteAppointmentId(null);
    };

    const handleCreateFormToggle = () => {
        setShowCreateForm(!showCreateForm);
        setShowUpdateForm(false);
    };

    const handleSearchInputChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const filteredAppointments = appointments.filter((appointment) => {
        const patientName = appointment.Patient_Name.toLowerCase();
        const doctorName = appointment.Doctor_Name.toLowerCase();
        return (
            patientName.includes(searchQuery.toLowerCase()) ||
            doctorName.includes(searchQuery.toLowerCase())
        );
    });

    const columns = [
        { field: 'Appoint_ID', headerName: 'Appointment ID', width: 130 },
        { field: 'Patient_Name', headerName: 'Patient Name', width: 180 },
        { field: 'Doctor_Name', headerName: 'Doctor Name', width: 180 },
        { field: 'Scheduled_On', headerName: 'Scheduled On', width: 180 },
        { field: 'Date', headerName: 'Date', width: 130 },
        { field: 'Time', headerName: 'Time', width: 130 },
        {
            field: 'update',
            headerName: 'Update',
            width: 130,
            renderCell: (params) => (
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleUpdateButtonClick(params.row.Appoint_ID)}
                >
                    Update
                </Button>
            ),
        },
        {
            field: 'delete',
            headerName: 'Delete',
            width: 130,
            renderCell: (params) => (
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => handleDelete(params.row.Appoint_ID)}
                >
                    Delete
                </Button>
            ),
        }
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
                            Are you sure you want to delete this appointment?
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

            {!showCreateForm && (
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleCreateFormToggle}
                    startIcon={<Add />}
                >
                    Add Appointment
                </Button>
            )}

            {showCreateForm && <CreateAppointment onClose={() => setShowCreateForm(false)} />}
            
            <Box mt={4}>
                <TextField
                    label="Search by Patient or Doctor Name"
                    variant="outlined"
                    value={searchQuery}
                    onChange={handleSearchInputChange}
                    fullWidth
                />
            </Box>
            
            <Box mt={4} style={{ height: '100%' , width: '100%' }}>
                {isDataLoaded && (
                    <DataGrid
                        rows={filteredAppointments}
                        columns={columns}
                        pageSize={10}
                        rowsPerPageOptions={[10]}
                        getRowId={(row) => row.Appoint_ID}
                        autoHeight
                        hideFooterSelectedRowCount
                    />
                )}
            </Box>
        </div>
    );
}

export default Appointment;
