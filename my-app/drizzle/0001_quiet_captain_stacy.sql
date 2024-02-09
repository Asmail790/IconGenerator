ALTER TABLE icons ADD `color` text NOT NULL;--> statement-breakpoint
ALTER TABLE icons ADD `style` text NOT NULL;--> statement-breakpoint
ALTER TABLE icons ADD `description` text NOT NULL;--> statement-breakpoint
ALTER TABLE `icons` DROP COLUMN `properties`;--> statement-breakpoint
ALTER TABLE `icons` DROP COLUMN `timestamp`;