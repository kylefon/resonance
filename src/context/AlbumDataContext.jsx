import { useState, useContext, createContext } from "react";
import { useFetchAccessToken } from "./AccessTokenContext";

const AlbumDataContext = createContext();

export const useAlbumData = () => {
    return useContext(AlbumDataContext);
}

export const AlbumDataProvider = ({ children }) => {

    // tracks all artist albums 

    const [albumData, setAlbumData] = useState(null);
    const accessToken = useFetchAccessToken();

    const fetchAlbumData = async (artistId) => {
        if (!accessToken || !artistId) return;

        const options = {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            }
        };

        try {
            const response = await fetch(`https://api.spotify.com/v1/artists/${artistId}/albums`, options);

            if (!response.ok) {
                throw new Error('Failed to fetch album tracks');
            }

            const data = await response.json();
            setAlbumData(data);

        } catch (error) {
            console.error('Error fetching album tracks:', error);
        }
    }; 

    return (
        <AlbumDataContext.Provider value={{ albumData, fetchAlbumData }}>
            {children}
        </AlbumDataContext.Provider>
    )
}