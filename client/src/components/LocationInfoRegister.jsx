import React from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import '../../public/css/components/account.scss';
import Input from './Input';
import { setLocationInfo } from '../../store/slices/userSlice';
import {
  previousAnimation,
  nextAnimation,
} from '../../public/js/accountAnimations';

export default function LocationInfoRegister() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const dispatch = useDispatch();

  function onPreviousClick() {
    previousAnimation('locationInfoRegisterBlock', 'contactInfoRegisterBlock');
  }

  function onSubmit(data) {
    dispatch(
      setLocationInfo({
        city: data.city,
        country: data.country,
      }),
    );
    nextAnimation('locationInfoRegisterBlock', 'additionalInfoRegisterBlock');
  }

  return (
    <section className="mainBlock" id="locationInfoRegisterBlock">
      <div className="asideBlock">
        <span className="registerText">Місцезнаходження</span>
      </div>
      <div className="inputsBlock">
        <form action="" method="POST" onSubmit={handleSubmit(onSubmit)}>
          <Input
            type="text"
            label="Країна"
            input={register('country')}
            errors={errors}
          />
          <Input
            type="text"
            label="Населений пункт"
            input={register('city')}
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
