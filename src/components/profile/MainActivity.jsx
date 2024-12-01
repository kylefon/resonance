import Loading from '../loading/Loading';
import ReviewCard from '../cards/ReviewCard';
import { FriendReviewCards } from './FriendReviewCards';
import { useState } from 'react';

export default function MainActivity({ activities, userData }) {

    const { activities: data, isLoading, error } = activities; 
    const [activeTab, setActiveTab] = useState('you')
    
    if (isLoading) {
        return <Loading />
    }

    const UserTab = () => (
        <div>
            {data.length > 0 ? (
                data.map((activity, index) => (
                    <div key={index}>
                    <ReviewCard activities={activity} userData={userData}/>
                    </div>
                ))
            ) : (
                <p className="header" style={{marginTop: "10px"}}>You have no reviews.</p>
            )
            }
        </div>
    )
    
    return (
        <div>
            <div className="main-header-activity">
                <ul className='header-list'>
                    <li className={`header ${activeTab === 'you' ? 'active' : ''}`} onClick={() => setActiveTab('you')}>YOU</li>
                    <li className={`header ${activeTab === 'friends' ? 'active' : ''}`} onClick={() => setActiveTab('friends')}>FRIENDS</li>
                </ul>
            </div>
            {error && <p className='header-listen'>{error}</p>}
            {activeTab === 'you' && (
                <div>
                    <UserTab />
                </div>
            )}
            {activeTab === 'friends' && userData?.id && (
                <div>
                    <FriendReviewCards userId={userData.id}/>
                </div>
            )}
        </div>
    )
}