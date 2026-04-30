import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import GuidedFlow from './pages/GuidedFlow';
import CandidateExplorer from './pages/CandidateExplorer';
import Timeline from './pages/Timeline';
import PollingBooth from './pages/PollingBooth';
import ScenarioAssistant from './pages/ScenarioAssistant';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="guided-flow" element={<GuidedFlow />} />
          <Route path="candidates" element={<CandidateExplorer />} />
          <Route path="timeline" element={<Timeline />} />
          <Route path="polling-booth" element={<PollingBooth />} />
          <Route path="scenarios" element={<ScenarioAssistant />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
