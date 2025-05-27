import { IUser, User, UserRole } from "src/models/user"

interface CreateUserInput {
    input: {
        email: string,
        password: string,
        phoneNumber: string,
        role?: UserRole
    };
}

export const createUser = async (_: any, {input}: CreateUserInput): Promise<IUser> => { 
    const existingUser = await User.findOne({ email: input.email });
    if (existingUser) {
        throw new Error("User already exist")
    }
    const newUser = new User({
        email: input.email,
        password: input.password,
        phoneNumber: input.phoneNumber,
        role: input.role || UserRole.USER
    });
    return await newUser.save()
}