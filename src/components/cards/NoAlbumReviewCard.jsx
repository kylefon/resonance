import { useState } from "react";
import { usePocket } from "../../context/PocketContext";
import { useLikeReview, RenderLikeButton } from "../../hooks/useLikeReview";
import StarRating from "../stars/StarRating";

import './noalbumreviewcard.css'
import { FaHeart } from "react-icons/fa";

export default function NoAlbumReviewCard({ activities, userData }) {
    const { pb, user, likeReview, unlikeReview, likeCount, isLiked } = usePocket(); 
    const { showButton, likeButton, numberOfLikes, likeClick, unlikeClick } = useLikeReview(pb, user, activities, userData, {
        likeReview, unlikeReview, likeCount, isLiked
    }); 

    return (
        <div className="review-container">
            <img src={userData.avatarUrl} className="no-album-avatar"/>
            <div className="no-album-content">
                <div className="no-album-header">
                    <p className="review-by">Review by</p>
                    {userData.username}
                    <div className='star-gold'>
                        <StarRating stars={activities.rating}  />
                    </div>
                    { activities.liked && (
                        <FaHeart color="red" />
                    )
                    }
                </div>
                {activities.reviewText && (
                    <div>
                        <p>{activities.reviewText}</p>    
                    </div>
                    )
                }
                <div>
                    <RenderLikeButton 
                        showButton={showButton}
                        likeButton={likeButton}
                        numberOfLikes={numberOfLikes}
                        likeClick={likeClick}
                        unlikeClick={unlikeClick}
                    />
                </div>
            </div>
        </div>
    )
}