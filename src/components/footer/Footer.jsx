import { FaFacebook, FaInstagram, FaTiktok, FaYoutube } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import './footer.css'

export default function Footer() {
    return (
        <div className="footer-wrapper">
            <div className="footer-container">
                <div>
                    <div className="footer-main">
                        <p className="footer-content">About</p>
                        <p className="footer-content">Contact</p>
                    </div>
                    <p className="footer-sub">Made in the Philippines using Spotify API.</p>
                </div>
                <div className="footer-socials">
                    <FaFacebook className="socials"/>
                    <FaInstagram className="socials"/>
                    <FaXTwitter className="socials"/>
                    <FaYoutube className="socials"/>
                    <FaTiktok className="socials"/>
                </div>
            </div>
        </div>
    )
}