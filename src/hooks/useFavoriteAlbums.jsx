import { useEffect, useState } from "react";
import { usePocket } from "../context/PocketContext";
import { useFetchAccessToken } from "../context/AccessTokenContext";

export const useFetchFavoriteAlbums = ( userId ) => {
    const [selectedAlbums, setSelectedAlbums] = useState([null,null,null,null]);
    const { getFavoriteAlbums,  } = usePocket();
    const accessToken = useFetchAccessToken(); 
    
    useEffect(() => {
        const fetchFavoriteAlbums = async () => {
            if (!userId) {
                console.error("User ID is missing");
                setSelectedAlbums(Array(4).fill(null));
                return;
            }

            if (!accessToken) {
                console.error("accessToken is missing");
                setSelectedAlbums(Array(4).fill(null));
                return;
            }
    
            try {
                const albums = await getFavoriteAlbums(userId);
    
                if (albums && albums.length > 0) {
                    // Extract album IDs
                    const albumIds = albums.map((album) => album.albumId).join(',');
    
                    const options = {
                        method: 'GET',
                        headers: {
                            Accept: 'application/json',
                            Authorization: `Bearer ${accessToken}`,
                        },
                    };
    
                    const response = await fetch(`https://api.spotify.com/v1/albums?ids=${albumIds}`, options);
    
                    if (!response.ok) {
                        throw new Error("Failed to fetch album details");
                    }
    
                    const data = await response.json();
    
                    // Safely handle missing or incomplete data
                    const updatedAlbums = [
                        ...(data.albums || []),
                        ...Array(4 - (data.albums?.length || 0)).fill(null),
                    ];

                    // console.log("use fetch favorite albums: ", updatedAlbums)
    
                    setSelectedAlbums(updatedAlbums);
                } else {
                    setSelectedAlbums(Array(4).fill(null));
                }
            } catch (e) {
                console.error("Failed to get favorite albums: ", e);
                setSelectedAlbums(Array(4).fill(null)); // Set to empty if an error occurs
            }
        };
    
        fetchFavoriteAlbums();
    }, [userId, accessToken, getFavoriteAlbums]);
    
        
    return { selectedAlbums, setSelectedAlbums }; 
};