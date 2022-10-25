import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import checkLogin from '../../public/js/checkLogin';
import { getCookie } from '../../public/js/cookieFuncs';
import { clearUserInfo, setUserInfo } from '../../store/slices/userSlice';
import Input from '../components/Input';
import '../../public/css/pages/userSettingsPage.scss';
import {
  useUploadImageMutation,
  useRemoveImageMutation,
} from '../../store/apis/imageApi';
import {
  useChangeUserMutation,
  useDeleteUserMutation,
} from '../../store/apis/accountApi';

export default function UserSettingsPage() {
  const [user] = useState(useSelector((state) => state.user));
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    register,
    trigger,
    formState: { errors },
    setError,
  } = useForm();
  const [uploadImage] = useUploadImageMutation();
  const [removeImage] = useRemoveImageMutation();
  const [changeUser] = useChangeUserMutation();
  const [deleteUser] = useDeleteUserMutation();
  const personalInfoFormRef = useRef();
  const loginInfoFormRef = useRef();
  const contactInfoFormRef = useRef();
  const locationInfoFormRef = useRef();
  const { login } = useParams();

  useEffect(() => {
    if (login !== user.login) {
      navigate('/');
    }
    if (!getCookie('token')) {
      dispatch(clearUserInfo());
    }
    checkLogin(user);
  }, []);

  async function onSave() {
    const nameCheckResult = await trigger('name');
    const surnameCheckResult = await trigger('surname');
    const genderCheckResult = await trigger('gender');
    const birthDateCheckResult = await trigger('birthDate');
    const loginCheckResult = await trigger('login');
    const passwordCheckResult = await trigger('password');
    const passwordReenterCheckResult = await trigger('passwordReenter');
    const emailCheckResult = await trigger('email');
    const countryCheckResult = await trigger('country');
    const cityCheckResult = await trigger('city');

    if (
      !nameCheckResult ||
      !surnameCheckResult ||
      !genderCheckResult ||
      !birthDateCheckResult ||
      !loginCheckResult ||
      !passwordCheckResult ||
      !passwordReenterCheckResult ||
      !emailCheckResult ||
      !countryCheckResult ||
      !cityCheckResult
    ) {
      return false;
    }

    let avatar;
    if (personalInfoFormRef.current.avatar.files) {
      [avatar] = personalInfoFormRef.current.avatar.files;
    } else {
      avatar = undefined;
    }

    let imageUploadResult;

    if (avatar) {
      const imageUrlArray = user.avatar.split('/');
      await removeImage(imageUrlArray[imageUrlArray.length - 1].split('.')[0]);
      imageUploadResult = await uploadImage({
        image: avatar,
      });
      if (imageUploadResult.error) {
        setError(
          'avatar',
          { message: 'Файл повинен бути зображенням та менше 2 Мб' },
          { shouldFocus: true },
        );
        return false;
      }
    }

    const newUserInfo = {
      name: personalInfoFormRef.current.name.value.replace(/'/gi, '`'),
      surname: personalInfoFormRef.current.surname.value.replace(/'/gi, '`'),
      gender: personalInfoFormRef.current.gender.value,
      birthDate: personalInfoFormRef.current.birthDate.value,
      birthdate: personalInfoFormRef.current.birthDate.value,
      additionalInfo: personalInfoFormRef.current.additionalInfo.value.replace(
        /'/gi,
        '`',
      ),
      additional_info: personalInfoFormRef.current.additionalInfo.value.replace(
        /'/gi,
        '`',
      ),
      login: loginInfoFormRef.current.login.value.replace(/'/gi, '`'),
      password: loginInfoFormRef.current.password.value.replace(/'/gi, '`'),
      email: contactInfoFormRef.current.email.value.replace(/'/gi, '`'),
      additionalContactInfo:
        contactInfoFormRef.current.additionalContactInfo.value.replace(
          /'/gi,
          '`',
        ),
      additional_contact_info:
        contactInfoFormRef.current.additionalContactInfo.value.replace(
          /'/gi,
          '`',
        ),
      country: locationInfoFormRef.current.country.value.replace(/'/gi, '`'),
      city: locationInfoFormRef.current.city.value.replace(/'/gi, '`'),
      avatar: imageUploadResult?.data || user.avatar,
      user_role: user.role,
      userRole: user.role,
      enteredLogin: user.login,
    };

    console.log(newUserInfo.avatar);

    const result = await changeUser(newUserInfo);
    console.log(result);
    if (result.error) {
      setError('login', { message: result.error.data }, { shouldFocus: true });
    } else {
      dispatch(setUserInfo(newUserInfo));
      navigate(`/user/${newUserInfo.login}`);
    }
    return true;
  }

  async function onDelete() {
    await deleteUser(user.login);
    navigate('/logout');
  }

  return (
    <section className="userSettingsPage">
      <div className="userInfo">
        <div className="personalInfo block">
          <h2 className="header">Персональна інформація</h2>
          <form action="" method="POST" ref={personalInfoFormRef}>
            <Input
              type="text"
              label="Ім'я"
              input={register('name', {
                required: 'Поле повинно бути заповнено',
                maxLength: {
                  value: 50,
                  message: 'Повинно бути не більше 50 символів',
                },
              })}
              value={user.name}
              errors={errors}
            />
            <Input
              type="text"
              label="Прізвище"
              input={register('surname', {
                required: 'Поле повинно бути заповнено',
                maxLength: {
                  value: 50,
                  message: 'Повинно бути не більше 50 символів',
                },
              })}
              value={user.surname}
              errors={errors}
            />
            <select id="gender" {...register('gender')}>
              {user.gender === 'чоловіча' ? (
                <>
                  <option value="чоловіча" selected>
                    чоловіча
                  </option>
                  <option value="жіноча">жіноча</option>
                </>
              ) : (
                <>
                  <option value="чоловіча">чоловіча</option>
                  <option value="жіноча" selected>
                    жіноча
                  </option>
                </>
              )}
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
                required: 'Поле повинно бути заповнено',
                validate: (value) =>
                  new Date(value).getTime() < Date.now() ||
                  'Дата народження не може бути більше за сьогодні',
              })}
              value={user.birthDate.split('T')[0]}
              errors={errors}
            />
            <Input
              type="file"
              label="Фото користувача"
              input={register('avatar', {
                required: 'Поле повинно бути заповнено',
              })}
              errors={errors}
            />
            <label htmlFor="additionalInfo" className="textareaLabel">
              Додаткові інформація
            </label>
            <textarea
              id="additionalInfo"
              {...register('additionalInfo')}
              defaultValue={user.additionalInfo}
            ></textarea>
            <div className="inputFocusLines">
              <div className="inactiveLine"></div>
              <div className="activeLine"></div>
            </div>
          </form>
        </div>
        <div className="loginInfo block">
          <h2 className="header">Інформація про акаунт</h2>
          <form action="" method="POST" ref={loginInfoFormRef}>
            <Input
              type="text"
              label="Логін/Нікнейм"
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
              value={user.login}
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
              value={user.password}
              errors={errors}
            />
            <Input
              type="password"
              label="Повторіть пароль"
              input={register('passwordReenter', {
                required: 'Поле повинно бути заповнено',
                validate: (value) =>
                  value === document.getElementById('password').value ||
                  'Паролі не збігаються',
              })}
              value={user.password}
              errors={errors}
            />
          </form>
        </div>
        <div className="contactInfo block">
          <h2 className="header">Контактна інформація</h2>
          <form action="" method="POST" ref={contactInfoFormRef}>
            <Input
              type="email"
              label="Пошта"
              input={register('email', {
                required: 'Поле повинно бути заповнено',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Неправильний формат пошти',
                },
              })}
              value={user.email}
              errors={errors}
            />
            <label htmlFor="additionalContactInfo" className="textareaLabel">
              Додаткові контакти
            </label>
            <textarea
              id="additionalContactInfo"
              {...register('additionalContactInfo')}
              defaultValue={user.additionalContactInfo}
            ></textarea>
            <div className="inputFocusLines">
              <div className="inactiveLine"></div>
              <div className="activeLine"></div>
            </div>
          </form>
        </div>
        <div className="locationInfo block">
          <h2 className="header">Місцезнаходження</h2>
          <form action="" method="POST" ref={locationInfoFormRef}>
            <Input
              type="text"
              label="Країна"
              input={register('country', {
                required: 'Поле повинно бути заповнено',
              })}
              errors={errors}
              value={user.country}
            />
            <Input
              type="text"
              label="Населений пункт"
              input={register('city', {
                required: 'Поле повинно бути заповнено',
              })}
              errors={errors}
              value={user.city}
            />
          </form>
        </div>
      </div>
      <div className="userFuncsBlock">
        <dfn title="Зберегти зміни" className="funcButton saveButton">
          <button type="button" onClick={onSave}>
            <span className="material-symbols-outlined">save</span>
          </button>
        </dfn>
        <dfn title="Видалити сторінку" className="funcButton deleteButton">
          <button type="button" onClick={onDelete}>
            <span className="material-symbols-outlined">delete</span>
          </button>
        </dfn>
      </div>
    </section>
  );
}
