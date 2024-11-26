import pb from '../lib/pocketbase';
import { jwtDecode } from 'jwt-decode';
import { useInterval } from 'usehooks-ts';
import { ClientResponseError } from 'pocketbase';
import { createContext, useCallback, useContext, useEffect, useState } from 'react';

const PocketContext = createContext({});

export const PocketProvider = ({ children }) => {

    pb.autoCancellation(false);

    
    const [ token, setToken ] = useState(pb.authStore.token);
    const [ user, setUser ] = useState(pb.authStore.model);

    const [avatarUrl, setAvatarUrl] = useState('/default-profile.png'); 


    useEffect(() => {
        return pb.authStore.onChange((token, model) => {
            setToken(token);
            setUser(model);
        })
    }, []);

    const register = useCallback(async (email, username, password, passwordConfirm) => {
        try {
            return await pb.collection("users").create({ email, username, password, passwordConfirm });
        } catch (e) {
            if (e instanceof ClientResponseError) {
                if (e.status === 400) {
                    throw new Error("Invalid input. Please check your details.");
                } else if (e.status === 409) {
                    throw new Error("Account already exists.");
                }
            }
            throw new Error(e.message || "Failed to register account");
        }
    }, []);    

    const login = useCallback(async (email, password) => {
        try {
            return await pb.collection("users").authWithPassword(email, password);
        } catch (e) {
            throw new Error(e.message || "Failed to login account")
        }
    }, []);

    const logout = useCallback(() => {
        pb.authStore.clear();
        console.log("Successfully logged out");
    }, []);

    const changePassword = useCallback(async (currentPassword, newPassword, confirmNewPassword) => {
        if (!user?.id) {
            console.error("User is not authenticated")
        }
        
        try {
            return await pb.collection('users').update(user.id, { 
                oldPassword: currentPassword, 
                password: newPassword, 
                passwordConfirm: confirmNewPassword
            });
        } catch (e) {
            throw new Error(e.message || "Failed to change username")
        }
    }, [user?.id])

    const changeUsername = useCallback(async ( newUsername ) => {
        if (!user?.id) {
            console.error("User is not authenticated")
        }

        try {
            return await pb.collection('users').update(user.id, {username: newUsername })
        } catch (e) {
            throw new Error(e.message || "Failed to change password")
        }
    }, [user?.id])

    const changeAvatar = useCallback(async ( file ) => {
        if (!user?.id) {
            console.error("User is not authenticated")
        }
        try {
            const formData = new FormData();
            formData.append('avatar', file);

            return await pb.collection('users').update(user.id, formData);

            console.log("Avatar changed successfully")

        } catch (e) {
            throw new Error(e.message || "Failed to change avatar");
        }
    }, [user?.id])

    const removeProfile = useCallback(async () => {
        if (!user?.id) {
            console.error("User is not authenticated")
        }
        try {
            return await pb.collection('users').update(user.id, {
                avatar: null,
            })
        } catch (e) {
            console.error('Error removing avatar', e);
        }
    }, [user?.id]);

    const getAvatar = useCallback(async (userId) => {
        try {
            const record = await pb.collection('users').getOne(userId);
            const avatarFilename = record.avatar; 
            if (avatarFilename) {
                return pb.files.getUrl(record, avatarFilename);
            }
            return '/default-profile.png';
        } catch (e) {
            console.error("Error fetching avatar", e);
            return '/default-profile.png';
        }
    }, []);

    useEffect(() => {
        if (user?.id) {
            const fetchAvatar = async () => {
                const url = await getAvatar(user.id);
                setAvatarUrl(url);
            };
            fetchAvatar();
        } else {
            setAvatarUrl('/default-profile.png')
        }
    }, [user, getAvatar]);

    const getUserWithAvatar = useCallback(async (user) => {
        try {
            const avatarFilename = user.avatar;
            const avatarUrl = avatarFilename ? pb.files.getUrl(user, avatarFilename) : '/default-profile.png';
            return {...user, avatarUrl};
        } catch (error) {
            console.error('Error fetching user avatar: ', error);
            return { ...user, avatarUrl: '/default-profile.png'}
        }
    }, [])

    const addFavoriteAlbum = useCallback(async (userId, selectedAlbums) => {
        try {
            const currentFavorites = await pb.collection('favoriteAlbums').getFullList({
                filter: `userId = "${userId}"`,
            });

            console.log("CURRENT FAVORITES:", currentFavorites);


            const deletePromise = currentFavorites.map((album) => 
                pb.collection('favoriteAlbums').delete(album.id)
            );

            await Promise.all(deletePromise);

            const add = selectedAlbums.map((album, index) => {
                if (album) {
                    return pb.collection('favoriteAlbums').create({
                        userId,
                        albumId: album.id,
                        order: index,
                    }, { requestKey: `add-${album.id}`});
                }

                return null;
            })

            await Promise.all(add.filter(Boolean));

            console.log("Favorite albums synced successfully")
        } catch (e) {
            console.error("Error setting favorite album", e);
            throw e;
        }
    }, []);

    const getFavoriteAlbums = useCallback(async (userId) => {
        try {
            const favoriteAlbums = await pb.collection('favoriteAlbums').getFullList({
                filter: `userId="${userId}"`,
                sort: 'order',
            })

            console.log("FAVORITE ALBUMS OUTPUT: ", favoriteAlbums)
            
            return favoriteAlbums;

        } catch (e) {
            console.error("Failed to get favorite albums")
            throw e;
        }
    }, [user?.id]);

    const addReview = useCallback(async (userId, albumId, reviewText, rating, liked) => {
        try {
            const existingReview = await pb.collection('reviews').getFullList({
                filter: `userId="${userId}" && albumId="${albumId}"` 
            });

            if (existingReview.length > 0) {
                const updatedReview = await pb.collection('reviews').update(
                    existingReview[0].id, {
                        reviewText,
                        rating,
                        liked
                    });
                console.log("Review updated: ", updatedReview);
                return updatedReview;
            } else {
                console.log("review does not exist")
                const newReview = await pb.collection('reviews').create({
                    userId, albumId, reviewText, rating, liked
                })
                console.log("Review created: ", newReview);
                return newReview;
            }
        } catch (e) {
            console.error("Failed to add review");
            throw e;
        }
    }, [])

    const getReview = useCallback(async (userId, albumId) => {
        try {
            const review = await pb.collection('reviews').getFullList({
                filter: `userId="${userId}" && albumId="${albumId}"`
            })
            return review.length > 0 ? review[0] : null;
        } catch (e) {
            console.error("Failed to get review");
            throw e;
        }
    })

    const getRecentActivities = useCallback(async (userId) => {
        try {
            return await pb.collection('reviews').getFullList({
                filter: `userId="${userId}"`,
                sort: '-created'
            })
        } catch (e) {
            console.error("Failed to get activities", e)
        }
    }, [])

    const searchUsername = useCallback(async (query) => {
        try {
            return await pb.collection('users').getFullList({
                filter: `username="${query}"`,
                sort: '-created'
            })
        } catch (e) {
            console.error("Failed to search user", e)
        }
    })

    const followUsers = useCallback(async (userId, followedUserId) => {
        try {
            const checkFollow = await pb.collection('follows').getFullList({
                filter: `userId="${userId}" && followedUserId="${followedUserId}"`,
            })


            if (checkFollow.length === 0) {
                return await pb.collection('follows').create({ userId, followedUserId })
            } else {
                console.error("User is already followed")
            }
        } catch (e) {
            console.error("Failed to follow user", e)
        }
    })

    const checkMutual = useCallback(async (userId, followedUserId) => {
        try {
            const checkFollow = await pb.collection('follows').getFullList({
                filter: `userId="${followedUserId}" && followedUserId="${userId}"`,
            })

            if (checkFollow.length === 0) {
                return false; 
            } else {
                return true;
            }
        } catch (e) {
            console.error("Failed to show relationship")
        }
    })

    const removeFollowUser = useCallback(async (userId, followedUserId) => {
        try {
            const response = await pb.collection('follows').getFullList({
                filter: `userId="${userId}" && followedUserId="${followedUserId}"`,
            });

            if (response.length === 0) {
                console.log("No matching follow record found");
                return;
            }

            await Promise.all(
                response.map((record) => pb.collection('follows').delete(record.id))
            ); 

        } catch (e) {
            console.error("Failed to unfollow user", e);
        }
    });

    const checkIfFollowed = useCallback(async (userId, followedUserId) => {
        try {
            const response = await pb.collection('follows').getFullList({
                filter: `userId="${userId}" && followedUserId="${followedUserId}"`,
            });

            if ( response.length === 0) {
                console.log("you are not following this user")
                return false;
            } else {
                console.log("You are following this user")
                return true;
            }
        } catch (e) {
            console.error("Failed to check if user is followed already", e);
        }
    })

    const numberOfReviewedAlbums = useCallback( async (userId) => {
        try {
            const response = await pb.collection('reviews').getFullList({
                filter: `userId="${userId}"`
            })
            console.log("ALBUMS: ", response);
            console.log("Number of albums reviewed: ", response.length);
            return response.length;
        } catch (e) {
            console.error("Failed to get number of reviews", e);
            return 0;
        }
    })
    
    const numberOfFollowing = async (userId) => {
        try {
            const response = await pb.collection('follows').getFullList({
                filter: `userId="${userId}"`
            })

            console.log("number of following", response.length);
            console.log("userId numberofFollowign", userId)
            return response.length;
        } catch (e) {
            console.error("Failed to get number of following")
            return 0; 
        }
    }

    const numberOfFollowers = async (userId) => {
        try {
            const response = await pb.collection('follows').getFullList({
                filter: `followedUserId="${userId}"`
            })
            console.log("number of followers", response.length);
            return response.length;
        } catch (e) {
            console.error("Failed to get number of followers")
            return 0;
        }
    }


    const refreshSession = useCallback(async () => {
        if (!token || !pb.authStore.isValid) return;
        const decoded = jwtDecode(token);
        const tokenExpiration = decoded.exp;
        const expirationWithBuffer = (decoded.exp + 300000) / 1000;
        if (tokenExpiration < expirationWithBuffer) {
            await pb.collection("users").authRefresh();
        }
    }, [token]);
    
    
    useInterval(refreshSession, token ? 120000 : null);

    return (
        <PocketContext.Provider value={{ 
            register, login, logout, 
            changePassword, changeUsername, 
            changeAvatar, avatarUrl, getAvatar, getUserWithAvatar, removeProfile, 
            addFavoriteAlbum, getFavoriteAlbums,
            addReview, getReview, getRecentActivities, numberOfReviewedAlbums,
            searchUsername, followUsers, removeFollowUser, checkMutual, checkIfFollowed,
            numberOfFollowing, numberOfFollowers,
            user, token, pb }}>
            {children}
        </PocketContext.Provider>
    );
};

export const usePocket = () => useContext(PocketContext);