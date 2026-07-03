import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-dvh w-full flex items-center justify-center bg-muted/30 p-4">
      <Card className="w-full max-w-md">
        <CardContent className="pt-6">
          <div className="flex mb-4 gap-2 items-center">
            <AlertCircle className="h-8 w-8 text-destructive shrink-0" />
            <h1 className="text-2xl font-bold text-foreground text-balance">הדף לא נמצא</h1>
          </div>

          <p className="mt-4 text-sm text-muted-foreground">
            הדף שחיפשת אינו קיים. חזרו לדף הבית כדי להמשיך.
          </p>
          <Link href="/" className="mt-6 inline-flex h-11 items-center justify-center rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground">
            חזרה לדף הבית
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
