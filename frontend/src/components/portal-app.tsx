"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Clock3, Loader2, LogOut, RefreshCw, ShieldCheck, Sparkles, UserRound } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type User = {
  id: string;
  email: string;
  full_name: string;
  created_at: string;
};

type AuthState = {
  fullName: string;
  email: string;
  password: string;
};

const initialAuthState: AuthState = {
  fullName: "",
  email: "",
  password: "",
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";
const TOKEN_KEY = "internship_portal_token";
const FIRST_VISIT_NOTICE_KEY = "internship_portal_first_visit_notice_seen";

export default function PortalApp() {
  const [activeTab, setActiveTab] = useState("login");
  const [loginState, setLoginState] = useState<AuthState>(initialAuthState);
  const [signupState, setSignupState] = useState<AuthState>(initialAuthState);
  const [token, setToken] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loadingUser, setLoadingUser] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showWakeUpNotice, setShowWakeUpNotice] = useState(false);
  const [secondsUntilReload, setSecondsUntilReload] = useState(60);

  const loggedIn = useMemo(() => Boolean(token && currentUser), [token, currentUser]);

  useEffect(() => {
    const storedToken = window.localStorage.getItem(TOKEN_KEY);
    if (!storedToken) {
      return;
    }

    void fetchCurrentUser(storedToken);
  }, []);

  useEffect(() => {
    const alreadyShown = window.localStorage.getItem(FIRST_VISIT_NOTICE_KEY);
    if (alreadyShown) {
      return;
    }

    setShowWakeUpNotice(true);
    window.localStorage.setItem(FIRST_VISIT_NOTICE_KEY, "true");
  }, []);

  useEffect(() => {
    if (!showWakeUpNotice || secondsUntilReload <= 0) {
      return;
    }

    const timer = window.setInterval(() => {
      setSecondsUntilReload((previous) => Math.max(previous - 1, 0));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [showWakeUpNotice, secondsUntilReload]);

  async function fetchCurrentUser(authToken: string) {
    try {
      setLoadingUser(true);
      const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (!response.ok) {
        throw new Error("Session expired. Please log in again.");
      }

      const user = (await response.json()) as User;
      setToken(authToken);
      setCurrentUser(user);
      setError(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unable to load user profile";
      setError(message);
      setToken(null);
      setCurrentUser(null);
      window.localStorage.removeItem(TOKEN_KEY);
    } finally {
      setLoadingUser(false);
    }
  }

  async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: loginState.email,
          password: loginState.password,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detail ?? "Login failed");
      }

      const newToken = data.access_token as string;
      window.localStorage.setItem(TOKEN_KEY, newToken);
      setToken(newToken);
      await fetchCurrentUser(newToken);
      setLoginState(initialAuthState);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Login failed";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleSignup(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          full_name: signupState.fullName,
          email: signupState.email,
          password: signupState.password,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detail ?? "Signup failed");
      }

      const newToken = data.access_token as string;
      window.localStorage.setItem(TOKEN_KEY, newToken);
      setToken(newToken);
      await fetchCurrentUser(newToken);
      setSignupState(initialAuthState);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Signup failed";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  }

  function logout() {
    setToken(null);
    setCurrentUser(null);
    setError(null);
    window.localStorage.removeItem(TOKEN_KEY);
  }

  return (
    <div className="relative isolate min-h-screen overflow-hidden bg-[var(--page-bg)] px-6 py-12 text-[var(--slate-900)]">
      <div className="pointer-events-none absolute inset-0">
        <div className="orb orb-a" />
        <div className="orb orb-b" />
        <div className="orb orb-c" />
      </div>

      <main className="relative mx-auto grid w-full max-w-6xl gap-8 lg:grid-cols-[1.2fr_1fr]">
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-6"
        >
          {showWakeUpNotice && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="rounded-2xl border border-[var(--amber-300)] bg-[linear-gradient(135deg,#fff7e8_0%,#ffe8be_100%)] p-4 shadow-sm"
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-[var(--amber-900)]">
                  <Clock3 className="h-5 w-5" />
                </div>
                <div className="flex-1 space-y-2">
                  <p className="text-sm font-semibold text-[var(--amber-900)]">Backend Warm-up Notice</p>
                  <p className="text-sm text-[var(--amber-900)]/90">
                    First visit may be slow because the Render backend can sleep when idle. If login/signup does not respond,
                    wait 1 minute and reload this page.
                  </p>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-md bg-white px-2.5 py-1 text-xs font-medium text-[var(--amber-900)]">
                      Reload in about {secondsUntilReload}s
                    </span>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      className="border-[var(--amber-300)] bg-white text-[var(--amber-900)] hover:bg-[var(--amber-50)]"
                      onClick={() => window.location.reload()}
                    >
                      <RefreshCw className="h-4 w-4" />
                      Reload now
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      className="text-[var(--amber-900)] hover:bg-white/60"
                      onClick={() => setShowWakeUpNotice(false)}
                    >
                      Dismiss
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          <Badge className="w-fit" variant="secondary">
            Internship Assignment Portal
          </Badge>
          <h1 className="text-balance text-4xl font-semibold leading-tight md:text-6xl">
            A production-grade Full Stack starter with secure JWT auth.
          </h1>
          <p className="max-w-2xl text-lg text-[var(--slate-700)]">
            Built with Next.js, FastAPI, MongoDB Atlas, and a polished shadcn-style interface.
            Includes signup/login, protected user profile, and modern motion design.
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            <FeatureCard
              icon={<ShieldCheck className="h-5 w-5" />}
              title="JWT secured APIs"
              text="Token-based auth with protected endpoints and role-ready backend architecture."
            />
            <FeatureCard
              icon={<Sparkles className="h-5 w-5" />}
              title="Modern animated UI"
              text="Intentional visual hierarchy, gradient atmosphere, and smooth transitions."
            />
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>{loggedIn ? "Welcome Back" : "Get Started"}</CardTitle>
              <CardDescription>
                {loggedIn
                  ? "You are authenticated. Your profile below is loaded from a protected FastAPI route."
                  : "Create your account or log in to verify real authentication end to end."}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {error && (
                <Alert>
                  <AlertTitle>Action Required</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {loadingUser ? (
                <div className="flex items-center gap-2 rounded-md bg-[var(--slate-100)] p-3 text-sm">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Validating session...
                </div>
              ) : loggedIn && currentUser ? (
                <div className="space-y-4">
                  <div className="rounded-xl border border-[var(--slate-200)] bg-white p-4">
                    <div className="flex items-center justify-between gap-4">
                      <div className="space-y-1">
                        <p className="text-sm text-[var(--slate-600)]">Authenticated User</p>
                        <p className="text-xl font-semibold">{currentUser.full_name}</p>
                      </div>
                      <CheckCircle2 className="h-6 w-6 text-[var(--brand-600)]" />
                    </div>
                    <Separator className="my-4" />
                    <div className="space-y-1 text-sm text-[var(--slate-700)]">
                      <p>Email: {currentUser.email}</p>
                      <p>Database User ID: {currentUser.id}</p>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full" onClick={logout}>
                    <LogOut className="h-4 w-4" />
                    Logout
                  </Button>
                </div>
              ) : (
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="login">Login</TabsTrigger>
                    <TabsTrigger value="signup">Signup</TabsTrigger>
                  </TabsList>

                  <TabsContent value="login">
                    <form className="space-y-4" onSubmit={handleLogin}>
                      <FormField
                        id="login-email"
                        label="Email"
                        type="email"
                        placeholder="you@example.com"
                        value={loginState.email}
                        onChange={(value) =>
                          setLoginState((prev) => ({
                            ...prev,
                            email: value,
                          }))
                        }
                      />
                      <FormField
                        id="login-password"
                        label="Password"
                        type="password"
                        placeholder="Enter your password"
                        value={loginState.password}
                        onChange={(value) =>
                          setLoginState((prev) => ({
                            ...prev,
                            password: value,
                          }))
                        }
                      />
                      <Button type="submit" className="w-full" disabled={submitting}>
                        {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserRound className="h-4 w-4" />}
                        Sign in
                      </Button>
                    </form>
                  </TabsContent>

                  <TabsContent value="signup">
                    <form className="space-y-4" onSubmit={handleSignup}>
                      <FormField
                        id="signup-name"
                        label="Full Name"
                        type="text"
                        placeholder="Amrita Ghosh"
                        value={signupState.fullName}
                        onChange={(value) =>
                          setSignupState((prev) => ({
                            ...prev,
                            fullName: value,
                          }))
                        }
                      />
                      <FormField
                        id="signup-email"
                        label="Email"
                        type="email"
                        placeholder="you@example.com"
                        value={signupState.email}
                        onChange={(value) =>
                          setSignupState((prev) => ({
                            ...prev,
                            email: value,
                          }))
                        }
                      />
                      <FormField
                        id="signup-password"
                        label="Password"
                        type="password"
                        placeholder="Minimum 8 characters"
                        value={signupState.password}
                        onChange={(value) =>
                          setSignupState((prev) => ({
                            ...prev,
                            password: value,
                          }))
                        }
                      />
                      <Button type="submit" className="w-full" disabled={submitting}>
                        {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                        Create account
                      </Button>
                    </form>
                  </TabsContent>
                </Tabs>
              )}
            </CardContent>
          </Card>
        </motion.section>
      </main>
    </div>
  );
}

type FormFieldProps = {
  id: string;
  label: string;
  type: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
};

function FormField({ id, label, type, placeholder, value, onChange }: FormFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        required
      />
    </div>
  );
}

type FeatureCardProps = {
  icon: React.ReactNode;
  title: string;
  text: string;
};

function FeatureCard({ icon, title, text }: FeatureCardProps) {
  return (
    <div className="rounded-xl border border-white/70 bg-white/60 p-4 shadow-sm backdrop-blur-sm">
      <div className="mb-2 inline-flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--brand-100)] text-[var(--brand-700)]">
        {icon}
      </div>
      <h3 className="text-base font-semibold">{title}</h3>
      <p className="mt-1 text-sm text-[var(--slate-700)]">{text}</p>
    </div>
  );
}
