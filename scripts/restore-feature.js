const fs = require("fs");
const path = require("path");

const backupName = process.argv[2];

if (!backupName) {
  console.error("Please provide a backup name");
  console.log(`
Usage: npm run restore-feature <backupName>

Example: 
  npm run restore-feature auth-2024-03-20T10-30-45-000Z
`);
  process.exit(1);
}

try {
  const backupPath = path.join(process.cwd(), "backups", backupName);

  // Check if backup exists
  if (!fs.existsSync(backupPath)) {
    throw new Error(`Backup "${backupName}" does not exist`);
  }

  // Extract feature name from backup name
  const featureName = backupName.split("-")[0];
  const featurePath = path.join(
    process.cwd(),
    "app",
    "(features)",
    featureName,
  );

  // Check if feature already exists
  if (fs.existsSync(featurePath)) {
    throw new Error(
      `Feature "${featureName}" already exists. Delete it first if you want to restore from backup.`,
    );
  }

  // Restore from backup
  fs.cpSync(backupPath, featurePath, { recursive: true });

  console.log(`✅ Feature "${featureName}" restored successfully from backup!`);
} catch (error) {
  console.error("❌ Error:", error.message);
  process.exit(1);
}
