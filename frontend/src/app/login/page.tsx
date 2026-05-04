"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { apiRequest } from "@/lib/api";
import { saveAuth, User } from "@/lib/auth";

type AuthResponse = {
  access_token: string;
  token_type: string;
  user: User;
};

export default function LoginPage() {
  const router = useRouter();

  const [mode, setMode] = useState<"login" | "register">("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"worker" | "ceo">("worker");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const endpoint = mode === "login" ? "/auth/login" : "/auth/register";

      const body =
        mode === "login"
          ? { username, password }
          : { username, password, role };

      const data = await apiRequest<AuthResponse>(endpoint, {
        method: "POST",
        body: JSON.stringify(body),
      });

      saveAuth(data.access_token, data.user);
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Auth failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="authPage">
      <form className="authCard" onSubmit={handleSubmit}>
        <h1>{mode === "login" ? "Welcome back" : "Create account"}</h1>
        <p>
          Sign in to VibeDoing and continue tracking workload intelligence.
        </p>

        <div className="authSwitch">
          <button
            type="button"
            className={mode === "login" ? "primaryButton" : "secondaryButton"}
            onClick={() => setMode("login")}
          >
            Login
          </button>

          <button
            type="button"
            className={mode === "register" ? "primaryButton" : "secondaryButton"}
            onClick={() => setMode("register")}
          >
            Register
          </button>
        </div>

        <input
          className="input"
          placeholder="Username"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
        />

        <input
          className="input"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />

        {mode === "register" && (
          <select
            className="input"
            value={role}
            onChange={(event) => setRole(event.target.value as "worker" | "ceo")}
          >
            <option value="worker">Worker</option>
            <option value="ceo">CEO</option>
          </select>
        )}

        {error && <div className="error">{error}</div>}

        <button className="primaryButton" disabled={loading}>
          {loading ? "Loading..." : mode === "login" ? "Login" : "Register"}
        </button>
      </form>
    </main>
  );
}