import React from 'react';

const Footer = () => {
  return (
    <footer className="p-4 flex justify-center">
      <div className="text-center">
        <p>&copy; {new Date().getFullYear()} Task App.</p>
      </div>
    </footer>
  );
};

export default Footer; 