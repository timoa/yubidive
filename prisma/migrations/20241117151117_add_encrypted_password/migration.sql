-- Add encrypted password field to User table
ALTER TABLE "User" ADD COLUMN "encryptedPassword" TEXT NOT NULL DEFAULT '';
