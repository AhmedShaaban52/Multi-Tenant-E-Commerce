import {
  boolean,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  unique,
} from 'drizzle-orm/pg-core';

/* ------------------------------------------------------------------ */
/* Platform users (store owners, admins, staff, super admin)           */
/* ------------------------------------------------------------------ */

export const users = pgTable('users', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  email: text('email').notNull().unique(), // store lowercased
  passwordHash: text('password_hash').notNull(),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  isActive: boolean('is_active').notNull().default(true),
  isSuperAdmin: boolean('is_super_admin').notNull().default(false),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

/* ------------------------------------------------------------------ */
/* Stores (tenants)                                                    */
/* ------------------------------------------------------------------ */

export const stores = pgTable('stores', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(), // subdomain: slug.yourplatform.com
  customDomain: text('custom_domain').unique(),
  plan: text('plan').notNull().default('free'),
  currency: text('currency').notNull().default('EGP'),
  settings: jsonb('settings'), // theme, logo, banners, ...
  nextOrderNumber: integer('next_order_number').notNull().default(1),
  isActive: boolean('is_active').notNull().default(true), // soft delete / suspend
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

/* ------------------------------------------------------------------ */
/* Store members (which user belongs to which store, and with what role) */
/* ------------------------------------------------------------------ */

export const memberRole = pgEnum('member_role', ['owner', 'admin', 'staff']);

export const storeMembers = pgTable(
  'store_members',
  {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
    storeId: integer('store_id')
      .notNull()
      .references(() => stores.id, { onDelete: 'cascade' }),
    userId: integer('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    role: memberRole('role').notNull().default('staff'),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    unique().on(t.storeId, t.userId),
    index().on(t.userId), // "which stores is this user a member of?"
  ],
);

export const products = pgTable(
  'products',
  {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
    storeId: integer('store_id')
      .notNull()
      .references(() => stores.id),
    slug: text('slug').notNull(),
    name: text('name').notNull(),
    description: text('description'),
    price: integer('price').notNull(), // smallest currency unit (piasters / cents)
    stock: integer('stock').notNull().default(0),
    isActive: boolean('is_active').notNull().default(true), // hide instead of delete
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (t) => [unique().on(t.storeId, t.slug), index().on(t.storeId)],
);

/* ------------------------------------------------------------------ */
/* Customers (shoppers, scoped per store)                              */
/* ------------------------------------------------------------------ */

export const customers = pgTable(
  'customers',
  {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
    storeId: integer('store_id')
      .notNull()
      .references(() => stores.id),
    email: text('email').notNull(),
    passwordHash: text('password_hash').notNull(),
    name: text('name').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (t) => [unique().on(t.storeId, t.email)],
);

export const orderStatus = pgEnum('order_status', [
  'pending',
  'paid',
  'shipped',
  'delivered',
  'cancelled',
]);

export const orders = pgTable(
  'orders',
  {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
    storeId: integer('store_id')
      .notNull()
      .references(() => stores.id),
    customerId: integer('customer_id')
      .notNull()
      .references(() => customers.id),
    orderNumber: integer('order_number').notNull(),
    status: orderStatus('status').notNull().default('pending'),
    total: integer('total').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (t) => [
    unique().on(t.storeId, t.orderNumber),
    index().on(t.storeId, t.status),
    index().on(t.customerId),
  ],
);

export const orderItems = pgTable(
  'order_items',
  {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
    orderId: integer('order_id')
      .notNull()
      .references(() => orders.id, { onDelete: 'cascade' }),
    productId: integer('product_id')
      .notNull()
      .references(() => products.id),
    productName: text('product_name').notNull(),
    quantity: integer('quantity').notNull(),
    unitPrice: integer('unit_price').notNull(),
  },
  (t) => [index().on(t.orderId)],
);

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type Store = typeof stores.$inferSelect;
export type NewStore = typeof stores.$inferInsert;

export type StoreMember = typeof storeMembers.$inferSelect;
export type NewStoreMember = typeof storeMembers.$inferInsert;
export type MemberRole = (typeof memberRole.enumValues)[number];

export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;

export type Customer = typeof customers.$inferSelect;
export type NewCustomer = typeof customers.$inferInsert;

export type Order = typeof orders.$inferSelect;
export type NewOrder = typeof orders.$inferInsert;
export type OrderStatus = (typeof orderStatus.enumValues)[number];

export type OrderItem = typeof orderItems.$inferSelect;
export type NewOrderItem = typeof orderItems.$inferInsert;
