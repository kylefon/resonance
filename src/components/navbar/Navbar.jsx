import "./navbar.css";
import Auth from "../authentication/Auth";
import SearchBar from "./SearchBar";
import { Link } from "react-router-dom";
import { useRef, useState } from "react";
import { usePocket } from "../../context/PocketContext";
import CreateAccount from "../authentication/CreateAccount";
import Avatar from "./Avatar";

export default function Navbar() { 
  const { user, logout, avatarUrl } = usePocket();
  const [ signIn, setSignIn ] = useState(false);
  const [createAccount, setCreateAccount] = useState(false);
  const [open, setIsOpen] = useState(false);
  const timeoutRef = useRef(null);
  
  const handleSignInOpen = () => setSignIn(true);
  const handleSignInClose = () => setSignIn(false);
  
  const handleCreateOpen = () => setCreateAccount(true);
  const handleCreateClose = () => setCreateAccount(false);

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    setIsOpen(true);
  }

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 500);
  };

  return (
    <nav>
      <div className="nav-bar">
        <div className="nav-container">
          <Link to='/'><img src='/resonance-white.png' className="nav-logo" alt="Logo" /></Link>
          { !user ? 
          <div className="nav-right">
            {!signIn ? 
              <>
                <ul className="nav-buttons">
                  <li onClick={handleSignInOpen}>SIGN IN</li>
                  <li onClick={handleCreateOpen}>CREATE ACCOUNT</li>
                </ul>
                <CreateAccount isOpen={createAccount} closeModal={handleCreateClose}/>
                <SearchBar />
              </>
                : 
                <>
                  <Auth isOpen={signIn} closeModal={handleSignInClose} /> 
                </>
            }
          </div>
            : 
          <div className="logged-nav">
              <div className="user-nav-container" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} >
                <div className="user-nav">
                  <Avatar user={user} avatarUrl={avatarUrl}/>
                </div>
                <div className={`dropdown-menu`} style={{display: open?  "block" : "none"}}>
                  <ul>
                    <li className="tab-icon">
                        <Avatar user={user} avatarUrl={avatarUrl}/>
                    </li>
                    <li className="divider"></li>
                    <li className="dropdown-tab">
                      <Link to='/' className="link">
                        <p className="home-tab">Home</p>
                      </Link>
                    </li>
                    <li className="dropdown-tab">
                      <Link to={`/${user.username}`} className="link"> 
                        <p className="profile-tab">Profile</p>
                      </Link>
                    </li>
                    <li className="dropdown-tab" onClick={logout}>
                      <Link to='/' className="link">
                        <p className="signout-tab">Sign Out</p>
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
              <SearchBar />
          </div>}
        </div>
      </div>
    </nav>
  )
}