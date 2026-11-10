import { relations, sql } from "drizzle-orm";
import { integer, real, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";

const timestamps = {
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" }).notNull().$defaultFn(() => new Date()),
};

export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name"),
  phone: text("phone"),
  passwordHash: text("password_hash").notNull(),
  role: text("role", {
    enum: ["CONSUMER", "STYLIST", "SALON_MANAGER", "FRANCHISEE", "CORPORATE_ADMIN"],
  }).notNull().default("CONSUMER"),
  ...timestamps,
});

export const sessions = sqliteTable("sessions", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  expiresAt: integer("expires_at", { mode: "timestamp_ms" }).notNull(),
  ...timestamps,
});

export const authKeys = sqliteTable("auth_keys", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  providerId: text("provider_id").notNull().default("email"),
  providerUserId: text("provider_user_id").notNull(),
  hashedPassword: text("hashed_password").notNull(),
  ...timestamps,
}, (table) => ({
  providerUser: uniqueIndex("auth_keys_provider_user_idx").on(table.providerId, table.providerUserId),
}));

export const brands = sqliteTable("brands", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  category: text("category", { enum: ["LUXURY_SPA", "EXPRESS", "MEDSPA", "WELLNESS"] }).notNull(),
  description: text("description"),
  ...timestamps,
});

export const salons = sqliteTable("salons", {
  id: text("id").primaryKey(),
  franchiseeId: text("franchisee_id").references(() => users.id, { onDelete: "set null" }),
  brandId: text("brand_id").notNull().references(() => brands.id, { onDelete: "restrict" }),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  address: text("address").notNull(),
  city: text("city").default("New York"),
  phone: text("phone").default("+1 (555) 728-2831"),
  email: text("email").default("concierge@aegisbeauty.com"),
  hours: text("hours").default("Mon - Sat: 9:00 AM - 8:00 PM | Sun: 10:00 AM - 6:00 PM"),
  lat: real("lat").notNull(),
  lng: real("lng").notNull(),
  status: text("status", { enum: ["ACTIVE", "DRAFT", "SUSPENDED", "ARCHIVED"] }).notNull().default("ACTIVE"),
  ...timestamps,
});

export const stylists = sqliteTable("stylists", {
  id: text("id").primaryKey(),
  salonId: text("salon_id").notNull().references(() => salons.id, { onDelete: "cascade" }),
  userId: text("user_id").references(() => users.id, { onDelete: "set null" }),
  name: text("name").notNull(),
  title: text("title").default("Master Stylist & Beauty Artist"),
  specialization: text("specialization").default("Hair Styling & Color"),
  experienceYears: integer("experience_years").default(8),
  avatarUrl: text("avatar_url"),
  bio: text("bio"),
  rating: real("rating").default(4.9),
  commissionRate: real("commission_rate").notNull().default(0),
  status: text("status", { enum: ["ACTIVE", "INACTIVE", "ON_LEAVE"] }).notNull().default("ACTIVE"),
  ...timestamps,
});

export const services = sqliteTable("services", {
  id: text("id").primaryKey(),
  salonId: text("salon_id").notNull().references(() => salons.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  description: text("description"),
  durationMins: integer("duration_mins").notNull(),
  price: integer("price").notNull(), // price in whole dollars or cents, we'll store whole dollars
  currency: text("currency").notNull().default("USD"),
  category: text("category", { enum: ["HAIR", "SKIN", "MAKEUP", "NAILS", "GROOMING"] }).notNull(),
  imageUrl: text("image_url"),
  isFeatured: integer("is_featured", { mode: "boolean" }).notNull().default(false),
  isBestSeller: integer("is_best_seller", { mode: "boolean" }).notNull().default(false),
  status: text("status", { enum: ["ACTIVE", "DRAFT", "ARCHIVED"] }).notNull().default("ACTIVE"),
  ...timestamps,
});

export const packages = sqliteTable("packages", {
  id: text("id").primaryKey(),
  salonId: text("salon_id").notNull().references(() => salons.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  subtitle: text("subtitle"),
  description: text("description"),
  durationMins: integer("duration_mins").notNull().default(180),
  originalPrice: integer("original_price").notNull(),
  price: integer("price").notNull(),
  currency: text("currency").notNull().default("USD"),
  includes: text("includes"), // JSON string array of inclusions
  badge: text("badge"), // e.g. "Most Popular", "Signature Experience"
  imageUrl: text("image_url"),
  isFeatured: integer("is_featured", { mode: "boolean" }).notNull().default(true),
  ...timestamps,
});

export const appointments = sqliteTable("appointments", {
  id: text("id").primaryKey(),
  consumerId: text("consumer_id").references(() => users.id, { onDelete: "set null" }),
  stylistId: text("stylist_id").notNull().references(() => stylists.id, { onDelete: "restrict" }),
  serviceId: text("service_id").references(() => services.id, { onDelete: "set null" }),
  packageId: text("package_id").references(() => packages.id, { onDelete: "set null" }),
  salonId: text("salon_id").notNull().references(() => salons.id, { onDelete: "restrict" }),
  customerName: text("customer_name").notNull(),
  customerEmail: text("customer_email").notNull(),
  customerPhone: text("customer_phone").notNull(),
  bookingNotes: text("booking_notes"),
  startTime: integer("start_time", { mode: "timestamp_ms" }).notNull(),
  endTime: integer("end_time", { mode: "timestamp_ms" }).notNull(),
  status: text("status", { enum: ["PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"] }).notNull().default("CONFIRMED"),
  totalPrice: integer("total_price").notNull().default(0),
  ...timestamps,
}, (table) => ({
  bookingLookup: uniqueIndex("appointments_booking_lookup_idx").on(table.stylistId, table.startTime),
}));

export const galleryItems = sqliteTable("gallery_items", {
  id: text("id").primaryKey(),
  salonId: text("salon_id").notNull().references(() => salons.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  category: text("category", { enum: ["HAIR", "MAKEUP", "NAILS", "INTERIOR", "BEFORE_AFTER"] }).notNull(),
  imageUrl: text("image_url").notNull(),
  beforeImageUrl: text("before_image_url"),
  afterImageUrl: text("after_image_url"),
  description: text("description"),
  stylistName: text("stylist_name"),
  isFeatured: integer("is_featured", { mode: "boolean" }).notNull().default(true),
  ...timestamps,
});

export const customerInquiries = sqliteTable("customer_inquiries", {
  id: text("id").primaryKey(),
  salonId: text("salon_id").notNull().references(() => salons.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  subject: text("subject"),
  message: text("message").notNull(),
  status: text("status", { enum: ["UNREAD", "REPLIED", "ARCHIVED"] }).notNull().default("UNREAD"),
  ...timestamps,
});

export const specialOffers = sqliteTable("special_offers", {
  id: text("id").primaryKey(),
  salonId: text("salon_id").notNull().references(() => salons.id, { onDelete: "cascade" }),
  code: text("code").notNull().unique(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  discountPercent: integer("discount_percent").notNull().default(15),
  validUntil: text("valid_until"),
  isFirstVisit: integer("is_first_visit", { mode: "boolean" }).notNull().default(false),
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
  ...timestamps,
});

export const transactions = sqliteTable("transactions", {
  id: text("id").primaryKey(),
  appointmentId: text("appointment_id").notNull().references(() => appointments.id, { onDelete: "cascade" }),
  amount: integer("amount").notNull(),
  paymentStatus: text("payment_status", { enum: ["PENDING", "SUCCEEDED", "FAILED", "REFUNDED"] }).notNull().default("SUCCEEDED"),
  providerReference: text("provider_reference"),
  ...timestamps,
});

export const products = sqliteTable("products", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  sku: text("sku").notNull().unique(),
  price: integer("price").notNull(),
  stockCount: integer("stock_count").notNull().default(0),
  isProOnly: integer("is_pro_only", { mode: "boolean" }).notNull().default(false),
  ...timestamps,
});

export const franchiseAgreements = sqliteTable("franchise_agreements", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  territory: text("territory").notNull(),
  royaltyRate: real("royalty_rate").notNull(),
  status: text("status", { enum: ["ACTIVE", "PENDING", "EXPIRED"] }).notNull().default("PENDING"),
  ...timestamps,
});

export const proOrders = sqliteTable("pro_orders", {
  id: text("id").primaryKey(),
  salonId: text("salon_id").notNull().references(() => salons.id, { onDelete: "restrict" }),
  productId: text("product_id").notNull().references(() => products.id, { onDelete: "restrict" }),
  quantity: integer("quantity").notNull(),
  status: text("status", { enum: ["DRAFT", "SUBMITTED", "FULFILLED", "CANCELLED"] }).notNull().default("DRAFT"),
  ...timestamps,
});

export const serviceLocalizations = sqliteTable("service_localizations", {
  id: text("id").primaryKey(),
  serviceId: text("service_id").notNull().references(() => services.id, { onDelete: "cascade" }),
  locale: text("locale").notNull(),
  name: text("name").notNull(),
  description: text("description"),
  price: integer("price").notNull(),
  currency: text("currency").notNull(),
  ...timestamps,
}, (table) => ({
  serviceLocale: uniqueIndex("service_localizations_service_locale_idx").on(table.serviceId, table.locale),
}));

export const usersRelations = relations(users, ({ many }) => ({
  sessions: many(sessions),
  authKeys: many(authKeys),
  ownedSalons: many(salons),
  stylists: many(stylists),
  consumerAppointments: many(appointments),
  franchiseAgreements: many(franchiseAgreements),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));

export const authKeysRelations = relations(authKeys, ({ one }) => ({
  user: one(users, { fields: [authKeys.userId], references: [users.id] }),
}));

export const brandsRelations = relations(brands, ({ many }) => ({
  salons: many(salons),
}));

export const salonsRelations = relations(salons, ({ one, many }) => ({
  franchisee: one(users, { fields: [salons.franchiseeId], references: [users.id] }),
  brand: one(brands, { fields: [salons.brandId], references: [brands.id] }),
  stylists: many(stylists),
  services: many(services),
  packages: many(packages),
  appointments: many(appointments),
  galleryItems: many(galleryItems),
  customerInquiries: many(customerInquiries),
  specialOffers: many(specialOffers),
  proOrders: many(proOrders),
}));

export const stylistsRelations = relations(stylists, ({ one, many }) => ({
  salon: one(salons, { fields: [stylists.salonId], references: [salons.id] }),
  user: one(users, { fields: [stylists.userId], references: [users.id] }),
  appointments: many(appointments),
}));

export const servicesRelations = relations(services, ({ one, many }) => ({
  salon: one(salons, { fields: [services.salonId], references: [salons.id] }),
  localizations: many(serviceLocalizations),
  appointments: many(appointments),
}));

export const packagesRelations = relations(packages, ({ one, many }) => ({
  salon: one(salons, { fields: [packages.salonId], references: [salons.id] }),
  appointments: many(appointments),
}));

export const galleryItemsRelations = relations(galleryItems, ({ one }) => ({
  salon: one(salons, { fields: [galleryItems.salonId], references: [salons.id] }),
}));

export const customerInquiriesRelations = relations(customerInquiries, ({ one }) => ({
  salon: one(salons, { fields: [customerInquiries.salonId], references: [salons.id] }),
}));

export const specialOffersRelations = relations(specialOffers, ({ one }) => ({
  salon: one(salons, { fields: [specialOffers.salonId], references: [salons.id] }),
}));

export const appointmentsRelations = relations(appointments, ({ one, many }) => ({
  consumer: one(users, { fields: [appointments.consumerId], references: [users.id] }),
  stylist: one(stylists, { fields: [appointments.stylistId], references: [stylists.id] }),
  service: one(services, { fields: [appointments.serviceId], references: [services.id] }),
  package: one(packages, { fields: [appointments.packageId], references: [packages.id] }),
  salon: one(salons, { fields: [appointments.salonId], references: [salons.id] }),
  transactions: many(transactions),
}));

export const transactionsRelations = relations(transactions, ({ one }) => ({
  appointment: one(appointments, { fields: [transactions.appointmentId], references: [appointments.id] }),
}));

export type User = typeof users.$inferSelect;
export type Salon = typeof salons.$inferSelect;
export type Stylist = typeof stylists.$inferSelect;
export type Service = typeof services.$inferSelect;
export type Package = typeof packages.$inferSelect;
export type Appointment = typeof appointments.$inferSelect;
export type GalleryItem = typeof galleryItems.$inferSelect;
export type CustomerInquiry = typeof customerInquiries.$inferSelect;
export type SpecialOffer = typeof specialOffers.$inferSelect;
export type Product = typeof products.$inferSelect;
export type Transaction = typeof transactions.$inferSelect;

export const defaultTimestampSql = sql`(unixepoch() * 1000)`;
