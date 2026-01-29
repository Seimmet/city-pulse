
import { useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ArrowRight, Home } from "lucide-react";
import { PublicLayout } from "@/components/layout/PublicLayout";

export function PaymentSuccessPage() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");

  return (
    <PublicLayout>
      <div className="min-h-[80vh] flex items-center justify-center py-20">
        <div className="max-w-md w-full text-center px-6">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-green-600" />
          </div>
          
          <h1 className="font-serif text-4xl font-bold mb-4">Payment Successful!</h1>
          <p className="text-muted-foreground mb-8">
            Thank you for your subscription. You now have full access to all editions in your city.
          </p>
          
          {sessionId && (
            <div className="bg-muted p-4 rounded-lg mb-8 text-xs text-muted-foreground font-mono break-all">
              Session ID: {sessionId}
            </div>
          )}

          <div className="flex flex-col gap-3">
            <Link to="/reader">
              <Button className="w-full" size="lg">
                Go to Dashboard
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link to="/">
              <Button variant="outline" className="w-full">
                <Home className="w-4 h-4 mr-2" />
                Return Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
