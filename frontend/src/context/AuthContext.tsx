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

type ForgotPasswordCredentials = {
  token:string;
  newPassword:string;
}

type SignUpCredentials = {
  name: string;
  email: string;
  password: string;
};



export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signIn: (credentials: SignInCredentials) => Promise<any>;
  signUp: (credentials: SignUpCredentials) => Promise<void>;
  resetPassword:(credentials:ForgotPasswordCredentials) => Promise<void>;
  RequestPasswordReset:(email:string)=>Promise<void>;
  signOut: () => Promise<void>;
  otpVerified: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

function AuthProvider({children}: { children: ReactNode;}) {
  const { data, isPending } = authClient.useSession();

  const user = (data?.user as User) ?? null;

  const isAuthenticated = !!user;

  const otpVerified = user?.emailVerified ?? false;

  const signIn = async ({ email, password }: SignInCredentials) => {
    const response = await authClient.signIn.email({
      email,
      password,
    });

    if (response.error) {
      throw new Error(response.error.message);
    }

    return response;
  };

  const RequestPasswordReset = async(email:string)=>{
    try {
      await authClient.requestPasswordReset({
        email,
        redirectTo: window.location.origin + "/reset-password"
      });
    } catch (error) {
      throw new Error((error as Error).message || "Internal Server Error")
    }
  }

  const resetPassword = async({token,newPassword}:ForgotPasswordCredentials)=>{
    try {
      await authClient.resetPassword({
        token,
        newPassword
      })
    } catch (error) {
      throw new Error((error as Error).message || "Failed to reset password");
    }
  }


  const signUp = async ({name,email,password}: SignUpCredentials) => {
    const response = await authClient.signUp.email({
      name,
      email,
      password,
    });
    if (response.error) {
      throw new Error(response.error.message || "Failed to sign up");
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
     resetPassword,
     RequestPasswordReset,
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

export { AuthProvider };

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used within an AuthProvider"
    );
  }

  return context;
}