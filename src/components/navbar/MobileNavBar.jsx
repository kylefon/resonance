import { useState } from "react"
import { IoMenu } from "react-icons/io5";
import { FaSearch } from "react-icons/fa"
import { usePocket } from "../../context/PocketContext";
import { Link } from "react-router-dom";
import Avatar from "./Avatar";
import SearchBar from "./SearchBar";
import CreateAccount from "../authentication/CreateAccount";
import Auth from "../authentication/Auth";
import './navbar.css'

export default function MobileNavBar () {

    const { user, logout, avatarUrl } = usePocket();
    const [ openSearch, setOpenSearch ] = useState(false);
    const [ openMenu, setOpenMenu ] = useState(false);
    const [signInOpen, setSignInOpen] = useState(false);
    const [createAccountOpen, setCreateAccountOpen] = useState(false);

    
    const handleOpenMenu = () => {
        setOpenMenu((prev) => !prev);
        setOpenSearch(false);

        setSignInOpen(false);
        setCreateAccountOpen(false);
    }
    
    const handleSearchOpen = () => {
        setOpenMenu(false);
        setOpenSearch((prev) => !prev);
    }
       
    const NotLoggedIn = () => (
        <div className="small-nav-right">
            <div onClick={handleOpenMenu}>
                <IoMenu/>
            </div>
            <div onClick={handleSearchOpen}>
                <FaSearch />
            </div>
        </div>
    )

    return (
        <>
            <nav>
                <div className="mobile-nav-bar">
                    <div className="mobile-nav-container">
                        { user && <Avatar user={user} avatarUrl={avatarUrl} />}
                        <NotLoggedIn />
                    </div>
                </div>
            </nav> 
        <div className="mobile-dropdown">
            { openMenu &&  (
                <>
                    {!user ? (
                        <div className="auth-dropdown">
                            {signInOpen ? (
                                <div className="dropdown-auth">
                                    <Auth isOpen={signInOpen} closeModal={() => setSignInOpen(false)} /> 
                                </div>
                            ) : (
                                <ul className="mobile-ul">
                                    <li onClick={() => setSignInOpen(true)}>SIGN IN</li>
                                    <li onClick={() => setCreateAccountOpen(true)}>CREATE ACCOUNT</li>
                                </ul>)
                            }
                        </div>
                    ) : (
                        <div>
                            <ul className="mobile-ul">
                                <li>
                                    <Link to="/" className="link">
                                        Home
                                    </Link>
                                </li>
                                <li>
                                    <Link to={`/${user.username}`} className="link">
                                        Profile
                                    </Link>
                                </li>
                                <li onClick={logout}>
                                    <Link to="/" className="link">
                                        Sign Out
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    )}
                    <CreateAccount isOpen={createAccountOpen} closeModal={() => setCreateAccountOpen(false)}/>
                </>
            )}

            {openSearch && (
                <div style={{ margin: "0 20px 10px" }}>
                    <SearchBar />
                </div>
            )}
            </div>
        </>
    )      
}