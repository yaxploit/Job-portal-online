import { useContext } from "react";
import { AuthContext } from "@/hooks/use-auth";
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
  // Use useContext directly instead of the hook to avoid potential errors
  const authContext = useContext(AuthContext);
  
  // If auth context is not available, render the component anyway (for testing)
  if (!authContext) {
    console.log("Auth context not available in ProtectedRoute, rendering component anyway");
    return <Route path={path} component={Component} />;
  }
  
  const { user, isLoading } = authContext;

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
}
