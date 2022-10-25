import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUserInfo } from '../../store/slices/userSlice';
import '../../public/css/components/account.scss';
import Input from './Input';
import { nextAnimation } from '../../public/js/accountAnimations';
import { useLoginUserMutation } from '../../store/apis/accountApi';

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loginUser] = useLoginUserMutation();

  function onRegisterClick() {
    nextAnimation('loginBlock', 'loginInfoRegisterBlock');
  }

  async function onSubmit(enteredData) {
    const result = await loginUser(enteredData);
    if (result.error) {
      switch (result.error.data) {
        case 'USER_NOT_FOUND':
          setError(
            'login',
            { message: 'Користувача не знайдено' },
            { shouldFocus: true },
          );
          break;
        case 'PASSWORD_NOT_MATCH':
          setError(
            'password',
            { message: 'Пароль введено неправильно' },
            { shouldFocus: true },
          );
          break;
        default:
          setError(
            'login',
            { message: 'Помилка із сервером' },
            { shouldFocus: true },
          );
          break;
      }
    } else {
      dispatch(setUserInfo(result.data.user));
      document.cookie = `token=${result.data.token}; max-age=${
        result.data.expirationTime / 1000
      };`;
      const userPageLink = document.getElementById('userPageLink');
      const accountLink = document.getElementById('accountLink');
      const linkToUserPage = document.getElementById('linkToUserPage');
      const linkToUserSettings = document.getElementById('linkToUserSettings');
      const userName = document.getElementById('userName');
      const userAvatar = document.getElementById('userAvatar');
      userPageLink.style.display = 'flex';
      accountLink.style.display = 'none';
      userName.textContent = result.data.user.login;
      linkToUserPage.href = `/user/${result.data.user.login}`;
      linkToUserSettings.href = `/user/${result.data.user.login}/settings`;
      userAvatar.src = `${process.env.API_URL}/image/${result.data.user.avatar}`;
      // const avatar = await getImage(result.data.user.avatar);
      navigate(`/user/${result.data.user.login}`);
    }
  }

  return (
    <section className="mainBlock" id="loginBlock">
      <div className="inputsBlock">
        <form action="" method="POST" onSubmit={handleSubmit(onSubmit)}>
          <Input
            type="text"
            label="Логін"
            input={register('login', {
              required: 'Поле повинно бути заповнено',
              minLength: {
                value: 7,
                message: 'Повинно бути не менше 7 символів',
              },
              maxLength: {
                value: 20,
                message: 'Повинно бути не більше 20 символів',
              },
            })}
            errors={errors}
          />
          <Input
            type="password"
            label="Пароль"
            input={register('password', {
              required: 'Поле повинно бути заповнено',
              minLength: {
                value: 7,
                message: 'Повинно бути не менше 7 символів',
              },
              maxLength: {
                value: 20,
                message: 'Повинно бути не більше 20 символів',
              },
            })}
            errors={errors}
          />
          <button type="submit" className="nextButton">
            Ввійти
          </button>
        </form>
      </div>
      <div className="asideBlock">
        <button
          type="button"
          className="registerText"
          onClick={onRegisterClick}
        >
          Бажаєте зареєструватись?
        </button>
      </div>
    </section>
  );
}
