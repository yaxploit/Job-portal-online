import { createContext, ReactNode, useContext, useState, useEffect } from "react";
import {
  useMutation,
  UseMutationResult,
  useQueryClient
} from "@tanstack/react-query";
import { insertUserSchema, User } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { 
  initLocalAuth, 
  getCurrentUser, 
  login as localLogin, 
  register as localRegister, 
  logout as localLogout 
} from "../lib/local-auth";

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  error: Error | null;
  loginMutation: UseMutationResult<Omit<User, "password">, Error, LoginData>;
  logoutMutation: UseMutationResult<void, Error, void>;
  registerMutation: UseMutationResult<Omit<User, "password">, Error, RegisterData>;
};

type LoginData = {
  username: string;
  password: string;
};

const registerSchema = insertUserSchema.extend({
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type RegisterData = z.infer<typeof registerSchema>;

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Initialize local auth and check if user is already logged in
  useEffect(() => {
    try {
      initLocalAuth();
      const currentUser = getCurrentUser();
      setUser(currentUser);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginData) => {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const user = localLogin(credentials.username, credentials.password);
      
      if (!user) {
        throw new Error("Invalid username or password");
      }
      
      return user;
    },
    onSuccess: (userData) => {
      setUser(userData);
      queryClient.setQueryData(["/api/user"], userData);
      toast({
        title: "Login successful",
        description: `Welcome back, ${userData.name}!`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (credentials: RegisterData) => {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      try {
        const { confirmPassword, ...userData } = credentials;
        const user = localRegister(userData);
        
        if (!user) {
          throw new Error("Registration failed");
        }
        
        return user;
      } catch (error) {
        throw error;
      }
    },
    onSuccess: (userData) => {
      setUser(userData);
      queryClient.setQueryData(["/api/user"], userData);
      toast({
        title: "Registration successful",
        description: `Welcome to JobNexus, ${userData.name}!`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Registration failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      localLogout();
    },
    onSuccess: () => {
      setUser(null);
      queryClient.setQueryData(["/api/user"], null);
      toast({
        title: "Logged out",
        description: "You have been logged out successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Logout failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        error,
        loginMutation,
        logoutMutation,
        registerMutation,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
