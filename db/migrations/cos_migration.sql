CREATE TABLE `cycle_days` (
	`id` integer PRIMARY KEY NOT NULL,
	`cycle_id` integer NOT NULL,
	`date_id` text NOT NULL,
	`zone_offset` integer NOT NULL,
	`phase` text(20),
	FOREIGN KEY (`cycle_id`) REFERENCES `cycles`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `cycles` (
	`id` integer PRIMARY KEY NOT NULL,
	`start_date` integer,
	`start_zone_offset` integer,
	`end_date` integer,
	`period_length` integer,
	`cycle_length` integer
);
--> statement-breakpoint
CREATE TABLE `exercises` (
	`id` integer PRIMARY KEY NOT NULL,
	`day_id` integer NOT NULL,
	`start_datetime` integer NOT NULL,
	`start_zone_offset` integer NOT NULL,
	`end_datetime` integer NOT NULL,
	`end_zone_offset` integer NOT NULL,
	`exercise_type` integer NOT NULL,
	`notes` text(255),
	FOREIGN KEY (`day_id`) REFERENCES `cycle_days`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `sleep_sessions` (
	`id` integer PRIMARY KEY NOT NULL,
	`day_id` integer NOT NULL,
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
	`WASO` numeric,
	`fragmentation_index` integer,
	FOREIGN KEY (`day_id`) REFERENCES `cycle_days`(`id`) ON UPDATE no action ON DELETE no action
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
	`id` integer PRIMARY KEY NOT NULL,
	`day_id` integer NOT NULL,
	`steps` integer NOT NULL,
	FOREIGN KEY (`day_id`) REFERENCES `cycle_days`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `symptoms` (
	`id` integer PRIMARY KEY NOT NULL,
	`day_id` integer NOT NULL,
	`type` text(20) NOT NULL,
	`construct_value` integer,
	FOREIGN KEY (`day_id`) REFERENCES `cycle_days`(`id`) ON UPDATE no action ON DELETE no action
);
