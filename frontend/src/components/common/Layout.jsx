import Header from './Header';
import Footer from './Footer';

const Layout = ({ children }) => {
  return (
    <div className="flex flex-col">      
      <Header />
      {children}
      <Footer />
    </div>
  );
};

export default Layout;