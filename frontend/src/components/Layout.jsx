import Header from './Header';
import Footer from './Footer';
import { memo } from 'react';

const Layout = ({ children }) => {
  return (
    <div className="flex flex-col">      
      <Header />
      {children}
      <Footer />
    </div>
  );
};

export default memo(Layout);