const express = require('express');
const router = express.Router();
const { createPdf, 
    sendEmailWithPdf, 
    fetchPdf, 
    saveReportToDB, 
    fetchReportsFromDB,
    DeleteReport
    } = require('../controllers/ReportController');

router.post('/report/create-pdf', createPdf);
router.post('/report/send-email', sendEmailWithPdf);
router.get('/report/fetch-pdf', fetchPdf);
router.post('/report/save-report-to-db', saveReportToDB);
router.get('/report/fetch-reports', fetchReportsFromDB);
router.delete("/report/delete/:id", DeleteReport);

module.exports = router;
