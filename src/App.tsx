import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useSerial } from './hooks/useSerial';
import { MainLayout } from './components/layout/MainLayout';
import { Dashboard } from './pages/Overview';
import { Control } from './pages/Control';
import { Mission } from './pages/Mission';
import { Settings } from './pages/Settings';
import { Tools } from './pages/Tools';
import './App.css';

function App() {
  const serial = useSerial();

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout connectionState={serial.connectionState} />}>
          <Route index element={<Dashboard />} />
          <Route path="control" element={<Control />} />
          <Route path="mission" element={<Mission />} />
          <Route path="settings" element={<Settings />} />
          <Route path="tools" element={<Tools />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
