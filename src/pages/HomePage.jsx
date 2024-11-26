import PageLayout from "../components/layouts/PageLayout";
import PopularAlbmusWk from "../components/main/PopularAlbumsWk";
import ReviewandNew from "../components/main/ReviewandNew";
import './page.css'

export default function HomePage() {
    return (
        <PageLayout>
            <PopularAlbmusWk />
            <ReviewandNew />
        </PageLayout>
    )
}