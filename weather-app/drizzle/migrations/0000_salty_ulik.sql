CREATE TABLE `users` (
	`id` text PRIMARY KEY DEFAULT 'c3b4f880-8881-11ee-a608-c1a4a3662d82' NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_id_unique` ON `users` (`id`);