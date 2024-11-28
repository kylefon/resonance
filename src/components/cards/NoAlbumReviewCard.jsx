import { usePocket } from "../../context/PocketContext";
import { useLikeReview, RenderLikeButton } from "../../hooks/useLikeReview";
import StarRating from "../stars/StarRating";
import { FaHeart } from "react-icons/fa";
import { Link } from "react-router-dom";
import './noalbumreviewcard.css'

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
                        <Link to={`/${userData.username}`} className="link">
                            {userData.username}
                        </Link>
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