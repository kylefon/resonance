import { useEffect, useState } from "react"
import { usePocket } from "../../context/PocketContext";
import { Link } from "react-router-dom";

export default function MainNetwork({ userId }) {

    const {getUserWithAvatar, userFollowing, userFollowers, getUserFromUserId} = usePocket();
    const [following, setFollowing ] = useState([]);
    const [followers, setFollowers ] = useState([]);
    const [activeTab, setActiveTab] = useState('following');

    const [followerData, setFollowerData ] = useState([]);
    const [followingData, setFollowingData] = useState([]);

    const [followerWAvatar, setFollowerWAvatar] = useState([]);
    const [followingWAvatar, setFollowingWAvatar] = useState([]);

    useEffect(() => {
        const fetchFollowing = async () => {
            // console.log("User following id", userId)
            const following = await userFollowing(userId);
            // console.log("User following", following)
            setFollowing(following);
        }
        fetchFollowing();
    }, [userId, userFollowing])

    useEffect(() => {
        const fetchFollowers = async () => {
            // console.log("User followers id", userId)

            const followers = await userFollowers(userId);
            // console.log("user followers ", followers)
            setFollowers(followers);
        }
        fetchFollowers();
    }, [userId, userFollowers]);

    useEffect(() => {
        const followerProfile = async () => {
            const getFollowers = await Promise.all(
                followers.map((user) => {  
                    // console.log("getting user from user id follower profile", user)
                    return getUserFromUserId(user.userId)
                })
            )
            // console.log("follower profile ", getFollowers);
            setFollowerData(getFollowers.filter(Boolean));
        }
        if (followers.length > 0) followerProfile();
    }, [followers, getUserFromUserId])

    useEffect(() => {
        const followingProfile = async () => {
            const getFollowing = await Promise.all(
                following.map((user) => {  
                    // console.log("getting user from user id following profile", user)
                    return getUserFromUserId(user.followedUserId)
                })
            )
            // console.log("get following ", getFollowing)
            setFollowingData(getFollowing.filter(Boolean));
        }
        if (following.length > 0) followingProfile();
    }, [following, getUserFromUserId])

    useEffect(() => {
        const fetchFollowerAvatars = async () => {
            const resultsWithAvatars = await Promise.all(
                followerData.map(async (user) => {
                    const mapFollower = user.map(async (child) => {
                        const avatarData = await getUserWithAvatar(child);
                        return {
                            ...child, 
                            avatarUrl: avatarData.avatarUrl
                        }
                    })

                    return Promise.all(mapFollower)
                })
            )
            setFollowerWAvatar(resultsWithAvatars);
        }
        fetchFollowerAvatars();
    }, [followerData, getUserWithAvatar])

    useEffect(() => {
        const fetchFollowingAvatars = async () => {
            const resultsWithAvatars = await Promise.all(
                followingData.map(async (user) => {
                    const mapFollower = user.map(async (child) => {
                        const avatarData = await getUserWithAvatar(child)
                        return {
                            ...child,
                            avatarUrl: avatarData.avatarUrl
                        }
                    })

                    return Promise.all(mapFollower);
                })
            )
            setFollowingWAvatar(resultsWithAvatars);
        }
        fetchFollowingAvatars();
    }, [followingData, getUserWithAvatar])
    
    return (
        <div>
            <div className="main-header-activity">
                <ul className='header-list'>
                    <li className={`header ${activeTab === 'following' ? 'active' : ''}`} onClick={() => setActiveTab('following')}>FOLLOWING</li>
                    <li className={`header ${activeTab === 'followers' ? 'active' : ''}`} onClick={() => setActiveTab('followers')}>FOLLOWERS</li>
                </ul>
            </div>
            {activeTab === 'following' && 
              (followingWAvatar.length > 0 ? (
                followingWAvatar.map((user) => (
                  <Link to={`/${user[0].username}`} key={user[0].id}>
                    <div className="user-search-container">
                        <img 
                          src={user[0].avatarUrl || '/default-profile.png'} 
                          className="users-search-image"
                          />
                        <p className="users-search-username">{user[0].username}</p>
                    </div>
                  </Link>
                ))
              ) : (
                <p className="header" style={{marginTop: "10px"}}>User is not following any users.</p>
              )  
            )} 
            {activeTab === 'followers' && 
              (followerWAvatar.length > 0 ? (
                followerWAvatar.map((user) => (
                  <Link to={`/${user[0].username}`} key={user[0].id}>
                    <div className="user-search-container">
                        <img 
                          src={user[0].avatarUrl || '/default-profile.png'} 
                          className="users-search-image"
                          />
                        <p className="users-search-username">{user[0].username}</p>
                    </div>
                  </Link>
                ))
              ) : (
                <p className="header" style={{marginTop: "10px"}}>User has no followers.</p>
              )  
            )} 
        </div>
    )
}