import { useEffect, useState } from "react"
import { usePocket } from "../context/PocketContext";

export const useFetchProfileData = (userId) => {
    const { pb, getUserWithAvatar } = usePocket();
    const [ userData, setUserData ] = useState([]);
    const [ isLoading, setIsLoading ] = useState(false);
    const [ userFound, setUserFound ] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {

            setIsLoading(true);

            if (userId) {
                try {
                    const response = await pb.collection('users').getFirstListItem(`username="${userId}"`);
                    const userWithAvatar = await getUserWithAvatar(response);
                    setUserData(userWithAvatar);
                    setUserFound(true);
                } catch (e) {
                    console.error("Failed to fetch profile", e);
                    setUserFound(false);
                } finally {
                    setIsLoading(false)
                }
            }

        }
        
        fetchProfile();

    }, [userId]);

    return { userData, isLoading, userFound };
}