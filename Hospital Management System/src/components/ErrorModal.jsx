import React from 'react';
import './ErrorModal.css';

const ErrorModal = ({ message, onClose }) => {
  const handleClose = () => {
    onClose(); // Call the onClose function passed from the parent component
  };

  return (
    <div className="error-modal" onClick={handleClose}>
      <div className="error-modal-content" onClick={(e) => e.stopPropagation()}>
        <span className="close" onClick={handleClose}>&times;</span>
        <p>{message}</p>
      </div>
    </div>
  );
};

export default ErrorModal;
