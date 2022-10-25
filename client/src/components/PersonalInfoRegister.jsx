import React from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import '../../public/css/components/account.scss';
import Input from './Input';
import { setPersonalInfo } from '../../store/slices/userSlice';
import {
  previousAnimation,
  nextAnimation,
} from '../../public/js/accountAnimations';

export default function PersonalInfoRegister() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const dispatch = useDispatch();

  function onPreviousClick() {
    previousAnimation('personalInfoRegisterBlock', 'loginInfoRegisterBlock');
  }

  function onSubmit(data) {
    dispatch(
      setPersonalInfo({
        name: data.name,
        surname: data.surname,
        gender: data.gender,
        birthDate: data.birthDate,
      }),
    );
    nextAnimation('personalInfoRegisterBlock', 'contactInfoRegisterBlock');
  }

  return (
    <section className="mainBlock" id="personalInfoRegisterBlock">
      <div className="asideBlock">
        <span className="registerText">Особиста інформація</span>
      </div>
      <div className="inputsBlock">
        <form action="" method="POST" onSubmit={handleSubmit(onSubmit)}>
          <Input
            type="text"
            label="Ім'я"
            input={register('name', {
              maxLength: {
                value: 50,
                message: 'Повинно бути не більше 50 символів',
              },
            })}
            errors={errors}
          />
          <Input
            type="text"
            label="Прізвище"
            input={register('surname', {
              maxLength: {
                value: 50,
                message: 'Повинно бути не більше 50 символів',
              },
            })}
            errors={errors}
          />
          <select id="gender" {...register('gender')}>
            <option value="чоловіча">чоловіча</option>
            <option value="жіноча">жіноча</option>
          </select>
          <div className="inputFocusLines">
            <div className="inactiveLine"></div>
            <div className="activeLine"></div>
          </div>
          <label htmlFor="gender" className="translate">
            Стать
          </label>
          <span className="inputErrorField">&nbsp;</span>
          <Input
            type="date"
            label="Дата народження"
            input={register('birthDate', {
              validate: (value) =>
                new Date(value).getTime() < Date.now() ||
                'Дата народження не може бути більше за сьогодні',
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
