import { BrowserRouter, Route, Routes } from "react-router-dom";
import SubscriberForm from "./components/SubscriberForm";
import UnsubscribeForm from "./components/UnsubscribeForm";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/subscribe" element={<SubscriberForm />} />
        <Route path="/unsubscribe" element={<UnsubscribeForm />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;
