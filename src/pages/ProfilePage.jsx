import PageLayout from "../components/layouts/PageLayout";
import PopularAlbmusWk from "../components/main/PopularAlbumsWk";
import ReviewandNew from "../components/main/ReviewandNew";
import Profile from "../components/profile/Profile";
import { TrackDataProvider } from "../context/TrackDataContext";
import './page.css'

export default function ProfilePage() {
    return (
        <TrackDataProvider>
            <PageLayout>
                <Profile />
            </PageLayout>
        </TrackDataProvider>
    )
}