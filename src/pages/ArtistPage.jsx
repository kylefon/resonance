import ArtistMain from "../components/artist/ArtistMain";
import PageLayout from "../components/layouts/PageLayout";
import { AlbumDataProvider } from "../context/AlbumDataContext";
import { ArtistDataProvider } from "../context/ArtistDataContext";
import './page.css'

export default function ArtistPage() {
    return (
        <ArtistDataProvider>
            <AlbumDataProvider>
                <PageLayout>
                    <ArtistMain />
                </PageLayout>
            </AlbumDataProvider>
        </ArtistDataProvider>
    )
}