import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Layout from './components/Layout';
import OnboardingModal from './components/OnboardingModal';
import KeyboardShortcuts from './components/KeyboardShortcuts';
import LoadingSkeleton from './components/LoadingSkeleton';
import { trackPageView } from './utils/analytics';

const Dashboard = lazy(() => import('./pages/Dashboard'));
const GuidedFlow = lazy(() => import('./pages/GuidedFlow'));
const CandidateExplorer = lazy(() => import('./pages/CandidateExplorer'));
const Timeline = lazy(() => import('./pages/Timeline'));
const PollingBooth = lazy(() => import('./pages/PollingBooth'));
const ScenarioAssistant = lazy(() => import('./pages/ScenarioAssistant'));
const NotFound = lazy(() => import('./pages/NotFound'));

function RouteAnalytics() {
  const location = useLocation();
  useEffect(() => {
    trackPageView(location.pathname + location.search);
  }, [location]);
  return null;
}

function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <RouteAnalytics />
      <OnboardingModal />
      <KeyboardShortcuts />
      <Suspense fallback={<LoadingSkeleton />}>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="guided-flow" element={<GuidedFlow />} />
            <Route path="candidates" element={<CandidateExplorer />} />
            <Route path="timeline" element={<Timeline />} />
            <Route path="polling-booth" element={<PollingBooth />} />
            <Route path="scenarios" element={<ScenarioAssistant />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
