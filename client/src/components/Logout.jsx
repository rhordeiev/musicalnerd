import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { deleteCookie } from '../../public/js/cookieFuncs';
import { clearUserInfo } from '../../store/slices/userSlice';

export default function Logoff() {
  const dispatch = useDispatch();
  useEffect(() => {
    deleteCookie('token');
    dispatch(clearUserInfo());
    const userPageLink = document.getElementById('userPageLink');
    const accountLink = document.getElementById('accountLink');
    userPageLink.style.display = 'none';
    accountLink.style.display = 'flex';
  }, []);
  return <Navigate to="/account" replace />;
}
