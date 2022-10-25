import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import '../../public/css/components/review.scss';
import { Link } from 'react-router-dom';
import { useLazyGetLikesQuery } from '../../store/apis/reviewApi';
import {
  useLikeReviewMutation,
  useDislikeReviewMutation,
} from '../../store/apis/accountApi';

export default function Review({ info }) {
  const [recommendClicked, setRecommendClicked] = useState(false);
  const [likedCount, setLikedCount] = useState(0);
  const [likeReview] = useLikeReviewMutation();
  const [dislikeReview] = useDislikeReviewMutation();
  const [getLikes] = useLazyGetLikesQuery();
  const userLogin = useSelector((state) => state.user.login);
  const userRole = useSelector((state) => state.user.role);

  async function onRecommendClick() {
    const recommendIcon = document.getElementById(`recommendIcon${info.id}`);
    if (recommendClicked) {
      await dislikeReview({ userLogin, id: info.id });
      recommendIcon.classList.remove('recommendClickedStyle');
      setLikedCount(likedCount - 1);
    } else {
      await likeReview({ userLogin, id: info.id });
      recommendIcon.classList.add('recommendClickedStyle');
      setLikedCount(likedCount + 1);
    }
    setRecommendClicked(!recommendClicked);
  }

  useEffect(() => {
    const root = document.getElementById(info.id);
    switch (info.reaction) {
      case 'good':
        root.style.setProperty(
          '--review-bg-color',
          'var(--review-bg-color-good)',
        );
        break;
      case 'meh':
        root.style.setProperty(
          '--review-bg-color',
          'var(--review-bg-color-meh)',
        );
        break;
      case 'bad':
        root.style.setProperty(
          '--review-bg-color',
          'var(--review-bg-color-bad)',
        );
        break;
      default:
        root.style.setProperty(
          '--review-bg-color',
          'var(--review-bg-color-default)',
        );
    }
    getLikes({ id: info.id }).then((result) => {
      const recommendIcon = document.getElementById(`recommendIcon${info.id}`);
      setLikedCount(result.data.result.length);
      result.data.result.forEach((elem) => {
        if (userLogin === elem.user_login) {
          recommendIcon.classList.add('recommendClickedStyle');
          setRecommendClicked(true);
        }
      });
    });
  }, []);

  return (
    <div className="userReview" id={info.id}>
      <div className="userReviewInfo">
        <div className="albumCredentials">
          <Link to={`/artist/${info.artist_id}`}>{info.artist_name}</Link> -{' '}
          <Link to={`/album/${info.album_id}`}>{info.album_name}</Link>
        </div>
        <div className="reviewMainInfo">
          <div className="reviewHeader">{info.header}</div>
          <div className="userMark">
            <span>{info.mark ? info.mark : 'N/A'}</span>
          </div>
        </div>
        <div className="bottomCredentials">
          <span className="userCredentials">
            <Link to={`/user/${info.user_login}`}>{info.user_login}</Link>
          </span>
          <span className="dateInfo">{info.creation_date.split('T')[0]}</span>
        </div>
      </div>
      <div className="userReviewActions">
        <Link to={`/album/${info.album_id}/review/${info.id}`}>
          <span className="material-icons showReviewIcon">visibility</span>
        </Link>
        <div className="reccomendBlock">
          <span className="reviewUpvotesCount">{likedCount}</span>
          {userRole === 'user' ? (
            <button type="button" onClick={onRecommendClick}>
              <span
                className="material-symbols-outlined recommendIcon"
                id={`recommendIcon${info.id}`}
              >
                recommend
              </span>
            </button>
          ) : (
            ''
          )}
        </div>
      </div>
    </div>
  );
}
