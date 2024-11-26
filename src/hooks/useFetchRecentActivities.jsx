import { useEffect, useState } from "react"
import { usePocket } from "../context/PocketContext";
import { useFetchAccessToken } from "../context/AccessTokenContext";

export const useFetchRecentActivities = (userId) => {

    const { getRecentActivities } = usePocket();
    const [ activities, setActivities] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const accessToken = useFetchAccessToken();
    
    useEffect(() => {
        const fetchRecentActivities = async () => {
            setIsLoading(true);

            if (!userId) {
                console.error("User ID is missing");
                return;
            }

            if (!accessToken) {
                console.error("AccessToken is missing");
                return;
            }


            try {
                const recentActivities = await getRecentActivities(userId);

                if (recentActivities && recentActivities.length > 0) {
                    const albumIds = recentActivities.map((activity) => activity.albumId).join(',');

                    const options = {
                        method:'GET',
                        headers: {
                            Accept: 'application/json',
                            Authorization: `Bearer ${accessToken}`,
                        } 
                    }

                    const response = await fetch(`https://api.spotify.com/v1/albums?ids=${albumIds}`, options);
                    
                    if (!response.ok) {
                        console.error("Failed to fetch recent activity albums")
                        throw new Error("Failed to fetch recent activity albums");
                    }
                    
                    const { albums } = await response.json();
                    
                    const trackDataMap = albums.reduce((acc, album) => {
                        acc[album.id] = album;
                        return acc;
                    }, {});
                    
                    const updatedActivities = recentActivities.map((activity) => ({
                        ...activity, 
                        trackData: trackDataMap[activity.albumId] || null,
                    }))
                    
                    setActivities(updatedActivities);
                } else {
                    console.error("No activities found");
                }
            } catch (e) {
                console.error("Failed to fetch recent activities: ", e);
                setError(e.message);
            } finally {
                setIsLoading(false);
            }
        };
        fetchRecentActivities();
    }, [userId, accessToken, getRecentActivities])
    
    return { activities, isLoading, error }
}
