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

export default function Review() {

    const { username, albumId } = useParams();  
    const { trackData, fetchTrackData } = useTrackData();
    const [ error, setError ] = useState(null);
    const { getReview } = usePocket(); 
    const { userData, isLoading } = useFetchProfileData(username);
    
    const [ review, setReview ] = useState(null);

    const setDate = (date) => {
        const newDate = new Date(date);
        const options = { year: 'numeric', month: 'short', day: 'numeric'};
        const formattedDate = new Intl.DateTimeFormat('en-US', options).format(newDate);

        return formattedDate;
    }

    useEffect(() => {
        const getTrackData = async () => {
          try {
            if (!trackData && albumId) {
              await fetchTrackData(albumId);
            }
          } catch (e) {
            setError("Failed to track data")
            console.error("Failed to track data", e);
          } 
        }

        getTrackData();    
    }, [albumId, trackData, fetchTrackData]);

    useEffect(() => {
        const fetchReview = async () => {
            if (userData?.id && albumId) {
                try {
                    const data = await getReview(userData.id, albumId);
                    console.log("FETCH REVIEW REVIEWjsx: ", data);
                    setReview(data);
                } catch (e) {
                    setError("Failed to fetch review data");
                    console.error(e);
                }
            }
        }

        fetchReview();
    }, [albumId, userData.id, getReview])

    if (error) {
        return <p>{error}</p>
    }

    if (!trackData) {
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
                        <div className="reviewed-by-text">Review by <div className="reviewed-username">{userData.username}</div></div>
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
                        <div className="reviewed-lkes">
                            <FaHeart /> No likes yet
                        </div>
                    </div>
                </section>
            </div>
        </div>
    )
}