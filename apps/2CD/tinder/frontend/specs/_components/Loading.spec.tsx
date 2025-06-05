import {  render, screen } from "@testing-library/react";
import '@testing-library/jest-dom';
import { Loading } from "@/components";




describe("Loading component", () => {
  it("renders loading container", () => {
    render(<Loading />);
    const loader = screen.getByTestId("Loader");
    expect(loader).toBeInTheDocument();
  });
});