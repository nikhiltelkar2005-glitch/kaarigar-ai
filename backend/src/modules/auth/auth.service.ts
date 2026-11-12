import argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import { db } from '../../config/database';
import { env } from '../../config/env';
import { AppError } from '../../utils/AppError';
import type { RegisterInput, LoginInput } from './auth.schema';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const ARGON2_OPTIONS: argon2.Options = {
  type: argon2.argon2id,
  memoryCost: 2 ** 16, // 64 MiB
  timeCost: 3,
  parallelism: 1,
};

function signAccessToken(userId: string, email: string, role: string): string {
  return jwt.sign(
    { userId, email, role },
    env.JWT_ACCESS_SECRET,
    { expiresIn: env.JWT_ACCESS_EXPIRY as jwt.SignOptions['expiresIn'] },
  );
}

function signRefreshToken(userId: string, email: string, role: string): string {
  return jwt.sign(
    { userId, email, role },
    env.JWT_REFRESH_SECRET,
    { expiresIn: env.JWT_REFRESH_EXPIRY as jwt.SignOptions['expiresIn'] },
  );
}

function refreshExpiresAt(): Date {
  // 7 days from now
  const d = new Date();
  d.setDate(d.getDate() + 7);
  return d;
}

// ─── Service ──────────────────────────────────────────────────────────────────

export class AuthService {
  // Register a new artisan — creates User + ArtisanProfile in one transaction.
  static async register(input: RegisterInput) {
    // 1. Duplicate check
    const existing = await db.user.findFirst({
      where: {
        OR: [
          { email: input.email.toLowerCase() },
          ...(input.phone ? [{ phone: input.phone }] : []),
        ],
      },
    });

    if (existing) {
      const field = existing.email === input.email.toLowerCase() ? 'email' : 'phone number';
      throw new AppError(`An account with that ${field} already exists.`, 409);
    }

    // 2. Hash password
    const passwordHash = await argon2.hash(input.password, ARGON2_OPTIONS);

    // 3. Atomic create
    const { user, profile } = await db.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email: input.email.toLowerCase(),
          phone: input.phone ?? null,
          passwordHash,
          role: 'ARTISAN',
        },
      });

      const profile = await tx.artisanProfile.create({
        data: {
          userId: user.id,
          fullName: input.fullName,
          businessName: input.businessName,
          craftType: input.craftType,
          city: input.city ?? null,
          state: input.state ?? null,
          pincode: input.pincode ?? null,
        },
      });

      return { user, profile };
    });

    // 4. Issue tokens
    const accessToken = signAccessToken(user.id, user.email, user.role);
    const refreshToken = signRefreshToken(user.id, user.email, user.role);

    await db.refreshToken.create({
      data: { userId: user.id, token: refreshToken, expiresAt: refreshExpiresAt() },
    });

    return {
      tokens: { accessToken, refreshToken },
      user: { id: user.id, email: user.email, phone: user.phone, role: user.role },
      profile,
    };
  }

  // Login with email or phone number.
  static async login(input: LoginInput) {
    const identifier = input.identifier.trim();

    const user = await db.user.findFirst({
      where: {
        OR: [
          { email: identifier.toLowerCase() },
          { phone: identifier },
        ],
      },
      include: { artisanProfile: true },
    });

    // Use identical message to prevent user enumeration
    if (!user) {
      throw new AppError('Invalid credentials.', 401);
    }

    const valid = await argon2.verify(user.passwordHash, input.password);
    if (!valid) {
      throw new AppError('Invalid credentials.', 401);
    }

    const accessToken = signAccessToken(user.id, user.email, user.role);
    const refreshToken = signRefreshToken(user.id, user.email, user.role);

    await db.refreshToken.create({
      data: { userId: user.id, token: refreshToken, expiresAt: refreshExpiresAt() },
    });

    return {
      tokens: { accessToken, refreshToken },
      user: { id: user.id, email: user.email, phone: user.phone, role: user.role },
      profile: user.artisanProfile,
    };
  }

  // Rotate the refresh token and issue a fresh pair.
  static async refresh(rawToken: string) {
    let decoded: { userId: string; email: string; role: string };

    try {
      decoded = jwt.verify(rawToken, env.JWT_REFRESH_SECRET) as typeof decoded;
    } catch {
      throw new AppError('Invalid or expired refresh token.', 401);
    }

    const stored = await db.refreshToken.findUnique({ where: { token: rawToken } });

    if (!stored || stored.revokedAt !== null || stored.expiresAt < new Date()) {
      throw new AppError('Refresh token has been revoked or expired.', 401);
    }

    // Revoke the used token (rotation)
    await db.refreshToken.update({
      where: { id: stored.id },
      data: { revokedAt: new Date() },
    });

    // Issue new pair
    const accessToken = signAccessToken(decoded.userId, decoded.email, decoded.role);
    const refreshToken = signRefreshToken(decoded.userId, decoded.email, decoded.role);

    await db.refreshToken.create({
      data: { userId: decoded.userId, token: refreshToken, expiresAt: refreshExpiresAt() },
    });

    return { accessToken, refreshToken };
  }

  // Revoke the refresh token (logout).
  static async logout(rawToken?: string) {
    if (!rawToken) return;

    await db.refreshToken.updateMany({
      where: { token: rawToken, revokedAt: null },
      data: { revokedAt: new Date() },
    });
  }
}

