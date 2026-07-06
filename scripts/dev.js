import { createServer } from "node:http";
import worker from "../worker/index.js";

const port = Number(process.env.PORT || 5175);
const host = "127.0.0.1";

const server = createServer(async (request, response) => {
  if (request.url === "/favicon.ico") {
    response.writeHead(204);
    response.end();
    return;
  }

  const workerRequest = new Request(`http://${host}:${port}${request.url}`);
  const workerResponse = await worker.fetch(workerRequest);
  response.writeHead(workerResponse.status, {
    "content-type": workerResponse.headers.get("content-type") || "text/html; charset=utf-8",
  });
  response.end(await workerResponse.text());
});

server.listen(port, host, () => {
  console.log(`Money Planet preview: http://${host}:${port}/`);
});
