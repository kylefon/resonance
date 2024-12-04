import { FaChevronDown } from "react-icons/fa"

export default function Avatar({ user, avatarUrl }) {
    return (
      <div className="avatar-container">
        <img src={avatarUrl || 'default-profile.png'} className="logged-profile"/>
        <div className="avatar-info">
          {user.username.toUpperCase()}
          <FaChevronDown className="chevron-down"/>
        </div>
      </div>
    )
  }
