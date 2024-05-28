import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { DataGrid } from '@mui/x-data-grid';
import CreateRating from './CreateRating';
import { Button, TextField, Box, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import Cookies from 'js-cookie';
import { Add } from '@mui/icons-material';

function Rating({
    showCreateForm,
    setShowCreateForm,
    showUpdateForm,
    setShowUpdateForm,
    setSelectedRatingId,
}) {
    const [rating, setRating] = useState([]);
    const [deleteRatingId, setDeleteRatingId] = useState(null);
    const [employees, setEmployees] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isDataLoaded, setIsDataLoaded] = useState(false);
    const token = Cookies.get('token');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const ratingRes = await axios.get('http://localhost:9004/api/rating', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                const employeesRes = await axios.get('http://localhost:9004/api/staff', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                const employeesData = employeesRes.data;

                // Add employee names to the rating data
                const ratingDataWithNames = ratingRes.data.map(rating => {
                    const employee = employeesData.find(emp => emp.Emp_ID === rating.Emp_ID);
                    return {
                        ...rating,
                        Employee_Name: employee ? `${employee.Emp_Fname} ${employee.Emp_Lname}` : 'Unknown'
                    };
                });

                setRating(ratingDataWithNames);
                setEmployees(employeesData);
                setIsDataLoaded(true);
                console.log('Fetched rating data with names:', ratingDataWithNames);
            } catch (err) {
                console.error('Error fetching data:', err);
            }
        };

        fetchData();
    }, [token]);

    const handleUpdateButtonClick = (ratingId) => {
        setSelectedRatingId(ratingId);
        setShowUpdateForm(true);
        if (showCreateForm) {
            setShowCreateForm(false);
        }
    };

    const handleDelete = (id) => {
        setDeleteRatingId(id);
    };

    const handleDeleteConfirm = async () => {
        try {
            await axios.delete(`http://localhost:9004/api/rating/delete/${deleteRatingId}`);
            setRating(rating.filter((data) => data.Rating_ID !== deleteRatingId));
        } catch (err) {
            console.error('Error deleting rating:', err);
        }
        setDeleteRatingId(null);
    };

    const handleCreateFormToggle = () => {
        setShowCreateForm(!showCreateForm);
        setShowUpdateForm(false);
    };

    const handleSearchInputChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const filteredRating = rating.filter((item) => {
        const employeeName = item.Employee_Name.toLowerCase();
        return employeeName.startsWith(searchQuery.toLowerCase());
    });
    const columns = [
        { field: 'Rating_ID', headerName: 'ID', width: 290 },
        { field: 'Employee_Name', headerName: 'Employee', width: 290 },
        { field: 'Rating', headerName: 'Rating (1-5)', width: 290 },
        { field: 'Comments', headerName: 'Comments', width: 290 },
        { field: 'Date', headerName: 'Date', width: 290 },
        {
            field: 'update',
            headerName: 'Update',
            width: 130,
            renderCell: (params) => (
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleUpdateButtonClick(params.row.Rating_ID)}
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
                    onClick={() => handleDelete(params.row.Rating_ID)}
                >
                    Delete
                </Button>
            ),
        }
    ];

    function formatDate(dateString) {
        const options = { month: 'short', day: 'numeric', year: 'numeric' };
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', options);
    }

    return (
        <div className="container-fluid mt-4">
            {deleteRatingId && (
                <Dialog
                    open={!!deleteRatingId}
                    onClose={() => setDeleteRatingId(null)}
                >
                    <DialogTitle>Confirm Deletion</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Are you sure you want to delete this rating record?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setDeleteRatingId(null)} color="primary">
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
                </Button>
            )}

            {showCreateForm && <CreateRating onClose={() => setShowCreateForm(false)} />}

            <Box mt={4}>
                <TextField
                    label="Search by Employee Name"
                    variant="outlined"
                    value={searchQuery}
                    onChange={handleSearchInputChange}
                    fullWidth
                />
            </Box>

            <Box mt={4} style={{ height: '100%', width: '100%' }}>
                {isDataLoaded && (
                    <DataGrid
                        rows={filteredRating}
                        columns={columns}
                        pageSize={10}
                        rowsPerPageOptions={[10]}
                        getRowId={(row) => row.Rating_ID}
                        autoHeight
                        hideFooterSelectedRowCount
                    />
                )}
            </Box>
        </div>
    );
}

export default Rating;
