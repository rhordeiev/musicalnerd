import React, { useRef, useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import '../../public/css/components/addUpdateReview.scss';
import Input from './Input';
import {
  useCreateReviewMutation,
  useLazyGetReviewQuery,
  useChangeReviewMutation,
} from '../../store/apis/reviewApi';

export default function AddUpdateReview({ type = 'add' }) {
  const { id } = useParams();
  const {
    register,
    trigger,
    formState: { errors },
  } = useForm();
  const userLogin = useSelector((state) => state.user.login);
  const [createReview] = useCreateReviewMutation();
  const [getReview] = useLazyGetReviewQuery();
  const [changeReview] = useChangeReviewMutation();
  const { reviewId } = useParams();
  const navigate = useNavigate();

  const [reaction, setReaction] = useState('good');
  const [reviewHeader, setReviewHeader] = useState('');
  const [reviewText, setReviewText] = useState('');
  const [reviewMark, setReviewMark] = useState('');
  const goodReactionRef = useRef();
  const mehReactionRef = useRef();
  const badReactionRef = useRef();

  const reviewHeaderRef = useRef();
  const reviewMarkRef = useRef();
  const reviewTextRef = useRef();

  useEffect(() => {
    if (type === 'update') {
      getReview({ id: reviewId }).then((result) => {
        if (result.data.result.login !== userLogin) {
          navigate(`/album/${id}`);
        }
        setReviewHeader(result.data.result.header);
        setReviewText(result.data.result.text);
        setReaction(result.data.result.reaction);
        setReviewMark(result.data.result.mark);
      });
    }
  }, []);

  useEffect(() => {
    const reactions = [goodReactionRef, mehReactionRef, badReactionRef];
    reactions.forEach((reactionElem) => {
      reactionElem.current.classList.remove('activeReaction');
    });
    switch (reaction) {
      case 'meh':
        mehReactionRef.current.classList.add('activeReaction');
        break;
      case 'bad':
        badReactionRef.current.classList.add('activeReaction');
        break;
      default:
        goodReactionRef.current.classList.add('activeReaction');
    }
  }, [reaction]);

  async function submitForms() {
    const reviewHeaderFormResult = await trigger('reviewHeader');
    const reviewMarkFormResult = await trigger('reviewMark');
    const reviewTextFormResult = await trigger('reviewText');
    if (
      !reviewHeaderFormResult ||
      !reviewMarkFormResult ||
      !reviewTextFormResult
    ) {
      return false;
    }

    if (type === 'update') {
      const review = {
        header: document
          .getElementById('reviewHeader')
          .value.replace(/'/gi, '`'),
        mark: document.getElementById('reviewMark').value,
        reaction,
        text: document.getElementById('reviewText').value.replace(/'/gi, '`'),
        id: reviewId,
      };
      await changeReview(review);
      navigate(`/album/${id}/review/${reviewId}`);
    } else {
      const review = {
        header: document
          .getElementById('reviewHeader')
          .value.replace(/'/gi, '`'),
        mark: document.getElementById('reviewMark').value,
        reaction,
        text: document.getElementById('reviewText').value.replace(/'/gi, '`'),
        albumId: id,
        userLogin,
      };
      const result = await createReview(review);
      navigate(`/album/${id}/review/${result.data.result.id}`);
    }
    return true;
  }

  function onReactionClick(e) {
    const currentReaction = e.target.id;
    setReaction(currentReaction.split('R')[0]);
  }

  return (
    <section className="addReviewBlock">
      <div>
        <div className="reviewHeaderBlock">
          <form action="" method="POST" ref={reviewHeaderRef}>
            <Input
              type="text"
              label="??????????????????"
              input={register('reviewHeader', {
                required: '???????? ?????????????? ???????? ??????????????????',
                maxLength: {
                  value: 20,
                  message: '?????????????? ???????? ???? ???????????? 20 ????????????????',
                },
              })}
              value={reviewHeader}
              errors={errors}
            />
          </form>
        </div>
        <div className="reviewMarkBlock">
          <form action="" method="POST" ref={reviewMarkRef}>
            <Input
              type="number"
              label="????????????"
              input={register('reviewMark', {
                max: {
                  value: 100,
                  message: '???????????? ???? ?????????????? ???????? ???????????? 100',
                },
                min: {
                  value: 0,
                  message: '???????????? ???? ?????????????? ???????? ?????????? 0',
                },
              })}
              value={reviewMark}
              errors={errors}
            />
          </form>
        </div>
        <div className="reviewReactionBlock">
          <h5 className="header">????????????????</h5>
          <div className="reviewReaction">
            <button
              type="button"
              className="material-symbols-outlined faceReaction activeReaction"
              id="goodReaction"
              onClick={onReactionClick}
              ref={goodReactionRef}
            >
              sentiment_very_satisfied
            </button>
            <button
              type="button"
              className="material-symbols-outlined faceReaction"
              id="mehReaction"
              onClick={onReactionClick}
              ref={mehReactionRef}
            >
              sentiment_neutral
            </button>
            <button
              type="button"
              className="material-symbols-outlined faceReaction"
              id="badReaction"
              onClick={onReactionClick}
              ref={badReactionRef}
            >
              sentiment_very_dissatisfied
            </button>
          </div>
        </div>
        <div className="addArtistButton addArtistHiddenMain">
          <button type="submit" method="POST" onClick={submitForms}>
            {type === 'update' ? '????????????????' : '????????????'}
          </button>
        </div>
      </div>
      <div>
        <div className="reviewTextBlock">
          <h2 className="header">????????????</h2>
          <form action="" method="POST" ref={reviewTextRef}>
            <textarea
              maxLength="5000"
              placeholder="???????????? ??????..."
              id="reviewText"
              {...register('reviewText', {
                required: '???????? ?????????????? ???????? ??????????????????',
                maxLength: {
                  value: 2000,
                  message: '?????????????? ???????? ???? ???????????? 5000 ????????????????',
                },
              })}
              defaultValue={reviewText}
            ></textarea>
            <span className="inputErrorField" id="reviewTextErrorField">
              &nbsp;
              {errors.reviewText?.message}
            </span>
          </form>
        </div>
        <div className="addArtistButton addArtistHiddenMobile">
          <button type="submit" method="POST" onClick={submitForms}>
            {type === 'update' ? '????????????????' : '????????????'}
          </button>
        </div>
      </div>
    </section>
  );
}
