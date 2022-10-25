import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import '../../public/css/components/artistDescription.scss';
import { useLazyFindArtistQuery } from '../../store/apis/artistApi';

function ArtistGenres({ genres }) {
  const artistGenres = genres.split(';').filter((elem) => elem !== '');
  return artistGenres.map((genre) => (
    <span className="genre" key={`genre-${Math.random()}`}>
      {genre}
    </span>
  ));
}

function ArtistLinks({ links }) {
  const arrayLinksFinalSplit = [];
  const artistLinksInitialSplit = links
    .split(';')
    .filter((elem) => elem !== '');
  artistLinksInitialSplit.forEach((link) => {
    arrayLinksFinalSplit.push({
      name: link.split('==')[0],
      href: link.split('==')[1],
    });
  });
  return arrayLinksFinalSplit.map((link) => (
    <a
      href={link.href}
      className="link"
      target="_blank"
      rel="noreferrer"
      key={`${link.name}-${Math.random()}`}
    >
      {link.name}
    </a>
  ));
}

export default function ArtistDescription() {
  const { id } = useParams();
  const [artistGenres, setArtistGenres] = useState('');
  const [artistLinks, setArtistLinks] = useState('');
  const [artistInfo, setArtistInfo] = useState('');
  const [findArtist] = useLazyFindArtistQuery();

  useEffect(() => {
    findArtist(id).then((result) => {
      setArtistGenres(result.data.genres);
      setArtistLinks(result.data.links);
      setArtistInfo(result.data.info);
    });
  }, []);

  useEffect(() => {
    // console.log(artistGenres, artistLinks);
    // console.log(arrayLinksArrayOfObjects);
  }, [artistGenres, artistLinks]);

  return (
    <div className="artistInfoBlock">
      <div className="artistDescription block">
        <h2 className="header">Опис</h2>
        <textarea
          id="artistDescriptionText"
          defaultValue={artistInfo}
        ></textarea>
      </div>
      <div className="artistAdditionalInfo">
        <div className="artistGenresBlock block">
          <span className="header">Жанри</span>
          <div className="artistGenres">
            <ArtistGenres genres={artistGenres} />
          </div>
        </div>
        <div className="artistLinksBlock block">
          <span className="header">Посилання</span>
          <div className="artistLinks">
            <ArtistLinks links={artistLinks} />
          </div>
        </div>
      </div>
    </div>
  );
}
