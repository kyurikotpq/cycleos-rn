CREATE TABLE `cycles` (
	`id` integer PRIMARY KEY NOT NULL,
	`start_date` integer,
	`start_zone_offset` integer,
	`end_date` integer,
	`period_length` integer,
	`cycle_length` integer
);
--> statement-breakpoint
CREATE TABLE `cycle_days` (
	`date_id` text PRIMARY KEY NOT NULL,
	`cycle_id` integer,
	`zone_offset` integer NOT NULL,
	`phase` text(20),
	`notes` text(255),
	FOREIGN KEY (`cycle_id`) REFERENCES `cycles`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE TABLE `exercises` (
	`id` integer PRIMARY KEY NOT NULL,
	`day_id` text NOT NULL,
	`start_datetime` integer NOT NULL,
	`start_zone_offset` integer NOT NULL,
	`end_datetime` integer NOT NULL,
	`end_zone_offset` integer NOT NULL,
	`exercise_type` integer NOT NULL,
	`notes` text(255),
	FOREIGN KEY (`day_id`) REFERENCES `cycle_days`(`date_id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `sleep_sessions` (
	`id` integer PRIMARY KEY NOT NULL,
	`day_id` text NOT NULL,
	`start_datetime` integer NOT NULL,
	`start_zone_offset` integer NOT NULL,
	`end_datetime` integer NOT NULL,
	`end_zone_offset` integer NOT NULL,
	`duration` numeric NOT NULL,
	`total_awake` numeric NOT NULL,
	`total_rem` numeric NOT NULL,
	`total_light` numeric NOT NULL,
	`total_deep` numeric NOT NULL,
	`rem_latency` numeric,
	`fragmentation_index` numeric,
	FOREIGN KEY (`day_id`) REFERENCES `cycle_days`(`date_id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `sleep_stages` (
	`id` integer PRIMARY KEY NOT NULL,
	`sleep_session_id` integer NOT NULL,
	`start_datetime` integer NOT NULL,
	`start_zone_offset` integer NOT NULL,
	`end_datetime` integer NOT NULL,
	`end_zone_offset` integer NOT NULL,
	`sleep_type` integer NOT NULL,
	FOREIGN KEY (`sleep_session_id`) REFERENCES `sleep_sessions`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `steps` (
	`day_id` text PRIMARY KEY NOT NULL,
	`steps` integer NOT NULL,
	FOREIGN KEY (`day_id`) REFERENCES `cycle_days`(`date_id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `symptoms` (
	`day_id` text NOT NULL,
	`symptom_id` integer,
	PRIMARY KEY(`day_id`, `symptom_id`),
	FOREIGN KEY (`day_id`) REFERENCES `cycle_days`(`date_id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`symptom_id`) REFERENCES `symptoms_constructs`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `symptoms_constructs` (
	`id` integer PRIMARY KEY NOT NULL,
	`type` text(20) NOT NULL,
	`label` text(50) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `constructUniqueIndex` ON `symptoms_constructs` (lower("type"),lower("label"));