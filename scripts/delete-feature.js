const fs = require("fs");
const path = require("path");
const readline = require("readline");

// Get feature name from command line argument
const [featureName, ...flags] = process.argv.slice(2);
const force = flags.includes("--force");

if (!featureName) {
  console.error("Please provide a feature name");
  console.log(`
Usage: npm run delete-feature <featureName> [options]
Options:
  --force    Skip confirmation prompt

Example: 
  npm run delete-feature auth
  npm run delete-feature auth --force
`);
  process.exit(1);
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

async function confirmDeletion() {
  return new Promise((resolve) => {
    rl.question(
      `⚠️  Are you sure you want to delete the "${featureName}" feature? This action cannot be undone. (y/N): `,
      (answer) => {
        rl.close();
        resolve(answer.toLowerCase() === "y");
      },
    );
  });
}

async function deleteFeature() {
  try {
    const basePath = path.join(process.cwd(), "app", "(features)", featureName);

    // Check if feature exists
    if (!fs.existsSync(basePath)) {
      throw new Error(`Feature "${featureName}" does not exist`);
    }

    // Get confirmation unless --force flag is used
    if (!force) {
      const confirmed = await confirmDeletion();
      if (!confirmed) {
        console.log("❌ Deletion cancelled");
        process.exit(0);
      }
    }

    // Function to delete directory recursively
    const deleteFolderRecursive = (path) => {
      if (fs.existsSync(path)) {
        fs.readdirSync(path).forEach((file) => {
          const curPath = `${path}/${file}`;
          if (fs.lstatSync(curPath).isDirectory()) {
            deleteFolderRecursive(curPath);
          } else {
            fs.unlinkSync(curPath);
          }
        });
        fs.rmdirSync(path);
      }
    };

    // Create backup before deletion
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const backupPath = path.join(
      process.cwd(),
      "backups",
      `${featureName}-${timestamp}`,
    );

    // Create backups directory if it doesn't exist
    if (!fs.existsSync(path.join(process.cwd(), "backups"))) {
      fs.mkdirSync(path.join(process.cwd(), "backups"));
      // Add .gitkeep file
      fs.writeFileSync(path.join(process.cwd(), "backups", ".gitkeep"), "");
    }

    // Copy feature to backup
    fs.cpSync(basePath, backupPath, { recursive: true });

    // Delete the feature
    deleteFolderRecursive(basePath);

    console.log(`
✅ Feature "${featureName}" deleted successfully!

A backup has been created at: backups/${featureName}-${timestamp}

To restore the feature, run:
npm run restore-feature ${featureName}-${timestamp}
`);
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
}

deleteFeature();
