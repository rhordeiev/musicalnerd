import React from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import '../../public/css/components/account.scss';
import Input from './Input';
import { setContactInfo } from '../../store/slices/userSlice';
import {
  previousAnimation,
  nextAnimation,
} from '../../public/js/accountAnimations';

export default function ContactInfoRegister() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const dispatch = useDispatch();

  function onPreviousClick() {
    previousAnimation('contactInfoRegisterBlock', 'personalInfoRegisterBlock');
  }

  function onSubmit(data) {
    dispatch(
      setContactInfo({
        email: data.email,
        additionalContactInfo: data.additionalContactInfo,
      }),
    );
    nextAnimation('contactInfoRegisterBlock', 'locationInfoRegisterBlock');
  }

  return (
    <section className="mainBlock" id="contactInfoRegisterBlock">
      <div className="asideBlock">
        <span className="registerText">Контактна інформація</span>
      </div>
      <div className="inputsBlock">
        <form action="" method="POST" onSubmit={handleSubmit(onSubmit)}>
          <Input
            type="email"
            label="Пошта"
            input={register('email', {
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Неправильний формат пошти',
              },
            })}
            errors={errors}
          />
          <label htmlFor="additionalContactInfo" className="textareaLabel">
            Додаткові контакти
          </label>
          <textarea
            id="additionalContactInfo"
            {...register('additionalContactInfo')}
          ></textarea>
          <div className="inputFocusLines">
            <div className="inactiveLine"></div>
            <div className="activeLine"></div>
          </div>
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
