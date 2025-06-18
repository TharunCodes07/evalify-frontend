// "use client";

// import { useState } from "react";
// import { signIn } from "next-auth/react";
// import { useRouter } from "next/navigation";
// import Link from "next/link";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Alert } from "@/components/ui/alert";
// import { AlertCircle, Eye, EyeOff, LogIn, Loader2 } from "lucide-react";

// export default function LoginPage() {
//   const [formData, setFormData] = useState({
//     email: "",
//     password: "",
//   });
//   const [error, setError] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);
//   const router = useRouter();

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError("");
//     setIsLoading(true);

//     try {
//       const result = await signIn("credentials", {
//         email: formData.email,
//         password: formData.password,
//         redirect: false,
//       });
//       if (result?.error) {
//         setError(result.error);
//       } else {
//         router.push("/dashboard");
//       }
//     } catch (error) {
//       setError(`An unexpected error occurred. Please try again. ${error}`);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-background flex items-center justify-center p-4">
//       <div className="w-full max-w-md space-y-6">
//         <div className="text-center space-y-2">
//           <h1 className="text-3xl font-bold tracking-tight text-foreground">
//             Welcome back
//           </h1>
//           <p className="text-muted-foreground">
//             Sign in to your DevLabs account
//           </p>
//         </div>
//         <Card className="border-border/50 shadow-2xl bg-card/50 backdrop-blur-sm">
//           <CardHeader className="space-y-1 pb-4">
//             <CardTitle className="text-xl font-semibold">Sign in</CardTitle>
//             <CardDescription>
//               Enter your credentials to access your account
//             </CardDescription>
//           </CardHeader>
//           <CardContent className="space-y-4">
//             {error && (
//               <Alert
//                 variant="destructive"
//                 className="border-destructive/50 bg-destructive/10"
//               >
//                 <AlertCircle className="h-4 w-4" />
//                 <span>{error}</span>
//               </Alert>
//             )}

//             <form onSubmit={handleSubmit} className="space-y-4">
//               <div className="space-y-2">
//                 <label
//                   htmlFor="email"
//                   className="text-sm font-medium text-foreground"
//                 >
//                   Email address
//                 </label>
//                 <Input
//                   id="email"
//                   name="email"
//                   type="email"
//                   autoComplete="email"
//                   required
//                   placeholder="Enter your email"
//                   value={formData.email}
//                   onChange={handleChange}
//                   className="h-11 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
//                 />
//               </div>

//               <div className="space-y-2">
//                 <label
//                   htmlFor="password"
//                   className="text-sm font-medium text-foreground"
//                 >
//                   Password
//                 </label>
//                 <div className="relative">
//                   <Input
//                     id="password"
//                     name="password"
//                     type={showPassword ? "text" : "password"}
//                     autoComplete="current-password"
//                     required
//                     placeholder="Enter your password"
//                     value={formData.password}
//                     onChange={handleChange}
//                     className="h-11 pr-10 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
//                   />
//                   <Button
//                     type="button"
//                     variant="ghost"
//                     size="sm"
//                     className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
//                     onClick={() => setShowPassword(!showPassword)}
//                   >
//                     {showPassword ? (
//                       <EyeOff className="h-4 w-4 text-muted-foreground" />
//                     ) : (
//                       <Eye className="h-4 w-4 text-muted-foreground" />
//                     )}
//                   </Button>
//                 </div>
//               </div>

//               <div className="flex items-center justify-end">
//                 <Link
//                   href="/auth/forgot-password"
//                   className="text-sm text-primary hover:text-primary/80 transition-colors"
//                 >
//                   Forgot password?
//                 </Link>
//               </div>

//               <Button
//                 type="submit"
//                 disabled={isLoading}
//                 className="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-medium transition-all duration-200 disabled:opacity-50"
//               >
//                 {isLoading ? (
//                   <>
//                     <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                     Signing in...
//                   </>
//                 ) : (
//                   <>
//                     <LogIn className="mr-2 h-4 w-4" />
//                     Sign in
//                   </>
//                 )}
//               </Button>
//             </form>
//           </CardContent>
//         </Card>
//         {/* Register Link */}
//         <div className="text-center">
//           <p className="text-sm text-muted-foreground">
//             Don&apos;t have an account?
//             <Link
//               href="/auth/register"
//               className="text-primary hover:text-primary/80 font-medium transition-colors ml-1"
//             >
//               Sign up
//             </Link>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import { Button } from "@/components/ui/button";
import { signIn, signOut, useSession } from "next-auth/react";
import { ArrowLeft, Shield, Zap } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function SignIn() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    if (status === "loading") return;

    if (session?.user && !isRedirecting) {
      setIsRedirecting(true);
      setTimeout(() => {
        router.push("/dashboard");
      }, 2000);
    }
  }, [session, status, router, isRedirecting]);

  if (session?.user) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden transition-all duration-500 bg-gradient-to-br from-slate-50 via-white to-gray-100 dark:from-gray-900 dark:via-slate-900 dark:to-black">
      {/* Back to Home Button */}
      <button
        onClick={() => router.push("/")}
        className="fixed top-8 left-8 z-20 p-3 rounded-xl transition-all duration-300 hover:scale-110 bg-black/10 text-black border border-black/20 backdrop-blur-sm hover:bg-black/20 dark:bg-white/10 dark:text-white dark:border-white/20 dark:hover:bg-white/20 shadow-lg flex items-center gap-2"
      >
        <ArrowLeft size={20} />
        <span className="hidden sm:inline font-medium">Home</span>
      </button>

      {/* Floating Geometric Shapes */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute w-16 h-16 rounded-full bg-blue-500/5 dark:bg-blue-500/10 animate-float"
          style={{ top: "15%", left: "15%", animationDelay: "0s" }}
        ></div>
        <div
          className="absolute w-12 h-12 rounded-lg bg-purple-500/5 dark:bg-purple-500/10 animate-float"
          style={{ top: "25%", right: "20%", animationDelay: "0.5s" }}
        ></div>
        <div
          className="absolute w-20 h-20 rounded-full bg-cyan-500/5 dark:bg-cyan-500/10 animate-float"
          style={{ bottom: "25%", left: "10%", animationDelay: "1s" }}
        ></div>
        <div
          className="absolute w-14 h-14 rounded-lg rotate-45 bg-pink-500/5 dark:bg-pink-500/10 animate-float"
          style={{ bottom: "35%", right: "15%", animationDelay: "1.5s" }}
        ></div>
      </div>

      {/* Main Login Card */}
      <div className="relative z-10 w-full max-w-md mx-4 p-8 rounded-3xl shadow-2xl backdrop-blur-sm border transition-all duration-300 bg-white/80 border-gray-200/50 dark:bg-white/5 dark:border-white/10">
        {/* Evalify Logo */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-3 transition-all duration-1000 bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 dark:from-blue-400 dark:via-purple-400 dark:to-cyan-400 bg-clip-text text-transparent">
            Evalify
          </h1>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
            Sign in to your account
          </p>
        </div>

        {/* Login Form */}
        <div className="space-y-6">
          {/* Keycloak Sign In Button */}
          <Button
            onClick={() => signIn("keycloak")}
            className="w-full py-3 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white relative overflow-hidden group"
          >
            <span className="relative z-10 flex items-center justify-center gap-3">
              <Shield size={18} />
              Sign in with Keycloak
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </Button>

          {/* Features */}
          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="p-4 rounded-xl text-center transition-all duration-300 bg-gray-50/80 hover:bg-gray-100/80 dark:bg-white/5 dark:hover:bg-white/10">
              <Shield className="w-6 h-6 mx-auto mb-2 text-blue-600 dark:text-blue-400" />
              <p className="text-xs font-medium text-gray-600 dark:text-gray-300">
                Secure
              </p>
            </div>
            <div className="p-4 rounded-xl text-center transition-all duration-300 bg-gray-50/80 hover:bg-gray-100/80 dark:bg-white/5 dark:hover:bg-white/10">
              <Zap className="w-6 h-6 mx-auto mb-2 text-purple-600 dark:text-purple-400" />
              <p className="text-xs font-medium text-gray-600 dark:text-gray-300">
                Fast
              </p>
            </div>
          </div>

          {/* Debug: Sign Out Button (only show if session exists) */}
          {session && (
            <Button
              onClick={() => signOut()}
              variant="outline"
              className="w-full py-3 text-sm rounded-xl transition-all duration-300 border-gray-300/50 text-gray-700 hover:bg-gray-50 dark:border-white/20 dark:text-gray-300 dark:hover:bg-white/10"
            >
              Sign Out
            </Button>
          )}
        </div>

        {/* Subtle accent dots */}
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute w-1 h-1 rounded-full bg-blue-600/30 dark:bg-blue-400/50 animate-ping"
            style={{
              top: "20px",
              left: "20px",
              animationDelay: "0s",
              animationDuration: "4s",
            }}
          ></div>
          <div
            className="absolute w-1 h-1 rounded-full bg-purple-600/30 dark:bg-purple-400/50 animate-ping"
            style={{
              top: "20px",
              right: "20px",
              animationDelay: "1s",
              animationDuration: "4s",
            }}
          ></div>
          <div
            className="absolute w-1 h-1 rounded-full bg-cyan-600/30 dark:bg-cyan-400/50 animate-ping"
            style={{
              bottom: "20px",
              left: "20px",
              animationDelay: "2s",
              animationDuration: "4s",
            }}
          ></div>
          <div
            className="absolute w-1 h-1 rounded-full bg-blue-600/30 dark:bg-blue-400/50 animate-ping"
            style={{
              bottom: "20px",
              right: "20px",
              animationDelay: "3s",
              animationDuration: "4s",
            }}
          ></div>
        </div>
      </div>

      {/* Background geometric shapes */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div
          className="absolute w-96 h-96 rounded-full blur-3xl bg-blue-500/3 dark:bg-blue-500/5 animate-pulse"
          style={{ top: "10%", left: "10%", animationDelay: "0s" }}
        ></div>
        <div
          className="absolute w-80 h-80 rounded-full blur-3xl bg-purple-500/3 dark:bg-purple-500/5 animate-pulse"
          style={{ bottom: "10%", right: "10%", animationDelay: "1s" }}
        ></div>
      </div>
    </div>
  );
}
