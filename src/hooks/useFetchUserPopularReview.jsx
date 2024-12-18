import { useEffect, useState } from "react";
import { usePocket } from "../context/PocketContext";
import { useFetchAccessToken } from "../context/AccessTokenContext";

export const useFetchUserPopularReview = (userId) => {

    const { getUserPopularReview } = usePocket();
    const [ userPopularReview, setUserPopularReview ] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [ error, setError ] = useState(null);
    const accessToken = useFetchAccessToken();

    useEffect(() => {
        const fetchPopularAlbum = async () => {
            setIsLoading(true);
            if (!userId) {
                console.error("User id is missing")
                return;
            }

            if (!accessToken) {
                console.error("Access token is missing");
                return;
            }

            try {
                const popularAlbumActivity = await getUserPopularReview(userId);

                if ( popularAlbumActivity && popularAlbumActivity.length > 0) {
                    const albumIds = popularAlbumActivity.slice(0,20).map((activity) =>activity.albumId).join(',');

                    const options = {
                        method: 'GET',
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
                    
                    const updatedActivities = popularAlbumActivity.map((activity) => ({
                        ...activity, 
                        trackData: trackDataMap[activity.albumId] || null,
                    }))

                    // console.log("USER POPULAR ALBUMS REVIEW:", updatedActivities)
                    
                    setUserPopularReview(updatedActivities);

                } else {
                    console.error("No activities found");
                }
            } catch (e) {
                console.error("Failed to fetch popular album activities: ", e);
                setError(e.message);
            } finally {
                setIsLoading(false);
            }
        }

        fetchPopularAlbum();
    }, [userId, accessToken, getUserPopularReview])

    return { userPopularReview, isLoading, error }
}