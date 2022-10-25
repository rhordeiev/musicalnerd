import React from 'react';
import { Link } from 'react-router-dom';
import '../../public/css/components/moderatorFunctions.scss';

export default function ModeratorFunctions() {
  return (
    <div className="moderatorFunctionsBlock">
      <Link to="/artist/new">Додати виконавця</Link>
    </div>
  );
}
