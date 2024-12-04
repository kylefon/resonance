import Footer from "../footer/Footer";
import Navbar from "../navbar/Navbar";
import MobileNavBar from "../navbar/MobileNavBar";
import './pagelayout.css'

export default function PageLayout({ children }) {
    return (
        <div className="page-layout">
            <Navbar />
            <MobileNavBar />
            <main>
                <div className="main-content">
                    {children}
                </div>
            </main>
            <Footer />
        </div>
    )
}