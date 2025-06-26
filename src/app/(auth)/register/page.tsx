"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import {
  CheckCircle,
  User,
  Mail,
  Phone,
  UserPlus,
  Loader2,
} from "lucide-react";
import userQueries from "@/repo/user-queries/user-queries";
import { determineUserRole } from "@/lib/utils/user-verification";
import { RegistrationGuard } from "@/components/auth/AuthGuard";

interface RegistrationFormData {
  name: string;
  email: string;
  phoneNumber: string;
}

export default function RegisterPage() {
  return (
    <RegistrationGuard>
      <RegisterPageContent />
    </RegistrationGuard>
  );
}

function RegisterPageContent() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const { success, error: toastError } = useToast();

  const [formData, setFormData] = useState<RegistrationFormData>({
    name: "",
    email: "",
    phoneNumber: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const { data: userExistsData, isLoading: checkingUser } = useQuery({
    queryKey: ["checkUserExists", session?.user?.email],
    queryFn: () => userQueries.checkUserExists(session?.user?.email || ""),
    enabled: !!session?.user?.email,
  });
  const registerMutation = useMutation({
    mutationFn: userQueries.createKeycloakUser,
    onSuccess: async () => {
      success(
        "Registration completed successfully! Redirecting to dashboard..."
      );
      try {
        await update({ needsRegistration: false });
        setTimeout(() => {
          router.push("/dashboard");
        }, 1000);
      } catch (error) {
        console.error("Failed to update session:", error);
        setTimeout(() => {
          router.push("/dashboard");
        }, 1000);
      }
    },
    onError: (err: Error) => {
      toastError(err.message || "Registration failed. Please try again.");
      setIsLoading(false);
    },
  });
  useEffect(() => {
    if (session?.user) {
      setFormData({
        name: session.user.name || "",
        email: session.user.email || "",
        phoneNumber: "",
      });
    }
  }, [session]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  // Redirect if user already exists
  useEffect(() => {
    if (userExistsData?.exists) {
      router.push("/dashboard");
    }
  }, [userExistsData, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!session?.user?.id || !session?.user?.roles) {
      toastError("Session data is incomplete. Please try logging in again.");
      return;
    }

    if (!formData.phoneNumber.trim()) {
      toastError("Phone number is required.");
      return;
    }

    setIsLoading(true);

    try {
      const primaryRole = determineUserRole(
        session.user.roles,
        session.user.groups
      );
      await registerMutation.mutateAsync({
        email: formData.email,
        name: formData.name,
        role: primaryRole,
        phoneNumber: formData.phoneNumber,
      });
    } catch {
      // Error handling is done in mutation onError
    }
  };

  // Loading states
  if (status === "loading" || checkingUser) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center space-y-4 pt-6">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2 text-center">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-4 w-32" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // User not authenticated
  if (status === "unauthenticated") {
    return null;
  }

  // User already exists
  if (userExistsData?.exists) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-lg space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-xl mx-auto mb-4">
            <UserPlus className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Complete Registration
          </h1>
          <p className="text-muted-foreground">
            Review your details and complete your DevLabs registration
          </p>
        </div>

        <Card className="border-border/50 shadow-2xl bg-card/50 backdrop-blur-sm">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-xl font-semibold">
              Account Information
            </CardTitle>
            <CardDescription>
              Please review and complete your account details
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Info Alert */}
            <Alert className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950">
              <CheckCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <AlertDescription className="text-blue-800 dark:text-blue-200">
                Your account details have been retrieved from Keycloak. Please
                review and add any missing information.
              </AlertDescription>
            </Alert>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                {/* Full Name - Read Only */}
                <div className="space-y-2">
                  <label
                    htmlFor="name"
                    className="text-sm font-medium text-foreground flex items-center gap-2"
                  >
                    <User className="h-4 w-4" />
                    Full Name
                  </label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    readOnly
                    className="h-11 bg-muted/50 cursor-not-allowed"
                  />
                </div>

                {/* Email - Read Only */}
                <div className="space-y-2">
                  <label
                    htmlFor="email"
                    className="text-sm font-medium text-foreground flex items-center gap-2"
                  >
                    <Mail className="h-4 w-4" />
                    Email Address
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    readOnly
                    className="h-11 bg-muted/50 cursor-not-allowed"
                  />
                </div>

                {/* Phone Number - Editable */}
                <div className="space-y-2">
                  <label
                    htmlFor="phoneNumber"
                    className="text-sm font-medium text-foreground flex items-center gap-2"
                  >
                    <Phone className="h-4 w-4" />
                    Phone Number *
                  </label>
                  <Input
                    id="phoneNumber"
                    name="phoneNumber"
                    type="tel"
                    autoComplete="tel"
                    required
                    placeholder="Enter your phone number"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    className="h-11 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading || registerMutation.isPending}
                className="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-medium transition-all duration-200 disabled:opacity-50 mt-6"
              >
                {isLoading || registerMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Completing Registration...
                  </>
                ) : (
                  <>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Complete Registration
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Having trouble? Contact your system administrator for assistance.
          </p>
        </div>
      </div>
    </div>
  );
}
