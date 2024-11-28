import './profile.css'
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import MainProfile from './mainProfile';
import MainActivity from './MainActivity';
import MainAlbums from './MainAlbums';
import Loading from '../loading/Loading';
import { usePocket } from '../../context/PocketContext';
import { useFetchProfileData } from '../../hooks/useFetchProfileData';
import { useFetchRecentActivities } from '../../hooks/useFetchRecentActivities';
import { useFetchFavoriteAlbums } from '../../hooks/useFavoriteAlbums';

export default function Profile() {
    
    const tabs = [ 'Profile', 'Activity', 'Albums' ]
    
    const { pb, user, followUsers, removeFollowUser, checkMutual, numberOfReviewedAlbums, numberOfFollowing, numberOfFollowers, checkIfFollowed } = usePocket();
    const { userId } = useParams();

    const [activeTab, setActiveTab] = useState('Profile');
    
    const [showButton, setShowButton ] = useState(true);
    const [followBack, setFollowBack] = useState(false);
    const [followButton, setFollowButton] = useState(false);
    const [followedUser, setFollowedUser] = useState(false);

    const [reviewedAlbumCount, setReviewedAlbumCount] = useState(0);
    const [followersCount, setFollowersCount ] = useState(0);
    const [followingCount, setFollowingCount] = useState(0);

    const { userData, isLoading, userFound } = useFetchProfileData(userId);
    const { activities, isLoading: recentActivitiesLoading , error } = useFetchRecentActivities(userData.id);
    const { selectedAlbums } = useFetchFavoriteAlbums(userData.id);
    
    useEffect(() => {
        const updateButtonStates = () => {
            if (!pb.authStore.isValid) {
                setShowButton(false);
                setFollowButton(false);
                return;
            } else {    
                if (userData?.id !== user?.id) {
                    setFollowButton(true);
                    setShowButton(false);
                } else {
                    setShowButton(true);
                    setFollowButton(false);
                }
            }
        }

        updateButtonStates();
    }, [user, userData, pb])

    useEffect(() => {
        const checkFollowBack = async () => {
            if ( !followedUser ) {
                const check = await checkMutual(user.id, userData.id);
                if (check) {
                    // console.log("The user is following you")
                    setFollowBack(true);
                } else {
                    // console.log("The user is not following you")
                    setFollowBack(false);
                }
            }
        }
        checkFollowBack();
    }, [followedUser, user, userData]);

    useEffect(() => {
        const checkNumbers = async () => {
            try {
                if (userData) {
                    const follower = await numberOfFollowers(userData.id);
                    setFollowersCount(follower || 0);

                    const following = await numberOfFollowing(userData.id);
                    setFollowingCount(following || 0);

                    const reviewedAlbum = await numberOfReviewedAlbums(userData.id);
                    setReviewedAlbumCount(reviewedAlbum || 0);
                }
            } catch (e) {
                console.error("Error finding number of followers, following and albums", e)
            }
        }

        checkNumbers();

    }, [numberOfFollowers, numberOfFollowing, numberOfReviewedAlbums, userData, followedUser, followBack]);

    useEffect(() => {
        const followCheck = async () => {
            if (!followedUser) {
                const check = await checkIfFollowed(user.id, userData.id);
                if (check) {
                    // console.log("followed user");
                    setFollowedUser(true);
                } else {
                    // console.log("user not followed");
                    setFollowedUser(false);
                } 
            }
        }
        followCheck();
    }, [user, userData, followedUser])
    
    const followClick = async () => {
        if (userData.id && user.id) {
            try {
                console.log("set followeduser user.id", user.id)
                console.log("set followeduser userData.id", userData.id)
                await followUsers(user.id, userData.id); 
                setFollowedUser(true);
            } catch (e) {
                console.error("Error following user: ", e);
            }
        }
    }
    
    const removeFollow = async () => {
        if (userData.id && user.id) {
            try {
                await removeFollowUser(user.id, userData.id); 
                setFollowedUser(false);
            } catch (e) {
                console.error("Error unfollowing user: ", e);
            }
        }
    }

    const Button = ({ text, onClick }) => {
        return <button className='edit-profile' onClick={onClick}>{text}</button>
    }

    const Follow = () => <Button text="FOLLOW" onClick={followClick} />

    const Followed = () => <Button text="FOLLOWED" onClick={removeFollow} />

    const FollowBack = () => <Button text="FOLLOW BACK" onClick={followClick} />

    const EditProfileButton = () => (
        <Link to='/settings' className='link'>
           <Button text="EDIT PROFILE"/>
        </Link>
    )

    const RenderFollowButtons = () => (
        <>
            {showButton && <EditProfileButton />}
            {followButton && !followedUser && !followBack && <Follow />}
            {followButton && followedUser && <Followed />}
            {followButton && !followedUser && followBack && <FollowBack />}
        </>
    );
    
    const UserProfileHeader = () => {

        if (!userData) return null;

        return (
        <div className='profile-header'>
            <div className='profile-text'>
                <img 
                    src={userData.avatarUrl || '/default-profile.png'}
                    alt="profile image"
                    className='profile-image'
                />
                <div className='profile-username'>{userData.username}</div>
                <div>
                    <RenderFollowButtons /> 
                </div>
            </div>
            <div className='album-content-container'>
                <div className='album-content'>
                    <p className='album-number'>
                        {reviewedAlbumCount}
                    </p>
                    <p className='album-header'>
                        ALBUMS
                    </p>
                </div>
                <div className='album-content'>
                    <p className='album-number'>
                        {followersCount}
                    </p>
                    <p className='album-header'>
                        FOLLOWERS
                    </p>
                </div>
                <div className='album-content'>
                    <p className='album-number'>
                        {followingCount}
                    </p>
                    <p className='album-header'>
                        FOLLOWING
                    </p>
                </div>
            </div>
        </div>
        )
    }

    const Tabs = () => (
        <div className='tab-container'>
            <ul className='profile-tabs'>
                {tabs.map((tab) => (
                    <li 
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                    >
                        <p className={`tab-content ${activeTab === tab ? 'active' : ''}`}>{tab}</p>
                    </li>
                ))}
            </ul>
        </div>
    )

    if (isLoading) return <Loading />;
    if (!userFound)
        return (
            <div className='full-screen'>
                <p className='user-not-found'>USER NOT FOUND</p>
            </div>
        );
    
    return (
        <div className="profile-wrapper">
            <div className='profile-header-wrapper'>
                <UserProfileHeader />
                <Tabs />
            </div>
            <div>{activeTab === 'Profile' && <MainProfile setActiveTab={setActiveTab} userData={userData} selectedAlbums={selectedAlbums} activities={{activities, recentActivitiesLoading, error}} />}</div>
            <div>{activeTab === 'Activity' && <MainActivity activities={{activities, recentActivitiesLoading, error}} userData={userData}/>}</div>
            <div>{activeTab === 'Albums' && <MainAlbums activities={{activities, recentActivitiesLoading, error}} />}</div>
        </div>
    )
}