import './newestalbums.css';
import { Link } from "react-router-dom";
import { useFetchNewAlbums } from '../../hooks/useFetchNewAlbums';

export default function NewestAlbums() {

    const { newAlbums } = useFetchNewAlbums();

    return (
        <div>
            <div className='newest-header'>
                <div className='header'>
                    <p>NEWEST ALBUMS</p>
                </div>
            </div>
            <div className='newest-content'>
                {newAlbums.slice(0,10).map((album, index) => (
                    <Link to={`/album/${album.id}`} key={index}>
                        <div className='newest-albums-container'>
                            <img src={album.images[0].url} className='newest-albums' alt='album image'/>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    )
}