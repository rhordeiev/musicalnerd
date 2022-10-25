import React from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import '../../public/css/components/account.scss';
import Input from './Input';
import { setAccountInfo } from '../../store/slices/userSlice';
import {
  previousAnimation,
  nextAnimation,
} from '../../public/js/accountAnimations';

export default function LoginInfoRegister() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const dispatch = useDispatch();

  function onPreviousClick() {
    previousAnimation('loginInfoRegisterBlock', 'loginBlock');
  }

  function onFocus() {
    document.getElementById('registerLoginErrorField').textContent = '\xa0';
  }

  function onSubmit(data) {
    dispatch(
      setAccountInfo({
        login: data.registerLogin,
        password: data.registerPassword,
      }),
    );
    nextAnimation('loginInfoRegisterBlock', 'personalInfoRegisterBlock');
  }

  return (
    <section className="mainBlock" id="loginInfoRegisterBlock">
      <div className="asideBlock">
        <span className="registerText">Інформація про акаунт</span>
      </div>
      <div className="inputsBlock">
        <form
          action=""
          method="POST"
          onSubmit={handleSubmit(onSubmit)}
          onFocus={onFocus}
        >
          <Input
            type="text"
            label="Логін/Нікнейм"
            input={register('registerLogin', {
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
            input={register('registerPassword', {
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
            label="Повторіть пароль"
            input={register('registerPasswordReenter', {
              required: 'Поле повинно бути заповнено',
              validate: (value) =>
                value === document.getElementById('registerPassword').value ||
                'Паролі не збігаються',
            })}
            errors={errors}
          />
          <button type="submit" className="nextButton">
            Далі
          </button>
          <button
            type="button"
            className="previousButton"
            onClick={onPreviousClick}
          >
            &larr; Повернутись
          </button>
        </form>
      </div>
    </section>
  );
}
