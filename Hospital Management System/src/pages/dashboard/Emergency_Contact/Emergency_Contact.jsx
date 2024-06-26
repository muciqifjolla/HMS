import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { DataGrid } from '@mui/x-data-grid';
import CreateEmergencyContact from './CreateEmergency_Contact';
import { Button, Box, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Typography } from '@mui/material';
import Cookies from 'js-cookie';
import { Add, Delete, Edit } from '@mui/icons-material';
import { useLocation } from 'react-router-dom';

function EmergencyContact({
    showCreateForm,
    setShowCreateForm,
    showUpdateForm,
    setShowUpdateForm,
    setSelectedEmergency_ContactId,
}) {
    const [emergencyContacts, setEmergencyContacts] = useState([]);
    const [deleteContactId, setDeleteContactId] = useState(null);
    const [isDataLoaded, setIsDataLoaded] = useState(false);
    const [patients, setPatients] = useState([]);
    const token = Cookies.get('token');
    const location = useLocation();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const contactsRes = await axios.get('http://localhost:9004/api/emergency_contact', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                const patientsRes = await axios.get('http://localhost:9004/api/patient', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                const patientsData = patientsRes.data;

                const contactsDataWithNames = contactsRes.data.map(contact => {
                    const patient = patientsData.find(pat => pat.Patient_ID === contact.Patient_ID);
                    return {
                        ...contact,
                        Patient_Name: patient ? `${patient.Patient_Fname} ${patient.Patient_Lname}` : 'Unknown'
                    };
                });

                setEmergencyContacts(contactsDataWithNames);
                setPatients(patientsData);
                setIsDataLoaded(true);
            } catch (err) {
                console.error('Error fetching data:', err);
            }
        };

        fetchData();
        if (location.state?.patientId && location.state?.showCreateForm) {
            setShowCreateForm(true);
        }
    }, [token, location.state, setShowCreateForm]);

    const handleUpdateButtonClick = (contactId) => {
        setSelectedEmergency_ContactId(contactId);
        setShowUpdateForm(true);
        if (showCreateForm) {
            setShowCreateForm(false);
        }
    };

    const handleDelete = (id) => {
        setDeleteContactId(id);
    };

    const handleDeleteConfirm = async () => {
        try {
            await axios.delete(`http://localhost:9004/api/emergency_contact/delete/${deleteContactId}`);
            setEmergencyContacts(emergencyContacts.filter((data) => data.Contact_ID !== deleteContactId));
        } catch (err) {
            console.error('Error deleting emergency contact:', err);
        }
        setDeleteContactId(null);
    };

    const handleCreateFormToggle = () => {
        setShowCreateForm(!showCreateForm);
        setShowUpdateForm(false);
    };

    const columns = [
        { field: 'Contact_ID', headerName: 'Contact ID', width: 250 },
        { field: 'Patient_Name', headerName: 'Patient Name', width: 250 },
        { field: 'Contact_Name', headerName: 'Contact Name', width: 250 },
        { field: 'Phone', headerName: 'Phone', width: 250 },
        { field: 'Relation', headerName: 'Relation', width: 250 },
        {
            field: 'update',
            headerName: 'Update',
            width: 130,
            renderCell: (params) => (
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleUpdateButtonClick(params.row.Contact_ID)}
                    startIcon={<Edit />}
                >
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
                    onClick={() => handleDelete(params.row.Contact_ID)}
                    startIcon={<Delete />}
                >
                </Button>
            ),
        }
    ];

    return (
        <div className='container-fluid mt-4'>
            {deleteContactId && (
                <Dialog
                    open={!!deleteContactId}
                    onClose={() => setDeleteContactId(null)}
                >
                    <DialogTitle>Confirm Deletion</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Are you sure you want to delete this emergency contact?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setDeleteContactId(null)} color="primary">
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
                    Emergency Contacts
                </Typography>
                {!showCreateForm && (
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleCreateFormToggle}
                        startIcon={<Add />}
                    >
                        Add Emergency Contact
                    </Button>
                )}
            </Box>

            {showCreateForm && <CreateEmergencyContact onClose={() => setShowCreateForm(false)} />}

            <Box mt={4} style={{ height: '100%', width: '100%' }}>
                {isDataLoaded && (
                    <DataGrid
                        rows={emergencyContacts}
                        columns={columns}
                        pageSize={10}
                        rowsPerPageOptions={[10]}
                        getRowId={(row) => row.Contact_ID}
                        autoHeight
                        hideFooterSelectedRowCount
                    />
                )}
            </Box>
        </div>
    );
}

export default EmergencyContact;
