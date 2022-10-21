import React from 'react';
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import DataUpload from './pages/DataUpload';
import UniVarA from './pages/Univariable';
import BivA from './pages/Bivariable';
import Analysis from './pages/Analysis';
import Navbar from './components/Navbar';
import DataCleaning from './pages/DataCleaning';

export default function App() {
  return (
    <div className="bg-gray-300 min-h-screen ">
      <Navbar />
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
    </div>
  )
};