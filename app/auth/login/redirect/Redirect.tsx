"use client";

import { useAuthContext } from "@/context/AuthContext";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef } from "react";

const Redirect = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { updateValues } = useAuthContext();

  const hasRunRef = useRef(false);

  const parsed = useMemo(() => {
    const success = searchParams.get("success");

    const accessToken = searchParams.get("token") ?? searchParams.get("accessToken");
    const refreshToken = searchParams.get("refreshToken");
    const sessionId = searchParams.get("sessionId");
    const accessTokenExpiresAt = searchParams.get("accessTokenExpiresAt");
    const refreshTokenExpiresAt = searchParams.get("refreshTokenExpiresAt");

    const userId = searchParams.get("userId");
    const email = searchParams.get("email");
    const firstName = searchParams.get("firstName");
    const lastName = searchParams.get("lastName");

    const userRolesRaw = searchParams.get("userRoles");
    const parishMembershipsRaw = searchParams.get("parishMemberships");

    const safeParseArray = (value: string | null) => {
      if (!value) return [];
      try {
        const parsedValue = JSON.parse(value);
        return Array.isArray(parsedValue) ? parsedValue : [];
      } catch {
        return [];
      }
    };

    const user_roles = safeParseArray(userRolesRaw);
    const parish_memberships = safeParseArray(parishMembershipsRaw);

    return {
      success,
      accessToken,
      refreshToken,
      sessionId,
      accessTokenExpiresAt,
      refreshTokenExpiresAt,
      userId,
      email,
      firstName,
      lastName,
      user_roles,
      parish_memberships,
    };
  }, [searchParams]);

  useEffect(() => {
    console.log("has Run Ref", hasRunRef.current);
    if (hasRunRef.current) return;

    // If the backend indicates failure, bounce back to login.
    if (parsed.success && parsed.success !== "true") {
      hasRunRef.current = true;
      router.replace("/login");
      return;
    }

    // Only set auth data if we have at least the session/token core.
    console.log("parsed", parsed);
    if (!parsed.sessionId || !parsed.accessToken) return;

    updateValues({
      session_id: parsed.sessionId,
      access_token: parsed.accessToken,
      access_token_expires_at: parsed.accessTokenExpiresAt ?? "",
      refresh_token: parsed.refreshToken ?? "",
      refresh_token_expires_at: parsed.refreshTokenExpiresAt ?? "",
      user: {
        user_id: parsed.userId ?? "",
        first_name: parsed.firstName ?? "",
        last_name: parsed.lastName ?? "",
        gender: "",
        date_of_birth: "",
        email: parsed.email ?? "",
        phone: "",
        address: "",
        is_active: true,
        user_roles: parsed.user_roles,
        parish_memberships: parsed.parish_memberships,
      },
    });

    hasRunRef.current = true;
    router.replace("/dashboard");
  }, [parsed, router, updateValues]);

  return (
    <div>
      <h1>Login Success</h1>
      <p>Redirecting to home page...</p>
    </div>
  );
};
 
export default Redirect;