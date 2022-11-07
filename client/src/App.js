import React from 'react';
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import DataUpload from './pages/DataUpload';
import Analysis from './pages/Analysis';
import UniVarA from './pages/Univariable';
import BivA from './pages/Bivariable';
import Randomization from './pages/Randomization';
import Model from './pages/Model';
import MultiA from './pages/MultiA';
import Export from './pages/Export';
import Navbar from './components/Navbar';
import DataCleaning from './pages/DataCleaning';

const UserContext = React.createContext(null);

export default function App() {
  const [rawDataChanged, setRawDataChanged] = React.useState(false);
  const [resChanged, setResChanged] = React.useState(false);
  return (
    <div className="bg-gray-300 min-h-screen ">
      <Navbar />
      <UserContext.Provider value = {[rawDataChanged, setRawDataChanged, resChanged, setResChanged]}>
        <Routes>
          <Route path="" element={<Analysis><DataUpload /></Analysis>} />
          <Route path="/DataCleaning" element={<Analysis><DataCleaning /></Analysis>} />
          <Route path="/Univariable" element={<Analysis><UniVarA /></Analysis>} />
          <Route path="/Bivariable" element={<Analysis><BivA /></Analysis>} />
          <Route path="/MultiA" element={<Analysis><MultiA /></Analysis>} />
          <Route path="/Randomization" element={<Analysis><Randomization /></Analysis>} />
          <Route path="/Model" element={<Analysis><Model /></Analysis>} />
          <Route path="/Export" element={<Analysis><Export /></Analysis>} />
        </Routes>
      </UserContext.Provider>
    </div>
  )
};

export {UserContext};