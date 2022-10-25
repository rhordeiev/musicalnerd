import React from 'react';
import { Route, Routes, NavLink, Navigate } from 'react-router-dom';
import '../public/css/app.scss';
import defaultAvatar from '../public/images/avatar-default.svg';
import AccountPage from './pages/AccountPage';
import UserPage from './pages/UserPage';
import Logout from './components/Logout';
import CheckLogin from './components/CheckLogin';
import AlbumPage from './pages/AlbumPage';
import AlbumDescription from './components/AlbumDescription';
import AlbumReviews from './components/AlbumReviews';
import ArtistPage from './pages/ArtistPage';
import ArtistDescription from './components/ArtistDescription';
import ArtistAlbums from './components/ArtistAlbums';
import AddUpdateArtistPage from './pages/AddUpdateArtistPage';
import AddUpdateAlbum from './components/AddUpdateAlbum';
import AddUpdateReview from './components/AddUpdateReview';
import RequireModerator from './components/RequireModerator';
import RequireUser from './components/RequireUser';
import ReviewText from './components/ReviewText';
import Chat from './components/Chat';
import SearchPage from './pages/SearchPage';
import MainPage from './pages/MainPage';
import UserSettingsPage from './pages/UserSettingsPage';

export default function App() {
  function toggleDropdown() {
    const userDropdown = document.getElementById('userDropdown');
    const expandIcon = document.getElementById('expandIcon');
    if (expandIcon.textContent === 'expand_more') {
      expandIcon.textContent = 'expand_less';
      userDropdown.style.display = 'block';
    } else {
      expandIcon.textContent = 'expand_more';
      userDropdown.style.display = 'none';
    }
  }

  return (
    <>
      <header>
        <nav>
          <NavLink to="/">Головна</NavLink>
          <NavLink to="/search">Пошук</NavLink>
          <NavLink to="/account" id="accountLink">
            Ввійти
          </NavLink>
          <div id="userPageLink">
            <button type="button" onClick={toggleDropdown}>
              <img src={defaultAvatar} alt="Фото профіля" id="userAvatar" />
              <span id="userName"></span>
              <span
                className="material-symbols-outlined expandIcon"
                id="expandIcon"
              >
                expand_more
              </span>
            </button>
            <div id="userDropdown">
              <a
                href="user"
                className="userDropdownElement"
                id="linkToUserPage"
              >
                Сторінка
              </a>
              <a
                href="user"
                className="userDropdownElement"
                id="linkToUserSettings"
              >
                Налаштування
              </a>
              <a href="/logout" className="userDropdownElement">
                Вийти
              </a>
            </div>
          </div>
          <div className='websiteLanguage'>

          </div>
        </nav>
      </header>
      <main>
        <Routes>
          <Route index element={<MainPage />} />
          <Route
            path="account"
            element={
              <CheckLogin>
                <AccountPage />
              </CheckLogin>
            }
          />
          <Route path="search" element={<SearchPage />} />
          <Route path="user">
            <Route path=":login">
              <Route index element={<UserPage />} />
              <Route path="settings" element={<UserSettingsPage />} />
            </Route>
          </Route>
          <Route path="album">
            <Route path=":id" element={<AlbumPage />}>
              <Route index element={<Navigate to="description" replace />} />
              <Route path="description" element={<AlbumDescription />} />
              <Route path="reviews" element={<AlbumReviews />} />
              <Route path="review">
                <Route path=":reviewId">
                  <Route index element={<ReviewText />} />
                  <Route
                    path="update"
                    element={<AddUpdateReview type="update" />}
                  />
                </Route>
              </Route>
              <Route
                path="addReview"
                element={
                  <RequireUser>
                    <AddUpdateReview />
                  </RequireUser>
                }
              />
              <Route
                path="update"
                element={
                  <RequireModerator>
                    <AddUpdateAlbum type="update" />
                  </RequireModerator>
                }
              />
              <Route path="discussion" element={<Chat type="album" />} />
            </Route>
          </Route>
          <Route path="artist">
            <Route path=":id" element={<ArtistPage />}>
              <Route index element={<Navigate to="description" replace />} />
              <Route path="description" element={<ArtistDescription />} />
              <Route path="albums" element={<ArtistAlbums />} />
              <Route
                path="addAlbum"
                element={
                  <RequireModerator>
                    <AddUpdateAlbum />
                  </RequireModerator>
                }
              />
              <Route
                path="update"
                element={
                  <RequireModerator>
                    <AddUpdateArtistPage type="update" />
                  </RequireModerator>
                }
              />
              <Route path="discussion" element={<Chat type="artist" />} />
            </Route>
            <Route
              path="new"
              element={
                <RequireModerator>
                  <AddUpdateArtistPage />
                </RequireModerator>
              }
            />
          </Route>
          <Route path="logout" element={<Logout />} />
        </Routes>
      </main>
    </>
  );
}
