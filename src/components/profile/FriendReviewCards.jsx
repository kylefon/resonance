import { useEffect, useMemo, useState } from "react";
import { useFetchMultipleProfileData } from "../../hooks/useFetchMultipleProfileData";
import { useFetchFriendsRecentActivity } from "../../hooks/useFetchFriendsRecentActivity";
import Loading from "../loading/Loading";
import ReviewCard from "../cards/ReviewCard";

export const FriendReviewCards = ({ userId }) => {
    const [userIds, setUserIds] = useState([]);
    const { friendActivities, isLoading: activitiesLoading } = useFetchFriendsRecentActivity(userId);
    const { profiles, isLoading: profilesLoading } = useFetchMultipleProfileData(userIds);

    useEffect(() => {
        const gettingUserIds = friendActivities.flatMap(activity => activity[0]?.userId || []);
        setUserIds(gettingUserIds);
    }, [friendActivities]);

    const updatedActivities = useMemo(() => {
        return friendActivities.flat().map(activity => {
            const data = profiles.find(profile => profile.id === activity.userId);
            return {
                ...activity,
                userData: data || null,
            };
        }).reverse();
    }, [friendActivities, profiles]);

    // Debugging logs
    // useEffect(() => {
    //     console.log("Friend activities:", friendActivities);
    //     console.log("User IDs:", userIds);
    //     console.log("Profiles:", profiles);
    //     console.log("Updated activities:", updatedActivities);
    // }, [friendActivities, userIds, profiles, updatedActivities]);

    // Loading state
    if (activitiesLoading || profilesLoading) {
        return <Loading />;
    }

    // Handle empty state
    if (!updatedActivities || updatedActivities.length === 0) {
        return <div className="header" >No recent friend activity found.</div>;
    } 

    return (
        <div>
            {updatedActivities.map((activity, index) => (
                activity.userData && activity.trackData ? (
                <div key={index}>
                    <ReviewCard activities={activity} userData={activity.userData} />
                </div>
                ) : (
                    <Loading />
                )
            ))}
        </div>
    );
};
