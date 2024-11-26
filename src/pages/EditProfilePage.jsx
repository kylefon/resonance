import PageLayout from "../components/layouts/PageLayout";
import EditProfile from "../components/profile/EditProfile";
import { TrackDataProvider } from "../context/TrackDataContext";
import './page.css'

export default function EditProfilePage() {
    return (
        <TrackDataProvider>
            <PageLayout>
                <EditProfile />
            </PageLayout>
        </TrackDataProvider>
    )
}