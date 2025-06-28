// import logo from './logo.svg';
import './App.css';
// import Header from './Component/Header/Header_Logged';
import Header_Unlogged from './Component/Header/Header_nav_unlogin';
import Footer from './Component/Footer';
import CategoryList from './Component/Category/CategoryList';

function App() {
  return (
    <div className="App">

            <Header_Unlogged />
            <CategoryList />
            <Footer />
    </div>
  );
}

export default App;
