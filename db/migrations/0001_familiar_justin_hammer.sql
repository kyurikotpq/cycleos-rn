ALTER TABLE `symptoms` ADD `created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL;