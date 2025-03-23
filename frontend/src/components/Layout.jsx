import Header from './Header';
import Footer from './Footer';

const Layout = ({ children }) => {
  return (
    <div class="flex flex-col">      
      <Header />
      {children}
      <Footer />
    </div>
  );
};

export default Layout;