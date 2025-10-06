// import { NextRequest } from "next/server";
// import { Client } from "ssh2";

// const SSH_HOST = process.env.SSH_HOST!;
// const SSH_PORT = Number(process.env.SSH_PORT || 22);
// const SSH_USER = process.env.SSH_USER!;
const SSH_PRIVATE_KEY = process.env.SSH_PRIVATE_KEY?.replace(/\\n/g, "\n");


// const COMMANDS = [
//   `cd /var/www/admin.uditha.space/nexus-app && \
//    export NVM_DIR=~/.nvm && \
//    source ~/.nvm/nvm.sh && \
//    nvm use 22 && \
//    node -v && \
//    git checkout production && \
//    git branch && \
//    git stash && \
//    git pull && \
//    npm install && \
//    npx browserslist@latest --update-db && \
//    if [ -d ".next" ]; then \
//      echo "Backing up current .next folder..." && \
//      rm -rf .next.backup && \
//      mv .next .next.backup && \
//      echo "Backup completed"; \
//    fi && \
//    echo "Starting build..." && \
//    if npm run build; then \
//      echo "Build successful!" && \
//      rm -rf .next.backup && \
//      pm2 restart nexus_app_3011 && \
//      echo "Deployment Completed Successfully"; \
//    else \
//      echo "Build failed! Rolling back..." && \
//      if [ -d ".next.backup" ]; then \
//        rm -rf .next && \
//        mv .next.backup .next && \
//        pm2 restart admin_app && \
//        echo "Rollback completed"; \
//      else \
//        echo "No backup found, cannot rollback"; \
//      fi && \
//      exit 1; \
//    fi`
// ];


// // eslint-disable-next-line @typescript-eslint/no-unused-vars
// export async function GET(_req: NextRequest) {
//   const { readable, writable } = new TransformStream();
//   const writer = writable.getWriter();

//   const send = async (message: string) => {
//     await writer.write(`data: ${message}\n\n`);
//   };

//   const conn = new Client();

//   conn.on("ready", () => {
//     let i = 0;

//     const runNextCommand = () => {
//       if (i >= COMMANDS.length) {
//         send("✅ Deployment finished!");
//         conn.end();
//         writer.close();
//         return;
//       }

//       const cmd = COMMANDS[i];
//       send(`💻 Running: ${cmd}`);

//       conn.exec(cmd, (err, stream) => {
//         if (err) {
//           send(`❌ Error running command: ${cmd}`);
//           conn.end();
//           writer.close();
//           return;
//         }

//         stream
//           .on("data", (data: Buffer) => send(data.toString()))
//           .stderr.on("data", (data: Buffer) => send(`ERR: ${data.toString()}`))
//           .on("close", () => {
//             i++;
//             runNextCommand();
//           });
//       });
//     };

//     runNextCommand();
//   }).connect({
//     host: SSH_HOST,
//     port: SSH_PORT,
//     username: SSH_USER,
//     privateKey: SSH_PRIVATE_KEY,
//   });

//   return new Response(readable, {
//     headers: { "Content-Type": "text/event-stream" },
//   });
// }

import { NextRequest } from "next/server";
import { Client } from "ssh2";
import { connectDB } from "@/lib/mongodb";
import Deployment from "@/models/Deployment";

// const SSH_PRIVATE_KEY = process.env.SSH_PRIVATE_KEY?.replace(/\\n/g, "\n");

export async function GET(req: NextRequest) {
  await connectDB();

  const id = req.nextUrl.searchParams.get("id");
  const deployment = await Deployment.findById(id);
  if (!deployment)
    return new Response("Not found", { status: 404 });

  const { host, port, user, hostedPath, nodeVersion, branch } = deployment;

  const COMMANDS = [
  `cd ${hostedPath} && \
   export NVM_DIR=~/.nvm && \
   source ~/.nvm/nvm.sh && \
   nvm use ${nodeVersion} && \
   node -v && \
   git checkout ${branch} && \
   git branch && \
   git stash && \
   git pull && \
   npm install && \
   npx browserslist@latest --update-db && \
    if [ -d ".next" ]; then \
      echo "Backing up current .next folder..." && \
      rm -rf .next.backup && \
      mv .next .next.backup && \
      echo "Backup completed"; \
    fi && \
    echo "Starting build..." && \
    if npm run build; then \
      echo "Build successful!" && \
      rm -rf .next.backup && \
      pm2 restart nexus_app_3011 && \
      echo "Deployment Completed Successfully"; \
    else \
      echo "Build failed! Rolling back..." && \
      if [ -d ".next.backup" ]; then \
        rm -rf .next && \
        mv .next.backup .next && \
        pm2 restart admin_app && \
        echo "Rollback completed"; \
      else \
        echo "No backup found, cannot rollback"; \
      fi && \
     exit 1; \
    fi`
  ];

  const { readable, writable } = new TransformStream();
  const writer = writable.getWriter();

  const send = async (message: string) => {
    await writer.write(`data: ${message}\n\n`);
  };

  const conn = new Client();

  conn.on("ready", () => {
    let i = 0;

    const runNextCommand = () => {
      if (i >= COMMANDS.length) {
        send("✅ Deployment finished!");
        conn.end();
        writer.close();
        return;
      }

      const cmd = COMMANDS[i];
      send(`💻 Running: ${cmd}`);

      conn.exec(cmd, (err, stream) => {
        if (err) {
          send(`❌ Error running command: ${cmd}`);
          conn.end();
          writer.close();
          return;
        }

        stream
          .on("data", (data: Buffer) => send(data.toString()))
          .stderr.on("data", (data: Buffer) => send(`ERR: ${data.toString()}`))
          .on("close", () => {
            i++;
            runNextCommand();
          });
      });
    };

    runNextCommand();
  }).connect({
    host,
    port: Number(port),
    username: user,
    privateKey: SSH_PRIVATE_KEY,
  });

  return new Response(readable, {
    headers: { "Content-Type": "text/event-stream" },
  });

  // const { readable, writable } = new TransformStream();
  // const writer = writable.getWriter();
  // const send = async (m: string) => writer.write(`data: ${m}\n\n`);

  // const conn = new Client();
  // conn
  //   .on("ready", () => {
  //     send("🔗 Connected to server...");
  //     conn.exec(COMMAND, (err, stream) => {
  //       if (err) {
  //         send(`❌ Error: ${err.message}`);
  //         conn.end();
  //         writer.close();
  //         return;
  //       }
  //       stream
  //         .on("data", (d: Buffer) => send(d.toString()))
  //         .stderr.on("data", (d: Buffer) => send(`ERR: ${d}`))
  //         .on("close", () => {
  //           send("✅ Deployment finished!");
  //           conn.end();
  //           writer.close();
  //         });
  //     });
  //   })
  //   .connect({
  //     host,
  //     port: Number(port),
  //     username: user,
  //     privateKey: SSH_PRIVATE_KEY,
  //   });

  // return new Response(readable, { headers: { "Content-Type": "text/event-stream" } });
}

