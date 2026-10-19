"use server";

import { and, eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { users } from "@/db/schema";
import { db, neonSql } from "@/lib/db";
import { hashPassword } from "@/lib/password";
import { requireUser } from "@/lib/session";

export type UserActionState = {
  error: string | null;
  success: string | null;
};

const emptyState: UserActionState = { error: null, success: null };

export async function createUserAction(
  _previousState: UserActionState,
  formData: FormData,
): Promise<UserActionState> {
  const actor = await requireUser();
  const expectedRole =
    actor.role === "super_admin"
      ? "admin"
      : actor.role === "admin"
        ? "manager"
        : "account";
  const loginName = readText(formData, "loginName", 128);
  const password = readSecret(formData, "password");
  const firstName = readText(formData, "firstName", 120);
  const lastName = readText(formData, "lastName", 120);
  const candidateEmail = readText(formData, "candidateEmail", 320);
  const phone = readText(formData, "phone", 64);
  const headline = readText(formData, "headline", 256);
  const linkedinUrl = readText(formData, "linkedinUrl", 2048);
  const country = readText(formData, "country", 120);
  const city = readText(formData, "city", 120);
  const province = readText(formData, "province", 120);
  const addressLine1 = readText(formData, "addressLine1", 256);
  const postalCode = readText(formData, "postalCode", 32);
  const categoryId = readText(formData, "categoryId", 36);

  if (expectedRole !== "account" && password.length < 4) {
    return {
      ...emptyState,
      error: "The password must be at least 4 characters.",
    };
  }

  if (expectedRole === "account") {
    if (!firstName || !lastName) {
      return {
        ...emptyState,
        error: "Enter the candidate's first and last name.",
      };
    }
    if (candidateEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(candidateEmail)) {
      return { ...emptyState, error: "Enter a valid candidate email address." };
    }
    if (linkedinUrl && !isHttpUrl(linkedinUrl)) {
      return { ...emptyState, error: "Enter a valid LinkedIn profile URL." };
    }
    if (categoryId && !isUuid(categoryId)) {
      return { ...emptyState, error: "Select a valid candidate category." };
    }
  } else if (!loginName) {
    return {
      ...emptyState,
      error: "Enter a username for the staff account.",
    };
  }

  try {
    if (expectedRole === "account") {
      await db.execute(sql`
        with new_user as (
          insert into users (role, parent_user_id, display_name, login_name, password_hash)
          values ('account', ${actor.id}, null, null, null)
          returning id
        )
        insert into profiles (
          user_id, category_id, first_name, last_name, candidate_email, phone,
          headline, linkedin_url, country, city, province, address_line_1,
          postal_code
        )
        select id, ${categoryId || null}::uuid, ${firstName}, ${lastName},
          ${candidateEmail ? candidateEmail.toLowerCase() : null},
          ${phone || null}, ${headline || null}, ${linkedinUrl || null},
          ${country || null}, ${city || null}, ${province || null},
          ${addressLine1 || null}, ${postalCode || null}
        from new_user
      `);
    } else {
      const passwordHash = await hashPassword(password);
      await db.insert(users).values({
        role: expectedRole,
        parentUserId: actor.id,
        displayName: expectedRole === "admin" ? "Admin" : "Manager",
        loginName,
        passwordHash,
      });
    }
  } catch (error) {
    if (isUniqueViolation(error)) {
      return {
        ...emptyState,
        error:
          expectedRole === "account"
            ? "That candidate email is already in use."
            : "That login name is already in use.",
      };
    }
    logUserActionFailure("creating a user", error);
    return {
      ...emptyState,
      error: "The user could not be created. Please try again.",
    };
  }

  revalidatePath("/");
  revalidatePath("/users");
  return {
    error: null,
    success:
      expectedRole === "account"
        ? "Candidate profile created."
        : `${expectedRole === "admin" ? "Admin" : "Manager"} account created.`,
  };
}

export async function updateUserCredentialsAction(
  _previousState: UserActionState,
  formData: FormData,
): Promise<UserActionState> {
  const actor = await requireUser();
  if (actor.role !== "super_admin") {
    return { ...emptyState, error: "Only Super Admin can update other users." };
  }

  const userId = readText(formData, "userId", 64);
  const loginName = readText(formData, "loginName", 128);
  const password = readSecret(formData, "password");
  if (!isUuid(userId) || (!loginName && !password)) {
    return {
      ...emptyState,
      error: "Enter a login name or a new password.",
    };
  }
  if (password && password.length < 4) {
    return {
      ...emptyState,
      error: "A new password must be at least 4 characters.",
    };
  }

  let passwordHash: string | undefined;
  if (password) passwordHash = await hashPassword(password);

  try {
    const [updatedUser] = await db
      .update(users)
      .set({
        ...(loginName ? { loginName } : {}),
        ...(passwordHash
          ? {
              passwordHash,
              authVersion: sql`${users.authVersion} + 1`,
            }
          : {}),
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(users.id, userId),
          sql`${users.role} in ('super_admin', 'admin', 'manager')`,
        ),
      )
      .returning({ id: users.id });

    if (!updatedUser) {
      return {
        ...emptyState,
        error: "That staff account was not found.",
      };
    }
  } catch (error) {
    if (isUniqueViolation(error)) {
      return {
        ...emptyState,
        error: "That login name is already in use.",
      };
    }
    logUserActionFailure("updating staff credentials", error);
    return {
      ...emptyState,
      error: "Credentials could not be updated. Please try again.",
    };
  }

  revalidatePath("/users");
  revalidatePath("/");
  return { error: null, success: "Staff credentials updated." };
}

export async function deleteStaffUserAction(
  _previousState: UserActionState,
  formData: FormData,
): Promise<UserActionState> {
  const actor = await requireUser();
  if (actor.role !== "super_admin") {
    return { ...emptyState, error: "Only Super Admin can delete staff users." };
  }

  const userId = readText(formData, "userId", 64);
  const replacementUserId = readText(formData, "replacementUserId", 64);
  if (!isUuid(userId)) {
    return { ...emptyState, error: "Select a valid staff account." };
  }
  if (replacementUserId && !isUuid(replacementUserId)) {
    return { ...emptyState, error: "Select a valid replacement user." };
  }

  let reassignedCount = 0;
  try {
    const [reassigned, deleted] = await neonSql.transaction((tx) => [
      tx`
        update users as child
        set parent_user_id = replacement.id, updated_at = now()
        from users as target
        inner join users as replacement
          on replacement.id = ${replacementUserId || null}::uuid
          and replacement.role = target.role
          and replacement.parent_user_id = target.parent_user_id
          and replacement.id <> target.id
          and replacement.blocked_at is null
        where target.id = ${userId}::uuid
          and target.role in ('admin', 'manager')
          and child.parent_user_id = target.id
          and not exists (
            select 1 from users as blocked_user
            where blocked_user.blocked_by = target.id
          )
        returning child.id
      `,
      tx`
        delete from users as target
        where target.id = ${userId}::uuid
          and target.role in ('admin', 'manager')
          and not exists (
            select 1 from users as child
            where child.parent_user_id = target.id
          )
          and not exists (
            select 1 from users as blocked_user
            where blocked_user.blocked_by = target.id
          )
        returning target.id
      `,
    ]);
    reassignedCount = reassigned.length;

    if (deleted.length === 0) {
      const [target] = await db.execute<{
        role: string;
        hasReports: boolean;
        isBlockAuditor: boolean;
      }>(sql`
        select
          target.role,
          exists (
            select 1 from users as child
            where child.parent_user_id = target.id
          ) as "hasReports",
          exists (
            select 1 from users as blocked_user
            where blocked_user.blocked_by = target.id
          ) as "isBlockAuditor"
        from users as target
        where target.id = ${userId}::uuid
      `).then((result) => result.rows);

      if (!target || !["admin", "manager"].includes(target.role)) {
        return { ...emptyState, error: "That Admin or Manager was not found." };
      }
      if (target.hasReports && !replacementUserId) {
        return {
          ...emptyState,
          error: "Choose an active peer to receive this user's reports.",
        };
      }
      if (target.hasReports && reassigned.length === 0) {
        return {
          ...emptyState,
          error:
            "The selected replacement is unavailable or not an eligible peer. Refresh and choose another active peer.",
        };
      }
      if (target.isBlockAuditor) {
        return {
          ...emptyState,
          error:
            "This user is recorded as the blocker for another account. Resolve that audit reference before deleting them.",
        };
      }
      return {
        ...emptyState,
        error: "This account could not be deleted. Refresh and try again.",
      };
    }
  } catch (error) {
    logUserActionFailure("deleting a staff user", error);
    return {
      ...emptyState,
      error:
        "This account could not be deleted because related records still depend on it.",
    };
  }

  revalidatePath("/");
  revalidatePath("/users");
  return {
    error: null,
    success: reassignedCount
      ? `Staff account deleted; ${reassignedCount} direct report(s) reassigned to the selected peer.`
      : "Staff account permanently deleted.",
  };
}

function readText(formData: FormData, name: string, maxLength: number): string {
  const value = formData.get(name);
  return typeof value === "string" && value.length <= maxLength
    ? value.trim()
    : "";
}

function readSecret(formData: FormData, name: string): string {
  const value = formData.get(name);
  return typeof value === "string" && value.length <= 1024 ? value : "";
}

function isUuid(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value,
  );
}

function isHttpUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

function isUniqueViolation(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === "23505"
  );
}

function logUserActionFailure(stage: string, error: unknown): void {
  const code =
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    typeof error.code === "string"
      ? error.code
      : error instanceof Error
        ? error.name
        : "unknown";
  console.error(`User action failed while ${stage} (code: ${code}).`);
}
