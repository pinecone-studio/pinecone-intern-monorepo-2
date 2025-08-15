import { GraphQLError } from "graphql";
import { User } from "src/models";
import { createUser } from "src/resolvers/mutations";
import { CreateUserInput } from "src/generated";
import bcrypt from "bcrypt";

jest.mock("src/models", () => ({
  User: { create: jest.fn() },
}));
jest.mock("bcrypt", () => ({ hash: jest.fn() }));

describe("createUser mutation errors", () => {
  const mockUserInput: CreateUserInput = {
    email: "test@example.com",
    password: "password123",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("throws GraphQLError when bcrypt.hash fails with Error", async () => {
    (bcrypt.hash as jest.Mock).mockRejectedValue(new Error("Bcrypt error"));
    const consoleSpy = jest.spyOn(console, "log").mockImplementation();

    if (!createUser) throw new Error("createUser is undefined");
    await expect(
      createUser({}, { input: mockUserInput }, {}, {} as any)
    ).rejects.toThrow(new GraphQLError("Bcrypt error"));

    expect(bcrypt.hash).toHaveBeenCalledWith(mockUserInput.password, 10);
    expect(User.create).not.toHaveBeenCalled();
    expect(consoleSpy).toHaveBeenNthCalledWith(
      1,
      "Creating user with input:",
      JSON.stringify(mockUserInput)
    );
    expect(consoleSpy).toHaveBeenNthCalledWith(2, "Failed to create user:", expect.any(Error));
    consoleSpy.mockRestore();
  });

  it("throws GraphQLError when User.create fails with Error", async () => {
    (bcrypt.hash as jest.Mock).mockResolvedValue("hashedPassword123");
    (User.create as jest.Mock).mockRejectedValue(new Error("Database error"));
    const consoleSpy = jest.spyOn(console, "log").mockImplementation();

    if (!createUser) throw new Error("createUser is undefined");
    await expect(
      createUser({}, { input: mockUserInput }, {}, {} as any)
    ).rejects.toThrow(new GraphQLError("Database error"));

    expect(bcrypt.hash).toHaveBeenCalledWith(mockUserInput.password, 10);
    expect(User.create).toHaveBeenCalledWith({
      email: mockUserInput.email,
      password: "hashedPassword123",
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
    });
    expect(consoleSpy).toHaveBeenNthCalledWith(
      1,
      "Creating user with input:",
      JSON.stringify(mockUserInput)
    );
    expect(consoleSpy).toHaveBeenNthCalledWith(2, "Failed to create user:", expect.any(Error));
    consoleSpy.mockRestore();
  });

  it("throws GraphQLError for non-Error type unknown error", async () => {
    (bcrypt.hash as jest.Mock).mockResolvedValue("hashedPassword123");
    (User.create as jest.Mock).mockRejectedValue("Unknown error");
    const consoleSpy = jest.spyOn(console, "log").mockImplementation();

    if (!createUser) throw new Error("createUser is undefined");
    await expect(
      createUser({}, { input: mockUserInput }, {}, {} as any)
    ).rejects.toThrow(new GraphQLError("Unknown error"));

    expect(bcrypt.hash).toHaveBeenCalledWith(mockUserInput.password, 10);
    expect(User.create).toHaveBeenCalledWith({
      email: mockUserInput.email,
      password: "hashedPassword123",
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
    });
    expect(consoleSpy).toHaveBeenNthCalledWith(
      1,
      "Creating user with input:",
      JSON.stringify(mockUserInput)
    );
    expect(consoleSpy).toHaveBeenNthCalledWith(2, "Failed to create user:", "Unknown error");
    consoleSpy.mockRestore();
  });

  it("rethrows GraphQLError when thrown internally", async () => {
    const graphQLError = new GraphQLError("Custom GraphQL error");
    (bcrypt.hash as jest.Mock).mockRejectedValue(graphQLError);
    const consoleSpy = jest.spyOn(console, "log").mockImplementation();

    if (!createUser) throw new Error("createUser is undefined");
    await expect(
      createUser({}, { input: mockUserInput }, {}, {} as any)
    ).rejects.toThrow(new GraphQLError("Custom GraphQL error"));

    expect(bcrypt.hash).toHaveBeenCalledWith(mockUserInput.password, 10);
    expect(User.create).not.toHaveBeenCalled();
    expect(consoleSpy).toHaveBeenNthCalledWith(
      1,
      "Creating user with input:",
      JSON.stringify(mockUserInput)
    );
    expect(consoleSpy).toHaveBeenNthCalledWith(2, "Failed to create user:", graphQLError);
    consoleSpy.mockRestore();
  });
});