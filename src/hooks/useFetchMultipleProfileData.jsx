import { useEffect, useState } from "react"
import { usePocket } from "../context/PocketContext";

export const useFetchMultipleProfileData = (userIds) => {
    const { pb, getUserWithAvatar } = usePocket();
    const [ isLoading, setIsLoading ] = useState(false);
    const [ profiles, setProfiles ] = useState([]);
    
    useEffect(() => {
        const fetchProfiles = async () => {
            setIsLoading(true);
            try {
                const profilePromises = userIds.map(async (userId) => {
                    try {
                        const response = await pb.collection('users').getFirstListItem(`id="${userId}"`);
                        const userWithAvatar = await getUserWithAvatar(response);
                        return userWithAvatar;
                    } catch (e) {
                        console.error(`Failed to fetch profile for ${userId}`, e);
                        return null;
                    }
                });

                const profiles = await Promise.all(profilePromises)
                
                // console.log(" fetch multiple profile data: ", profiles);

                setProfiles(profiles);

            } catch (error) {
                console.error("Failed to fetch profiles")
            } finally {
                setIsLoading(false);
            }
        }

        fetchProfiles();
    }, [userIds])

    return { profiles, isLoading };
}