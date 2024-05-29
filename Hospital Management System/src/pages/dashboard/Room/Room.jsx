import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { DataGrid } from '@mui/x-data-grid';
import CreateRoom from './CreateRoom';
import UpdateRoom from './UpdateRoom';
import { Button, Box, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Typography } from '@mui/material';
import Cookies from 'js-cookie';
import { Add, Delete, Update } from '@mui/icons-material';
import { useLocation } from 'react-router-dom';

function Room({ showCreateForm, setShowCreateForm, showUpdateForm, setShowUpdateForm, setSelectedRoomId }) {
    const [rooms, setRooms] = useState([]);
    const [deleteRoomId, setDeleteRoomId] = useState(null);
    const token = Cookies.get('token');
    const location = useLocation();

    const handleUpdateButtonClick = (roomId) => {
        setSelectedRoomId(roomId);
        setShowUpdateForm(true);
    };

    useEffect(() => {
        console.log("Token from Cookies:", token); // Debugging

        axios.get('http://localhost:9004/api/room', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then((res) => {
            console.log("Fetched rooms:", res.data); // Debugging
            setRooms(res.data);
        })
        .catch((err) => {
            console.log(err);
            console.log("Error response data:", err.response?.data); // Debugging
        });

        // Check if navigation state contains patientId to show the CreateRoom form
        if (location.state?.patientId && location.state?.showCreateForm) {
            setShowCreateForm(true);
        }
    }, [token, location.state]);

    const handleDelete = (id) => {
        setDeleteRoomId(id);
    };

    const handleDeleteConfirm = async () => {
        try {
            await axios.delete(`http://localhost:9004/api/room/delete/${deleteRoomId}`);
            setRooms(rooms.filter(item => item.Room_ID !== deleteRoomId));
            setShowUpdateForm(false);
            setShowCreateForm(false);
        } catch (err) {
            console.log(err);
        }
        setDeleteRoomId(null);
    };

    const handleCreateFormToggle = () => {
        setShowCreateForm(!showCreateForm);
        setShowUpdateForm(false);
    };

    const columns = [
        { field: 'Room_ID', headerName: 'ID', width: 100 },
        { field: 'Room_type', headerName: 'Room Type', width: 300 },
        { field: 'Patient_ID', headerName: 'Patient ID', width: 300 },
        { field: 'Room_cost', headerName: 'Cost (€)', width: 300 },
        {
            field: 'update',
            headerName: 'Update',
            width: 150,
            renderCell: (params) => (
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleUpdateButtonClick(params.row.Room_ID)}
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
                    onClick={() => handleDelete(params.row.Room_ID)}
                    startIcon={<Delete />}
                >
                    
                </Button>
            )
        }
    ];

    return (
        <div className='container-fluid mt-4'>
            {deleteRoomId && (
                <Dialog
                    open={!!deleteRoomId}
                    onClose={() => setDeleteRoomId(null)}
                >
                    <DialogTitle>Confirm Deletion</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Are you sure you want to delete this room record?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setDeleteRoomId(null)} color="primary">
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
                    Rooms
                </Typography>
                {showCreateForm ? null : (
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleCreateFormToggle}
                        startIcon={<Add />}
                    >
                        Add Room
                    </Button>
                )}
            </Box>

            {showCreateForm && <CreateRoom onClose={() => setShowCreateForm(false)} />}

            <Box mt={4} style={{ height: '100%', width: '100%' }}>
                <DataGrid
                    rows={rooms}
                    columns={columns}
                    pageSize={10}
                    rowsPerPageOptions={[10]}
                    getRowId={(row) => row.Room_ID}
                />
            </Box>
        </div>
    );
}

export default Room;
