import { render, screen } from "@testing-library/react";
import { CollectionGrid } from "../../src/features/home/components/CollectionGrid";
import { itemsFixture } from "./fixtures";

jest.mock("next/image", () => ({
  __esModule: true,
  default: require("../__mocks__/next-image").default,
}));

describe("CollectionGrid", () => {
  it("renders one card per item", () => {
    render(<CollectionGrid items={itemsFixture} />);

    expect(screen.getByText("Shin Megami Tensei IV")).toBeInTheDocument();
    expect(screen.getByText("Shin Megami Tensei IV: Apocalypse")).toBeInTheDocument();
    expect(screen.getByText("Devil Survivor Overclocked")).toBeInTheDocument();
  });
});
