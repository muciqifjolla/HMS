import React, { useEffect, useState, Suspense, lazy } from 'react';
import axios from 'axios';
import { DataGrid } from '@mui/x-data-grid';
import { Button, Box, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Typography } from '@mui/material';
import Cookies from 'js-cookie';
import { Add, Delete, Edit } from '@mui/icons-material';
import {jwtDecode} from 'jwt-decode';

const CreateEmergencyContact = lazy(() => import('./CreateEmergency_Contact'));
const UpdateEmergencyContact = lazy(() => import('./UpdateEmergency_Contact'));

function EmergencyContact({ showCreateForm, setShowCreateForm, showUpdateForm, setShowUpdateForm, setSelectedEmergency_ContactId }) {
    const [emergencyContacts, setEmergencyContacts] = useState([]);
    const [deleteContactId, setDeleteContactId] = useState(null);
    const [userRole, setUserRole] = useState('');
    const token = Cookies.get('token');

    const handleUpdateButtonClick = (contactId) => {
        setSelectedEmergency_ContactId(contactId);
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
        const fetchEmergencyContacts = async () => {
            try {
                const endpoint = 'http://localhost:9004/api/emergency_contact';
                const response = await axios.get(endpoint, { headers: { 'Authorization': `Bearer ${token}` } });
                const data = response.data.emergencyContacts;

                const emergencyContactsDataWithNames = data.map(contact => ({
                    ...contact,
                    Patient_Name: contact.Patient ? `${contact.Patient.Patient_Fname} ${contact.Patient.Patient_Lname}` : 'Unknown'
                }));

                setEmergencyContacts(emergencyContactsDataWithNames);
            } catch (err) {
                console.error('Error fetching emergency contacts:', err.response ? err.response.data : err.message);
            }
        };

        fetchEmergencyContacts();
    }, [token]);

    const handleDelete = (id) => {
        setDeleteContactId(id);
    };

    const handleDeleteConfirm = async () => {
        try {
            await axios.delete(`http://localhost:9004/api/emergency_contact/delete/${deleteContactId}`, { headers: { 'Authorization': `Bearer ${token}` } });
            setEmergencyContacts(emergencyContacts.filter(item => item.Contact_ID !== deleteContactId));
            setShowUpdateForm(false);
            setShowCreateForm(false);
        } catch (err) {
            console.error('Error deleting emergency contact:', err.response ? err.response.data : err.message);
        }
        setDeleteContactId(null);
    };

    const handleCreateFormToggle = () => {
        setShowCreateForm(!showCreateForm);
        setShowUpdateForm(false);
    };

    const columns = [
        { field: 'Contact_ID', headerName: 'Contact ID', flex: 1 },
        { field: 'Patient_Name', headerName: 'Patient Name', flex: 2 },
        { field: 'Contact_Name', headerName: 'Contact Name', flex: 2 },
        { field: 'Phone', headerName: 'Phone', flex: 1.5 },
        { field: 'Relation', headerName: 'Relation', flex: 1.5 },
        ...(userRole !== 'patient' ? [
            {
                field: 'update',
                headerName: 'Update',
                flex: 0.5,
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
                flex: 0.5,
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
        ] : [])
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
                {userRole !== 'patient' && !showCreateForm && (
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

            {showCreateForm && (
                <Suspense fallback={<div>Loading...</div>}>
                    <CreateEmergencyContact onClose={() => setShowCreateForm(false)} />
                </Suspense>
            )}

            <Box mt={4} style={{ height: '100%', width: '100%' }}>
                <DataGrid
                    rows={emergencyContacts}
                    columns={columns}
                    pageSize={10}
                    rowsPerPageOptions={[10]}
                    getRowId={(row) => row.Contact_ID}
                />
            </Box>

            {showUpdateForm && (
                <Suspense fallback={<div>Loading...</div>}>
                    <UpdateEmergencyContact onClose={() => setShowUpdateForm(false)} />
                </Suspense>
            )}
        </div>
    );
}

export default EmergencyContact;
