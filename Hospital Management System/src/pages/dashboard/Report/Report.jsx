import React, { useState, useEffect, Suspense, lazy } from 'react';
import axios from 'axios';
import { DataGrid } from '@mui/x-data-grid';
import { Button, Box, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Typography } from '@mui/material';
import Cookies from 'js-cookie';
import { Add } from '@mui/icons-material';
import Datetime from 'react-datetime';
import "react-datetime/css/react-datetime.css";

const CreateReport = lazy(() => import('./CreateReport'));

function Report({ showCreateForm, setShowCreateForm }) {
  const [reports, setReports] = useState([]);
  const [deleteReportId, setDeleteReportId] = useState(null);
  const token = Cookies.get('token');

  useEffect(() => {
    refreshReports();
  }, []);

  const refreshReports = async () => {
    try {
      const res = await axios.get('http://localhost:9004/api/report/fetch-reports', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const reportsWithUrls = res.data.map(report => {
        const uint8Array = new Uint8Array(report.report.data);
        const blob = new Blob([uint8Array], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        const createdAt = report.created_at ? new Date(report.created_at) : null;
        console.log(`Report ID: ${report.Report_ID}, Created At: ${createdAt}`); // Debug log
        return { ...report, pdfUrl: url, created_at: createdAt };
      });
      setReports(reportsWithUrls);
    } catch (err) {
      console.error('Error fetching reports:', err);
    }
  };

  const handleDelete = async (id) => {
    setDeleteReportId(id);
  };

  const handleDeleteConfirm = async () => {
    try {
      await axios.delete(`http://localhost:9004/api/report/delete/${deleteReportId}`);
      setReports(reports.filter(item => item.Report_ID !== deleteReportId));

      if (showCreateForm) {
        setShowCreateForm(false);
      }
    } catch (err) {
      console.log(err);
    }
    setDeleteReportId(null);
  };

  const handleCreateFormToggle = () => {
    setShowCreateForm(!showCreateForm);
  };

  const openPDF = (reportData) => {
    window.open(reportData.pdfUrl, '_blank');
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return (
      <Datetime
        value={date}
        timeFormat="HH:mm:ss"
        dateFormat="DD-MM-YYYY"
        renderInput={(props,) => (
          <input {...props} disabled />
        )}
      />
    );
  };

  const columns = [
    { field: 'Report_ID', headerName: 'ID', flex: 1 },
    { field: 'personal_number', headerName: 'Personal Number', flex: 2 },
    {
      field: 'report',
      headerName: 'Report',
      flex: 2,
      renderCell: (params) => (
        <Button
          onClick={() => openPDF(params.row)}
          variant="contained"
          color="primary"
        >
          {`Report_${params.row.Report_ID}.pdf`}
        </Button>
      ),
    },
    {
      field: 'created_at',
      headerName: 'Time created',
      flex: 2,
      renderCell: (params) => {
        const date = params.row?.created_at;
        return date ? formatDate(date) : 'N/A';
      },
    },
    {
      field: 'delete',
      headerName: 'Delete',
      flex: 1,
      renderCell: (params) => (
        <Button
          variant="contained"
          color="secondary"
          onClick={() => handleDelete(params.row.Report_ID)}
        >
          Delete
        </Button>
      ),
    },
  ];

  return (
    <div className='container-fluid mt-4'>
      {deleteReportId && (
        <Dialog
          open={!!deleteReportId}
          onClose={() => setDeleteReportId(null)}
        >
          <DialogTitle>Confirm Deletion</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete this report?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteReportId(null)} color="primary">
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
          Reports
        </Typography>
        {showCreateForm ? null : (
          <Button
            variant="contained"
            color="primary"
            onClick={handleCreateFormToggle}
            startIcon={<Add />}
          >
            Create Report
          </Button>
        )}
      </Box>

      {showCreateForm && (
        <Suspense fallback={<div>Loading...</div>}>
          <CreateReport onClose={() => setShowCreateForm(false)} onSaveSuccess={refreshReports} />
        </Suspense>
      )}

      <Box mt={4} style={{ height: '100%', width: '100%' }}>
        <DataGrid
          rows={reports}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[10]}
          getRowId={(row) => row.Report_ID}
        />
      </Box>
    </div>
  );
}

export default Report;
