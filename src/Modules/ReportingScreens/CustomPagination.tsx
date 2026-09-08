import React, { useState } from 'react';
import './report-compliance.css';

const CustomPagination = ({ currentPage, totalPages, onPageChange }: any) => {
  const [expanded, setExpanded] = useState(false);

  const handlePrevClick = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNextClick = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const handlePageClick = (page: any) => {
    if (page !== currentPage) {
      onPageChange(page);
    }
  };

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const renderPageNumbers = () => {
    if (!expanded && totalPages > 5) {
      return (
        <>
          <div
            className={`page-item ${currentPage === 1 ? 'active' : ''}`}
            onClick={() => handlePageClick(1)}
          >
            1
          </div>
          {currentPage > 3 && <div className="page-item">...</div>}
          {currentPage > 2 && (
            <div
              className="page-item"
              onClick={() => handlePageClick(currentPage - 1)}
            >
              {currentPage - 1}
            </div>
          )}
          {currentPage !== 1 && currentPage !== totalPages && (
            <div className="page-item active">{currentPage}</div>
          )}
          {currentPage < totalPages - 1 && (
            <div
              className="page-item"
              onClick={() => handlePageClick(currentPage + 1)}
            >
              {currentPage + 1}
            </div>
          )}
          {currentPage < totalPages - 2 && (
            <div className="page-item" onClick={handleExpandClick}>
              ...
            </div>
          )}
          <div
            className={`page-item ${currentPage === totalPages ? 'active' : ''}`}
            onClick={() => handlePageClick(totalPages)}
          >
            {totalPages}
          </div>
        </>
      );
    }

    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(
        <div
          key={i}
          className={`page-item ${currentPage === i ? 'active' : ''}`}
          onClick={() => handlePageClick(i)}
        >
          {i}
        </div>
      );
    }
    return pageNumbers;
  };

  return (
    <div className="custom-pagination">
      <div
        className={`arrow ${currentPage === 1 ? 'disabled' : ''}`}
        onClick={handlePrevClick}
      >
        <svg
          viewBox="0 0 16 16"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M11 1L3 8L11 15" />
        </svg>
      </div>
      {renderPageNumbers()}
      <div
        className={`arrow ${currentPage === totalPages ? 'disabled' : ''}`}
        onClick={handleNextClick}
      >
        <svg
          viewBox="0 0 16 16"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M5 1L13 8L5 15" />
        </svg>
      </div>
    </div>
  );
};

export default CustomPagination;
