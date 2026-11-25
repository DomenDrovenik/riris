import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it } from "vitest";
import NewRequest from "../pages/NewRequest";
import { jsonResponse, mockFetch } from "./utils";

const renderNewRequest = () =>
  render(
    <MemoryRouter initialEntries={["/new-request"]}>
      <Routes>
        <Route path="/new-request" element={<NewRequest />} />
        <Route path="/" element={<p>Seznam zahtevkov</p>} />
      </Routes>
    </MemoryRouter>,
  );

const fillForm = async (user) => {
  await user.type(screen.getByLabelText("Naslov zahtevka"), "Hladilnik ne hladi");
  await user.selectOptions(screen.getByLabelText("Vrsta aparata"), "REFRIGERATOR");
  await user.type(screen.getByLabelText("Znamka"), "Gorenje");
  await user.type(screen.getByLabelText("Model"), "NRK6192");
  await user.type(screen.getByLabelText("Opis težave"), "Notranjost je topla.");
};

describe("NewRequest", () => {
  it("pošlje zahtevek z žetonom in podatki obrazca ter preusmeri na seznam", async () => {
    localStorage.setItem("token", "zeton-stranke");
    const fetchMock = mockFetch(jsonResponse({ request: { id: 1 } }));
    const user = userEvent.setup();
    renderNewRequest();

    await fillForm(user);
    await user.click(screen.getByRole("button", { name: "Oddaj zahtevek" }));

    expect(await screen.findByText("Seznam zahtevkov")).toBeInTheDocument();
    const [url, options] = fetchMock.mock.calls[0];
    expect(url).toBe("http://localhost:3000/api/requests");
    expect(options.method).toBe("POST");
    expect(options.headers.Authorization).toBe("Bearer zeton-stranke");
    expect(JSON.parse(options.body)).toMatchObject({
      applianceType: "REFRIGERATOR",
      brand: "Gorenje",
    });
  });
});
