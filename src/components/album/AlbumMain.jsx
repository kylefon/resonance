import { Link, useParams } from 'react-router-dom';
import RatingCard from '../cards/RatingCard'
import './albummain.css'
import { useTrackData } from '../../context/TrackDataContext';
import { useEffect, useState } from 'react';
import Loading from '../loading/Loading';
import { usePocket } from '../../context/PocketContext';
import ReviewCard from '../cards/ReviewCard';
import { useFetchRecentAlbumActivities } from '../../hooks/useFetchRecentAlbumActivities';
import { useFetchMultipleProfileData } from '../../hooks/useFetchMultipleProfileData';
import NoAlbumReviewCard from '../cards/NoAlbumReviewCard';
import { useFetchPopularAlbumActivities } from '../../hooks/useFetchPopularAlbumActivities';

export default function AlbumMain() {

  const [ userProfiles, setUserProfiles ] = useState([]);
  const [ popularUserProfiles, setPopularUserProfiles ] = useState([]);

  const { albumId } = useParams();  
  const { useFetchTrackData } = useTrackData();
  const { data: trackData, isLoading, error} = useFetchTrackData(albumId);

  const { albumActivities, isLoading: albumIsLoading, error: albumError } = useFetchRecentAlbumActivities(albumId);
  const { popularAlbum, isLoading: popularActLoading , error: popularActError } = useFetchPopularAlbumActivities(albumId);

  const {profiles, isLoading: multipleProfileLoading } = useFetchMultipleProfileData(userProfiles);
  const {profiles: popularProfiles, isLoading: multiplePopularProfileLoading } = useFetchMultipleProfileData(popularUserProfiles);

  // Fetch user profiles when albumActivities changes
  useEffect(() => {
    if (albumActivities && albumActivities.length > 0) {
      const userIds = albumActivities.map((album) => album.userId);
      // console.log(userIds);
      setUserProfiles(userIds);
    }
  }, [albumActivities]);

  useEffect(() => {
    if (popularAlbum && popularAlbum.length > 0) {
      const userIds = popularAlbum.map((album) => album.userId);
      setPopularUserProfiles(userIds);
    }
  }, [popularAlbum]);

    
  if (error || albumError || popularActError)  {
    return <p className='header-listen'>{error}</p>
  }

  if (isLoading  || albumIsLoading ) {
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
              <div className='album-section'>
                <div className='main-header'>
                    <div className='header'>
                        <p>POPULAR REVIEWS</p>
                    </div>
                    <div className='more'>
                        <p>MORE</p>
                    </div>
                </div>
                <div>
                  {popularProfiles.slice(0,3).map((profile, index) => (
                    <NoAlbumReviewCard key={index} activities={popularAlbum[index]} userData={profile} />
                  ))}
                </div>
              </div>
              <div className='album-section'>
                <div className='main-header'>
                    <div className='header'>
                        <p>RECENT REVIEWS</p>
                    </div>
                    <div className='more'>
                        <p>MORE</p>
                    </div>
                </div>
                <div>
                  {profiles.slice(0,5).map((profile, index) => ( // shows only 5 recent revoews
                    <NoAlbumReviewCard key={index} activities={albumActivities[index]} userData={profile}/>
                  ))}
                </div>
              </div>
              <div className='album-section'>
                <div className='main-header'>
                    <div className='header'>
                        <p>RELATED ARTISTS</p>
                    </div>
                    <div className='more'>
                        <p>MORE</p>
                    </div>
                </div>
              </div>
            </div>
          </section>
        </div>
    )
}