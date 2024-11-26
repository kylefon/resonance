import AlbumMain from "../components/album/AlbumMain";
import PageLayout from "../components/layouts/PageLayout";
import { TrackDataProvider } from "../context/TrackDataContext";
import './page.css'

export default function AlbumPage() {
    return (
        <TrackDataProvider>
            <PageLayout>
                <AlbumMain />
            </PageLayout>
        </TrackDataProvider>
    )
}