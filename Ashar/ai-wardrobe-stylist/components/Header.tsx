import React from 'react';
import { SparklesIcon } from './icons';

const Header = () => {
  return (
    <header className="bg-[#05060a] border-b border-[#00f5d4]/20 shadow-lg">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex items-center">
        <SparklesIcon className="h-8 w-8 text-[#00f5d4] mr-3"/>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-[#ff3cac] to-[#00f5d4] bg-clip-text text-transparent">HackFashion-AI</h1>
      </div>
    </header>
  );
};

export default Header;
