import { Link, useParams } from 'react-router-dom';
import RatingCard from '../cards/RatingCard'
import './albummain.css'
import { useTrackData } from '../../context/TrackDataContext';
import { useEffect, useState } from 'react';
import Loading from '../loading/Loading';

export default function AlbumMain() {

  const { albumId } = useParams();  
  const { useFetchTrackData } = useTrackData();
  const { data: trackData, isLoading, error} = useFetchTrackData(albumId);
  
  if (error) {
    return <p>{error}</p>
  }

  if (isLoading) {
    return <Loading />;
  }

  if (!trackData) {
    return <p>No album data available.</p>;
  }

    return (
        <div className='album-section-wrapper'>
          <div className='album-main-container'>
            <section className="album-image-section">
                <img src={trackData.images[0].url} className="album-image" alt="album image"/>
                <div>
                    <RatingCard />
                </div>
            </section> 
            <section className="album-info-section">
              <div className="album-credit">
                  <p className="album-name">{trackData.name}</p>
                  <div className="album-artists">
                    {trackData.artists.map((artist, index) => (
                      <Link to={`/artist/${artist.id}`} key={index}>
                          <p>{artist.name}</p>
                      </Link>
                    ))}
                  </div>
              </div>
              <div className="album-tracks">
                <div className='track-title'>
                    TRACKS
                </div>
                <div className='track-name-container'>
                  {trackData.tracks.items.map((track, index) => {
                    return <p key={index} className='track-name'>{track.name}</p>
                  })}
                </div>
              </div>
            </section>
          </div>
          <section>
            <div className="album-review-container">
              <div className='album-review-popular'>
                  <div className='main-popular'>
                      <p>POPULAR REVIEWS</p>
                  </div>
                  <div className='main-more'>
                      <p>MORE</p>
                  </div>
              </div>
              <div className='album-review-recent'>
                  <div className='main-popular'>
                      <p>RECENT REVIEWS</p>
                  </div>
                  <div className='main-more'>
                      <p>MORE</p>
                  </div>
              </div>
              <div className='album-review-artists'>
                  <div className='main-popular'>
                      <p>RELATED ARTISTS</p>
                  </div>
                  <div className='main-more'>
                      <p>MORE</p>
                  </div>
              </div>
            </div>
          </section>
        </div>
    )
}