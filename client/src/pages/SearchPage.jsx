import React, { useRef, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import '../../public/css/pages/searchPage.scss';
import checkLogin from '../../public/js/checkLogin';
import { getCookie } from '../../public/js/cookieFuncs';
import { useLazySearchQuery } from '../../store/apis/accountApi';
import { clearUserInfo } from '../../store/slices/userSlice';

function SearchResult({ result, type }) {
  return result.map((element) => {
    let link;
    switch (type) {
      case 'album':
        link = `/album/${element.id}`;
        break;
      case 'artist':
        link = `/artist/${element.id}`;
        break;
      default:
        link = `/user/${element.login}`;
        break;
    }
    const image = type === 'user' ? element.avatar : element.photo;

    return (
      <div className="searchResult" key={element.id || element.login}>
        <img
          src={`${
            image ||
            'https://res.cloudinary.com/dbapiimages/image/upload/v1655238165/avatar-default_v7gfhw.svg'
          }`}
          alt="Фото"
        />
        <div className="name">
          {element.login ? element.login : element.name}
        </div>
        <Link to={link} className="link">
          <span className="material-symbols-outlined">arrow_forward_ios</span>
        </Link>
      </div>
    );
  });
}

export default function SearchPage() {
  const searchInput = useRef();
  const searchButton = useRef();
  const albumSearchTypeButton = useRef();
  const artistSearchTypeButton = useRef();
  const userSearchTypeButton = useRef();
  const user = useSelector((state) => state.user);
  const [searchType, setSearchType] = useState('album');
  const [currentPage, setCurrentPage] = useState(1);
  const [searchResult, setSearchResult] = useState([]);
  const [search] = useLazySearchQuery();
  const dispatch = useDispatch();

  function isEmpty(str) {
    return !str.trim().length;
  }

  useEffect(() => {
    if (!getCookie('token')) {
      dispatch(clearUserInfo());
    }
    checkLogin(user);
  }, []);

  useEffect(() => {
    switch (searchType) {
      case 'album':
        albumSearchTypeButton.current.classList.add('searchTypeActive');
        artistSearchTypeButton.current.classList.remove('searchTypeActive');
        userSearchTypeButton.current.classList.remove('searchTypeActive');
        break;
      case 'artist':
        albumSearchTypeButton.current.classList.remove('searchTypeActive');
        artistSearchTypeButton.current.classList.add('searchTypeActive');
        userSearchTypeButton.current.classList.remove('searchTypeActive');
        break;
      case 'user':
        albumSearchTypeButton.current.classList.remove('searchTypeActive');
        artistSearchTypeButton.current.classList.remove('searchTypeActive');
        userSearchTypeButton.current.classList.add('searchTypeActive');
        break;
      default:
        albumSearchTypeButton.current.classList.add('searchTypeActive');
        artistSearchTypeButton.current.classList.remove('searchTypeActive');
        userSearchTypeButton.current.classList.remove('searchTypeActive');
    }
  }, [searchType]);

  useEffect(() => {
    if (!isEmpty(searchInput.current.value)) {
      setSearchResult([]);
      search({
        type: searchType,
        value: searchInput.current.value.replace(/'/gi, '`'),
        limit: 3,
        offset: (currentPage - 1) * 3,
      }).then((result) => {
        if (!result.error) {
          setSearchResult(result.data.result);
        } else {
          setCurrentPage(currentPage - 1);
        }
      });
    }
  }, [currentPage]);

  useEffect(() => {
    searchInput.current.addEventListener('keypress', (event) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        searchButton.current.click();
      }
    });
  }, [searchInput, searchButton]);

  async function onSearchSubmit() {
    if (!isEmpty(searchInput.current.value)) {
      setSearchResult([]);
      const result = await search({
        type: searchType,
        value: searchInput.current.value,
        limit: 3,
        offset: (currentPage - 1) * 3,
      });
      setSearchResult(result.data.result);
    }
  }

  function onSearchTypeClick(e) {
    setSearchType(e.target.id.split('S')[0]);
    setSearchResult([]);
  }

  function OnPaginationClick(direction) {
    if (direction === 'previous') {
      if (currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    } else {
      setCurrentPage(currentPage + 1);
    }
  }

  return (
    <section className="searchPage">
      <div className="searchTypeBlock block">
        <button
          type="button"
          onClick={onSearchTypeClick}
          id="albumSearchType"
          ref={albumSearchTypeButton}
        >
          Музичний твір
        </button>
        <button
          type="button"
          onClick={onSearchTypeClick}
          id="artistSearchType"
          ref={artistSearchTypeButton}
        >
          Виконавець
        </button>
        <button
          type="button"
          onClick={onSearchTypeClick}
          id="userSearchType"
          ref={userSearchTypeButton}
        >
          Користувач
        </button>
      </div>
      <div className="block">
        <div className="searchInputBlock">
          <form action="" method="POST">
            <input
              type="search"
              ref={searchInput}
              placeholder="Напишіть щось..."
            />
          </form>
          <button type="button" onClick={onSearchSubmit} ref={searchButton}>
            <span className="material-symbols-outlined">search</span>
          </button>
        </div>
        <div
          className="searchResultsBlock"
          style={searchResult.length === 0 ? { display: 'none' } : {}}
        >
          <SearchResult result={searchResult} type={searchType} />
          <div className="pagination">
            <button
              type="button"
              className="paginationArrow"
              onClick={() => OnPaginationClick('previous')}
            >
              &lsaquo;
            </button>
            <span className="currentPage">{currentPage}</span>
            <button
              type="button"
              className="paginationArrow"
              onClick={() => OnPaginationClick('next')}
            >
              &rsaquo;
            </button>
          </div>
        </div>
      </div>
      <div
        className="searchTypeBlock searchTypeBlockHidden"
        style={{ visibility: 'hidden' }}
      >
        <button type="button">Музичний твір</button>
        <button type="button">Виконавець</button>
        <button type="button">Користувач</button>
      </div>
    </section>
  );
}
