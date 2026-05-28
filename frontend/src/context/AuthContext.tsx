import {
  createContext,
  type ReactNode,
  useContext,
  useMemo,
} from "react";

import { authClient, type User } from "../../lib/auth";


type SignInCredentials = {
  email: string;
  password: string;
};

type SignUpCredentials = {
  name: string;
  email: string;
  password: string;
};

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signIn: (credentials: SignInCredentials) => Promise<void>;
  signUp: (credentials: SignUpCredentials) => Promise<void>;
  signOut: () => Promise<void>;
  otpVerified: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({children}: { children: ReactNode;}) {
  const { data, isPending } = authClient.useSession();

  
  const user = (data?.user as User) ?? null;

  const isAuthenticated = !!user;

  const otpVerified = user?.emailVerified ?? false;



  const signIn = async ({email,password,}: SignInCredentials) => {
    const { error } = await authClient.signIn.email({  email ,  password });

    if (error) {
      throw new Error(error.message || "Failed to sign in");
    }
  };

  const signUp = async ({name,email,password}: SignUpCredentials) => {
    const { error } = await authClient.signUp.email({
      name,
      email,
      password,
    });

    if (error) {
      throw new Error(error.message || "Failed to sign up");
    }
  };

  const signOut = async () => {
    const { error } = await authClient.signOut();

    if (error) {
      throw new Error(error.message || "Failed to sign out");
    }
  };

  const value = useMemo<AuthContextType>(
   () => ({
     user,
     isLoading: isPending,
     isAuthenticated,
     otpVerified,
     signIn,
     signUp,
     signOut,
   }),
    [user, isPending, isAuthenticated]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used within an AuthProvider"
    );
  }

  return context;
}