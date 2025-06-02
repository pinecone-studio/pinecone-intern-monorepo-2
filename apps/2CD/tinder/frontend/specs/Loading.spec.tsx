import { render, screen } from "@testing-library/react";
import '@testing-library/jest-dom';
import { Loading } from "@/components/Loading";


describe("Loading component", () => {
  it("renders loading image", () => {
    render(<Loading />);
    const image = screen.getByRole("img");
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute("src", "tinder.svg");
  });

  it("shows spinning loader", () => {
    render(<Loading />);
    const spinner = screen.getByText("Please Wait...");
    expect(spinner).toBeInTheDocument();
  });

  it("shows copyright text", () => {
    render(<Loading />);
    const copyright = screen.getByText("©2025 Tinder");
    expect(copyright).toBeInTheDocument();
  });
});
