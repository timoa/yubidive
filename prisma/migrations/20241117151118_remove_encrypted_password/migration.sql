-- Remove encrypted password field from User table
ALTER TABLE "User" DROP COLUMN "encryptedPassword";
