import { useCallback, useEffect, useState } from "react"
import { FaHeart } from "react-icons/fa";

export const useLikeReview = (pb, user, activities, userData, { likeReview, unlikeReview, likeCount, isLiked }) => {
    const [ showButton, setShowButton ] = useState(false);
    const [ likeButton, setLikeButton ] = useState(false);
    const [ numberOfLikes, setNumberOfLikes ] = useState(0);

    useEffect(() => {
        const ifLoggedIn = async () => {
            if (pb.authStore.isValid) {
                setShowButton(true);
                // console.log("ACIVITIES REVIEWCARD: ", activities)
                // console.log("USERDATA REVIEWCARD: ", userData);
            } else {
                setShowButton(false);
            }
        }
        
        ifLoggedIn();
    }, [pb, activities, userData])

    useEffect(() => {
        const checkIfLiked = async () => {
            // console.log("id of the user liking the review", userData.id)
            // console.log("id of the review", activities.userId)
            // console.log("id of the user that made the review", activities.id)


            const check = await isLiked( user.id, activities.id, activities.userId);
            if (check) {
                // console.log("Already liked");
                setLikeButton(true);
            } else {
                // console.log("haven't liked it yet");
                setLikeButton(false);
            }
        }

        checkIfLiked();
    }, [activities, userData, user, isLiked])

    useEffect(() => {
        const checkNumber = async () => {
            try {
                const likes = await likeCount(activities.id, activities.userId);
                setNumberOfLikes(likes || 0);
            } catch (e) {
                console.error("Error finding number of likes: ", e);
            }
        }

        checkNumber();
    }, [likeCount, activities, likeButton])

    const likeClick = useCallback(async () => {
        if (activities && userData) {
            try {
                await likeReview( user.id, activities.id, activities.userId );
                setLikeButton(true);
            } catch (e) {
                console.error("Failed to like review: ", e);
            }
        }
    }, [likeReview, user, activities, userData])

    const unlikeClick = useCallback(async () => {
        if (activities && userData) {
            try {
                await unlikeReview( user.id, activities.id, activities.userId );
                setLikeButton(false);
            } catch (e) {
                console.error("Error unliking review: ", e);
            }
        }
    }, [unlikeReview, user, activities, userData ]);


    return {
        showButton, likeButton, numberOfLikes, likeClick, unlikeClick
    };
};

export const RenderLikeButton = ({ 
    showButton, likeButton, numberOfLikes, likeClick, unlikeClick
}) => (
        <div className="review-likes">
            {showButton && likeButton && <FaHeart color='red' onClick={unlikeClick}/>}
            {showButton && !likeButton && <FaHeart onClick={likeClick}/>}
            {showButton && numberOfLikes === 0 && <p>No Likes yet</p>}
            {showButton && numberOfLikes > 1 && (
                <>
                    {numberOfLikes}
                    <p>Likes</p>
                </>
            )}
            {showButton && numberOfLikes === 1 && (
                <>
                    {numberOfLikes}
                    <p>Like</p>
                </>
            )}
        </div>
)