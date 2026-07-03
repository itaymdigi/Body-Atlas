import { lazy, Suspense } from "react";
import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Spinner } from "@/components/ui/spinner";
import NotFound from "@/pages/not-found";
import { AppLayout } from "@/components/layout";
import { ErrorBoundary } from "@/components/error-boundary";

// Pages
import Dashboard from "@/pages/dashboard";
import Layers from "@/pages/layers";
import Elements from "@/pages/elements";
import VitalZones from "@/pages/vital-zones";
import PatientsList from "@/pages/patients/index";
import PatientDetail from "@/pages/patients/[id]";
import NewPainRecord from "@/pages/pain-record/new";
import Treatment from "@/pages/treatment";
import AIGuide from "@/pages/ai-guide";
import Pause from "@/pages/pause";
import Progress from "@/pages/progress";
import Disclaimer from "@/pages/disclaimer";
import Programs from "@/pages/programs";
import Profile from "@/pages/profile";

// Lazy-loaded: pulls in three.js / @react-three, kept out of the main bundle.
const FootModel = lazy(() => import("@/pages/foot-model"));

const queryClient = new QueryClient();

function RouteFallback() {
  return (
    <div className="flex items-center justify-center py-24">
      <Spinner className="size-8 text-primary" />
    </div>
  );
}

function Router() {
  return (
    <AppLayout>
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/foot-model">
          <Suspense fallback={<RouteFallback />}>
            <FootModel />
          </Suspense>
        </Route>
        <Route path="/layers" component={Layers} />
        <Route path="/elements" component={Elements} />
        <Route path="/vital-zones" component={VitalZones} />
        <Route path="/patients" component={PatientsList} />
        <Route path="/patients/:id" component={PatientDetail} />
        <Route path="/pain-record/new" component={NewPainRecord} />
        <Route path="/treatment" component={Treatment} />
        <Route path="/ai-guide" component={AIGuide} />
        <Route path="/pause" component={Pause} />
        <Route path="/progress" component={Progress} />
        <Route path="/disclaimer" component={Disclaimer} />
        <Route path="/programs" component={Programs} />
        <Route path="/profile" component={Profile} />
        <Route component={NotFound} />
      </Switch>
    </AppLayout>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Router />
          </WouterRouter>
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
