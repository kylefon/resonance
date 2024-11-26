import './artistmain.css'
import { useEffect } from 'react';
import Loading from '../loading/Loading';
import { Link, useParams } from 'react-router-dom';
import { useAlbumData } from '../../context/AlbumDataContext';
import { useArtistData } from '../../context/ArtistDataContext';

export default function ArtistMain() {

    const { artistId } = useParams();
    const { artistData, fetchArtistData } = useArtistData();
    const { albumData, fetchAlbumData } = useAlbumData();

    useEffect(() => {
        if (artistId && (!artistData || !albumData)) {
            if (!artistData) fetchArtistData(artistId);
            if (!albumData) fetchAlbumData(artistId);
        }
    }, [artistId, artistData, albumData, fetchArtistData, fetchAlbumData]);

    if (!artistData || !albumData) {
        return <Loading />
    }

    return (
        <div className='artist-wrapper'>
            <section className='main-content'>
                <p className='albums-by'>ALBUMS BY</p>
                <p className='artist-name'>{artistData.name}</p>
                <div className='artist-albums-wrapper'>
                    <div className='artist-albums'>
                        {albumData.items.filter(album => album.album_type === "album").map((albums) => (
                            <Link to={`/album/${albums.id}`} key={albums.id}>
                                <div className='album-images'>
                                    {/* <p>{albums.name}</p> */}
                                        <img src={albums.images[1].url} alt={albums.name}/>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>
            <section className='artist-visual'>
                <img src={artistData.images[1].url} className='artist-image' alt={artistData.name}/>
                <div className='artist-genre'>
                    {artistData.genres.map((genres, index) => (
                        <p key={index}>{genres.toUpperCase()}</p>
                    ))}
                </div>
            </section>
        </div>
    )
}