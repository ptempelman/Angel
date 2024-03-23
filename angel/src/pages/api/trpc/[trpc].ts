import { createNextApiHandler, NextApiRequest, NextApiResponse } from "@trpc/server/adapters/next";
import cors from "nextjs-cors";

import { env } from "~/env";
import { appRouter } from "~/server/api/root";
import { createTRPCContext } from "~/server/api/trpc";

function setCorsHeaders(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*'); // Adjust the origin according to your needs
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS'); // Adjust the methods according to your needs
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization'); // Adjust the headers according to your needs

  // Handle OPTIONS method
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return true;
  }

  return false;
}

// export API handler
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Apply CORS headers and handle OPTIONS request
  if (setCorsHeaders(req, res)) return;

  // Proceed with tRPC handler if not an OPTIONS request
  return createNextApiHandler({
    router: appRouter,
    createContext: createTRPCContext,
    onError:
      process.env.NODE_ENV === "development"
        ? ({ path, error }) => {
          console.error(
            `❌ tRPC failed on ${path ?? "<no-path>"}: ${error.message}`
          );
        }
        : undefined,
  })(req, res);
}