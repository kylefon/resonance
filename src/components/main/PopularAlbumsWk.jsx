import './popularalbumswk.css'
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useFetchPopularAlbums } from '../../hooks/useFetchPopularAlbums';

export default function PopularAlbmusWk() {

    const { popularAlbums } = useFetchPopularAlbums();

    const [albumIndex, setAlbumIndex] = useState(0);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024); 
    const visibleAlbums = 4; 
    const totalAlbums = popularAlbums.length;

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 1024);
        };

        window.addEventListener('resize', handleResize); 

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const pressRightArrow = () => {
        if (albumIndex + visibleAlbums < totalAlbums) {
            setAlbumIndex(prevIndex => prevIndex + visibleAlbums);
        }
    };

    const pressLeftArrow = () => {
        if (albumIndex - visibleAlbums >= 0) {
            setAlbumIndex(prevIndex => prevIndex - visibleAlbums);
        } else {
            setAlbumIndex(0);
        }
    };

    return (
        <div className='main-week'>
            <div className='main-header'>
                <div className='header'>
                    <p>TOP ALBUMS</p>
                </div>
            </div>
            <div className='albums-container'>
                {!isMobile && (
                    <>
                        <button className="chevron-button" onClick={pressLeftArrow}>
                            <FaChevronLeft className='chevrons'/>
                        </button>
                        <div className='carousel-wrapper'>
                            <div className='albums-image-container' style={{ transform: `translateX(-${(albumIndex * 230) + (albumIndex * 10)}px)` }}>
                                {popularAlbums.map((album) => (
                                    <Link to={`/album/${album.id}`} key={album.id}>
                                        <img 
                                            src={album.images[1].url} 
                                            className='albums-image'
                                            alt='album image'
                                        />
                                    </Link>
                                ))}
                            </div>
                        </div>
                        <button className="chevron-button" onClick={pressRightArrow}>
                            <FaChevronRight className='chevrons'/>
                        </button>
                    </> 
                )}

                {isMobile && (
                    <div className='carousel-wrapper'>
                        <div className='albums-image-container'>
                            {popularAlbums.map((album) => (
                                <Link to={`/album/${album.id}`} key={album.id}>
                                    <img 
                                        src={album.images[1].url} 
                                        className='albums-image'
                                        alt='album image'
                                    />
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
