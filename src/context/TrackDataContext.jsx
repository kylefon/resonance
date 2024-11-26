import { useQuery } from "@tanstack/react-query";
import { useFetchAccessToken } from "./AccessTokenContext";
import { useState, useContext, createContext, useCallback } from "react";

const TrackDataContext = createContext();

export const useTrackData = () => {
    return useContext(TrackDataContext);
}


const fetchTrackData = async ({ queryKey }) => {
    const [_, albumId, accessToken] = queryKey;
    
    if (!accessToken || !albumId) {
        throw new Error("Missing access token or album ID");
    };

    const options = {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${accessToken}`           
        }
    };

        // console.log(`Fetching track data for album id: ${albumId}`)
        const response = await fetch(`https://api.spotify.com/v1/albums/${albumId}`, options);

        if (!response.ok) {
            throw new Error(`Failed to fetch album tracks: ${albumId}`);
        }

        return await response.json();    
}; 


export const TrackDataProvider = ({ children }) => {

    // gets the tracks/songs of an album 

    const accessToken = useFetchAccessToken();

    const useFetchTrackData = (albumId) => {
        return useQuery({
            queryKey: ["albumTracks", albumId, accessToken],
            queryFn: fetchTrackData,
            enabled: !!albumId && !!accessToken,
            staleTime: 60000,
            cacheTime: 30000,
            retry: 2,
            onError: (error) => { console.error("Error fetching album tracks:", error.message) },
        });
    };

    return (
        <TrackDataContext.Provider value={{ useFetchTrackData }}>
            {children}
        </TrackDataContext.Provider>
    )
}