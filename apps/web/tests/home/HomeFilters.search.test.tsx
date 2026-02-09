import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { HomeFilters } from "../../src/features/home/components/HomeFilters";
import { itemsFixture } from "./fixtures";

jest.mock("next/image", () => ({
  __esModule: true,
  default: require("../__mocks__/next-image").default,
}));

describe("HomeFilters (search)", () => {
  it("filters items by typed query", async () => {
    const user = userEvent.setup();
    render(<HomeFilters items={itemsFixture} />);

    const input = screen.getByRole("textbox", { name: /buscar por título/i });
    await user.type(input, "Apocalypse");

    expect(screen.queryByText("Shin Megami Tensei IV")).not.toBeInTheDocument();
    expect(screen.getByText("Shin Megami Tensei IV: Apocalypse")).toBeInTheDocument();
    expect(screen.queryByText("Devil Survivor Overclocked")).not.toBeInTheDocument();
  });
});
