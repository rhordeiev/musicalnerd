import React, { useState, useEffect } from 'react';
import {
  Link,
  Outlet,
  NavLink,
  useParams,
  useNavigate,
} from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import '../../public/css/pages/artistPage.scss';
import checkLogin from '../../public/js/checkLogin';
import {
  useLazyFindArtistQuery,
  useLazyGetMarkQuery,
  useLazyGetReactionsQuery,
  useDeleteArtistMutation,
} from '../../store/apis/artistApi';
import { getCookie } from '../../public/js/cookieFuncs';
import { clearUserInfo } from '../../store/slices/userSlice';

export default function ArtistPage() {
  const { id } = useParams();
  const user = useSelector((state) => state.user);
  const [artistName, setArtistName] = useState('');
  const [artistPhoto, setArtistPhoto] = useState('');
  const [artistReviewsCount, setArtistReviewsCount] = useState(0);
  const [albumMark, setAlbumMark] = useState('N/A');
  const [albumMarkCount, setAlbumMarkCount] = useState(0);
  const [albumGoodReactionPercentage, setAlbumGoodReactionPercentage] =
    useState(0);
  const [albumMehReactionPercentage, setAlbumMehReactionPercentage] =
    useState(0);
  const [albumBadReactionPercentage, setAlbumBadReactionPercentage] =
    useState(0);

  const [findArtist] = useLazyFindArtistQuery();
  const [getMark] = useLazyGetMarkQuery();
  const [getReactions] = useLazyGetReactionsQuery();
  const [deleteArtist] = useDeleteArtistMutation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!getCookie('token')) {
      dispatch(clearUserInfo());
    }
    checkLogin(user);
    if (user.role === '') {
      const userPageLink = document.getElementById('userPageLink');
      const accountLink = document.getElementById('accountLink');
      userPageLink.style.display = 'none';
      accountLink.style.display = 'flex';
    }
    findArtist(id).then((result) => {
      setArtistName(result.data.name);
      setArtistPhoto(result.data.photo);
      setArtistReviewsCount(result.data.reviewCount);
    });
    getMark(id).then((result) => {
      setAlbumMark(result.data.result.average_artist_mark);
      setAlbumMarkCount(result.data.result.artist_mark_count);
    });
    getReactions(id).then((result) => {
      setAlbumGoodReactionPercentage(result.data.result.goodReactionPercentage);
      setAlbumMehReactionPercentage(result.data.result.mehReactionPercentage);
      setAlbumBadReactionPercentage(result.data.result.badReactionPercentage);
    });
  }, []);

  async function onDeleteReview() {
    await deleteArtist(id);
    navigate('/search');
  }

  return (
    <section className="artistPage">
      <div className="artistInfo">
        <div className="artistMainBlock">
          <div id="artistPhoto">
            <img src={`${artistPhoto}`} alt="Фото виконавця" />
          </div>
          <div className="artistMainInfoBlock">
            <span id="artistName">{artistName}</span>
          </div>
          <div className="mainInfoBlock">
            <div className="mainInfoElement">
              <span className="mainInfoHeader">Відгуків</span>
              <span className="mainInfoText">{artistReviewsCount}</span>
            </div>
            {/* <div className="mainInfoElement">
              <span className="mainInfoHeader">Підписників</span>
              <span className="mainInfoText">{artistSubscribersCount}</span>
            </div> */}
          </div>
          <div className="artistRatings">
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
          {user.role === 'moderator' ? (
            <div className="moderatorFuncs">
              <dfn title="Додати альбом" className="funcButton addAlbumButton">
                <Link to={`/artist/${id}/addAlbum`}>
                  <span className="material-symbols-outlined">add</span>
                </Link>
              </dfn>
              <dfn title="Змінити виконавця" className="funcButton editButton">
                <Link to={`/artist/${id}/update`}>
                  <span className="material-symbols-outlined">edit_note</span>
                </Link>
              </dfn>
              <dfn
                title="Видалити виконавця"
                className="funcButton deleteButton"
              >
                <button type="button" onClick={onDeleteReview}>
                  <span className="material-symbols-outlined">delete</span>
                </button>
              </dfn>
            </div>
          ) : (
            ''
          )}
        </div>
        <Outlet />
      </div>
      <div className="artistMenu">
        <NavLink to={`/artist/${id}/description`}>Опис</NavLink>
        <NavLink to={`/artist/${id}/albums`}>Музичні твори</NavLink>
        <NavLink to={`/artist/${id}/discussion`}>Обговорення</NavLink>
      </div>
    </section>
  );
}
