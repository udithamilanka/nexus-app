import { NextRequest } from "next/server";
import { Client } from "ssh2";
import { connectDB } from "@/lib/mongodb";
import Deployment from "@/models/Deployment";

const SSH_PRIVATE_KEY = process.env.SSH_PRIVATE_KEY?.replace(/\\n/g, "\n");

export async function GET(req: NextRequest) {
  await connectDB();

  const id = req.nextUrl.searchParams.get("id");
  const deployment = await Deployment.findById(id);
  if (!deployment)
    return new Response("Not found", { status: 404 });

  const { host, port, user, hostedPath, nodeVersion, branch, appNamePM2 } = deployment;

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
      pm2 restart ${appNamePM2} && \
      echo "Deployment Completed Successfully"; \
    else \
      echo "Build failed! Rolling back..." && \
      if [ -d ".next.backup" ]; then \
        rm -rf .next && \
        mv .next.backup .next && \
        pm2 restart ${appNamePM2} && \
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
}

