import React from 'react';
import '../../public/css/components/list.scss';
import { Link } from 'react-router-dom';

export default function List() {
  return (
    <div className="userList">
      <div className="listHeader">Header</div>
      <div className="listActions">
        <Link to="list/id">
          <span className="material-icons showListIcon">visibility</span>
        </Link>
      </div>
    </div>
  );
}
