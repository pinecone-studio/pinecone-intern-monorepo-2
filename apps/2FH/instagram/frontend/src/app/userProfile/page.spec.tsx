import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import UserProfile from "./page"; 

describe("UserProfile Component", () => {
  it("renders username and profile actions", () => {
    render(<UserProfile />);

    expect(screen.getByText("username")).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: /Edit Profile/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Ad tools/i })
    ).toBeInTheDocument();
  });

  it("shows posts/followers/following counts", () => {
    render(<UserProfile />);

    expect(screen.getByText(/10 posts/)).toBeInTheDocument();
    expect(screen.getByText(/10 followers/)).toBeInTheDocument();
    expect(screen.getByText(/10 following/)).toBeInTheDocument();
  });

  it("shows posts grid", () => {
    render(<UserProfile />);
    const posts = screen.getAllByText("post");
    expect(posts.length).toBeGreaterThanOrEqual(3);
  });

  it("renders bio and link", () => {
    render(<UserProfile />);
    expect(screen.getByText("Upvox")).toBeInTheDocument();
    expect(screen.getByText("Product/service")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /upvox.net/i })
    ).toBeInTheDocument();
  });
});