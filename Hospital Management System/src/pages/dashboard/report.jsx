import React, { useState } from 'react';
import Report from "./Report/Report";

export function Reports () {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const handleDelete = async (id) => {
    try {
        await axios.delete(`http://localhost:9004/api/report/delete/${id}`);
        setShowCreateForm(false);
    } catch (error) {
        console.error('Error deleting report:', error);
    }
};
  return (
    <div>
      <Report 
        showCreateForm={showCreateForm}
        setShowCreateForm={setShowCreateForm}
        handleDelete={handleDelete}
      />
    </div>
  );
};

export default Reports;
