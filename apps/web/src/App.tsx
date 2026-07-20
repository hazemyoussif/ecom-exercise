import './App.css';
import Builder from './components/Bulider';
import ReviewPanel from './components/ReviewPanel';
import { BundleProvider } from './context/BundleProvider';
import { useBreakpoint } from './hooks/useBreakpoint';
import { useBundle } from './hooks/useBundle';

function BundleBuilderLayout() {
  const breakpoint = useBreakpoint();
  const { error, isLoading, reload } = useBundle();

  if (isLoading) {
    return (
      <main className="main-div" data-breakpoint={breakpoint} aria-busy="true">
        <p role="status">Loading your bundle...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="main-div" data-breakpoint={breakpoint}>
        <section role="alert">
          <p>{error}</p>
          <button type="button" onClick={() => void reload()}>Try again</button>
        </section>
      </main>
    );
  }

  return (
    <main className="main-div" data-breakpoint={breakpoint}>
      <Builder />
      <ReviewPanel />
    </main>
  );
}

function App() {
  return (
    <BundleProvider>
      <BundleBuilderLayout />
    </BundleProvider>
  );
}

export default App;