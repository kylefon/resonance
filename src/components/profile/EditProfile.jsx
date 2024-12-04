import './profile.css'
import Loading from '../loading/Loading';
import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { usePocket } from '../../context/PocketContext'
import FavoriteAlbumSearch from '../cards/FavoriteAlbumSearch';
import { useFetchFavoriteAlbums } from '../../hooks/useFavoriteAlbums';
import DeleteAccount from '../cards/DeleteAccount';

export default function EditProfile() {

    const fileInputRef = useRef(null);
    
    const navigate = useNavigate();

    const [currentIndex, setCurrentIndex] = useState(null);
    const [ filmModal, setFilmModal ] = useState(false);
    const [deleteModal, setDeleteModal] = useState(false);
    const [ isLoading, setIsLoading ] = useState(false);
    const [ isError, setIsError ] = useState(false);

    
    const { register, handleSubmit, reset, formState: {errors}, getValues} = useForm();
    const { pb, user, changePassword, changeUsername, changeAvatar, avatarUrl, removeProfile, addFavoriteAlbum } = usePocket();
    
    const { selectedAlbums, setSelectedAlbums } = useFetchFavoriteAlbums(user.id);
    
    const handleFavoriteAlbum = (index) => {
        setCurrentIndex(index);
        setFilmModal(true);
    };

    const handleClose = () => {
        setFilmModal(false);
        setCurrentIndex(null);
    }

    const handleAlbumSelect = (album) => {
        setSelectedAlbums((prev) => {
            const updatedAlbums = [...prev];
            updatedAlbums[currentIndex] = album;
            return updatedAlbums;
        });
        handleClose();
    }

    const handleRemove = (index) => {
        setSelectedAlbums((prev) => {
            const updatedAlbums = [...prev];
            updatedAlbums[index] = null;
            return updatedAlbums;
        });
    };

    const openDeleteModal = () => setDeleteModal(true);
    const closeDeleteModal = () => setDeleteModal(false);

    async function onSubmit(data) {
        setIsLoading(true);
        setIsError(false);
        try {
            if (data.username) {
                await changeUsername(data.username);
                console.log("Successfully changed username");
            }

            if (data.currentPassword && data.newPassword && data.confirmPassword) {
                await changePassword(data.currentPassword, data.newPassword, data.confirmPassword);
                console.log("Password changed");
            }

            if (data.file) {
                await changeAvatar(data.file);
                console.log("Successfully changed Avatar");
            }

            await addFavoriteAlbum(user.id, selectedAlbums);

            reset();
            navigate(`/${user.username}`)

        } catch (error) {
            setIsError(true);
            console.error("Error changing profile: ", error.message);
        } finally {
            setIsLoading(false);
        }
    }

    if (isLoading) {
        return <Loading />
    }
 
    const MainContent = () => (
        <div className='edit-profile-container'>
            <form onSubmit={handleSubmit(onSubmit)}>
                {isError && <p>Error changing account</p>}
                <div className="edit-header">Account Settings</div>
                <section className="change-avatar">
                    <p className='edit-sub-header'>Avatar</p>
                    <div className='image-container'>
                        <input 
                            type="file" 
                            accept='image/*'
                            className='fileInput' 
                            ref={fileInputRef}
                            onChange={(e) => {
                                const file = e.target.files[0];
                                if (file) {
                                    changeAvatar(file);
                                }
                            }}
                            style={{ display: 'none' }}
                        />
                        <img src={avatarUrl || "default-profile.png"}/>
                    </div>
                    <div className='buttons-container'>
                        <div className='submit-button'>
                            <button type="button" onClick={() => fileInputRef.current.click()}>SELECT NEW AVATAR</button>
                        </div>
                        <button type="button" className='remove-button' onClick={() => removeProfile(user.id)}>Remove</button>
                    </div>
                </section>
                <div className='change-section-wrapper'>
                    <section className='change-section'>
                        <div className="change-username">
                            <p className='edit-sub-header'>Profile</p>
                            <div className='change-form'> 
                                <label htmlFor="username" className='edit-label'>Username</label>
                                <input 
                                    type="text" 
                                    name="username" 
                                    placeholder={user.username} 
                                    {...register(
                                        "username"
                                    )}
                                />
                            </div>
                            {errors.username && <span className='header-listen'>{errors.username.message}</span>}
                        </div>
                        <div className="change-password">
                            <p className='edit-sub-header'>Change password</p>
                            <div className='change-form'>
                                <label htmlFor="currentPassword" className='edit-label'>Current password</label>
                                <input 
                                    name="currentPassword" 
                                    type='password' 
                                    {...register(
                                        "currentPassword", {
                                            minLength: {
                                                value: 8,
                                                message: "Password must be at least 8 characters"
                                            }
                                        }
                                    )}
                                />
                                {errors.currentPassword && <span className='header-listen'>{errors.currentPassword.message}</span>}
                            </div>
                            <div className='change-form'>
                                <label htmlFor="newPassword" className='edit-label'>New password</label>
                                <input 
                                    name="newPassword" 
                                    type='password'
                                    {...register(
                                        "newPassword", {
                                            minLength: {
                                                value: 8,
                                                message: "Password must be at least 8 characters"
                                            }
                                        }
                                    )}
                                />
                                {errors.newPassword && <span className='header-listen'>{errors.newPassword.message}</span>}
                            </div>
                            <div className='change-form'>
                                <label htmlFor="confirmPassword" className='edit-label'>Confirm new password</label>
                                <input 
                                    name="confirmPassword" 
                                    type='password'
                                    {...register(
                                        "confirmPassword", {
                                            // required: "Please confirm your password",
                                            validate: (value) => 
                                                value === getValues("newPassword") || "Passwords do not match"
                                        })}
                                />
                                {errors.confirmPassword && <span className='header-listen'>{errors.confirmPassword.message}</span>}
                            </div>
                        </div>
                    </section>
                    <section>
                        <p className='edit-sub-header'>Favorite Albums</p>
                        <div className='favorite-album-container'>
                            {selectedAlbums.map((album, index) => {
                                // console.log(`selectedAlbums[${index}]:`, album); // Log statement for debugging
                                return (<div className='favorite-album' key={index} onClick={() => handleFavoriteAlbum(index)}>
                                    {album && album.images && album.images[0] ? (
                                        <img 
                                            className='favorite-image'
                                            src={album.images[0].url}
                                            alt={album.name}
                                            onClick={() => handleRemove(index)}
                                        />
                                    ) : (
                                        <div className='favorite-album' onClick={() => handleFavoriteAlbum(index)}>
                                        </div>
                                    )}
                                </div>)
                            })}
                        </div>
                    </section>
                </div>
                <footer className='button-container'>
                    <div>
                        <button className='delete-button' type="button" onClick={openDeleteModal}>DELETE</button>
                    </div>
                    <div className='submit-button'>
                        <button type="submit" disabled={isLoading}>SAVE CHANGES</button>
                    </div>
                </footer>
            </form>
            <FavoriteAlbumSearch isOpen={filmModal} closeModal={handleClose} onAlbumSelect={handleAlbumSelect} />
            <DeleteAccount isOpen={deleteModal} closeModal={closeDeleteModal}/>
        </div>
    )

    return (
        <>
            { !pb.authStore.isValid ? (
                <p>Not logged in. Logged in first.</p>
            ) : (
                <MainContent />
            )}
        </>
    )
}