import { SignedIn, SignedOut } from '@clerk/clerk-react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ClerkTokenBridge from './components/ClerkTokenBridge';
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

function ProtectedApp() {
  return (
    <>
      <SignedIn>
        <AppLayout />
      </SignedIn>
      <SignedOut>
        <Navigate to="/login" replace />
      </SignedOut>
    </>
  );
}

function PublicOnly({ children }) {
  return (
    <>
      <SignedIn>
        <Navigate to="/" replace />
      </SignedIn>
      <SignedOut>{children}</SignedOut>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <ClerkTokenBridge />
      <Routes>
        <Route
          path="/login/*"
          element={(
            <PublicOnly>
              <Login />
            </PublicOnly>
          )}
        />
        <Route
          path="/register/*"
          element={(
            <PublicOnly>
              <Register />
            </PublicOnly>
          )}
        />

        <Route element={<ProtectedApp />}>
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

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
