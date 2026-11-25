import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import RequestsList from "../components/RequestsList";
import { jsonResponse, mockFetch } from "./utils";

const sampleRequest = {
  id: 1,
  title: "Pečica ne greje",
  appliance_type: "OVEN",
  brand: "Bosch",
  model: "HBA534",
  description: "Grelec ne deluje.",
  status: "NEW",
  created_at: "2026-11-20T10:00:00Z",
};

const renderList = (role) =>
  render(
    <MemoryRouter>
      <RequestsList role={role} />
    </MemoryRouter>,
  );

describe("RequestsList", () => {
  it("stranki prikaže njene zahtevke in gumb za nov zahtevek", async () => {
    mockFetch(jsonResponse({ requests: [sampleRequest] }));
    renderList("CUSTOMER");

    expect(await screen.findByText("Moji zahtevki")).toBeInTheDocument();
    expect(screen.getByText("Pečica ne greje")).toBeInTheDocument();
    expect(screen.getByText("NEW")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "+ Nov zahtevek" })).toBeInTheDocument();
  });
});
