import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import '../../public/css/components/albumDescription.scss';
import { useLazyFindAlbumQuery } from '../../store/apis/albumApi';

function AlbumGenres({ genres }) {
  const artistGenres = genres.split(';').filter((elem) => elem !== '');
  return artistGenres.map((genre) => (
    <span className="tag" key={`genre-${Math.random()}`}>
      {genre}
    </span>
  ));
}

function AlbumLanguages({ languages }) {
  const artistLanguages = languages.split(';').filter((elem) => elem !== '');
  return artistLanguages.map((language) => (
    <span className="tag" key={`language-${Math.random()}`}>
      {language}
    </span>
  ));
}

function AlbumCredits({ credits }) {
  const arrayCreditsFinalSplit = [];
  const artistCreditsInitialSplit = credits
    .split(';')
    .filter((elem) => elem !== '');
  artistCreditsInitialSplit.forEach((credit) => {
    arrayCreditsFinalSplit.push({
      name: credit.split('==')[0].replace('/n', ''),
      role: credit.split('==')[1],
    });
  });
  return arrayCreditsFinalSplit.map((credit) => (
    <tr className="creditPerson" key={`credit-${Math.random()}`}>
      <td className="creditPersonName">{credit.name}</td>
      <td>
        <span className="creditPersonRole">{credit.role}</span>
      </td>
    </tr>
  ));
}

function AlbumTracks({ tracks }) {
  const arrayTracksFinalSplit = [];
  const artistTracksInitialSplit = tracks
    .split(';')
    .filter((elem) => elem !== '');
  artistTracksInitialSplit.forEach((track) => {
    arrayTracksFinalSplit.push({
      order: track.split('==')[0].replace('/n', ''),
      name: track.split('==')[1],
      length: track.split('==')[2],
    });
  });
  arrayTracksFinalSplit.sort((a, b) => a.order - b.order);
  return arrayTracksFinalSplit.map((track) => (
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
    </tr>
  ));
}

export default function AlbumDescription() {
  const { id } = useParams();
  const [albumReleaseDate, setAlbumReleaseDate] = useState('');
  const [albumFormat, setAlbumFormat] = useState('');
  const [albumGenres, setAlbumGenres] = useState('');
  const [albumLanguages, setAlbumLanguages] = useState('');
  const [albumCredits, setAlbumCredits] = useState('');
  const [albumTracks, setAlbumTracks] = useState('');
  const [findAlbum] = useLazyFindAlbumQuery();

  useEffect(() => {
    findAlbum(id).then((result) => {
      setAlbumReleaseDate(result.data.release_date);
      setAlbumFormat(result.data.format);
      setAlbumGenres(result.data.album_genres);
      setAlbumLanguages(result.data.languages);
      setAlbumCredits(result.data.credits);
      setAlbumTracks(result.data.tracks);
    });
  }, []);

  return (
    <div className="albumDescriptionBlock">
      <div className="block">
        <div className="albumDetails">
          <h3 className="header">Деталі</h3>
          <table>
            <tr>
              <td>
                <span className="albumDetailsInputHeader">Дата виходу:</span>
              </td>
              <td>
                <div className="albumDetailsInputText">
                  <input
                    type="text"
                    disabled
                    value={albumReleaseDate.split('T')[0]}
                  />
                  <div className="inputFocusLines">
                    <div className="inactiveLine"></div>
                    <div className="activeLine"></div>
                  </div>
                </div>
              </td>
            </tr>
            <tr>
              <td>
                <span className="albumDetailsInputHeader">Формат:</span>
              </td>
              <td>
                <div className="albumDetailsInputText">
                  <input type="text" disabled value={albumFormat} />
                  <div className="inputFocusLines">
                    <div className="inactiveLine"></div>
                    <div className="activeLine"></div>
                  </div>
                </div>
              </td>
            </tr>
          </table>
        </div>
        <div className="albumTagBlock">
          <span className="header">Жанри</span>
          <div className="albumTag">
            <AlbumGenres genres={albumGenres} />
          </div>
        </div>
        <div className="albumTagBlock">
          <span className="header">Мови</span>
          <div className="albumTag">
            <AlbumLanguages languages={albumLanguages} />
          </div>
        </div>
      </div>
      <div className="block">
        <div className="albumCredits">
          <h3 className="header">Кредити</h3>
          <div>
            <table id="credits">
              <AlbumCredits credits={albumCredits} />
            </table>
          </div>
        </div>
      </div>
      <div className="block">
        <div className="albumTracks">
          <span className="header">Треки</span>
          <table>
            <AlbumTracks tracks={albumTracks} />
          </table>
        </div>
      </div>
    </div>
  );
}
