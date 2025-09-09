import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import SubscriberForm from "./components/SubscriberForm";
import UnsubscribeForm from "./components/UnsubscribeForm";
import LandingPage from "./components/LandingPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='*' element={<Navigate to ='/home' replace />} />
        <Route path="/home" element={<LandingPage />} />
        <Route path="/subscribe" element={<SubscriberForm />} />
        <Route path="/unsubscribe" element={<UnsubscribeForm />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;
