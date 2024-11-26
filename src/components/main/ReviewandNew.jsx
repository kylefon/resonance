import NewestAlbums from "./NewestAlbums";
import PopularReviews from "./PopularReviews";
import './reviewandnew.css'

export default function ReviewandNew() {
    return(
        <div className="review-new-wrapper">
            <div className="review-wrapper">
                <PopularReviews />
            </div>
            <div className="newest-wrapper">
                <NewestAlbums />
            </div>
        </div>
    )
}