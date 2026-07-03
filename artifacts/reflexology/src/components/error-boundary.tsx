import { Component, type ErrorInfo, type ReactNode } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  children: ReactNode;
}

interface State {
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Unhandled UI error:", error, info.componentStack);
  }

  render() {
    if (this.state.error) {
      return (
        <div className="min-h-dvh w-full flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl border bg-card p-6 text-center shadow-sm">
            <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h1 className="text-lg font-semibold text-foreground text-balance">
              משהו השתבש
            </h1>
            <p className="mt-2 text-sm text-muted-foreground text-pretty">
              אירעה שגיאה בלתי צפויה. נסו לרענן את העמוד — אם הבעיה חוזרת, בדקו את החיבור לאינטרנט.
            </p>
            <Button
              className="mt-5 h-11 w-full rounded-full"
              onClick={() => {
                this.setState({ error: null });
                window.location.href = "/";
              }}
            >
              חזרה לדף הבית
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
