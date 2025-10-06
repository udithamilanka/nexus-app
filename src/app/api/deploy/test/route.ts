import { NextRequest } from "next/server";
import { Client } from "ssh2";

const SSH_HOST = process.env.SSH_HOST!;
const SSH_PORT = Number(process.env.SSH_PORT || 22);
const SSH_USER = process.env.SSH_USER!;
const SSH_PRIVATE_KEY = process.env.SSH_PRIVATE_KEY?.replace(/\\n/g, "\n");


const COMMANDS = [
  `htop`
];


// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(_req: NextRequest) {
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
    host: SSH_HOST,
    port: SSH_PORT,
    username: SSH_USER,
    privateKey: SSH_PRIVATE_KEY,
  });

  return new Response(readable, {
    headers: { "Content-Type": "text/event-stream" },
  });
}
