import React from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  return (
    <div className="pagination-container">
      <span>Page {currentPage + 1} of {totalPages}</span>
      <div className="pagination" style={{ display: 'flex', gap: '0.5rem' }}>
        <button
          className="btn btn-secondary"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 0}
        >
          Previous
        </button>
        <button
          className="btn btn-secondary"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages - 1}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Pagination;
