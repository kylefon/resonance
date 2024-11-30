import { useEffect, useState } from "react";
import { usePocket } from "../context/PocketContext"
import { useFetchAccessToken } from "../context/AccessTokenContext";

export const useFetchFriendsRecentActivity = (userId) => {
    const { getFriendsRecentActivity } = usePocket();
    const [ friendActivities, setFriendActivities ] = useState([]);
    const [ isLoading, setIsLoading ] = useState(false);
    const [ error, setError ] = useState(null);
    const accessToken = useFetchAccessToken();

    useEffect(() => {
        const fetchFriendsRecentActivities = async () => {
            setIsLoading(true);

            if (!userId) {
                console.error("User ID is missing");
                return;
            }

            if (!accessToken) {
                console.error("Access token is missing");
                return;
            }


            try {
                // console.log("user id usefetchfriendsrecentactivity", userId)
                const recentActivities = await getFriendsRecentActivity(userId);

                // console.log("Recent activities fetched", recentActivities)

                if (recentActivities && recentActivities.length > 0) {
                    const albumIds = recentActivities
                        .slice(0,20)
                        .filter((activity) => activity.length > 0 )
                        .map((activity) => activity.map((child) => child.albumId))
                        .join(',');

                    const options = {
                        method: 'GET',
                        headers: {
                            Accept: 'application/json',
                            Authorization: `Bearer ${accessToken}`,
                        }
                    }
                    // console.log("album ids ", albumIds)

                    if (albumIds) {  
        
                        // console.log("getting spotify api response")
                        const response = await fetch(`https://api.spotify.com/v1/albums?ids=${albumIds}`, options);

                        if (!response.ok) {
                            console.error("Failed to fetch albums of friend's activities from Spotify API")
                        }
                        
                        const { albums } = await response.json();
                        // console.log("albums from use fetch ", albums)
                        
                        const updatedActivities = recentActivities
                        .filter((activity) => activity.length > 0 )
                        .map((activity) => {
                            return activity.map((act) => {
                                const albumData = albums.find(album => album.id === act.albumId);
                                return {
                                    ...act,
                                    trackData: albumData || null,
                                    }
                                })
                            })
                        // console.log("UPDATED ACTIVITIES: ", updatedActivities)
                        
                        setFriendActivities(updatedActivities)
                    } else {
                        console.error("No valid album IDs to fetch from Spotify");
                    }
                } else {
                    console.error("No activities found")
                }
            } catch (e) {
                console.error("Failed to fetch friend's recent activities: ", e);
                setError(e.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchFriendsRecentActivities();
    }, [ userId, accessToken, getFriendsRecentActivity])

    return { friendActivities, isLoading, error }
}