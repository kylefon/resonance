import { useEffect, useState } from 'react';
import { useFetchAllPopular } from '../../hooks/useFetchAllPopular'
import { useFetchMultipleProfileData } from '../../hooks/useFetchMultipleProfileData';
import ReviewCard from '../cards/ReviewCard'
import './popularreviews.css'
import Loading from '../loading/Loading';

export default function PopularReviews() {

    const [ userProfiles, setUserProfiles ] = useState([]);
    const {allPopular, isLoading, error} = useFetchAllPopular(); 
    const {profiles, isLoading: multipleProfileLoading} = useFetchMultipleProfileData(userProfiles);

    useEffect(() => {
        if (allPopular && allPopular.length > 0 ) {
            const userIds = allPopular.map((review) => review.userId);

            setUserProfiles(userIds);
        }
    }, [allPopular])

    const ReviewContent = () => (
        <div className='review-bottom'>
            {profiles.slice(0,3).map((profile, index) => (
                <ReviewCard activities={allPopular[index]} userData={profile}/> 
            ))}
        </div>
    )

    const RenderReview = () => (
        <>
            {isLoading && multipleProfileLoading && <Loading /> }
            {!isLoading && !multipleProfileLoading && <ReviewContent /> }
        </>
    )

    return (
        <div className='review-popular-container'> 
            {error && <p className='header-listen'>{error}</p>}
            <div className='reviews-header'>
                <div className='header'>
                    <p>POPULAR REVIEWS</p>
                </div>
                <div className='more'>
                    <p>MORE</p>
                </div>
            </div>
            <RenderReview />
        </div>
    )
}