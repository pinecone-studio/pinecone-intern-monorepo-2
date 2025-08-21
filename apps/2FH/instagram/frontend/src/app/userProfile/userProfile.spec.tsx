import { render, screen } from "@testing-library/react";
import UserProfile from "./page";
import '@testing-library/jest-dom';

describe("UserProfile", () => {
  it("renders username and bio", () => {
    render(<UserProfile />);
    expect(screen.getByText("travel.explorer")).toBeInTheDocument();
    expect(screen.getByText("📸 Travel Photographer")).toBeInTheDocument();
  });

  it("renders posts count, followers, following", () => {
    render(<UserProfile />);
    expect(screen.getByText(/284/)).toBeInTheDocument();
    expect(screen.getByText(/15.6K/)).toBeInTheDocument();
    expect(screen.getByText(/432/)).toBeInTheDocument();
  });

  it("renders posts grid with images", () => {
    render(<UserProfile />);
    const posts = screen.getAllByRole("img");
    // avatar + 6 post images = 7
    expect(posts.length).toBe(7);
    expect(posts[1]).toHaveAttribute("alt", "Post 1");
  });

  it("renders website link", () => {
    render(<UserProfile />);
    const link = screen.getByRole("link", { name: "alexchen-photography.com" });
    expect(link).toHaveAttribute("href", "https://alexchen-photography.com");
  });
});