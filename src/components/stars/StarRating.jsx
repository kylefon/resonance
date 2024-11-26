import { FaStar } from "react-icons/fa";


const StarRating = ({ stars }) => {
    const starCount = parseInt(stars, 5);

    return (
        <div className="star-rating">
            {Array.from({ length: starCount}, (_, index) => (
                <FaStar key={index}/>
            ))}
        </div>
    );
}

export default StarRating;