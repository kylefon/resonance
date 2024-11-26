import { useState, useContext, createContext } from "react";
import { useFetchAccessToken } from "./AccessTokenContext";

const ArtistDataContext = createContext();

export const useArtistData = () => {
    return useContext(ArtistDataContext);
}

export const ArtistDataProvider = ({ children }) => {

    // gets artist data 

    const [artistData, setArtistData] = useState(null);
    const accessToken = useFetchAccessToken();

    const fetchArtistData = async (artistId) => {
        if (!accessToken || !artistId) return;

        const options = {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            }
        };

        try {
            const response = await fetch(`https://api.spotify.com/v1/artists/${artistId}`, options);

            if (!response.ok) {
                throw new Error('Failed to fetch album tracks');
            }

            const data = await response.json();
            setArtistData(data);

        } catch (error) {
            console.error('Error fetching album tracks:', error);
        }
    }; 

    return (
        <ArtistDataContext.Provider value={{ artistData, fetchArtistData }}>
            {children}
        </ArtistDataContext.Provider>
    )
}