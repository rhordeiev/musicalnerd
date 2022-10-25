import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import '../../public/css/pages/addUpdateArtistPage.scss';
import Input from '../components/Input';
import {
  useUploadImageMutation,
  useRemoveImageMutation,
} from '../../store/apis/imageApi';
import {
  useCreateArtistMutation,
  useLazyFindArtistQuery,
  useChangeArtistMutation,
} from '../../store/apis/artistApi';
import checkLogin from '../../public/js/checkLogin';
import { getCookie } from '../../public/js/cookieFuncs';
import { clearUserInfo } from '../../store/slices/userSlice';

function ArtistLinks({ links, setLinks }) {
  // const arrayLinksFinalSplit = [];
  // const artistLinksInitialSplit = links
  //   .split(';')
  //   .filter((elem) => elem !== '');
  // artistLinksInitialSplit.forEach((link) => {
  //   arrayLinksFinalSplit.push({
  //     name: link.split('==')[0],
  //     href: link.split('==')[1],
  //   });
  // });

  function linksToArray(enteredLinks) {
    const arrayLinksFinalSplit = [];
    const artistLinksInitialSplit = enteredLinks
      .split(';')
      .filter((elem) => elem !== '');
    artistLinksInitialSplit.forEach((link, index) => {
      arrayLinksFinalSplit.push({
        id: `link${index}`,
        name: link.split('==')[0],
        href: link.split('==')[1],
      });
    });
    return arrayLinksFinalSplit;
  }

  function onDeleteClick(e) {
    const result = linksToArray(links).filter(
      (element) => element.id !== e.target.id,
    );
    let newLinksString = '';
    result.forEach((element) => {
      newLinksString += `${element.name}==${element.href};`;
    });
    setLinks(newLinksString);
  }

  const arrayOfLinks = linksToArray(links);

  return arrayOfLinks.map((link) => (
    <div className="linkBlock">
      <a
        href={link.href}
        className="link"
        target="_blank"
        rel="noreferrer"
        key={`${link.name}-${Math.random()}`}
      >
        {link.name}
      </a>
      <span className="deleteTag">
        <button
          type="button"
          className="material-symbols-outlined"
          id={link.id}
          onClick={onDeleteClick}
        >
          close
        </button>
      </span>
    </div>
  ));
}

export default function AddUpdatePage({ type = 'add' }) {
  const user = useSelector((state) => state.user);
  const { id } = useParams();
  const [artistName, setArtistName] = useState('');
  const [artistGenres, setArtistGenres] = useState('');
  const [artistLinks, setArtistLinks] = useState('Name==link;');
  const [artistInfo, setArtistInfo] = useState('');
  const [artistReceivedPhoto, setArtistPhoto] = useState('');

  const {
    register,
    trigger,
    formState: { errors },
    setError,
  } = useForm();

  const [uploadImage] = useUploadImageMutation();
  const [createArtist] = useCreateArtistMutation();
  const [findArtist] = useLazyFindArtistQuery();
  const [changeArtist] = useChangeArtistMutation();
  const [removeImage] = useRemoveImageMutation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const artistNameRef = useRef();
  const artistPhotoRef = useRef();
  const artistGenresRef = useRef();
  const artistLinksRef = useRef();
  const artistInfoRef = useRef();

  async function submitForms() {
    const artistNameFormResult = await trigger('artistName');
    const artistPhotoFormResult = await trigger('artistPhoto');
    const artistGenresFormResult = await trigger('artistGenres');

    switch (type) {
      case 'update':
        if (!artistNameFormResult || !artistGenresFormResult || !artistLinks) {
          return false;
        }
        break;
      default:
        if (
          !artistNameFormResult ||
          !artistPhotoFormResult ||
          !artistGenresFormResult ||
          !artistLinks
        ) {
          return false;
        }
    }

    let artistPhoto;
    if (artistPhotoRef.current.artistPhoto.files) {
      [artistPhoto] = artistPhotoRef.current.artistPhoto.files;
    } else {
      artistPhoto = undefined;
    }

    if (type === 'update' && artistPhoto) {
      const imageUrlArray = artistReceivedPhoto.split('/');
      await removeImage(imageUrlArray[imageUrlArray.length - 1].split('.')[0]);
    }

    let imageUploadResult;

    if (type === 'add' || (type === 'update' && artistPhoto)) {
      imageUploadResult = await uploadImage({
        image: artistPhoto,
      });
      if (imageUploadResult.error) {
        setError(
          'artistPhoto',
          { message: 'Файл повинен бути зображенням та менше 2 Мб' },
          { shouldFocus: true },
        );
        return false;
      }
    }

    const artist = {
      id,
      name: artistNameRef.current.artistName.value.replace(/'/gi, '`'),
      genres: artistGenresRef.current.artistGenres.value.replace(/'/gi, '`'),
      links: artistLinks.replace(/'/gi, '`'),
      info: artistInfoRef.current.artistInfo.value.replace(/'/gi, '`'),
      photo: imageUploadResult?.data || '',
    };

    if (type === 'update') {
      await changeArtist(artist);
      navigate(`/artist/${id}`);
    } else {
      const result = await createArtist(artist);
      navigate(`/artist/${result.data.result.id}`);
    }

    return true;
  }

  async function onLinkAddClick(e) {
    e.preventDefault();
    const linkNameValidated = await trigger('linkName');
    const linkRefValidated = await trigger('linkRef');
    if (!linkNameValidated || !linkRefValidated) {
      return false;
    }
    const link = [
      artistLinksRef.current.linkName.value,
      artistLinksRef.current.linkRef.value,
    ]
      .join('==')
      .concat(';');
    setArtistLinks(artistLinks.concat(link));
    return true;
  }

  useEffect(() => {
    if (!getCookie('token')) {
      dispatch(clearUserInfo());
    }
    checkLogin(user);

    if (type === 'update') {
      findArtist(id).then((result) => {
        setArtistName(result.data.name);
        setArtistGenres(result.data.genres);
        setArtistLinks(result.data.links);
        setArtistInfo(result.data.info);
        setArtistPhoto(result.data.photo);
      });
    }
  }, []);

  return (
    <section className="newArtistPage">
      <div>
        <div className="artistNameBlock">
          <form action="" method="POST" ref={artistNameRef}>
            <Input
              type="text"
              label="Ім'я"
              input={register('artistName', {
                required: 'Поле повинно бути заповнено',
                maxLength: {
                  value: 50,
                  message: 'Повинно бути не більше 50 символів',
                },
              })}
              value={artistName}
              errors={errors}
            />
          </form>
        </div>
        <div className="artistPhotoBlock">
          <form action="" method="POST" ref={artistPhotoRef}>
            <Input
              type="file"
              label="Фото виконавця"
              input={register('artistPhoto', {
                required: 'Поле повинно бути заповнено',
              })}
              errors={errors}
            />
          </form>
        </div>
        <div className="artistGenresBlock">
          <form action="" method="POST" ref={artistGenresRef}>
            <Input
              type="text"
              label="Жанри"
              input={register('artistGenres', {
                required: 'Поле повинно бути заповнено',
                maxLength: {
                  value: 500,
                  message: 'Повинно бути не більше 500 символів',
                },
              })}
              value={artistGenres}
              errors={errors}
            />
          </form>
        </div>
        <div className="addArtistButton">
          <button type="submit" method="POST" onClick={submitForms}>
            {type === 'update' ? 'Зберегти' : 'Додати'}
          </button>
        </div>
      </div>
      <div>
        <div className="artistLinksBlock">
          <div className="albumTagsBlock">
            <div className="albumTagElement">
              <span className="header">Посилання</span>
              <form action="" method="POST" ref={artistLinksRef}>
                <Input
                  type="text"
                  label="Назва"
                  input={register('linkName', {
                    required: 'Поле повинно бути заповнено',
                    maxLength: {
                      value: 50,
                      message: 'Повинно бути не більше 50 символів',
                    },
                  })}
                  errors={errors}
                />
                <Input
                  type="text"
                  label="Посилання"
                  input={register('linkRef', {
                    required: 'Поле повинно бути заповнено',
                    maxLength: {
                      value: 100,
                      message: 'Повинно бути не більше 100 символів',
                    },
                  })}
                  errors={errors}
                />
                <button
                  type="submit"
                  className="addTagButton"
                  onClick={onLinkAddClick}
                >
                  Додати
                </button>
              </form>
            </div>
          </div>
          <div className="artistLinks">
            <ArtistLinks links={artistLinks} setLinks={setArtistLinks} />
          </div>
        </div>
      </div>
      <div>
        <div className="artistInfoBlock">
          <h2 className="header">Опис</h2>
          <form action="" method="POST" ref={artistInfoRef}>
            <textarea
              maxLength="2000"
              placeholder="Пишіть тут..."
              id="artistInfo"
              {...register('artistInfo', {
                required: 'Поле повинно бути заповнено',
                maxLength: {
                  value: 2000,
                  message: 'Повинно бути не більше 2000 символів',
                },
              })}
              defaultValue={artistInfo}
            ></textarea>
            <span className="inputErrorField" id="artistInfoErrorField">
              &nbsp;
              {errors.artistInfo?.message}
            </span>
          </form>
        </div>
      </div>
    </section>
  );
}
