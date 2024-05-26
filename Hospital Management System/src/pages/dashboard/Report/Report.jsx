import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CreateReport from './CreateReport';

function Report({ showCreateForm, setShowCreateForm }) {
  const [reports, setReports] = useState([]);
  const [deleteReportId, setDeleteReportId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredReports, setFilteredReports] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage] = useState(10);

  useEffect(() => {
    refreshReports();
  }, []);

  const refreshReports = async () => {
    try {
      const res = await axios.get('http://localhost:9004/api/report/fetch-reports');
      const reportsWithUrls = res.data.map(report => {
        const uint8Array = new Uint8Array(report.report.data);
        const blob = new Blob([uint8Array], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        return { ...report, pdfUrl: url };
      });
      setReports(reportsWithUrls);
      setFilteredReports(reportsWithUrls);
    } catch (err) {
      console.error('Error fetching reports:', err);
    }
  };

  function formatDate(dateString) {
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', options);
  }

  const handleDelete = async (id) => {
    setDeleteReportId(id);
  };

  const handleDeleteConfirm = async () => {
    try {
      await axios.delete(`http://localhost:9004/api/report/delete/${deleteReportId}`);
      setReports(reports.filter(item => item.Report_ID !== deleteReportId));
      setFilteredReports(filteredReports.filter((item) => item.Report_ID !== deleteReportId));

      if (showCreateForm) {
        setShowCreateForm(false);
      }
    } catch (err) {
      console.log(err);
    }
    setDeleteReportId(null);
  };

  const handleSearchInputChange = (event) => {
    setSearchQuery(event.target.value);
    setCurrentPage(1);
  };

  const handleCreateFormToggle = () => {
    setShowCreateForm(!showCreateForm);
  };

  useEffect(() => {
    if (reports.length > 0) {
      const filtered = reports
        .filter((item) => {
          const personalNumberRegex = /^\d+$/;
          const personalNumberStr = String(item.personal_number);
          if (!personalNumberRegex.test(personalNumberStr)) {
            console.warn(`Invalid personal number: ${personalNumberStr}`);
            return false;
          }
          if (searchQuery === '') {
            return true;
          }
          return personalNumberStr.startsWith(searchQuery);
        })
        .sort((a, b) => b.Report_ID - a.Report_ID);
      setFilteredReports(filtered);
    }
  }, [searchQuery, reports]);

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredReports.slice(indexOfFirstRecord, indexOfLastRecord);

  const paginate = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= Math.ceil(filteredReports.length / recordsPerPage)) {
      setCurrentPage(pageNumber);
    }
  };

  const openPDF = (reportData) => {
    window.open(reportData.pdfUrl, '_blank');
  };

  return (
    <div className='container-fluid mt-4'>
        {deleteReportId && (
                <div className="fixed inset-0 flex items-center justify-center z-10 overflow-auto bg-black bg-opacity-50">
                    <div className="bg-white p-8 mx-auto rounded-lg">
                        <h1 className="text-lg font-bold mb-4">Confirm Deletion</h1>
                        <p className="mb-4">Are you sure you want to delete this patient record?</p>
                        <div className="flex justify-end">
                            <button className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 mr-2 rounded" onClick={handleDeleteConfirm}>Delete</button>
                            <button className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded" onClick={() => setDeleteReportId(null)}>Cancel</button>
                        </div>
                    </div>
                </div>
        )}
      {showCreateForm ? null : (
        <div className="mt-4">
          <button
            className="bg-green-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            style={{ borderRadius: '0.5rem' }}
            onClick={handleCreateFormToggle}
          >
            Create Report
          </button>
        </div>
      )}
    {showCreateForm && (
        <CreateReport onClose={() => setShowCreateForm(false)} onSaveSuccess={refreshReports} />
    )}

      <div className="mt-4">
        {filteredReports.length > recordsPerPage && (
          <div className="flex justify-end">
            {currentPage > 1 && (
              <button
                className="mr-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={() => paginate(currentPage - 1)}
              >
                Previous
              </button>
            )}
            {currentPage < Math.ceil(filteredReports.length / recordsPerPage) && (
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={() => paginate(currentPage + 1)}
              >
                Next
              </button>
            )}
          </div>
        )}
      </div>
      <div className="mt-4">
        <input
          type="text"
          placeholder="Search by personal number"
          value={searchQuery}
          onChange={handleSearchInputChange}
          className="border border-gray-300 px-4 py-2 rounded-md"
        />
      </div>
      <div className="table-responsive">
        <div>
          <div className="py-8">
            <div>
              <h2 className="text-2xl font-semibold leading-tight">Reports</h2>
            </div>
            <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
              <div className="inline-block min-w-full shadow-md rounded-lg overflow-hidden">
                <table className="min-w-full leading-normal">
                  <thead>
                    <tr>
                      <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">ID</th>
                      <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Personal Number</th>
                      <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Report</th>
                      <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Time created</th>
                      <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Delete</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentRecords.map((data, i) => (
                      <tr key={i}>
                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                          <p className="text-gray-900 whitespace-no-wrap">{data.Report_ID}</p>
                        </td>
                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                          <p className="text-gray-900 whitespace-no-wrap">{data.personal_number}</p>
                        </td>
                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                          {data.report && (
                            <button
                              onClick={() => openPDF(data)}
                              className="text-blue-600 hover:underline focus:outline-none"
                            >
                              {`Report_${data.Report_ID}.pdf`}
                            </button>
                          )}
                        </td>
                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                          <p className="text-gray-900 whitespace-no-wrap">{formatDate(data.created_at)}</p>
                        </td>
                        <td className='px-5 py-5 border-b border-gray-200 bg-white text-sm'>
                            <button className='bg-red-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded' onClick={() => handleDelete(data.Report_ID)} style={{ borderRadius: '0.5rem', padding: '5px 10px' }}>Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Report;
