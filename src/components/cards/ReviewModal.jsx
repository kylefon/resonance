import './reviewmodal.css';
import { IoMdClose } from "react-icons/io";
import { FaHeart, FaStar  } from "react-icons/fa";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useTrackData } from "../../context/TrackDataContext";
import { usePocket } from "../../context/PocketContext";
import Loading from "../loading/Loading";
import { useParams } from 'react-router-dom';

export default function ReviewModal({ 
    isOpen, closeModal, like, setLike, rating, setRating
 }) {

    const {albumId} = useParams();
    const numStars = [1,2,3,4,5];
    const [hover, setHover] = useState(0);
    const [ isError, setIsError ] = useState(false);
    const [ isLoading, setIsLoading ] = useState(false);

    const dialogRef = useRef(null);
    
    const { useFetchTrackData } = useTrackData();
    const { data: trackData, isLoading: trackDataLoading, error: trackDataError } = useFetchTrackData(albumId);

    const { user, addReview, getReview } = usePocket();
    
    const { register, handleSubmit, formState: {errors}, getValues, setValue } = useForm();

    useEffect(() => {
        if (dialogRef.current) {
          if (isOpen) {
            dialogRef.current.showModal();
          } else {
            dialogRef.current.close();
          }
        }
      }, [isOpen]);

    useEffect(() => {
        if (!trackData || !user || !user.id) {
            return;
        }
        const fetchReview = async () => {
            try {
                const existingReview = await getReview(user.id, trackData.id);
                if ( existingReview ) {
                    setValue("reviewText", existingReview.reviewText || "");
                    setValue("rating", existingReview.rating || 0);
                    setLike(existingReview.liked || false);
                }
            } catch (error) {
                console.error('Error fetching existing review: ', error);
            }
        }

        fetchReview();
    }, [trackData, user, setValue, getReview])

    useEffect(() => {
        if (rating !== undefined) {
          setValue("rating", rating);
        }
      }, [rating, setValue]);

    async function onSubmit(data) {
        setIsLoading(true);
        setIsError(false);
        try {

            if (!trackData || !trackData.id) {
                console.error("trackData is missing or trackData.id is not available");
                return;
            }

            setRating(data.rating);
            setLike(like); 
            await addReview(user.id, trackData.id, data.reviewText, data.rating, like);

            console.log("Review submitted successfully!");
            closeModal();
        } catch (error) {
            setIsError(true);
            console.error("Error adding review: ", error.message);
        } finally {
            setIsLoading(false);
        }
    }

    if (trackDataLoading || isLoading) {
        return <Loading />
    }

    if (trackDataError) {
        return <p>Error loading track data: {trackDataError.message}</p>
    }

    return (
        <dialog ref={dialogRef} className="review-modal">
            {isError && <p>Error making review</p>}
            <div className="modal-content">
                <img src={trackData.images[1].url} alt={trackData.name}/>
                <div className="modal-review-container">
                    <form className="review-form" onSubmit={handleSubmit(onSubmit)}>
                        <header>
                            <p className="header-listen">I LISTENED TO...</p>
                            <p className="header-name">{trackData.name}</p>
                            <textarea 
                                placeholder="Add a review..."
                                {...register(
                                    "reviewText"
                                )}
                            ></textarea>
                            {errors.reviewText && <p className="error-text">{errors.reviewText.message}</p>}
                        </header>
                        <section className="rating-like">
                            <div className="modal-rating">
                                <p>Rating</p>
                                <div className="rating-stars">
                                    {numStars.map((num) => (
                                        <label 
                                            key={num} 
                                            htmlFor={`star${num}`}
                                            className="rating" 
                                            onMouseEnter={() => setHover(num)} 
                                            onMouseLeave={() => setHover(0)}
                                            onClick={() => setValue("rating", num)}
                                        >    
                                            <input 
                                                type="radio" 
                                                name="rating"
                                                id={`star${num}`} 
                                                value={getValues("rating")}
                                                {...register("rating")}
                                            />
                                            <FaStar color={hover >= num || getValues("rating") >= num ? "gold" : "#2c3641"}/>
                                        </label>
                                    ))}
                                </div>
                                {errors.rating && <p className="error-text">{errors.rating.message}</p>}
                            </div>
                            <div className="modal-like">
                                <div className="like" onClick={() => { setLike(prev => !prev);}}>
                                    {like ? (
                                        <>
                                            <p>Liked</p>
                                            <FaHeart size={20} color="red" className="heart-icon" />
                                        </>
                                    ) : (
                                        <>
                                            <p>Like</p>
                                            <FaHeart size={20} color="rgb(44, 54, 65)" className="heart-icon" />
                                        </>
                                    )}
                                </div>
                            </div>
                        </section>
                        <footer className="submit-button" type="submit" >
                            <button disabled={isLoading}>SUBMIT</button>
                        </footer>
                    </form>
                    <button className="modal-close" type="button" onClick={closeModal}>
                        <IoMdClose className="modal-button"/>
                    </button>
                </div>
            </div>
        </dialog>
    )
}