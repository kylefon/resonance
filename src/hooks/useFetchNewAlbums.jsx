import { useEffect, useState } from "react";
import { useFetchAccessToken } from "../context/AccessTokenContext";

export const useFetchNewAlbums = () => {
    
    const accessToken = useFetchAccessToken();
    const [newAlbums, setNewAlbums] = useState([]);

    useEffect(() => {
        if (!accessToken) return;

        const fetchNewAlbums = async () => {
            const options = {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                }
            };

            try {
                const response = await fetch(`https://api.spotify.com/v1/browse/new-releases`, options);
                if (!response.ok) {
                    throw new Error('Failed to fetch new albums');
                }

                const data = await response.json();
                const filteredData = data.albums.items.filter((item) => item.album_type === "album");
                setNewAlbums(filteredData);

            } catch (error) {
                console.error('Error fetching new albums: ', error);
            }
        };

        fetchNewAlbums(); 
    }, [accessToken]);

    return { newAlbums };
}