import PageLayout from "../components/layouts/PageLayout";
import Review from "../components/review/Review";
import { TrackDataProvider } from "../context/TrackDataContext";
import './page.css'

export default function ReviewPage() {
    return (
        <TrackDataProvider>
            <PageLayout>
                <Review />
            </PageLayout>
        </TrackDataProvider>
    )
}