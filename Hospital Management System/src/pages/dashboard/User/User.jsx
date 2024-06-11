import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { DataGrid } from '@mui/x-data-grid';
import CreateUser from './CreateUser';
import { Button, Box, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Typography } from '@mui/material';
import { Add, Delete, Edit } from '@mui/icons-material';
import Cookies from 'js-cookie'; // Import js-cookie

function User({
    showCreateForm,
    setShowCreateForm,
    setShowUpdateForm,
    showUpdateForm,
    setSelectedUserId,
}) {
    const [users, setUsers] = useState([]);
    const [deleteUserId, setDeleteUserId] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const token = Cookies.get('token'); 


    // const handleUpdateButtonClick = (userId) => {
    //     setSelectedUserId(userId);
    //     setShowUpdateForm(!showUpdateForm);
    // };


    useEffect(() => {
        axios
            .get('http://localhost:9004/api/users',{
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            .then((res) => {
                console.log("Users data:", res.data);
                setUsers(res.data);
                
            })
            .catch((err) => console.log(err));
            
    }, []);

    const handleUpdateButtonClick = (userId) => {
        setSelectedUserId(userId);
        setShowUpdateForm((prevState) => prevState === userId ? null : userId);
        if (showCreateForm) {
            setShowCreateForm(false); 
        }
    };

    const handleDelete = (id) => {
        setDeleteUserId(id);
    };

    const handleDeleteConfirm = async () => {
        try {
            await axios.delete(`http://localhost:9004/api/users/delete/${deleteUserId}`);
            setUsers(users.filter((user) => user.user_id !== deleteUserId));
            setFilteredUsers(filteredUsers.filter((item) => item.user_id !== deleteUserId));
            
            // Close the create form if open
            if (showCreateForm) {
                setShowCreateForm(false);
            }
             // Close the update form if open
             if (showUpdateForm) {
                setShowUpdateForm(false);
            }
            
        } catch (err) {
            console.log(err);
        }
        setDeleteUserId(null);
    };

    const handleCreateFormToggle = () => {
        setShowCreateForm(!showCreateForm);
        setShowUpdateForm(false);
    };

    const handleCloseCreateForm = () => {
        setShowCreateForm(false);
    };

    const columns = [
        { field: 'user_id', headerName: 'User ID', flex: 1 },
        { field: 'email', headerName: 'Email', flex: 2 },
        { field: 'username', headerName: 'Username', flex: 2 },
        { field: 'role', headerName: 'Role', flex: 2 }, // Assuming you want to display the user's role
        {
            field: 'update',
            headerName: 'Update',
            flex: 1,
            renderCell: (params) => (
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleUpdateButtonClick(params.row.user_id)} // Adjust the function and parameter accordingly
                    startIcon={<Edit />}
                >
                </Button>
            ),
        },
        {
            field: 'delete',
            headerName: 'Delete',
            flex: 1,
            renderCell: (params) => (
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => handleDelete(params.row.user_id)} // Adjust the function and parameter accordingly
                    startIcon={<Delete />}
                >
                </Button>
            ),
        }
    ];

 
  
    return (
        <div className='container-fluid mt-4'>
            {deleteUserId && (
                <Dialog
                    open={!!deleteUserId}
                    onClose={() => setDeleteUserId(null)}
                >
                    <DialogTitle>Confirm Deletion</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Are you sure you want to delete this user?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setDeleteUserId(null)} color="primary">
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
                    Users
                </Typography>
                {showCreateForm ? null : (
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleCreateFormToggle}
                        startIcon={<Add />}
                    >
                        Add User
                    </Button>
                )}
            </Box>

            {showCreateForm && <CreateUser onClose={() => setShowCreateForm(false)} />}

            <Box mt={4} style={{ height: '100%', width: '100%' }}>
                <DataGrid
                    rows={users}
                    columns={columns}
                    pageSize={10}
                    rowsPerPageOptions={[10]}
                    getRowId={(row) => row.user_id}
                    autoHeight
                />
            </Box>
        </div>
    );
}

export default User;