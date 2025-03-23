import Header from './Header';
import Navbar from './Navbar';
import Footer from './Footer';

const Layout = ({ children }) => {
  return (
    <div>      
      <Header />
      <Navbar />
      {children}
      <Footer />
    </div>
  );
};

export default Layout;