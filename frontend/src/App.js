import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Overview from './pages/Overview';
import Members from './pages/Members';
import Transactions from './pages/Transactions';
import Products from './pages/Products';
import RFM from './pages/RFM';
import Notify from './pages/Notify';

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path='/'             element={<Overview />} />
        <Route path='/members'      element={<Members />} />
        <Route path='/transactions' element={<Transactions />} />
        <Route path='/products'     element={<Products />} />
        <Route path='/rfm'          element={<RFM />} />
        <Route path='/notify'       element={<Notify />} />
      </Routes>
    </BrowserRouter>
  );
}