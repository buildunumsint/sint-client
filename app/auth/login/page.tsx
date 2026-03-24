"use client";

import { apiUrl } from "@/lib/constants";
import { useAuthContext } from "@/context/AuthContext";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import * as yup from "yup";
import { useFormik } from "formik";
import { useMutation } from "@tanstack/react-query";
import { createApiClient } from "@/services/apiClient";
import { toast } from "sonner";
import { parseArray } from "@/lib/formatters";
import { staticPaths } from "@/lib/constants/paths";

type LoginData = {
  email_or_phone: string;
  password: string;
}
export default function LoginPage() {
  const router = useRouter();
  const { updateValues } = useAuthContext();

  const googleLoginUrl = apiUrl ? `${apiUrl}/auth/login/google` : "";
  const apiClient = createApiClient()

  const loginMut = useMutation({
    mutationKey: ["login"],
    mutationFn: (data: LoginData) => apiClient.post("/auth/login", data),
    onSuccess: (data) => {
      console.log(data);
      if (!data?.status || !data?.data) {
        toast.error(data?.message.length > 100 ? "Unable to login. Please try again." : data?.message);
        return;
      }
      toast.success(data?.message || "Login successful");

      updateValues({
        session_id: data?.data?.session_id ?? "",
        access_token: data?.data?.access_token ?? "",
        refresh_token: data?.data?.refresh_token ?? "",
        access_token_expires_at: data?.data?.access_token_expires_at ?? "",
        refresh_token_expires_at: data?.data?.refresh_token_expires_at ?? "",
        user: {
          user_id: data?.data?.user?.user_id ?? "",
          first_name: data?.data?.user?.first_name ?? "",
          last_name: data?.data?.user?.last_name ?? "",
          gender: data?.data?.user?.gender ?? "",
          date_of_birth: data?.data?.user?.date_of_birth ?? "",
          email: data?.data?.user?.email ?? "",
          phone: data?.data?.user?.phone ?? "",
          address: "",
          is_active: true,
          user_roles: parseArray(data?.data?.user?.user_roles),
          parish_memberships: parseArray(data?.data?.user?.parish_memberships),
        },
      });
      router.push(staticPaths.DASHBOARD_PATHS.home);
    },
    onError: (error) => {
      toast.error("Login failed");
    },
  });

  const formik = useFormik(
    {

      initialValues: {
        email_or_phone: "",
        password: "",
      },
      validationSchema: yup.object({
        email_or_phone: yup.string().email("Invalid email address").required("Email or phone is required"),
        password: yup.string().required("Password is required"),
      }),
      onSubmit: (values) => {


        loginMut.mutate({ email_or_phone: values.email_or_phone, password: values.password });
        // try {
        //   const res = await fetch(`${apiUrl}/auth/login`, {
        //     method: "POST",
        //     headers: {
        //       Accept: "application/json",
        //       "Content-Type": "application/json",
        //     },
        //     body: JSON.stringify({ email: safeEmail, password: values.password }),
        //   });

        //   const contentType = res.headers.get("content-type") ?? "";
        //   if (!contentType.toLowerCase().includes("application/json")) {
        //     throw new Error("Login failed. Server returned an unexpected response.");
        //   }

        //   const json = (await res.json()) as CredentialsLoginResponse;
        //   if (!res.ok) {
        //     const msg =
        //       (isRecord(json) && typeof json.message === "string" && json.message) ||
        //       `Login failed (${res.status})`;
        //     throw new Error(msg);
        //   }

        //   const extracted = extractAuthState(json);
        //   if (!extracted.accessToken) {
        //     throw new Error(
        //       extracted.message ||
        //       "Login succeeded but no access token was returned.",
        //     );
        //   }



        //   router.push("/dashboard");
        // } catch (err) {
        //   const msg = err instanceof Error ? err.message : "Login failed.";
        //   setError(msg);
        // } finally {
        //   setLoading(false);
        // }
      },
    }
  );



  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        <Link href="/" className="flex items-center gap-2 justify-center">
          <Image src="/Unum_Logo.svg" alt="Unum Sint" width={36} height={36} />
          <span className="font-semibold text-lg tracking-tight">Unum Sint</span>
        </Link>

        <div className="mt-8 rounded-2xl border border-foreground/10 bg-background/60 p-6 shadow-sm backdrop-blur">
          <h1 className="text-2xl font-semibold tracking-tight text-center">
            Sign in
          </h1>
          <p className="mt-2 text-sm text-foreground/70 text-center">
            Use your email and password, or continue with Google.
          </p>

          <form
            className="mt-6 space-y-4"
            onSubmit={formik.handleSubmit}
          >
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="email_or_phone">
                Email or phone
              </label>
              <input
                id="email_or_phone"
                name="email_or_phone"
                type="text"
                autoComplete="email"
                value={formik.values.email_or_phone}
                onChange={formik.handleChange}
                placeholder="you@example.com"
                className="w-full rounded-xl border border-foreground/15 bg-background px-4 py-3 text-sm outline-none focus:border-foreground/30 focus:ring-4 focus:ring-foreground/10"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                value={formik.values.password}
                onChange={formik.handleChange}
                placeholder="••••••••"
                className="w-full rounded-xl border border-foreground/15 bg-background px-4 py-3 text-sm outline-none focus:border-foreground/30 focus:ring-4 focus:ring-foreground/10"
              />
            </div>

            <button
              type="submit"
              disabled={loginMut.isPending}
              className="w-full rounded-xl bg-primary px-4 py-3 text-sm font-medium text-background transition disabled:opacity-60"
            >
              {loginMut.isPending ? "Signing in…" : "Sign in"}
            </button>
          </form>
{/* 
          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-foreground/10" />
            <span className="text-xs text-foreground/60">or</span>
            <div className="h-px flex-1 bg-foreground/10" />
          </div>

          <button
            type="button"
            onClick={() => {
              if (!googleLoginUrl) {
                return;
              }
              window.location.href = googleLoginUrl;
            }}
            className="w-full rounded-xl border border-foreground/15 bg-background px-4 py-3 text-sm font-medium transition hover:bg-foreground/5"
          >
            Continue with Google
          </button> */}

          <p className="mt-6 text-center text-xs text-foreground/60">
            By continuing, you agree to our terms and privacy policy.
          </p>
        </div>
      </div>
    </div>
  );
}

