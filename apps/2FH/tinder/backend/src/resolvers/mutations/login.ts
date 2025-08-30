import { MutationResolvers, LoginResponse, UserResponse } from "src/generated";
import { User } from "src/models";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

class LoginError extends Error {}

async function findUserByEmail(email: string) {
  return await User.findOne({ email });
}

async function validatePassword(password: string, hashedPassword: string) {
  return await bcryptjs.compare(password, hashedPassword);
}

function createToken(userId: string, secret: string) {
  return jwt.sign({ userId }, secret, { expiresIn: "1d" });
}

function getJwtSecretOrThrow(): string {
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    throw new LoginError("JWT secret is not configured");
  }
  return jwtSecret;
}

async function getUserOrThrow(email: string) {
  const user = await findUserByEmail(email);
  if (!user) {
    throw new LoginError("Email address not registered");
  }
  return user;
}

async function assertPasswordOrThrow(password: string, hashedPassword: string) {
  const isValid = await validatePassword(password, hashedPassword);
  if (!isValid) {
    throw new LoginError("Incorrect password");
  }
}

function toErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return "Unknown error during login";
}

export const login: MutationResolvers["login"] = async (
  _,
  { email, password }
): Promise<LoginResponse> => {
  try {
    const user = await getUserOrThrow(email);
    await assertPasswordOrThrow(password, user.password);
    const jwtSecret = getJwtSecretOrThrow();
    const token = createToken(user._id.toString(), jwtSecret);

    return {
      status: UserResponse.Success,
      message: "Login successful",
      token,
      user: {
        id: user._id.toString(),
        email: user.email,
        password: user.password,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
      },
    }; 
  } catch (error: unknown) {
    return {
      status: UserResponse.Error,
      message: toErrorMessage(error),
      token: undefined,
      user: undefined,
    };
  }
};