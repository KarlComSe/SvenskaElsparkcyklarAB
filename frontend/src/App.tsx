// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import './App.css'
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
// import LoginPage from './pages/LoginPage';
// import RegisterPage from './pages/RegisterPage';

import Header from './components/Header';
// import LoginOAuth from './pages/LoginOAuth.tsx';
import Github from './pages/Github';
import CustomerStartPage from './pages/CustomerStartPage';
import AdminStartPage from './pages/AdminStartPage';
import UserListPage from './pages/UserListPage';
import UserInfoPage from './pages/UserInfoPage';
import ShowMap from './pages/ShowMap';
import AdminUserOverviewPage from './pages/AdminUserOverviewPage';
import AdminMapNavigation from './pages/AdminMapNavigation';
import AllBikes from './pages/AllBikes'
import AllZones from './pages/AllZones';
import MyRentals from './pages/CustomerHistory';

const App: React.FC = () => {
  return (
    <Router >
      <Header/>
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
