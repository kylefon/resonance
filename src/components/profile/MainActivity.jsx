import Loading from '../loading/Loading';
import ReviewCard from '../cards/ReviewCard';
import { useFetchProfileData } from '../../hooks/useFetchProfileData';

export default function MainActivity({ activities, userData }) {

    // const { userId: username } = useParams();
    
    // const { activities, isLoading, error } = useFetchRecentActivities(userId);
    const { activities: data, isLoading, error } = activities; 

    if (isLoading) {
        return <Loading />
    }
    
    return (
        <div>
            <div className="main-header">
                <div className="header">RECENT ACTIVITIES</div>
            </div>
            {error && <p className='header-listen'>{error}</p>}
            <div>
                {data.map((activity, index) => (
                    <div key={index}>
                        <ReviewCard activities={activity} userData={userData}/>
                    </div>
                ))}
            </div>
        </div>
    )
}