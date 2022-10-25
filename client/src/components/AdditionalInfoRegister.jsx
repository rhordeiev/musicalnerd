import React from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import '../../public/css/components/account.scss';
import { setAdditionalInfo } from '../../store/slices/userSlice';
import {
  previousAnimation,
  nextAnimation,
} from '../../public/js/accountAnimations';

export default function additionalInfoRegister() {
  const { register, handleSubmit } = useForm();
  const dispatch = useDispatch();

  function onPreviousClick() {
    previousAnimation(
      'additionalInfoRegisterBlock',
      'locationInfoRegisterBlock',
    );
  }

  function onSubmit(data) {
    dispatch(
      setAdditionalInfo({
        additionalInfo: data.additionalInfo,
      }),
    );
    nextAnimation('additionalInfoRegisterBlock', 'avatarRegisterBlock');
  }

  return (
    <section className="mainBlock" id="additionalInfoRegisterBlock">
      <div className="asideBlock">
        <span className="registerText">Додаткова інформація</span>
      </div>
      <div className="inputsBlock">
        <form action="" method="POST" onSubmit={handleSubmit(onSubmit)}>
          <label htmlFor="additionalInfo" className="textareaLabel">
            Додаткові інформація
          </label>
          <textarea
            id="additionalInfo"
            {...register('additionalInfo')}
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
