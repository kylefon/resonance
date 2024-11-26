import './profile.css';
import Loading from "../loading/Loading";
import { useNavigate } from "react-router-dom";

export default function MainProfile({ setActiveTab, selectedAlbums, activities }) {
    const {activities: data, isLoading, error } = activities;
    
    const navigate = useNavigate();

    const handleAlbumClick = (albumId) => {
        navigate(`/album/${albumId}`)
    }

    const FavoriteAlbumsTab = () => (
        <div style={{ paddingBottom: '32px' }}>
            <div className='main-header' style={{ marginBottom: '10px'}}>
                <div className="main-popular">
                    <p>FAVORITE ALBUMS</p>
                </div>
            </div>
            <div className="grid-album-container">
                {selectedAlbums.map((album, index) => {
                    return (
                        <div className="favorite-album-main" key={index}>
                            {album ? (
                                <img 
                                    className="favorite-image-main"
                                    src={album.images[0].url}
                                    alt={album.name}
                                    onClick={() => handleAlbumClick(album.id)}
                                /> 
                                ) : (
                                    <div className="favorite-album-null"></div>
                            )}
                        </div>
                    )})}
            </div>
        </div>
    )

    if (isLoading) {
        return <Loading />
    }

    if (error) {
        return <p>ERROR</p>
    }

    const RecentActivitiesTab = () => (
        <div style={{paddingBottom:'32px'}}>
            <div className="main-header" style={{ marginBottom: '10px'}}>
                <div className="main-popular">
                    RECENT ACTIVITY
                </div>
                <div className='main-more' onClick={() => setActiveTab("Activity")} style={{ cursor: "pointer" }}>
                    <p>MORE</p>
                </div>
            </div>
            <div className="grid-album-container">
                {data.slice(0,4).map((album, index) => {
                    if (isLoading) {
                        return (
                            <div key={index}><Loading /></div>
                        )
                    }
                    return (
                        <div className="favorite-album-main" key={index}>
                            {album ? (
                                <img 
                                    className="favorite-image-main"
                                    src={album.trackData.images[0].url}
                                    alt={album.trackData.name}
                                    onClick={() => handleAlbumClick(album.albumId)}
                                /> 
                            ) : (
                                <div className="favorite-album-null"></div>
                            )}
                        </div>
                    )
                })}
            </div>
        </div>
    )

    return (
        <>
            {(!data || !selectedAlbums) ? (
                <Loading />
            ) : (
                <div>
                    {/* {error && <p>{error}</p>} */}
                    <FavoriteAlbumsTab />
                    <RecentActivitiesTab />
                </div>
            )}
        </>
    )
}