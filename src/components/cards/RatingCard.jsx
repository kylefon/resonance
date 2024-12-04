import './ratingcard.css';
import ReviewModal from "./ReviewModal";
import { useEffect, useState } from "react";
import { FaHeart, FaStar, FaRegHeart  } from "react-icons/fa";
import { usePocket } from "../../context/PocketContext";
import { useTrackData } from "../../context/TrackDataContext";
import { useParams } from 'react-router-dom';

export default function RatingCard() {

    const { albumId } = useParams();  
    
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    // const [listen, setListen] = useState(false);
    const [like, setLike] = useState(false);
    const [reviewModal, setReviewModal] = useState(false)

    const numStars = [1,2,3,4,5];

    const handleOpen = () => setReviewModal(true);
    const handleClose = () => setReviewModal(false);  

    const { pb, user, getReview } = usePocket();
    const { useFetchTrackData } = useTrackData();
    const { data: trackData, isLoading, error} = useFetchTrackData(albumId);

    useEffect(() => {
        if (!trackData || !user || !user.id) return;
    
        const fetchReview = async () => {
          try {
            const existingReview = await getReview(user.id, trackData.id);
            if (existingReview) {
              setRating(existingReview.rating || 0);
              setLike(existingReview.liked || false);
            }
          } catch (error) {
            console.error("Error fetching review in RatingCard: ", error);
          }
        };
    
        fetchReview();
      }, [trackData, user, getReview]);
      
    return (
        <div className="rating-card-wrapper">
            <div className="rating-icons" >
                <div className="heart-icon" onClick={() => setLike(!like)}>
                    {!like ? 
                    <>
                        <FaRegHeart size={20}  />
                        <p>Like</p>
                    </> : <>
                        <FaHeart size={20}  color="red"/>
                        <p>Liked</p>
                    </>
                    }
                </div>
            </div>
            <div className="rating-select">
                <p>Rate</p>
                <div className="rating-stars">
                    {numStars.map((num) => (
                        <label key={num} htmlFor="star-label" className="rating" onMouseEnter={() => setHover(num)} onMouseLeave={() => setHover(0)} onClick={() => setRating(num)} >
                            <input type="radio" id={`star${num}`} name="rating" value={num} />
                            <FaStar color={hover >= num || rating >= num ? "gold" : "#2c3641"}/>
                        </label>
                    ))}
                </div>
            </div>
            { pb.authStore.isValid ? (
                    <div className="rating-review" onClick={handleOpen}>Review</div> 
            ): (
                <div className="rating-review">Sign in to Review</div> 
            )
            }

            <ReviewModal 
                isOpen={reviewModal} 
                closeModal={handleClose} 
                like={like}
                setLike={setLike}
                rating={rating}
                setRating={setRating}
            />
        </div>
    )
}