import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import { AppLayout } from "@/components/layout";

// Pages
import Dashboard from "@/pages/dashboard";
import FootModel from "@/pages/foot-model";
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

const queryClient = new QueryClient();

function Router() {
  return (
    <AppLayout>
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/foot-model" component={FootModel} />
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
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
