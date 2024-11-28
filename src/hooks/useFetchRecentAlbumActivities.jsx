import { useEffect, useState } from "react"
import { useFetchAccessToken } from "../context/AccessTokenContext";
import { usePocket } from "../context/PocketContext";

export const useFetchRecentAlbumActivities = (albumId) => {

    const { getRecentAlbumActivity } = usePocket();
    const [ albumActivities, setAlbumActivities ] = useState([]);
    const [ isLoading, setIsLoading ] = useState(false);
    const [ error, setError ] = useState(null);
    const accessToken = useFetchAccessToken();

    useEffect(() => {
        const fetchAlbumRecent = async () => {
            setIsLoading(true);

            if (!albumId) {
                console.error("Album ID is missing");
                return;
            }

            if (!accessToken) {
                console.error("Access Token is missing");
                return;
            }

            try {
                const recentAlbumActivities = await getRecentAlbumActivity(albumId);

                if (recentAlbumActivities && recentAlbumActivities.length > 0) {
                    const albumIds = recentAlbumActivities.map((activity) => activity.albumId).join(',');

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
                    
                    const updatedActivities = recentAlbumActivities.map((activity) => ({
                        ...activity, 
                        trackData: trackDataMap[activity.albumId] || null,
                    }))

                    // console.log("RECENT ALBUM:", updatedActivities)
                    
                    setAlbumActivities(updatedActivities);
                } else {
                    console.error("No activities found");
                }
            } catch (e) {
                console.error("Failed to fetch recent album activities: ", e);
                setError(e.message);
            } finally {
                setIsLoading(false);
            }
        };
        fetchAlbumRecent();
        
    }, [albumId, accessToken, getRecentAlbumActivity])

    return { albumActivities, isLoading, error }
};