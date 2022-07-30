import Navbar from './Navbar';

const MainLayout = ({ children }) => {
  return (
    <>
      <Navbar />
      <main className='container'>{children}</main>
    </>
  );
};

export default MainLayout;
