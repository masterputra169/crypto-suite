// src/components/templates/MainLayout.jsx

import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../organisms/Sidebar';

const MainLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <Sidebar 
        onSidebarToggle={setIsSidebarOpen}
      />

      {/* Main Content */}
      <main 
        className={`transition-all duration-700 ease-in-out ${
          isSidebarOpen ? 'lg:ml-64' : 'lg:ml-20'
        }`}
      >
        <div className="min-h-screen">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default MainLayout;