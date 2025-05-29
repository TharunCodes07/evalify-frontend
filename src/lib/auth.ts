import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import "next-auth/jwt";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface User {
    id: string;
    name: string;
    email: string;
    profileId: string;
    role: string;
    phoneNumber: string;
    image?: string;
    isActive: boolean;
    accessToken?: string;
  }

  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      profileId: string;
      role: string;
      phoneNumber: string;
      image?: string;
      isActive: boolean;
    };
    accessToken?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    refreshToken?: string;
    role?: string;
    profileId?: string;
    phoneNumber?: string;
    isActive?: boolean;
    exp?: number;
  }
}

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "your-email@example.com",
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "Enter your password",
        },
      },
      authorize: async (credentials) => {
        const email = credentials.email as string | undefined;
        const password = credentials.password as string | undefined;

        if (!email || !password) {
          throw new Error("Please provide both email and password");
        }

        try {
          const response = await fetch(`${BACKEND_URL}/api/auth/login`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email,
              password,
            }),
          });

          const data = await response.json();

          if (!response.ok || !data.success) {
            throw new Error(data.message || "Authentication failed");
          }

          const { token, user } = data.data;

          const userData = {
            id: user.id,
            name: user.name,
            email: user.email,
            profileId: user.profileId,
            role: user.role,
            phoneNumber: user.phoneNumber,
            image: user.image,
            isActive: user.isActive,
            accessToken: token,
          };

          return userData;
        } catch (error) {
          console.error("Authentication error:", error);
          throw new Error(
            error instanceof Error ? error.message : "Authentication failed"
          );
        }
      },
    }),
  ],
  pages: {
    signIn: "/login"
  },
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60,
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (account && user) {
        return {
          ...token,
          accessToken: user.accessToken,
          role: user.role,
          profileId: user.profileId,
          phoneNumber: user.phoneNumber,
          isActive: user.isActive,
        };
      }

      if (Date.now() < (token.exp as number) * 1000) {
        return token;
      }

      return await refreshAccessToken(token);
    },

    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub!;
        session.user.role = token.role as string;
        session.user.profileId = token.profileId as string;
        session.user.phoneNumber = token.phoneNumber as string;
        session.user.isActive = token.isActive as boolean;
        session.accessToken = token.accessToken as string;
      }
      return session;
    },
  },
});

async function refreshAccessToken(token: JWT) {
  try {
    const response = await fetch(`${BACKEND_URL}/api/auth/refresh-token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token.accessToken}`,
      },
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.message || "Token refresh failed");
    }

    return {
      ...token,
      accessToken: data.data.token,
      exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60,
    };
  } catch (error) {
    console.error("Error refreshing access token:", error);

    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
}

export async function registerUser(userData: {
  name: string;
  email: string;
  profileId: string;
  password: string;
  phoneNumber: string;
  role?: string;
}) {
  try {
    const response = await fetch(`${BACKEND_URL}/api/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...userData,
        role: userData.role || "STUDENT",
      }),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.message || "Registration failed");
    }

    return data;
  } catch (error) {
    console.error("Registration error:", error);
    throw error;
  }
}

export async function changePassword(
  currentPassword: string,
  newPassword: string,
  accessToken: string
) {
  try {
    const response = await fetch(`${BACKEND_URL}/api/auth/change-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        currentPassword,
        newPassword,
      }),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.message || "Password change failed");
    }

    return data;
  } catch (error) {
    console.error("Password change error:", error);
    throw error;
  }
}

export async function getCurrentUser(accessToken: string) {
  try {
    const response = await fetch(`${BACKEND_URL}/api/auth/me`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.message || "Failed to get user info");
    }

    return data.data;
  } catch (error) {
    console.error("Get current user error:", error);
    throw error;
  }
}
