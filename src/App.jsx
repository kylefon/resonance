import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './App.css'
import './index.css'
import HomePage from './pages/HomePage'
import AlbumPage from './pages/AlbumPage'
import SearchPage from './pages/SearchPage'
import ArtistPage from './pages/ArtistPage'
import ReviewPage from './pages/ReviewPage'
import ProfilePage from './pages/ProfilePage'
import EditProfilePage from './pages/EditProfilePage'
import { SearchLoader } from './loaders/SearchLoader'
import { PocketProvider } from './context/PocketContext'
import { AccessTokenProvider } from './context/AccessTokenContext'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />
  },
  {
    path: "/album/:albumId",
    element: <AlbumPage />
  },
  {
    path: "/artist/:artistId",
    element: <ArtistPage />
  },
  {
    path: "/search",
    element: <SearchPage />,
    loader: SearchLoader, 
  },
  {
    path: "/:userId",
    element: <ProfilePage />
  },
  {
    path: "/settings",
    element: <EditProfilePage />
  }, 
  {
    path: "/:username/film/:albumId",
    element: <ReviewPage />
  }
])

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <PocketProvider>
        <AccessTokenProvider>
          <RouterProvider router={router} />
        </AccessTokenProvider>
      </PocketProvider>
    </QueryClientProvider>
  )
}

export default App
