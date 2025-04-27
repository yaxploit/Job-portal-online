import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";
import { Redirect, Route } from "wouter";

export function ProtectedRoute({
  path,
  component: Component,
  userType,
}: {
  path: string;
  component: () => React.JSX.Element;
  userType?: string;
}) {
  try {
    const { user, isLoading } = useAuth();

    if (isLoading) {
      return (
        <Route path={path}>
          <div className="flex items-center justify-center min-h-screen">
            <Loader2 className="h-8 w-8 animate-spin text-border" />
          </div>
        </Route>
      );
    }

    if (!user) {
      return (
        <Route path={path}>
          <Redirect to="/auth" />
        </Route>
      );
    }

    if (userType && user.userType !== userType) {
      return (
        <Route path={path}>
          <Redirect to={user.userType === "seeker" ? "/dashboard/seeker" : "/dashboard/employer"} />
        </Route>
      );
    }

    return <Route path={path} component={Component} />;
  } catch (error) {
    console.error("Error in ProtectedRoute:", error);
    
    // Fallback to render component in case of auth error
    return <Route path={path} component={Component} />;
  }
}
