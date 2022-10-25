import React, { useEffect } from 'react';
import '../../public/css/pages/accountPage.scss';
import Login from '../components/Login';
import Register from '../components/Register';
import checkLogin from '../../public/js/checkLogin';

export default function SigningPage() {
  useEffect(() => {
    checkLogin();
  }, []);
  return (
    <div className="accountPage">
      <section className="accountBlock">
        <Login />
        <Register />
      </section>
    </div>
  );
}
