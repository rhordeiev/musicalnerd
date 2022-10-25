import React, { useRef, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import '../../public/css/components/addUpdateAlbum.scss';
import Input from './Input';
import {
  useUploadImageMutation,
  useRemoveImageMutation,
} from '../../store/apis/imageApi';
import {
  useCreateAlbumMutation,
  useLazyFindAlbumQuery,
  useChangeAlbumMutation,
} from '../../store/apis/albumApi';

function AlbumCredits({ credits, setCredits }) {
  function creditsToArray(enteredCredits) {
    const arrayCreditsFinalSplit = [];
    const artistCreditsInitialSplit = enteredCredits
      .split(';')
      .filter((elem) => elem !== '');
    artistCreditsInitialSplit.forEach((credit, index) => {
      arrayCreditsFinalSplit.push({
        id: `credit${index}`,
        name: credit.split('==')[0].replace('/n', ''),
        role: credit.split('==')[1],
      });
    });
    return arrayCreditsFinalSplit;
  }

  function onDeleteClick(e) {
    const result = creditsToArray(credits).filter(
      (element) => element.id !== e.target.id,
    );
    let newCreditsString = '';
    result.forEach((element) => {
      newCreditsString += `${element.name}==${element.role};`;
    });
    setCredits(newCreditsString);
  }

  const arrayOfCredits = creditsToArray(credits);

  return arrayOfCredits.map((credit) => (
    <tr className="creditPerson" key={`credit-${Math.random()}`}>
      <td className="creditPersonName">{credit.name}</td>
      <td>
        <span className="creditPersonRole">{credit.role}</span>
      </td>
      <td className="deleteTag">
        <button
          type="button"
          className="material-symbols-outlined"
          id={credit.id}
          onClick={onDeleteClick}
        >
          close
        </button>
      </td>
    </tr>
  ));
}

function AlbumTracks({ tracks, setTracks }) {
  function tracksToArray(enteredTracks) {
    const arrayTracksFinalSplit = [];
    const artistTracksInitialSplit = enteredTracks
      .split(';')
      .filter((elem) => elem !== '');
    artistTracksInitialSplit.forEach((track, index) => {
      arrayTracksFinalSplit.push({
        id: `track${index}`,
        order: track.split('==')[0].replace('/n', ''),
        name: track.split('==')[1],
        length: track.split('==')[2],
      });
    });
    return arrayTracksFinalSplit;
  }

  function onDeleteClick(e) {
    const result = tracksToArray(tracks).filter(
      (element) => element.id !== e.target.id,
    );
    let newTracksString = '';
    result.forEach((element) => {
      newTracksString += `${element.order}==${element.name}==${element.length};`;
    });
    setTracks(newTracksString);
  }

  const arrayOfTracks = tracksToArray(tracks);

  arrayOfTracks.sort((a, b) => a.order - b.order);
  return arrayOfTracks.map((track) => (
    <tr key={`track-${Math.random()}`}>
      <td className="trackOrder">
        <span>{track.order}</span>
      </td>
      <td className="trackName">
        <span>{track.name}</span>
      </td>
      <td className="trackLength">
        <sub>{track.length}</sub>
      </td>
      <td className="deleteTag">
        <button
          type="button"
          className="material-symbols-outlined"
          id={track.id}
          onClick={onDeleteClick}
        >
          close
        </button>
      </td>
    </tr>
  ));
}

export default function AddUpdateAlbum({ type = 'add' }) {
  const {
    register,
    trigger,
    formState: { errors },
    setError,
  } = useForm();
  const { id } = useParams();

  const [albumName, setAlbumName] = useState('');
  const [albumFormat, setAlbumFormat] = useState('');
  const [albumReleaseDate, setAlbumReleaseDate] = useState('');
  const [albumGenres, setAlbumGenres] = useState('');
  const [albumLanguages, setAlbumLanguages] = useState('');
  const [albumCredits, setAlbumCredits] = useState('');
  const [albumTracks, setAlbumTracks] = useState('');
  const [albumReceivedPhoto, setAlbumReceivedPhoto] = useState('');

  const [uploadImage] = useUploadImageMutation();
  const [createAlbum] = useCreateAlbumMutation();
  const [findAlbum] = useLazyFindAlbumQuery();
  const [changeAlbum] = useChangeAlbumMutation();
  const [removeImage] = useRemoveImageMutation();
  const navigate = useNavigate();

  const albumDetailsRef = useRef();
  const albumGenresRef = useRef();
  const albumLanguagesRef = useRef();
  const albumCreditsRef = useRef();
  const albumTracksRef = useRef();
  const albumCreditsErrorRef = useRef();

  async function submitForms() {
    const albumDetailsFormResult = await trigger('albumDetails');
    const albumGenresFormResult = await trigger('albumGenres');
    const albumLanguagesFormResult = await trigger('albumLanguages');
    switch (type) {
      case 'update':
        if (
          !albumDetailsRef.current.albumName.value ||
          !albumDetailsRef.current.albumFormat.value ||
          !albumDetailsRef.current.albumReleaseDate.value ||
          !albumGenresFormResult ||
          !albumLanguagesFormResult ||
          !albumCredits ||
          !albumTracks
        ) {
          return false;
        }
        break;
      default:
        if (
          !albumDetailsFormResult ||
          !albumGenresFormResult ||
          !albumLanguagesFormResult ||
          !albumCredits ||
          !albumTracks
        ) {
          return false;
        }
    }

    let albumPhoto;
    if (albumDetailsRef.current.albumPhoto.files) {
      [albumPhoto] = albumDetailsRef.current.albumPhoto.files;
    } else {
      albumPhoto = undefined;
    }

    if (type === 'update' && albumPhoto) {
      const imageUrlArray = albumReceivedPhoto.split('/');
      await removeImage(imageUrlArray[imageUrlArray.length - 1].split('.')[0]);
    }

    let imageUploadResult;

    if (type === 'add' || (type === 'update' && albumPhoto)) {
      imageUploadResult = await uploadImage({
        image: albumPhoto,
      });
      if (imageUploadResult.error) {
        setError(
          'albumPhoto',
          { message: 'Файл повинен бути зображенням та менше 2 Мб' },
          { shouldFocus: true },
        );
        return false;
      }
    }

    const album = {
      id,
      name: albumDetailsRef.current.albumName.value.replace(/'/gi, '`'),
      format: albumDetailsRef.current.albumFormat.value.replace(/'/gi, '`'),
      releaseDate: albumDetailsRef.current.albumReleaseDate.value,
      genres: albumGenresRef.current.albumGenres.value.replace(/'/gi, '`'),
      languages: albumLanguagesRef.current.albumLanguages.value.replace(
        "'",
        '`',
      ),
      credits: albumCredits.replace(/'/gi, '`'),
      tracks: albumTracks.replace(/'/gi, '`'),
      photo: imageUploadResult?.data || '',
      artistId: id,
    };

    if (type === 'update') {
      await changeAlbum(album);
      navigate(`/album/${id}`);
    } else {
      const result = await createAlbum(album);
      navigate(`/album/${result.data.result.id}`);
    }

    return true;
  }

  async function onCreditAddClick(e) {
    e.preventDefault();
    const creditNameValidated = await trigger('creditName');
    const creditRoleValidated = await trigger('creditRole');
    if (!creditNameValidated || !creditRoleValidated) {
      return false;
    }
    const credit = [
      albumCreditsRef.current.creditName.value,
      albumCreditsRef.current.creditRole.value,
    ]
      .join('==')
      .concat(';');
    setAlbumCredits(albumCredits.concat(credit));
    return true;
  }

  async function onTrackAddClick(e) {
    e.preventDefault();
    const trackOrderValidated = await trigger('trackOrder');
    const trackNameValidated = await trigger('trackName');
    const trackLengthValidated = await trigger('trackLength');
    if (!trackOrderValidated || !trackNameValidated || !trackLengthValidated) {
      return false;
    }
    const track = [
      albumTracksRef.current.trackOrder.value,
      albumTracksRef.current.trackName.value,
      albumTracksRef.current.trackLength.value,
    ]
      .join('==')
      .concat(';');
    setAlbumTracks(albumTracks.concat(track));
    return true;
  }

  useEffect(() => {
    if (type === 'update') {
      findAlbum(id).then((result) => {
        setAlbumName(result.data.album_name);
        setAlbumFormat(result.data.format);
        setAlbumReleaseDate(result.data.release_date);
        setAlbumGenres(result.data.album_genres);
        setAlbumLanguages(result.data.languages);
        setAlbumCredits(result.data.credits);
        setAlbumTracks(result.data.tracks);
        setAlbumReceivedPhoto(result.data.album_photo);
      });
    }
  }, []);

  return (
    <section className="newAlbumBlock">
      <div>
        <div className="albumDetailsBlock">
          <form action="" method="POST" ref={albumDetailsRef}>
            <Input
              type="text"
              label="Назва"
              input={register('albumName', {
                required: 'Поле повинно бути заповнено',
                maxLength: {
                  value: 50,
                  message: 'Повинно бути не більше 50 символів',
                },
              })}
              value={albumName}
              errors={errors}
            />
            <Input
              type="text"
              label="Формат"
              input={register('albumFormat', {
                required: 'Поле повинно бути заповнено',
                maxLength: {
                  value: 50,
                  message: 'Повинно бути не більше 50 символів',
                },
              })}
              value={albumFormat}
              errors={errors}
            />
            <Input
              type="date"
              label="Дата виходу"
              input={register('albumReleaseDate', {
                required: 'Поле повинно бути заповнено',
              })}
              value={albumReleaseDate.split('T')[0]}
              errors={errors}
            />
            <br />
            <Input
              type="file"
              label="Фото альбома"
              input={register('albumPhoto', {
                required: 'Поле повинно бути заповнено',
              })}
              errors={errors}
            />
            <br />
          </form>
        </div>
        <div className="albumGenresBlock">
          <form action="" method="POST" ref={albumGenresRef}>
            <Input
              type="text"
              label="Жанри"
              input={register('albumGenres', {
                required: 'Поле повинно бути заповнено',
                maxLength: {
                  value: 200,
                  message: 'Повинно бути не більше 200 символів',
                },
              })}
              value={albumGenres}
              errors={errors}
            />
          </form>
        </div>
        <div className="albumLanguagesBlock">
          <form action="" method="POST" ref={albumLanguagesRef}>
            <Input
              type="text"
              label="Мови"
              input={register('albumLanguages', {
                required: 'Поле повинно бути заповнено',
                maxLength: {
                  value: 200,
                  message: 'Повинно бути не більше 200 символів',
                },
              })}
              value={albumLanguages}
              errors={errors}
            />
          </form>
        </div>
      </div>
      <div>
        <div className="albumTracksAndCreditsBlock">
          <div className="albumCreditsBlock">
            <div className="albumTagsBlock">
              <div className="albumTagElement">
                <h2 className="header">Кредити</h2>
                <form action="" method="POST" ref={albumCreditsRef}>
                  <Input
                    type="text"
                    label="Ім'я"
                    input={register('creditName', {
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
                    label="Роль"
                    input={register('creditRole', {
                      required: 'Поле повинно бути заповнено',
                      maxLength: {
                        value: 50,
                        message: 'Повинно бути не більше 50 символів',
                      },
                    })}
                    errors={errors}
                  />
                  {/* <span className="inputErrorField" ref={albumCreditsErrorRef}>
                    &nbsp; message
                  </span> */}
                  <button
                    type="submit"
                    className="addTagButton"
                    onClick={onCreditAddClick}
                  >
                    Додати
                  </button>
                </form>
              </div>
            </div>
            <div className="albumCredits">
              <div>
                <table id="credits">
                  <AlbumCredits
                    credits={albumCredits}
                    setCredits={setAlbumCredits}
                  />
                </table>
              </div>
            </div>
          </div>
          <div className="albumTracksBlock">
            <div className="albumTagsBlock">
              <div className="albumTagElement">
                <h2 className="header">Треки</h2>
                <form action="" method="POST" ref={albumTracksRef}>
                  <Input
                    type="number"
                    label="Порядок"
                    input={register('trackOrder', {
                      required: 'Поле повинно бути заповнено',
                      max: {
                        value: 100,
                        message: 'Оцінка не повинна бути більше 100',
                      },
                      min: {
                        value: 0,
                        message: 'Оцінка не повинна бути менше 0',
                      },
                    })}
                    errors={errors}
                  />
                  <Input
                    type="text"
                    label="Назва"
                    input={register('trackName', {
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
                    label="Довжина"
                    input={register('trackLength', {
                      required: 'Поле повинно бути заповнено',
                      maxLength: {
                        value: 5,
                        message: 'Повинно бути не більше 5 символів',
                      },
                    })}
                    errors={errors}
                  />
                  <button
                    type="submit"
                    className="addTagButton"
                    onClick={onTrackAddClick}
                  >
                    Додати
                  </button>
                </form>
              </div>
            </div>
            <div className="albumTracks">
              <table>
                <AlbumTracks tracks={albumTracks} setTracks={setAlbumTracks} />
              </table>
            </div>
          </div>
        </div>
        <div className="addAlbumButton">
          <button type="submit" method="POST" onClick={submitForms}>
            {type === 'update' ? 'Зберегти' : 'Додати'}
          </button>
        </div>
      </div>
    </section>
  );
}
