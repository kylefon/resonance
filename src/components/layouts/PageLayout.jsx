import Footer from "../footer/Footer";
import Navbar from "../navbar/Navbar";
import './pagelayout.css'

export default function PageLayout({ children }) {
    return (
        <div className="page-layout">
            <Navbar />
            <main className="main-content">
                {children}
            </main>
            <Footer />
        </div>
    )
}