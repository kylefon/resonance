import { useEffect, useState } from "react";
import { usePocket } from "../context/PocketContext"
import { useFetchAccessToken } from "../context/AccessTokenContext";

export const useFetchAllPopular = () => {
    const { getAllPopularReview } = usePocket();
    const [ allPopular, setAllPopular ] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const accessToken = useFetchAccessToken();

    useEffect(() => {
        const fetchAllPopularAlbums = async () => {
            setIsLoading(true);

            if (!accessToken) {
                console.error("Access Token is missing");
                return;
            }

            try {
                console.log("Getting all popular reviews")
                const popularAlbumActivity = await getAllPopularReview();

                if ( popularAlbumActivity && popularAlbumActivity.length > 0) {
                    const albumIds = popularAlbumActivity.map((activity) =>activity.albumId).join(',');

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

                    console.log("POPULAR ALL ALBUMS REVIEW:", updatedActivities)
                    
                    setAllPopular(updatedActivities);

                } else {
                    console.error("No activities found");
                }
            } catch (e) {
                console.error("Failed to fetch popular album activities: ", e);
                setError(e.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAllPopularAlbums();
    }, [accessToken, getAllPopularReview])

    return { allPopular, isLoading, error }
}