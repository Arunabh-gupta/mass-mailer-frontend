import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from './layouts/AppLayout';
import Dashboard from './pages/Dashboard';
import Templates from './pages/Templates';
import Campaigns from './pages/Campaigns';
import Contacts from './pages/Contacts';
import ContactFormPage from './pages/ContactFormPage';
import CampaignFormPage from './pages/CampaignFormPage';
import TemplateFormPage from './pages/TemplateFormPage';
import Login from './pages/Login';
import Register from './pages/Register';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected routes with layout */}
        <Route element={<AppLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/templates" element={<Templates />} />
          <Route path="/templates/new" element={<TemplateFormPage />} />
          <Route path="/templates/:templateId/edit" element={<TemplateFormPage />} />
          <Route path="/campaigns" element={<Campaigns />} />
          <Route path="/campaigns/new" element={<CampaignFormPage />} />
          <Route path="/campaigns/:campaignId/edit" element={<CampaignFormPage />} />
          <Route path="/contacts" element={<Contacts />} />
          <Route path="/contacts/new" element={<ContactFormPage />} />
          <Route path="/contacts/:contactId/edit" element={<ContactFormPage />} />
        </Route>

        {/* Catch all - redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
