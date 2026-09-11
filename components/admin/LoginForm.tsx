"use client";

import { useActionState } from "react";
import { signIn, type FormState } from "@/app/admin/actions";

export default function LoginForm({ next }: { next: string }) {
  const [state, formAction, pending] = useActionState<FormState, FormData>(signIn, undefined);

  return (
    <div className="admin-login">
      <form className="admin-card admin-login__card" action={formAction}>
        <span className="dots" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        <h1>Afri Inclusion Admin</h1>
        <p className="admin-login__note">Sign in to write and manage insights.</p>

        <input type="hidden" name="next" value={next} />

        <label className="admin-field">
          <span className="admin-field__label">Password</span>
          <input
            className="admin-input"
            type="password"
            name="password"
            autoComplete="current-password"
            autoFocus
            required
          />
        </label>

        {state?.error && (
          <p className="admin-error" role="alert">
            {state.error}
          </p>
        )}

        <button className="btn btn--green admin-login__submit" type="submit" disabled={pending}>
          {pending ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}
