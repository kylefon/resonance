import ReviewCard from '../cards/ReviewCard'
import './popularreviews.css'

export default function PopularReviews() {
    return (
        <> 
            <div className='reviews-header'>
                <div className='main-popular'>
                    <p>POPULAR REVIEWS</p>
                </div>
                <div className='main-more'>
                    <p>MORE</p>
                </div>
            </div>
            <div className='review-bottom'>
                {/* {Object.keys(reviews).slice(0,4).map((column, index) => (
                    // <ReviewCard data={reviews[column]} key={index}/>
                ))} */}
            </div>
        </>
    )
}