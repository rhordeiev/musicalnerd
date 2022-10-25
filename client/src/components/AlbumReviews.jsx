import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import Review from './Review';
import '../../public/css/components/albumReviews.scss';
import '../../public/css/components/pagination.scss';
import { useLazyFindReviewsQuery } from '../../store/apis/reviewApi';

function Reviews({ reviews }) {
  if (!reviews) {
    return '';
  }
  return reviews.map((review) => <Review info={review} key={review.id} />);
}

export default function AlbumReviews() {
  const { id } = useParams();
  const [reviews, setReviews] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [findReviews] = useLazyFindReviewsQuery();
  const filterRef = useRef();
  const sortRef = useRef();
  const directionRef = useRef();

  useEffect(() => {
    findReviews({ type: 'album', id, offset: 0 }).then((result) => {
      setReviews(result.data);
    });
  }, []);

  useEffect(() => {
    findReviews({
      type: 'album',
      id,
      offset: (currentPage - 1) * 3,
      filterColumn: filterRef.current.value.split('_')[1],
      filterValue: filterRef.current.value.split('_')[0],
      sort: sortRef.current.value,
      direction: directionRef.current.value,
    }).then((result) => {
      if (!result.error) {
        setReviews(result.data);
      } else if (currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    });
  }, [currentPage]);

  function OnPaginationClick(direction) {
    if (direction === 'previous') {
      if (currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    } else {
      setCurrentPage(currentPage + 1);
    }
  }

  function onViewChange() {
    findReviews({
      type: 'album',
      id,
      offset: 0,
      filterColumn: filterRef.current.value.split('_')[1],
      filterValue: filterRef.current.value.split('_')[0],
      sort: sortRef.current.value,
      direction: directionRef.current.value,
    }).then((result) => {
      setReviews(result.data);
      setCurrentPage(1);
    });
  }

  return (
    <div className="albumReviewsBlock">
      <div className="albumReviews" style={!reviews ? { display: 'none' } : {}}>
        <Reviews reviews={reviews} />
        <div className="pagination moveUpPagination">
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
      <div className="reviewsViewChange block">
        <div className="reviewsViewChangeBlock">
          <h2 className="header">Вигляд</h2>
          <div className="reviewsFilter">
            <h3 className="albumFilterSubheader">Відфільтрувати:</h3>
            <select id="filter" onChange={onViewChange} ref={filterRef}>
              <option value="none_none">-</option>
              <option value="good_reaction">хороше враження</option>
              <option value="meh_reaction">ніяке враження</option>
              <option value="bad_reaction">погане враження</option>
            </select>
            <div className="inputFocusLines">
              <div className="inactiveLine"></div>
              <div className="activeLine"></div>
            </div>
          </div>
          <div className="reviewsSort">
            <h3 className="albumFilterSubheader">Відcортувати:</h3>
            <select id="sort" onChange={onViewChange} ref={sortRef}>
              <option value="like_count">за лайками</option>
              <option value="mark">за оцінкою</option>
              <option value="creation_date">за датою</option>
            </select>
            <div className="inputFocusLines">
              <div className="inactiveLine"></div>
              <div className="activeLine"></div>
            </div>
            <select id="direction" onChange={onViewChange} ref={directionRef}>
              <option value="desc">спадний</option>
              <option value="asc">зростаючий</option>
            </select>
            <div className="inputFocusLines">
              <div className="inactiveLine"></div>
              <div className="activeLine"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
