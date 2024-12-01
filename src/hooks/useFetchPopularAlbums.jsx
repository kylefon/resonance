import { useEffect, useState } from "react";
import { useFetchAccessToken } from "../context/AccessTokenContext";

export const useFetchPopularAlbums = () => {
    const accessToken = useFetchAccessToken(); 
    const [popularAlbums, setPopularAlbums] = useState([]);

    useEffect(() => {
        if (!accessToken) return;

        const fetchPopularAlbums = async () => {
            const options = {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                }
            };

            try {
                // Fetch Top 100: Global playlist made by Afrikan Radar
                const response = await fetch(`https://api.spotify.com/v1/playlists/0sDahzOkMWOmLXfTMf2N4N?fields=tracks.items(track(album(album_type,id,name,images)))`, options);
                if (!response.ok) {
                    throw new Error('Failed to fetch popular albums');
                }

                const data = await response.json();
                let uniqueAlbums = [];
                let albumNames = new Set();

                // filters data to get only if the album type is album
                // outputs images, album name, album type and album id
                data.tracks.items
                    .filter(item => item.track.album.album_type === "album")
                    .forEach(item => {
                        const album = item.track.album;
                        if (!albumNames.has(album.name)) {
                            albumNames.add(album.name);
                            uniqueAlbums.push(album);
                        }
                    });

                setPopularAlbums(uniqueAlbums);

            } catch (error) {
                console.error('Error fetching popular albums: ', error);
            }
        };

        fetchPopularAlbums();
    }, [accessToken]);

    return { popularAlbums };
};
