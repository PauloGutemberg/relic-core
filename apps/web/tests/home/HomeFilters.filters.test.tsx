import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { HomeFilters } from "../../src/features/home/components/HomeFilters";
import { itemsFixture } from "./fixtures";

jest.mock("next/image", () => ({
  __esModule: true,
  default: require("../__mocks__/next-image").default,
}));

describe("HomeFilters (select filters)", () => {
  it("filters by tag", async () => {
    const user = userEvent.setup();
    render(<HomeFilters items={itemsFixture} />);

    const tagSelect = screen.getByRole("combobox", { name: /tag/i });
    await user.selectOptions(tagSelect, "SRPG");

    expect(screen.getByText("Devil Survivor Overclocked")).toBeInTheDocument();
    expect(screen.queryByText("Shin Megami Tensei IV")).not.toBeInTheDocument();
  });

  it("sorts by year ascending", async () => {
    const user = userEvent.setup();
    render(<HomeFilters items={itemsFixture} />);

    const sortSelect = screen.getByRole("combobox", { name: /ordenar/i });
    await user.selectOptions(sortSelect, "year-asc");

    const titles = screen.getAllByRole("heading", { level: 3 }).map((h) => h.textContent);

    expect(titles[0]).toContain("Devil Survivor Overclocked"); // 2011
    expect(titles[2]).toContain("Shin Megami Tensei IV: Apocalypse"); // 2016
  });
});
