import './profile.css';
import Loading from "../loading/Loading";
import { useNavigate, useParams } from "react-router-dom";
import ReviewCard from '../cards/ReviewCard';
import { useFetchMultipleProfileData } from '../../hooks/useFetchMultipleProfileData';
import { useEffect, useState } from 'react';
import { useFetchUserPopularReview } from '../../hooks/useFetchUserPopularReview';

export default function MainProfile({ setActiveTab, selectedAlbums, activities, userData}) {

    const {activities: data, isLoading, error } = activities;
    const { userPopularReview, isLoading: userPopularLoading, error: userPopularError } = useFetchUserPopularReview(userData.id)
    const [userProfiles, setUserProfiles] = useState([]);
    const { profiles, isLoading: multipleProfileLoading } = useFetchMultipleProfileData(userProfiles);
    
    useEffect(() => {
        if (userPopularReview && userPopularReview.length > 0 ) {
            console.log("user id being used", userData.id)
            const userIds = userPopularReview.map((review) => review.userId);
            console.log("popular review of this user", userPopularReview);
            setUserProfiles(userIds);
            console.log("user profiles of this user", profiles);
        }
    }, [ userPopularReview]);
    
    const navigate = useNavigate();

    const handleAlbumClick = (albumId) => {
        navigate(`/album/${albumId}`)
    }

    const FavoriteAlbumsTab = () => (
        <div style={{ paddingBottom: '32px' }}>
            <div className='main-header' style={{ marginBottom: '10px'}}>
                <div className="main-popular">
                    <p>FAVORITE ALBUMS</p>
                </div>
            </div>
            <div className="grid-album-container">
                {selectedAlbums.map((album, index) => {
                    return (
                        <div className="favorite-album-main" key={index}>
                            {album ? (
                                <img 
                                    className="favorite-image-main"
                                    src={album.images[0].url}
                                    alt={album.name}
                                    onClick={() => handleAlbumClick(album.id)}
                                /> 
                                ) : (
                                    <div className="favorite-album-null"></div>
                            )}
                        </div>
                    )})}
            </div>
        </div>
    )

    if (isLoading) {
        return <Loading />
    }

    if (error) {
        return <p>ERROR</p>
    }

    const RecentActivitiesTab = () => (
        <div style={{paddingBottom:'32px'}}>
            <div className="main-header" >
                <div className="main-popular">
                    RECENT ACTIVITY
                </div>
                <div className='main-more' onClick={() => setActiveTab("Activity")} style={{ cursor: "pointer" }}>
                    <p>MORE</p>
                </div>
            </div>
            <div className="grid-album-container">
                {data.slice(0,4).map((album, index) => {
                    if (isLoading) {
                        return (
                            <div key={index}><Loading /></div>
                        )
                    }
                    return (
                        <div className="favorite-album-main" key={index}>
                            {album ? (
                                <img 
                                    className="favorite-image-main"
                                    src={album.trackData.images[0].url}
                                    alt={album.trackData.name}
                                    onClick={() => handleAlbumClick(album.albumId)}
                                /> 
                            ) : (
                                <div className="favorite-album-null"></div>
                            )}
                        </div>
                    )
                })}
            </div>
        </div>
    )

    const PopularActivitiesTab = () => (
        <div style={{paddingBottom:'32px'}}>
            <div className='main-header'>
                <div className='main-popular'>
                    POPULAR REVIEWS
                </div>
                {/* <div className='main-more'>
                    <p>MORE</p>
                </div> */}
            </div>
            <div>
                {profiles.slice(0,3).map((profile, index) => (
                    <ReviewCard key={index} activities={userPopularReview[index]} userData={profile}/> 
                ))}
            </div>
        </div>
    );

    return (
        <>
            {(!data || !selectedAlbums) ? (
                <Loading />
            ) : (
                <div>
                    {/* {error && <p>{error}</p>} */}
                    <FavoriteAlbumsTab />
                    <RecentActivitiesTab />
                    <PopularActivitiesTab />
                </div>
            )}
        </>
    )
}