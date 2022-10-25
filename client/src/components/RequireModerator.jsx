import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getCookie } from '../../public/js/cookieFuncs';
import { clearUserInfo } from '../../store/slices/userSlice';
import checkLogin from '../../public/js/checkLogin';

export default function RequireUser({ children }) {
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!getCookie('token')) {
      dispatch(clearUserInfo());
    }
    checkLogin(user);
    if (user.role !== 'moderator' && user.role !== 'admin') {
      navigate(`/user/${user.login}`);
    }
  });
  return children;
}
