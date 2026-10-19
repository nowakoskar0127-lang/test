"use client";

import { useActionState } from "react";
import { ChevronDown, Plus, ShieldCheck, UserPlus } from "lucide-react";
import { PasswordField } from "@/app/components/password-field";
import {
  createUserAction,
  deleteStaffUserAction,
  type UserActionState,
  updateUserCredentialsAction,
} from "@/app/users/actions";

const initialState: UserActionState = { error: null, success: null };

type CreateUserFormProps = {
  role: "admin" | "manager" | "account";
  categories: { id: string; name: string }[];
};

export function CreateUserForm({ role, categories }: CreateUserFormProps) {
  const [state, formAction, isPending] = useActionState(
    createUserAction,
    initialState,
  );
  const isAccount = role === "account";
  const roleLabel = isAccount
    ? "candidate Account"
    : role === "admin"
      ? "Admin"
      : "Manager";

  return (
    <details className="group rounded-xl border border-slate-200/80 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.03)]">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-5 py-4 [&::-webkit-details-marker]:hidden sm:px-6">
        <span className="flex items-center gap-3">
          <span className="flex size-9 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
            <UserPlus className="size-4" />
          </span>
          <span>
            <span className="block text-sm font-semibold text-slate-800">
              Add {roleLabel}
            </span>
            <span className="mt-1 block text-[11px] text-slate-400">
              {isAccount
                ? "Create a candidate profile managed by you."
                : "Create a staff account in your hierarchy."}
            </span>
          </span>
        </span>
        <ChevronDown className="size-4 text-slate-400 transition group-open:rotate-180" />
      </summary>

      <form
        action={formAction}
        className="space-y-5 border-t border-slate-100 px-5 py-5 sm:px-6"
      >
        {isAccount ? (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <TextField
              autoComplete="given-name"
              id="firstName"
              label="First name"
              maxLength={120}
              name="firstName"
              required
            />
            <TextField
              autoComplete="family-name"
              id="lastName"
              label="Last name"
              maxLength={120}
              name="lastName"
              required
            />
            <div className="sm:col-span-2">
              <TextField
                autoComplete="email"
                id="candidateEmail"
                label="Candidate email (optional)"
                maxLength={320}
                name="candidateEmail"
                type="email"
              />
            </div>
            <TextField
              autoComplete="tel"
              id="phone"
              label="Phone"
              maxLength={64}
              name="phone"
            />
            <TextField
              autoComplete="organization-title"
              id="headline"
              label="Professional headline"
              maxLength={256}
              name="headline"
            />
            <TextField
              autoComplete="url"
              id="linkedinUrl"
              label="LinkedIn profile URL"
              maxLength={2048}
              name="linkedinUrl"
              type="url"
            />
            <TextField
              autoComplete="country"
              id="country"
              label="Country"
              maxLength={120}
              name="country"
              placeholder="Country name"
            />
            <TextField
              autoComplete="address-level2"
              id="city"
              label="City"
              maxLength={120}
              name="city"
            />
            <TextField
              autoComplete="address-level1"
              id="province"
              label="Province / state"
              maxLength={120}
              name="province"
            />
            <TextField
              autoComplete="street-address"
              id="addressLine1"
              label="Address line 1"
              maxLength={256}
              name="addressLine1"
            />
            <TextField
              autoComplete="postal-code"
              id="postalCode"
              label="Postal code"
              maxLength={32}
              name="postalCode"
            />
            <SelectField
              id="categoryId"
              label="Category"
              name="categoryId"
              options={categories}
            />
            <div className="sm:col-span-2 rounded-lg bg-slate-50 px-3.5 py-3 text-[11px] leading-5 text-slate-500">
              Candidates are profile-only Accounts. They do not receive a login
              name or password. All profile details are optional except the
              candidate&apos;s name.
            </div>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField
              autoComplete="off"
              id="loginName"
              label="Username"
              maxLength={128}
              name="loginName"
              required
            />
            <div className="sm:col-span-2">
              <PasswordField
                autoComplete="new-password"
                id="newStaffPassword"
                label="Temporary password"
                minLength={4}
                name="password"
                placeholder="At least 4 characters"
                required
              />
            </div>
          </div>
        )}

        {state.error && <FormMessage variant="error">{state.error}</FormMessage>}
        {state.success && (
          <FormMessage variant="success">{state.success}</FormMessage>
        )}
        <button
          className="inline-flex h-10 items-center gap-2 rounded-lg bg-indigo-600 px-4 text-xs font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-wait disabled:opacity-70"
          disabled={isPending}
          type="submit"
        >
          <Plus className="size-3.5" />
          {isPending ? "Creating..." : `Create ${roleLabel}`}
        </button>
      </form>
    </details>
  );
}

type CredentialResetFormProps = {
  userId: string;
  loginName: string;
};

export function CredentialResetForm({
  userId,
  loginName,
}: CredentialResetFormProps) {
  const [state, formAction, isPending] = useActionState(
    updateUserCredentialsAction,
    initialState,
  );

  return (
    <details className="group mt-2">
      <summary className="flex cursor-pointer list-none items-center gap-1.5 text-[10px] font-semibold text-indigo-600 [&::-webkit-details-marker]:hidden">
        <ShieldCheck className="size-3" />
        Change credentials
        <ChevronDown className="size-3 transition group-open:rotate-180" />
      </summary>
      <form action={formAction} className="mt-3 space-y-3">
        <input name="userId" type="hidden" value={userId} />
        <TextField
          autoComplete="off"
          defaultValue={loginName}
          id={`resetLogin-${userId}`}
          label="Login name"
          maxLength={128}
          name="loginName"
        />
        <PasswordField
          autoComplete="new-password"
          id={`resetPassword-${userId}`}
          label="Set a new password (optional)"
          minLength={4}
          name="password"
          placeholder="At least 4 characters"
        />
        {state.error && <FormMessage variant="error">{state.error}</FormMessage>}
        {state.success && (
          <FormMessage variant="success">{state.success}</FormMessage>
        )}
        <button
          className="h-8 rounded-md bg-slate-900 px-3 text-[10px] font-semibold text-white disabled:opacity-60"
          disabled={isPending}
          type="submit"
        >
          {isPending ? "Saving..." : "Save credentials"}
        </button>
      </form>
    </details>
  );
}

function TextField({
  id,
  label,
  name,
  maxLength,
  required = false,
  autoComplete,
  defaultValue,
  placeholder,
  type = "text",
}: {
  id: string;
  label: string;
  name: string;
  maxLength: number;
  required?: boolean;
  autoComplete: string;
  defaultValue?: string;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div>
      <label
        className="mb-2 block text-xs font-semibold text-slate-700"
        htmlFor={id}
      >
        {label}
      </label>
      <input
        autoComplete={autoComplete}
        className="h-10 w-full rounded-lg border border-slate-200 px-3 text-xs outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
        defaultValue={defaultValue}
        id={id}
        maxLength={maxLength}
        name={name}
        placeholder={placeholder}
        required={required}
        type={type}
      />
    </div>
  );
}

export function DeleteStaffUserForm({
  userId,
  reportsCount,
  replacementUsers,
}: {
  userId: string;
  reportsCount: number;
  replacementUsers: { id: string; name: string }[];
}) {
  const [state, formAction, isPending] = useActionState(
    deleteStaffUserAction,
    initialState,
  );
  const hasReports = reportsCount > 0;
  const noReplacementAvailable = hasReports && replacementUsers.length === 0;

  return (
    <form
      action={formAction}
      className="mt-2"
      onSubmit={(event) => {
        if (
          !window.confirm(
            hasReports
              ? `Permanently delete this staff account and reassign ${reportsCount} direct report(s) to the selected peer? This also deletes their login history.`
              : "Permanently delete this staff account? This also deletes their login history.",
          )
        ) {
          event.preventDefault();
        }
      }}
    >
      <input name="userId" type="hidden" value={userId} />
      {hasReports && replacementUsers.length > 0 && (
        <div className="mb-3">
          <label
            className="mb-2 block text-[10px] font-semibold text-slate-600"
            htmlFor={`replacementUser-${userId}`}
          >
            Reassign {reportsCount} direct report(s) to
          </label>
          <select
            className="h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
            defaultValue=""
            id={`replacementUser-${userId}`}
            name="replacementUserId"
            required
          >
            <option disabled value="">
              Choose an active peer
            </option>
            {replacementUsers.map((replacement) => (
              <option key={replacement.id} value={replacement.id}>
                {replacement.name}
              </option>
            ))}
          </select>
        </div>
      )}
      {noReplacementAvailable && (
        <FormMessage variant="error">
          Add another active peer at this level before deleting this account.
        </FormMessage>
      )}
      {state.error && (
        <FormMessage variant="error">{state.error}</FormMessage>
      )}
      {state.success && (
        <FormMessage variant="success">{state.success}</FormMessage>
      )}
      <button
        className="h-8 rounded-md border border-rose-200 px-3 text-[10px] font-semibold text-rose-700 transition hover:bg-rose-50 disabled:opacity-60"
        disabled={isPending || noReplacementAvailable}
        type="submit"
      >
        {isPending ? "Deleting..." : "Delete account"}
      </button>
    </form>
  );
}

function SelectField({
  id,
  label,
  name,
  options,
}: {
  id: string;
  label: string;
  name: string;
  options: { id: string; name: string }[];
}) {
  return (
    <div>
      <label
        className="mb-2 block text-xs font-semibold text-slate-700"
        htmlFor={id}
      >
        {label}
      </label>
      <select
        className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
        id={id}
        name={name}
        defaultValue=""
      >
        <option value="">No category</option>
        {options.map((option) => (
          <option key={option.id} value={option.id}>
            {option.name}
          </option>
        ))}
      </select>
    </div>
  );
}

function FormMessage({
  children,
  variant,
}: {
  children: string;
  variant: "error" | "success";
}) {
  return (
    <p
      aria-live="polite"
      className={`rounded-lg border px-3.5 py-3 text-xs ${
        variant === "error"
          ? "border-rose-200 bg-rose-50 text-rose-700"
          : "border-emerald-200 bg-emerald-50 text-emerald-700"
      }`}
      role={variant === "error" ? "alert" : "status"}
    >
      {children}
    </p>
  );
}
