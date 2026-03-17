import { Routes, Route } from 'react-router-dom';

// Layout
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import MobileNav from './components/layout/MobileNav';

// Pages
import HomePage from './pages/HomePage';
import DateMatchPage from './pages/DateMatchPage';
import BrowsePage from './pages/BrowsePage';
import ListingDetailPage from './pages/ListingDetailPage';
import PostListingPage from './pages/PostListingPage';
import WantedBoardPage from './pages/WantedBoardPage';
import ChatPage from './pages/ChatPage';
import ProfilePage from './pages/ProfilePage';

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/date-match" element={<DateMatchPage />} />
          <Route path="/browse" element={<BrowsePage />} />
          <Route path="/listing/:id" element={<ListingDetailPage />} />
          <Route path="/post" element={<PostListingPage />} />
          <Route path="/wanted" element={<WantedBoardPage />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/profile/:id" element={<ProfilePage />} />
        </Routes>
      </main>

      <Footer />
      <MobileNav />
    </div>
  );
}

export default App;
