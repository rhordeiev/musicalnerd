import React from 'react';
import { Link } from 'react-router-dom';
import '../../public/css/components/userLists.scss';
import List from './List';

export default function UserLists() {
  return (
    <section className="userListsBlock">
      <div className="userLists">
        <div className="userListsHeader">Списки</div>
        <div className="userListsElements">
          <List />
          <List />
          <List />
          <List />
        </div>
        <span className="moreLists">
          <Link to="lists">Більше &raquo;</Link>
        </span>
      </div>
    </section>
  );
}
