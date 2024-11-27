import './reviewcard.css'
import { FaHeart } from "react-icons/fa";
import StarRating from "../stars/StarRating";
import { Link } from "react-router-dom";
import { usePocket } from '../../context/PocketContext';
import { useEffect, useState } from 'react';
import { useLikeReview, RenderLikeButton } from '../../hooks/useLikeReview';

export default function ReviewCard({ activities, userData }) {

    const { pb, user, likeReview, unlikeReview, likeCount, isLiked } = usePocket();
    const { showButton, likeButton, numberOfLikes, likeClick, unlikeClick } = useLikeReview(pb, user, activities, userData, {
        likeReview, unlikeReview, likeCount, isLiked
    });

    const getTimeElapsed = (createdDate)  => {
        const created = new Date(createdDate);
        const now = Date.now();
        const diff = now - created.getTime();

        const seconds = Math.floor(diff / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        const months = Math.floor(days / 30 );
        const years = Math.floor( months / 12);

        if ( years > 0) {
            return `${years}y`
        } else if (months > 0) {
            return `${months}m`;
        } else if (days > 0) {
            return `${days}d`;
        } else if (hours > 0) {
            return `${hours}h`;
        } else if (minutes > 0) {
            return `${minutes}min`;
        } else {
            return `Now`;
        }
    }

    
    
    return (
        <div className="review-container">
            <Link to={ `/album/${activities.albumId}` }>
                <div className="review-image-container">
                    <img src={activities.trackData.images[0].url} className="review-image" alt='album image' />
                </div>
            </Link>
            <div className="review-bot">
                <div className="review-album-container">
                    <div className="review-album-header">
                        <div className="review-album">
                            <Link to={`/${userData.username}/film/${activities.albumId}`} style={{ textDecoration: "none" }}>
                                <div className="review-name">{activities.trackData.name}</div>
                            </Link>
                            <div className="review-year">{activities.trackData.release_date.slice(0,4)}</div>
                        </div>
                        <div className="review-artist">
                            <p>{getTimeElapsed(activities.created)}</p>
                        </div>
                    </div>
                    <div className="review-artist">
                        By {activities.trackData.artists.map((artist) => artist.name).join(', ')}
                    </div>
                </div>
                <div className="review-user">
                    <img src={userData.avatarUrl} className="avatar-image"/>
                    <p>{userData.username}</p>
                </div>
                <div className="review-stars">
                    <StarRating stars={activities.rating} color="gold" />
                </div>
                <div>
                    <p className="review-text">{activities.reviewText || ''}</p>
                </div>
                <RenderLikeButton 
                    showButton={showButton}
                    likeButton={likeButton}
                    numberOfLikes={numberOfLikes}
                    likeClick={likeClick}
                    unlikeClick={unlikeClick}
                />
            </div>
        </div>
    )
}