import React from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import '../../public/css/components/account.scss';
import Input from './Input';
import { useCreateUserMutation } from '../../store/apis/accountApi';
import {
  useRemoveImageMutation,
  useUploadImageMutation,
} from '../../store/apis/imageApi';
import { previousAnimation } from '../../public/js/accountAnimations';

export default function avatarRegister() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm();
  const userInfo = useSelector((state) => state.user);
  const [createUser] = useCreateUserMutation();
  const [uploadImage] = useUploadImageMutation();
  const [removeImage] = useRemoveImageMutation();

  function onPreviousClick() {
    previousAnimation('avatarRegisterBlock', 'additionalInfoRegisterBlock');
  }

  async function onSubmit(data) {
    let imageUploadResult;
    console.log(userInfo);
    const enteredData = { ...userInfo };
    if (data.avatar[0]) {
      imageUploadResult = await uploadImage({
        fieldName: 'image',
        image: data.avatar[0],
      });
      if (imageUploadResult.error) {
        setError(
          'avatar',
          { message: 'Файл повинен бути зображенням та менше 2 Мб' },
          { shouldFocus: true },
        );
        return false;
      }
      enteredData.avatar = imageUploadResult.data;
    }
    const user = await createUser(enteredData);
    if (user.error) {
      if (data.avatar[0]) {
        const imageUrlArray = enteredData.avatar.split('/');
        await removeImage(
          imageUrlArray[imageUrlArray.length - 1].split('.')[0],
        );
      }
      document.getElementById('registerLoginErrorField').textContent =
        user.error.data;
      previousAnimation('avatarRegisterBlock', 'loginInfoRegisterBlock');
    } else {
      previousAnimation('avatarRegisterBlock', 'loginBlock');
    }
    return true;
  }

  return (
    <section className="mainBlock" id="avatarRegisterBlock">
      <div className="asideBlock">
        <span className="registerText">Фото профіля</span>
      </div>
      <div className="inputsBlock">
        <form
          action=""
          method="POST"
          onSubmit={handleSubmit(onSubmit)}
          encType="multipart/form-data"
        >
          <Input
            type="file"
            label="Фото профіля"
            input={register('avatar')}
            errors={errors}
          />
          <button type="submit" className="nextButton">
            Завершити
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
