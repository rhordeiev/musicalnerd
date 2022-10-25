import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  useLazyGetReviewQuery,
  useDeleteReviewMutation,
} from '../../store/apis/reviewApi';
import '../../public/css/components/reviewText.scss';

export default function ReviewText() {
  const { reviewId } = useParams();
  const { id } = useParams();
  const [reviewHeader, setReviewHeader] = useState('');
  const [reviewText, setReviewText] = useState('');
  const [userLogin, setUserLogin] = useState('');
  const [userAvatar, setUserAvatar] = useState('');
  const loggedinUser = useSelector((state) => state.user.login);
  const [getReview] = useLazyGetReviewQuery();
  const [deleteReview] = useDeleteReviewMutation();
  const navigate = useNavigate();

  useEffect(() => {
    getReview({ id: reviewId }).then((result) => {
      console.log(result.data.result);
      setReviewHeader(result.data.result.header);
      setReviewText(result.data.result.text);
      setUserLogin(result.data.result.login);
      setUserAvatar(result.data.result.avatar);
    });
  }, []);

  async function onDeleteReview() {
    await deleteReview(reviewId);
    navigate(`/album/${id}`);
  }

  return (
    <div className="reviewTextBlock">
      <div className="reviewText">
        <h2 className="header">{reviewHeader}</h2>
        <textarea
          maxLength="2000"
          placeholder="Пишіть тут..."
          id="reviewText"
          disabled
          defaultValue={reviewText}
        ></textarea>
      </div>
      <div className="reviewUserInfoAndFuncsBlock">
        <div className="reviewUserInfo">
          <img
            src={`${
              userAvatar ||
              'https://res.cloudinary.com/dbapiimages/image/upload/v1655238165/avatar-default_v7gfhw.svg'
            }`}
            alt="Фото користувача"
          />
          <Link to={`/user/${userLogin}`} className="userLogin">
            {userLogin}
          </Link>
        </div>
        {userLogin === loggedinUser ? (
          <div className="reviewFuncsBlock">
            <Link to="update" className="funcButton editButton">
              <span className="material-symbols-outlined">edit_note</span>
            </Link>
            <button
              type="button"
              className="funcButton deleteButton"
              onClick={onDeleteReview}
            >
              <span className="material-symbols-outlined">delete</span>
            </button>
          </div>
        ) : (
          ''
        )}
      </div>
    </div>
  );
}
