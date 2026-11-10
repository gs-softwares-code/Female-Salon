CREATE TABLE `appointments` (
	`id` text PRIMARY KEY NOT NULL,
	`consumer_id` text,
	`stylist_id` text NOT NULL,
	`service_id` text,
	`package_id` text,
	`salon_id` text NOT NULL,
	`customer_name` text NOT NULL,
	`customer_email` text NOT NULL,
	`customer_phone` text NOT NULL,
	`booking_notes` text,
	`start_time` integer NOT NULL,
	`end_time` integer NOT NULL,
	`status` text DEFAULT 'CONFIRMED' NOT NULL,
	`total_price` integer DEFAULT 0 NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`consumer_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`stylist_id`) REFERENCES `stylists`(`id`) ON UPDATE no action ON DELETE restrict,
	FOREIGN KEY (`service_id`) REFERENCES `services`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`package_id`) REFERENCES `packages`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`salon_id`) REFERENCES `salons`(`id`) ON UPDATE no action ON DELETE restrict
);
--> statement-breakpoint
CREATE UNIQUE INDEX `appointments_booking_lookup_idx` ON `appointments` (`stylist_id`,`start_time`);--> statement-breakpoint
CREATE TABLE `auth_keys` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`provider_id` text DEFAULT 'email' NOT NULL,
	`provider_user_id` text NOT NULL,
	`hashed_password` text NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `auth_keys_provider_user_idx` ON `auth_keys` (`provider_id`,`provider_user_id`);--> statement-breakpoint
CREATE TABLE `brands` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`slug` text NOT NULL,
	`category` text NOT NULL,
	`description` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `brands_slug_unique` ON `brands` (`slug`);--> statement-breakpoint
CREATE TABLE `customer_inquiries` (
	`id` text PRIMARY KEY NOT NULL,
	`salon_id` text NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`phone` text,
	`subject` text,
	`message` text NOT NULL,
	`status` text DEFAULT 'UNREAD' NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`salon_id`) REFERENCES `salons`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `franchise_agreements` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`territory` text NOT NULL,
	`royalty_rate` real NOT NULL,
	`status` text DEFAULT 'PENDING' NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `gallery_items` (
	`id` text PRIMARY KEY NOT NULL,
	`salon_id` text NOT NULL,
	`title` text NOT NULL,
	`category` text NOT NULL,
	`image_url` text NOT NULL,
	`before_image_url` text,
	`after_image_url` text,
	`description` text,
	`stylist_name` text,
	`is_featured` integer DEFAULT true NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`salon_id`) REFERENCES `salons`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `packages` (
	`id` text PRIMARY KEY NOT NULL,
	`salon_id` text NOT NULL,
	`name` text NOT NULL,
	`slug` text NOT NULL,
	`subtitle` text,
	`description` text,
	`duration_mins` integer DEFAULT 180 NOT NULL,
	`original_price` integer NOT NULL,
	`price` integer NOT NULL,
	`currency` text DEFAULT 'USD' NOT NULL,
	`includes` text,
	`badge` text,
	`image_url` text,
	`is_featured` integer DEFAULT true NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`salon_id`) REFERENCES `salons`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `packages_slug_unique` ON `packages` (`slug`);--> statement-breakpoint
CREATE TABLE `pro_orders` (
	`id` text PRIMARY KEY NOT NULL,
	`salon_id` text NOT NULL,
	`product_id` text NOT NULL,
	`quantity` integer NOT NULL,
	`status` text DEFAULT 'DRAFT' NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`salon_id`) REFERENCES `salons`(`id`) ON UPDATE no action ON DELETE restrict,
	FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON UPDATE no action ON DELETE restrict
);
--> statement-breakpoint
CREATE TABLE `products` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`sku` text NOT NULL,
	`price` integer NOT NULL,
	`stock_count` integer DEFAULT 0 NOT NULL,
	`is_pro_only` integer DEFAULT false NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `products_sku_unique` ON `products` (`sku`);--> statement-breakpoint
CREATE TABLE `salons` (
	`id` text PRIMARY KEY NOT NULL,
	`franchisee_id` text,
	`brand_id` text NOT NULL,
	`name` text NOT NULL,
	`slug` text NOT NULL,
	`address` text NOT NULL,
	`city` text DEFAULT 'New York',
	`phone` text DEFAULT '+1 (555) 728-2831',
	`email` text DEFAULT 'concierge@aegisbeauty.com',
	`hours` text DEFAULT 'Mon - Sat: 9:00 AM - 8:00 PM | Sun: 10:00 AM - 6:00 PM',
	`lat` real NOT NULL,
	`lng` real NOT NULL,
	`status` text DEFAULT 'ACTIVE' NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`franchisee_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`brand_id`) REFERENCES `brands`(`id`) ON UPDATE no action ON DELETE restrict
);
--> statement-breakpoint
CREATE UNIQUE INDEX `salons_slug_unique` ON `salons` (`slug`);--> statement-breakpoint
CREATE TABLE `service_localizations` (
	`id` text PRIMARY KEY NOT NULL,
	`service_id` text NOT NULL,
	`locale` text NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`price` integer NOT NULL,
	`currency` text NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`service_id`) REFERENCES `services`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `service_localizations_service_locale_idx` ON `service_localizations` (`service_id`,`locale`);--> statement-breakpoint
CREATE TABLE `services` (
	`id` text PRIMARY KEY NOT NULL,
	`salon_id` text NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`duration_mins` integer NOT NULL,
	`price` integer NOT NULL,
	`currency` text DEFAULT 'USD' NOT NULL,
	`category` text NOT NULL,
	`image_url` text,
	`is_featured` integer DEFAULT false NOT NULL,
	`is_best_seller` integer DEFAULT false NOT NULL,
	`status` text DEFAULT 'ACTIVE' NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`salon_id`) REFERENCES `salons`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `sessions` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`expires_at` integer NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `special_offers` (
	`id` text PRIMARY KEY NOT NULL,
	`salon_id` text NOT NULL,
	`code` text NOT NULL,
	`title` text NOT NULL,
	`description` text NOT NULL,
	`discount_percent` integer DEFAULT 15 NOT NULL,
	`valid_until` text,
	`is_first_visit` integer DEFAULT false NOT NULL,
	`is_active` integer DEFAULT true NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`salon_id`) REFERENCES `salons`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `special_offers_code_unique` ON `special_offers` (`code`);--> statement-breakpoint
CREATE TABLE `stylists` (
	`id` text PRIMARY KEY NOT NULL,
	`salon_id` text NOT NULL,
	`user_id` text,
	`name` text NOT NULL,
	`title` text DEFAULT 'Master Stylist & Beauty Artist',
	`specialization` text DEFAULT 'Hair Styling & Color',
	`experience_years` integer DEFAULT 8,
	`avatar_url` text,
	`bio` text,
	`rating` real DEFAULT 4.9,
	`commission_rate` real DEFAULT 0 NOT NULL,
	`status` text DEFAULT 'ACTIVE' NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`salon_id`) REFERENCES `salons`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE TABLE `transactions` (
	`id` text PRIMARY KEY NOT NULL,
	`appointment_id` text NOT NULL,
	`amount` integer NOT NULL,
	`payment_status` text DEFAULT 'SUCCEEDED' NOT NULL,
	`provider_reference` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`appointment_id`) REFERENCES `appointments`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`name` text,
	`phone` text,
	`password_hash` text NOT NULL,
	`role` text DEFAULT 'CONSUMER' NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);