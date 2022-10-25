import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import '../../public/css/pages/userPage.scss';
import UserInfo from '../components/UserInfo';
import UserReviews from '../components/UserReviews';
import checkLogin from '../../public/js/checkLogin';
import ModeratorFunctions from '../components/ModeratorFunctions';
import { useLazyFindUserQuery } from '../../store/apis/accountApi';
import { getCookie } from '../../public/js/cookieFuncs';
import { clearUserInfo } from '../../store/slices/userSlice';

export default function UserPage() {
  const { login } = useParams();
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState('user');
  const [findUser] = useLazyFindUserQuery();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!getCookie('token')) {
      dispatch(clearUserInfo());
    }
    checkLogin(user);
    findUser({ login, role: userRole }).then((result) => {
      setUserRole(result.data.user_role);
    });
  }, []);

  useEffect(() => {
    if (userRole === 'moderator' && login !== user.login) {
      navigate('/account');
    }
  }, [userRole]);

  return (
    <section className="userPage">
      <UserInfo userLogin={login} />
      {userRole === 'moderator' ? <ModeratorFunctions /> : <UserReviews />}
    </section>
  );
}
