// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import './App.css'
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage.tsx';
// import LoginPage from './pages/LoginPage.tsx';
// import RegisterPage from './pages/RegisterPage';
import Header from './components/Header.tsx';
// import LoginOAuth from './pages/LoginOAuth.tsx';
import Github from './pages/Github.tsx';
import CustomerStartPage from './pages/CustomerStartPage.tsx';
import AdminStartPage from './pages/AdminStartPage.tsx';
import UserListPage from './pages/UserListPage.tsx';
import UserInfoPage from './pages/UserInfoPage.tsx';
import ShowMap from './pages/ShowMap.tsx';

const App: React.FC = () => {
  return (
    <Router>
      <Header/>
        <Routes>
          <Route path="/customerstartpage" element={<CustomerStartPage />} />
          <Route path="/adminstartpage" element={<AdminStartPage />} />
          <Route path="/userlistpage" element={<UserListPage />} />
          <Route path="/userinfopage" element={<UserInfoPage />} />
          <Route path="/" element={<HomePage />} />
          <Route path="github/callback" element={<Github/>} />
          <Route path="/map" element={<ShowMap/>} />
        </Routes>
    </Router>
  );
};

export default App
