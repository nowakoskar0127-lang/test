import {
  type AnyPgColumn,
  check,
  index,
  pgEnum,
  pgTable,
  integer,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const userRole = pgEnum("user_role", [
  "super_admin",
  "admin",
  "manager",
  "account",
]);

export const categories = pgTable(
  "categories",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: "date" })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    uniqueIndex("categories_name_normalized_unique").on(
      sql`lower(btrim(${table.name}))`,
    ),
  ],
);

export const users = pgTable(
  "users",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    role: userRole("role").notNull(),
    parentUserId: uuid("parent_user_id").references((): AnyPgColumn => users.id, {
      onDelete: "restrict",
    }),
    displayName: text("display_name"),
    loginName: text("login_name"),
    passwordHash: text("password_hash"),
    authVersion: integer("auth_version").default(0).notNull(),
    blockedAt: timestamp("blocked_at", { withTimezone: true, mode: "date" }),
    blockedBy: uuid("blocked_by").references((): AnyPgColumn => users.id, {
      onDelete: "restrict",
    }),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: "date" })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    uniqueIndex("users_login_name_unique")
      .on(sql`lower(btrim(${table.loginName}))`)
      .where(sql`${table.loginName} is not null`),
    uniqueIndex("users_single_super_admin_unique")
      .on(table.role)
      .where(sql`${table.role} = 'super_admin'`),
    check(
      "users_parent_matches_role_check",
      sql`(${table.role} = 'super_admin' and ${table.parentUserId} is null) or (${table.role} <> 'super_admin' and ${table.parentUserId} is not null)`,
    ),
    check(
      "users_login_credentials_match_role_check",
      sql`(${table.role} = 'account' and ${table.loginName} is null and ${table.passwordHash} is null) or (${table.role} <> 'account' and ${table.loginName} is not null and ${table.passwordHash} is not null)`,
    ),
    check(
      "users_display_name_matches_role_check",
      sql`(${table.role} = 'account' and ${table.displayName} is null) or (${table.role} <> 'account' and ${table.displayName} is not null)`,
    ),
    check(
      "users_block_audit_fields_check",
      sql`(${table.blockedAt} is null and ${table.blockedBy} is null) or (${table.blockedAt} is not null and ${table.blockedBy} is not null)`,
    ),
  ],
);

export const profiles = pgTable(
  "profiles",
  {
    userId: uuid("user_id")
      .primaryKey()
      .references(() => users.id, { onDelete: "restrict" }),
    categoryId: uuid("category_id").references(() => categories.id, {
      onDelete: "set null",
    }),
    resumePdfId: uuid("resume_pdf_id"),
    firstName: text("first_name"),
    lastName: text("last_name"),
    candidateEmail: text("candidate_email"),
    phone: text("phone"),
    headline: text("headline"),
    linkedinUrl: text("linkedin_url"),
    country: text("country"),
    city: text("city"),
    province: text("province"),
    addressLine1: text("address_line_1"),
    postalCode: text("postal_code"),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: "date" })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("profiles_category_id_index").on(table.categoryId),
    uniqueIndex("profiles_candidate_email_normalized_unique")
      .on(sql`lower(btrim(${table.candidateEmail}))`)
      .where(sql`${table.candidateEmail} is not null`),
  ],
);

export const loginHistory = pgTable(
  "login_history",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    loggedInAt: timestamp("logged_in_at", { withTimezone: true, mode: "date" })
      .defaultNow()
      .notNull(),
  },
  (table) => [index("login_history_user_logged_in_at_index").on(table.userId, table.loggedInAt)],
);

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Profile = typeof profiles.$inferSelect;
export type NewProfile = typeof profiles.$inferInsert;
export type LoginHistory = typeof loginHistory.$inferSelect;
