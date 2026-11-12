// Extends Express Request so every route has typed access to `req.user`
// after the authenticate middleware runs.

import { Role } from '@prisma/client';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role: Role;
        artisanProfileId?: string;
      };
    }
  }
}

