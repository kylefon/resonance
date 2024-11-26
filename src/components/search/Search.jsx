import './search.css'
import Loading from "../loading/Loading";
import { useEffect, useState } from "react";
import { Link, useLoaderData } from "react-router-dom";
import { useFetchSearch } from "../../hooks/useFetchSearch";
import { usePocket } from "../../context/PocketContext";

export default function Search() {
  const { query } = useLoaderData();
  const { search: searchResults, isLoading } = useFetchSearch(query);
  const { searchUsername, getUserWithAvatar } = usePocket();
  const [usernameResults , setUsernameResults ] = useState([]);
  const [usersWithAvatar, setUsersWithAvatar] = useState([]);
  const [activeTab, setActiveTab] = useState('albums');

  useEffect(() => {
    let isMounted = true;

    const fetchUsernameResults = async () => {
      if (activeTab === 'users') {
        const result = await searchUsername(query);
        if (isMounted) {
          setUsernameResults(result);
        }
      }
    } 

    fetchUsernameResults();

    return () => {
      isMounted = false;
    }
  }, [query, activeTab, searchUsername])

  useEffect(() => {
    const fetchAvatar = async () => {
      const resultsWithAvatars = await Promise.all(
        usernameResults.map(async (user) => {
          return await getUserWithAvatar(user)
        })
      );
      setUsersWithAvatar(resultsWithAvatars);
    };

    if (usernameResults.length > 0) {
      fetchAvatar();
    }
},[usernameResults]);

  // useEffect(() => {
  //   console.log("username results", usernameResults);
  //   console.log("users with avatar: ", usersWithAvatar);
  // }, [usernameResults, usersWithAvatar])

  return (
    <>
    { isLoading ? (
      <Loading />
    ) :
    (
    <div className="searched-results-container">
      <div className="searched-results">
        <div className="main-header">
          <p className="main-popular">SHOWING MATCHES FOR "{query}"</p>
        </div>
        <div className="search-content">
            {activeTab === 'albums' && 
              ( searchResults.length > 0 ? (
                <>
                { searchResults.map((search) => (
                  <div key={search.id} className="search-item">
                    <Link to={`/album/${search.id}`}>
                      <img src={search.images[0].url} alt={search.name} className="search-image"/>
                    </Link>
                    <div className="search-content-wrapper">
                      <Link to={`/album/${search.id}`} className="search-link">
                        <div className="search-name">{search.name}</div>
                      </Link>
                      <div className="artist-content">
                        <p>By</p>
                        {search.artists.map((artist, index) => (
                          <span key={artist.id}>
                          <Link to={`/artist/${artist.id}`}>
                            <div  className="searching-artist">
                              {artist.name}
                            </div>
                          </Link>
                          {index < search.artists.length - 1 && ', '}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
                </>
              ) : (
                <p className="main-popular" style={{marginTop: "10px"}}>No results found for "{query}".</p>
              ))
            }
            {activeTab === 'users' && 
              (usersWithAvatar.length > 0 ? (
                usersWithAvatar.map((user) => (
                  <Link to={`/${user.username}`} key={user.id}>
                    <div className="user-search-container">
                        <img 
                          src={user.avatarUrl || '/default-profile.png'} 
                          className="users-search-image"
                          />
                        <p className="users-search-username">{user.username}</p>
                    </div>
                  </Link>
                ))
              ) : (
                <p className="main-popular" style={{marginTop: "10px"}}>No results found for "{query}".</p>
              )  
            )} 
        </div>
      </div>
      <div className="searched-filter">
        <div className="main-header">
          <p className="main-popular">SHOW RESULTS FOR</p>
        </div>
        <div className="result-filter">
          <ul>
            <li className={`result-filter-li ${activeTab === 'albums' ? 'active' : ''}`} onClick={() => setActiveTab('albums')}>Albums</li>
            <li className={`result-filter-li ${activeTab === 'users' ? 'active' : ''}`}onClick={() => setActiveTab('users')}>Users</li>
          </ul>
        </div>
      </div>
    </div>
    )}
  </>
  );
}
