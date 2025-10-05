import React from 'react';
import { SparklesIcon } from './icons';

const Header = () => {
  return (
    <header className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex items-center">
        <SparklesIcon className="h-8 w-8 text-indigo-600 mr-3"/>
        <h1 className="text-3xl font-bold text-gray-900">AI Wardrobe Stylist</h1>
      </div>
    </header>
  );
};

export default Header;
