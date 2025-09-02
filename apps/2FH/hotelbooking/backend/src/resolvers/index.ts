import { UserModel } from 'src/models';
import { mapBookingStatusToGraphQL } from './common/booking-status.mapper';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import * as Mutation from './mutations';
import * as Query from './queries';
import { LoginInput, LoginResponse } from 'src/generated';

// Interface for the parent object in field resolvers
interface BookingParent {
  id?: string;
  _id?: string;
  userId?: string;
  user_id?: string;
  hotelId?: string;
  hotel_id?: string;
  roomId?: string;
  room_id?: string;
  checkInDate?: string;
  check_in_date?: string;
  checkOutDate?: string;
  check_out_date?: string;
  adults?: number;
  children?: number;
  status?: string;
  createdAt?: string;
  created_at?: string;
  updatedAt?: string;
  updated_at?: string;
  [key: string]: unknown;
}

// Helper functions for Booking resolvers
const validateParent = (parent: BookingParent, fieldName: string): void => {
  if (!parent) {
    throw new Error(`Cannot return null for non-nullable field Booking.${fieldName}. Parent object is missing.`);
  }
};

const getPrimaryFieldValue = (parent: BookingParent, fieldName: string): unknown => parent[fieldName];

const getFallbackFieldValue = (parent: BookingParent, fallbackField: string): unknown => parent[fallbackField];

const validateFieldValue = (value: unknown, fieldName: string): unknown => {
  if (value === null || value === undefined) {
    throw new Error(`Cannot return null for non-nullable field Booking.${fieldName}.`);
  }
  return value;
};

const getFieldValue = (parent: BookingParent, fieldName: string, fallbackField?: string): unknown => {
  let value = getPrimaryFieldValue(parent, fieldName);
  if (fallbackField && (value === null || value === undefined)) {
    value = getFallbackFieldValue(parent, fallbackField);
  }
  return validateFieldValue(value, fieldName);
};

const logParentObjectDetails = (parent: BookingParent): void => {
  console.error('ID field resolver - parent object:', {
    hasId: !!parent.id,
    hasUnderscoreId: !!parent._id,
    parentKeys: Object.keys(parent),
    parentType: typeof parent,
    parentValue: parent,
  });
};

const resolveIdField = (parent: BookingParent): string => {
  const value = parent.id || parent._id;
  if (value === null || value === undefined) {
    logParentObjectDetails(parent);
    throw new Error('Cannot return null for non-nullable field Booking.id.');
  }
  return value as string;
};

const createFieldResolver = (fieldName: string, fallbackField?: string) => {
  return (parent: BookingParent) => {
    validateParent(parent, fieldName);
    return getFieldValue(parent, fieldName, fallbackField);
  };
};
const findUser = async (email: string) => {
  const u = await UserModel.findOne({ email });
  if (!u) throw new Error('Invalid email or password');
  return u;
};

const checkPassword = async (password: string, hash: string) => {
  const valid = await bcrypt.compare(password, hash);
  if (!valid) throw new Error('Invalid email or password');
};

const ensureString = (value: string | undefined | null): string => {
  return value != null ? value : '';
};

const createToken = (userId: string) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET missing');
  return jwt.sign({ id: userId }, secret, { expiresIn: '14d' });
};
// --- resolvers ---
export const resolvers = {
  Query,
  Mutation: {
    ...Mutation,
    // --- login resolver with complexity ≤4 ---
    login: async (_: any, { input }: { input: LoginInput }): Promise<LoginResponse> => {
      const user = await findUser(input.email);
      await checkPassword(input.password, user.password);

      const token = createToken(user._id.toString());

      return {
        token,
        user: {
          _id: user._id.toString(),
          email: user.email,
          firstName: ensureString(user.firstName),
          lastName: ensureString(user.lastName),
          dateOfBirth: ensureString(user.dateOfBirth),
          role: user.role,
        },
      };
    },
  },

  Booking: {
    id: (parent: BookingParent) => resolveIdField(parent),
    userId: createFieldResolver('userId', 'user_id'),
    hotelId: createFieldResolver('hotelId', 'hotel_id'),
    roomId: createFieldResolver('roomId', 'room_id'),
    checkInDate: createFieldResolver('checkInDate', 'check_in_date'),
    checkOutDate: createFieldResolver('checkOutDate', 'check_out_date'),
    adults: createFieldResolver('adults'),
    children: createFieldResolver('children'),
    status: (parent: BookingParent) => {
      const statusValue = getFieldValue(parent, 'status');
      return mapBookingStatusToGraphQL(statusValue as string);
    },
    createdAt: (parent: BookingParent) => parent?.createdAt || parent?.created_at,
    updatedAt: (parent: BookingParent) => parent?.updatedAt || parent?.updated_at,
  },
};
