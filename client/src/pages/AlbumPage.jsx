import React, { useEffect, useState } from 'react';
import {
  Link,
  Outlet,
  NavLink,
  useParams,
  useNavigate,
} from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import '../../public/css/pages/albumPage.scss';
import checkLogin from '../../public/js/checkLogin';
import {
  useLazyFindAlbumQuery,
  useLazyGetMarkQuery,
  useLazyGetReactionsQuery,
  useDeleteAlbumMutation,
} from '../../store/apis/albumApi';
import { getCookie } from '../../public/js/cookieFuncs';
import { clearUserInfo } from '../../store/slices/userSlice';

export default function AlbumPage() {
  const { id } = useParams();
  const [albumName, setAlbumName] = useState('');
  const [albumPhoto, setAlbumPhoto] = useState('');
  const [albumArtistName, setAlbumArtistName] = useState('');
  const [albumArtistId, setAlbumArtistId] = useState('');
  const [albumMark, setAlbumMark] = useState('N/A');
  const [albumMarkCount, setAlbumMarkCount] = useState(0);
  const [albumGoodReactionPercentage, setAlbumGoodReactionPercentage] =
    useState(0);
  const [albumMehReactionPercentage, setAlbumMehReactionPercentage] =
    useState(0);
  const [albumBadReactionPercentage, setAlbumBadReactionPercentage] =
    useState(0);
  const user = useSelector((state) => state.user);
  const [findAlbum] = useLazyFindAlbumQuery();
  const [getMark] = useLazyGetMarkQuery();
  const [getReactions] = useLazyGetReactionsQuery();
  const [deleteAlbum] = useDeleteAlbumMutation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!getCookie('token')) {
      dispatch(clearUserInfo());
    }
    checkLogin(user);
    findAlbum(id).then((result) => {
      setAlbumName(result.data.album_name);
      setAlbumPhoto(result.data.album_photo);
      setAlbumArtistName(result.data.artist_name);
      setAlbumArtistId(result.data.artist_id);
    });
    getMark(id).then((result) => {
      setAlbumMark(result.data.result.average_album_mark);
      setAlbumMarkCount(result.data.result.album_mark_count);
    });
    getReactions(id).then((result) => {
      setAlbumGoodReactionPercentage(result.data.result.goodReactionPercentage);
      setAlbumMehReactionPercentage(result.data.result.mehReactionPercentage);
      setAlbumBadReactionPercentage(result.data.result.badReactionPercentage);
    });
  }, []);

  async function onDeleteReview() {
    const result = await deleteAlbum(id);
    navigate(`/artist/${result.data.result.artist_id}`);
  }

  return (
    <section className="albumPage">
      <div className="albumInfo">
        <div className="albumMainBlock">
          <div id="albumPhoto">
            <img src={`${albumPhoto}`} alt="Фото альбома" />
          </div>
          <div className="albumMainInfoBlock">
            <span id="albumName">{albumName}</span>
            <Link id="albumArtist" to={`/artist/${albumArtistId}`}>
              {albumArtistName}
            </Link>
          </div>
          <div className="albumRatings">
            <div className="markBlock">
              <span id="mark">{albumMark || 'N/A'}</span>
              <div className="reviewCountText">
                з <span id="reviewCount">{albumMarkCount}</span> оцінювань
              </div>
            </div>
            <div className="reactions">
              <div className="reaction" id="goodReaction">
                <span className="material-symbols-outlined faceReaction">
                  sentiment_very_satisfied
                </span>
                <div
                  className="reactionProgressBar"
                  style={{ width: `${albumGoodReactionPercentage}%` }}
                ></div>
              </div>
              <div className="reaction" id="mehReaction">
                <span className="material-symbols-outlined faceReaction">
                  sentiment_neutral
                </span>
                <div
                  className="reactionProgressBar"
                  style={{ width: `${albumMehReactionPercentage}%` }}
                ></div>
              </div>
              <div className="reaction" id="badReaction">
                <span className="material-symbols-outlined faceReaction">
                  sentiment_very_dissatisfied
                </span>
                <div
                  className="reactionProgressBar"
                  style={{ width: `${albumBadReactionPercentage}%` }}
                ></div>
              </div>
            </div>
          </div>
          {user.role === 'user' ? (
            <div className="addReviewButton">
              <Link to={`/album/${id}/addReview`}>Додати відгук</Link>
            </div>
          ) : (
            ''
          )}
          {user.role === 'moderator' ? (
            <div className="moderatorFuncs">
              <dfn title="Змінити альбом" className="funcButton editButton">
                <Link to={`/album/${id}/update`}>
                  <span className="material-symbols-outlined">edit_note</span>
                </Link>
              </dfn>
              <dfn title="Видалити альбом" className="funcButton deleteButton">
                <button type="button" onClick={onDeleteReview}>
                  <span className="material-symbols-outlined">delete</span>
                </button>
              </dfn>
            </div>
          ) : (
            ''
          )}
        </div>
        <div>
          <Outlet />
        </div>
      </div>
      <div className="albumMenu">
        <NavLink to={`/album/${id}/description`}>Опис</NavLink>
        <NavLink to={`/album/${id}/reviews`}>Відгуки</NavLink>
        <NavLink to={`/album/${id}/discussion`}>Обговорення</NavLink>
      </div>
    </section>
  );
}
