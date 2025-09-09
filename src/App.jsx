import React from 'react';
import { BrowserRouter,Routes,Route } from 'react-router-dom';
import Home from './pages/home';
import Bulk from './pages/bulkpage';
import Manual from './pages/manualpage';
function App() {
  return (
    <div>
      <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/bulk' element={<Bulk/>}/>
        <Route path='/manual' element={<Manual/>}/>
      </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App