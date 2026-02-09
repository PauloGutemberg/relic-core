import { render, screen } from "@testing-library/react";
import { ItemCard } from "../../src/features/home/components/ItemCard";

jest.mock("next/image", () => ({
  __esModule: true,
  default: require("../__mocks__/next-image").default,
}));

describe("ItemCard", () => {
  it("renders title and description", () => {
    render(
      <ItemCard
        item={{
          slug: "smt-iv",
          title: "Shin Megami Tensei IV",
          shortDescription: "Escolhas entre lei e caos…",
          image: { src: "/images/x.jpeg", alt: "x" },
          year: 2013,
          platform: "Nintendo 3DS",
          tags: ["JRPG"],
        }}
      />
    );

    expect(screen.getByText("Shin Megami Tensei IV")).toBeInTheDocument();
    expect(screen.getByText(/Escolhas entre/)).toBeInTheDocument();
  });
});
