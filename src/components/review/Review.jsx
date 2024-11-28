import './review.css'
import { FaHeart } from "react-icons/fa";
import RatingCard from "../cards/RatingCard";
import StarRating from "../stars/StarRating";
import Loading from "../loading/Loading";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { usePocket } from "../../context/PocketContext";
import { useTrackData } from "../../context/TrackDataContext";
import { useFetchProfileData } from "../../hooks/useFetchProfileData";
import { useLikeReview, RenderLikeButton } from "../../hooks/useLikeReview";

export default function Review() {

    const { username, albumId } = useParams();  
    const { useFetchTrackData } = useTrackData();
    const { data: trackData, isLoading: trackLoading, error } = useFetchTrackData(albumId);
    const { pb, user, likeReview, unlikeReview, likeCount, isLiked, getReview } = usePocket(); 
    const { userData, isLoading: profileLoading } = useFetchProfileData(username);
    const [review, setReview] = useState([]);

    const { showButton, likeButton, numberOfLikes, likeClick, unlikeClick } = useLikeReview(pb, user, review, userData, {
        likeReview, unlikeReview, likeCount, isLiked
    }); 

    const setDate = (date) => {
        if (!date) return "Unknown Date";
        const newDate = new Date(date);
        if (isNaN(newDate)) return "Invalid Date";
        const options = { year: 'numeric', month: 'short', day: 'numeric'};
        const formattedDate = new Intl.DateTimeFormat('en-US', options).format(newDate);

        return formattedDate;
    }

    useEffect(() => {
        const fetchReview = async () => {
            if (userData?.id && albumId) {
                try {
                    const data = await getReview(userData.id, albumId);
                    // console.log("fetch get review", data);
                    setReview(data);
                } catch (e) {
                    console.error(e);
                }
            }
        }

        fetchReview();
    }, [albumId, userData.id, getReview])

    if (error) {
        return <p className='header-listen'>{error}</p>
    }

    if (profileLoading || trackLoading || !trackData || !userData) {
        return <Loading />
    }

    return (
        <div className="album-section-wrapper">
            <div className="album-main-container">
                <section className="album-image-section">
                    <img src={trackData?.images[0].url} alt="album image" className="album-image"/>
                    <div>
                        <RatingCard />
                    </div>
                </section>
                <section className="album-info-section">
                    <div className="reviewed-by">
                        <img src={userData.avatarUrl} alt="user image" className="reviewed-image"/>
                        <div className="reviewed-by-text">
                            Review by 
                            <Link to={`/${userData.username}`} className='link'>
                                <div className="reviewed-username">
                                    {userData.username}
                                </div>
                            </Link>
                        </div>
                    </div>
                    <div>
                        <div className="reviewed-album">
                            <Link to={`/album/${trackData.id}`} style={{ textDecoration: "none" }}>
                                <div className="album-name">{trackData.name}</div>
                            </Link>
                            <div className="album-year">{trackData.release_date.slice(0,4)}</div>
                        </div>
                        <div className="review-stars">
                            <StarRating stars={review.rating} color="gold"/>
                            <div>
                                { review.liked ? (
                                    <FaHeart color="red"/>
                                ) : (
                                    ''
                                )}
                            </div>
                        </div>
                        <div className="reviewed-date">
                            Reviewed {setDate(review.created)}
                        </div>
                        <div className="reviewed-text">
                            {review.reviewText}
                        </div>
                        <RenderLikeButton 
                            showButton={showButton}
                            likeButton={likeButton}
                            numberOfLikes={numberOfLikes}
                            likeClick={likeClick}
                            unlikeClick={unlikeClick}
                        />
                    </div>
                </section>
            </div>
        </div>
    )
}