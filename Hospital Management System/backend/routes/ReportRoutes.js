const express = require('express');
const router = express.Router();
const { createPdf, sendEmailWithPdf, fetchPdf } = require('../controllers/ReportController');

router.post('/create-pdf', createPdf);
router.post('/send-email', sendEmailWithPdf);
router.get('/fetch-pdf', fetchPdf);

module.exports = router;
