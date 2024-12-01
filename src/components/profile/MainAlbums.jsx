import './mainalbum.css'
import { Link } from "react-router-dom";
import Loading from "../loading/Loading";
import StarRating from "../stars/StarRating";
import { LuText } from "react-icons/lu";
import { FaHeart } from "react-icons/fa";

export default function MainAlbums({ activities, userData }) {
    
    const { activities: data, recentActivitiesLoading: isLoading, error } = activities;
    
    if (isLoading) {
        return <Loading />
    }

    return (
        <div>
            {error && <p className='header-listen'>{error}</p>}
            <div className="main-header" style={{ marginBottom: '10px'}}>
                <div className="header">
                    REVIEWED FILMS
                </div>
            </div>
            {data.length > 0 ? (
                <div className="main-album-container">
                    {data.map((activity, index) => (
                        <div key={index}>
                        <Link to={`/${userData.username}/film/${activity.albumId}`}>
                        <img src={activity.trackData.images[0].url} className="main-album-image"/>
                        </Link>
                        <div className="album-review-icons">
                        {activity.rating > 0 && <StarRating stars={activity.rating} color="#556677"/>}
                        {activity.liked && <FaHeart />}
                        {activity.reviewText && <LuText />}
                        </div>
                        </div>
                    ))}
                </div> ) : (
                <p className="header">User has no reviews.</p>
            )}
        </div>
    )
}