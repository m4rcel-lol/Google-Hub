import {
  createAdminUser,
  getUserStorePath,
  listUsers,
} from "../src/server/userStore.ts";

function readArg(name: string) {
  const index = process.argv.indexOf(name);
  if (index === -1) return undefined;
  return process.argv[index + 1];
}

function usage() {
  console.log(`Usage:
  npm run admin:create -- --username admin --password "long-password"
  npm run admin:list

Environment alternatives:
  ADMIN_USERNAME=admin ADMIN_PASSWORD="long-password" npm run admin:create`);
}

const command = process.argv[2];

if (command === "list") {
  const users = await listUsers();
  if (users.length === 0) {
    console.log(`No users found in ${getUserStorePath()}`);
  } else {
    for (const user of users) {
      console.log(`${user.username}\t${user.role}\t${user.disabled ? "disabled" : "active"}`);
    }
  }
} else if (command === "create") {
  const username = readArg("--username") || process.env.ADMIN_USERNAME;
  const password = readArg("--password") || process.env.ADMIN_PASSWORD;

  if (!username || !password) {
    usage();
    process.exitCode = 2;
  } else {
    const user = await createAdminUser(username, password);
    console.log(`Created admin user "${user.username}" in ${getUserStorePath()}`);
  }
} else {
  usage();
  process.exitCode = 2;
}
