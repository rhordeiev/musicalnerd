import React, { useRef, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import '../../public/css/pages/mainPage.scss';
import checkLogin from '../../public/js/checkLogin';
import {
  useLazyGetPopularAlbumsQuery,
  useLazyGetNearestAlbumsQuery,
} from '../../store/apis/albumApi';
import { useLazyGetPopularArtistsQuery } from '../../store/apis/artistApi';
import { getCookie } from '../../public/js/cookieFuncs';
import { clearUserInfo } from '../../store/slices/userSlice';

function Info({ elements, type }) {
  if (!elements) {
    return '';
  }
  const slicedElements = elements.slice(0, 8);
  return slicedElements.map((element) => (
    <Link
      className="showedElement"
      to={type === 'album' ? `/album/${element.id}` : `/artist/${element.id}`}
      key={element.id + Math.random(Date.now())}
    >
      {type === 'album' && (
        <span className="elementReleaseDate">
          {element.release_date.split('T')[0]}
        </span>
      )}
      <img src={`${element.photo}`} alt="Фото" />
      <span className="elementName">{element.name}</span>
    </Link>
  ));
}

export default function MainPage() {
  const albumShowTypeButton = useRef();
  const artistShowTypeButton = useRef();
  const user = useSelector((state) => state.user);
  const [showType, setShowType] = useState('album');
  const [currentInfoTypeBlock, setCurrentInfoTypeBlock] = useState(0);
  const infoTypeBlockNames = ['Популярне', 'Очікується'];
  const [infoElements, setInfoElements] = useState([]);
  const [getPopularAlbums] = useLazyGetPopularAlbumsQuery();
  const [getNearestAlbums] = useLazyGetNearestAlbumsQuery();
  const [getPopularArtists] = useLazyGetPopularArtistsQuery();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!getCookie('token')) {
      dispatch(clearUserInfo());
    }
    checkLogin(user);
  }, []);

  useEffect(() => {
    setInfoElements([]);
    switch (showType) {
      case 'album':
        if (currentInfoTypeBlock === 0) {
          getPopularAlbums().then((result) => {
            const ratings = [...result.data];
            setInfoElements(ratings.sort((a, b) => b.count - a.count));
            albumShowTypeButton.current.classList.add('showTypeActive');
            artistShowTypeButton.current.classList.remove('showTypeActive');
          });
        } else {
          getNearestAlbums().then((result) => {
            const ratings = [...result.data];
            setInfoElements(ratings.sort((a, b) => b.count - a.count));
            albumShowTypeButton.current.classList.add('showTypeActive');
            artistShowTypeButton.current.classList.remove('showTypeActive');
          });
        }
        break;
      default:
        if (currentInfoTypeBlock === 0) {
          getPopularArtists().then((result) => {
            const ratings = [...result.data];
            setInfoElements(ratings.sort((a, b) => b.count - a.count));
            albumShowTypeButton.current.classList.remove('showTypeActive');
            artistShowTypeButton.current.classList.add('showTypeActive');
          });
        } else {
          setCurrentInfoTypeBlock(0);
          setShowType('album');
        }
    }
  }, [showType, currentInfoTypeBlock]);

  function onShowTypeClick(e) {
    setShowType(e.target.id.split('S')[0]);
    setInfoElements([]);
  }

  function onInfoTypeChange(direction) {
    switch (direction) {
      case 'previous':
        if (currentInfoTypeBlock === 0) {
          setCurrentInfoTypeBlock(infoTypeBlockNames.length - 1);
        } else {
          setCurrentInfoTypeBlock(currentInfoTypeBlock - 1);
        }
        break;
      default:
        if (infoTypeBlockNames.length - 1 === currentInfoTypeBlock) {
          setCurrentInfoTypeBlock(0);
        } else {
          setCurrentInfoTypeBlock(currentInfoTypeBlock + 1);
        }
    }
  }

  return (
    <section className="mainPage">
      <div className="showTypeBlock block">
        <button
          type="button"
          onClick={onShowTypeClick}
          id="albumShowType"
          ref={albumShowTypeButton}
        >
          Музичний твір
        </button>
        <button
          type="button"
          onClick={onShowTypeClick}
          id="artistShowType"
          ref={artistShowTypeButton}
        >
          Виконавець
        </button>
      </div>
      <div className="block">
        <div className="infoTypeBlock">
          <button
            type="button"
            className="infoTypeArrow"
            onClick={() => onInfoTypeChange('previous')}
          >
            &lsaquo;
          </button>
          <h2 className="header">{infoTypeBlockNames[currentInfoTypeBlock]}</h2>
          <button
            type="button"
            className="infoTypeArrow"
            onClick={() => onInfoTypeChange('next')}
          >
            &rsaquo;
          </button>
        </div>
        <div className="showedElementsBlock">
          <Info elements={infoElements} type={showType} />
        </div>
      </div>
    </section>
  );
}
