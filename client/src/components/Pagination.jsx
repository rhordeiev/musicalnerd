import React from 'react';
import '../../public/css/components/pagination.scss';

export default function Pagination({ moveUp }) {
  return (
    <div className={`pagination ${moveUp ? 'moveUpPagination' : ''}`}>
      <button type="button" className="paginationArrow">
        &lsaquo;
      </button>
      <span className="currentPage">1</span>
      <button type="button" className="paginationArrow">
        &rsaquo;
      </button>
    </div>
  );
}
