import { createContext, useContext, useEffect, useState } from "react";

const AccessTokenContext = createContext();

export const useFetchAccessToken = () => {
    return useContext(AccessTokenContext);
}

export const AccessTokenProvider = ({ children }) => {
    const clientSecret = import.meta.env.VITE_CLIENT_SECRET;
    const clientId = import.meta.env.VITE_CLIENT_ID;

    const [accessToken, setAccessToken] = useState(null);

    useEffect(() => {
        const fetchAccessToken = async () => {
            const tokenUrl = 'https://accounts.spotify.com/api/token';

            const headers = {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + btoa(clientId + ':' + clientSecret)
            };

            const body = 'grant_type=client_credentials';

            try {
                const response = await fetch(tokenUrl, {
                    method: 'POST',
                    headers: headers,
                    body: body
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch access token');
                }

                const data = await response.json();
                setAccessToken(data.access_token); 
                
            } catch (error) {
                console.error('Error fetching access token: ', error);
            }
        };

        fetchAccessToken();
    }, [clientId, clientSecret]); 

    return (
        <AccessTokenContext.Provider value={accessToken}>
            {children}
        </AccessTokenContext.Provider>
    );
    
}