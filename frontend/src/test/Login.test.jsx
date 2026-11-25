import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it } from "vitest";
import Login from "../pages/Login";
import { jsonResponse, mockFetch } from "./utils";

const renderLogin = () =>
  render(
    <MemoryRouter initialEntries={["/login"]}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<p>Domača stran</p>} />
      </Routes>
    </MemoryRouter>,
  );

const fillAndSubmit = async (email, password) => {
  const user = userEvent.setup();
  await user.type(screen.getByLabelText("E-poštni naslov"), email);
  await user.type(screen.getByLabelText("Geslo"), password);
  await user.click(screen.getByRole("button", { name: "Prijavi se" }));
};

describe("Login", () => {
  it("ob uspešni prijavi shrani žeton in preusmeri na domačo stran", async () => {
    const fetchMock = mockFetch(jsonResponse({ token: "abc123" }));
    renderLogin();

    await fillAndSubmit("ana@test.si", "geslo123");

    expect(await screen.findByText("Domača stran")).toBeInTheDocument();
    expect(localStorage.getItem("token")).toBe("abc123");
    expect(JSON.parse(fetchMock.mock.calls[0][1].body)).toEqual({
      email: "ana@test.si",
      password: "geslo123",
    });
  });

  it("ob napačnih podatkih prikaže sporočilo strežnika", async () => {
    mockFetch(
      jsonResponse({ message: "Napačen elektronski naslov ali geslo." }, false),
    );
    renderLogin();

    await fillAndSubmit("ana@test.si", "napacno");

    expect(
      await screen.findByText("Napačen elektronski naslov ali geslo."),
    ).toBeInTheDocument();
    expect(localStorage.getItem("token")).toBeNull();
  });
});
