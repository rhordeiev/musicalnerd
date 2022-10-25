import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import '../../public/css/components/artistAlbums.scss';
import { useLazyFindArtistAlbumsQuery } from '../../store/apis/artistApi';

function Albums({ albums }) {
  if (!albums) {
    return '';
  }
  return albums.map((album) => (
    <Link className="album" to={`/album/${album.id}`} key={album.id}>
      <span className="albumReleaseDate">
        {album.release_date.split('T')[0]}
      </span>
      <img src={`${album.photo}`} alt="Фото альбома" />
      <span className="albumName">{album.name}</span>
    </Link>
  ));
}

export default function ArtistAlbums() {
  const { id } = useParams();
  const [albums, setAlbums] = useState([]);
  const [findArtistAlbums] = useLazyFindArtistAlbumsQuery();

  useEffect(() => {
    findArtistAlbums(id).then((result) => {
      setAlbums(result.data);
    });
  }, []);

  return (
    <div
      className="artistAlbumsBlock"
      style={!albums ? { display: 'none' } : {}}
    >
      <div className="artistAlbums">
        <Albums albums={albums} />
      </div>
    </div>
  );
}
