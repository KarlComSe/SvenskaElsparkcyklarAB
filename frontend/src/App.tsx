import './App.css'
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import Header from './components/Header';
import Github from './pages/Github';
import CustomerStartPage from './pages/user/CustomerStartPage';
import AdminStartPage from './pages/admin/AdminStartPage';
import UserListPage from './pages/admin/UserListPage';
import UserInfoPage from './pages/user/UserInfoPage';
import ShowMap from './pages/admin/ShowMap';
import AdminUserOverviewPage from './pages/admin/AdminUserOverviewPage';
import AdminMapNavigation from './pages/admin/AdminMapNavigation';
import AllBikes from './pages/admin/AllBikes'
import AllZones from './pages/admin/AllZones';
import { ToastContainer } from 'react-toastify';
import MyRentals from './pages/user/CustomerHistory';

const App: React.FC = () => {
  return (
    <Router >
      <Header/>
      <ToastContainer/>
        <Routes>
        
          <Route path="/customerstartpage" element={<CustomerStartPage />} />
          <Route path="/adminstartpage" element={<AdminStartPage />} />
          <Route path="/userlistpage" element={<UserListPage />} />
          <Route path="/userinfopage" element={<UserInfoPage />} />
          <Route path="/" element={<HomePage />} />
          <Route path="github/callback" element={<Github/>} />
          <Route path="/map/:city" element={<ShowMap/>} />
          <Route path="/user/:githubId" element={<AdminUserOverviewPage />} />
          <Route path="/adminmapnavigation" element={<AdminMapNavigation />} />
          <Route path="/allbikes" element={<AllBikes />} />
          <Route path="/allzones" element={<AllZones />} />
          <Route path="/history" element={<MyRentals />} />
        </Routes>
        <div data-testid="app-test"></div>
    </Router>
  );
};

export default App
