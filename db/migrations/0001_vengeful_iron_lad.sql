PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_sleep_stages` (
	`id` integer PRIMARY KEY NOT NULL,
	`sleep_session_id` integer NOT NULL,
	`start_datetime` integer NOT NULL,
	`start_zone_offset` integer NOT NULL,
	`end_datetime` integer NOT NULL,
	`end_zone_offset` integer NOT NULL,
	`sleep_type` integer NOT NULL,
	FOREIGN KEY (`sleep_session_id`) REFERENCES `sleep_sessions`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_sleep_stages`("id", "sleep_session_id", "start_datetime", "start_zone_offset", "end_datetime", "end_zone_offset", "sleep_type") SELECT "id", "sleep_session_id", "start_datetime", "start_zone_offset", "end_datetime", "end_zone_offset", "sleep_type" FROM `sleep_stages`;--> statement-breakpoint
DROP TABLE `sleep_stages`;--> statement-breakpoint
ALTER TABLE `__new_sleep_stages` RENAME TO `sleep_stages`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `sleepStageUniqueIndex` ON `sleep_stages` (`start_datetime`,`sleep_type`);--> statement-breakpoint
CREATE UNIQUE INDEX `cycles_start_date_unique` ON `cycles` (`start_date`);--> statement-breakpoint
CREATE UNIQUE INDEX `exerciseUniqueIndex` ON `exercises` (`day_id`,`start_datetime`);--> statement-breakpoint
CREATE UNIQUE INDEX `sleepSessionUniqueIndex` ON `sleep_sessions` (`day_id`,`start_datetime`);