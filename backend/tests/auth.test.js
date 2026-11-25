jest.mock("../src/db", () => ({ query: jest.fn() }));
jest.mock("bcrypt", () => ({ hash: jest.fn(), compare: jest.fn() }));

const request = require("supertest");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const pool = require("../src/db");
const app = require("../src/app");

const validRegistration = {
  firstName: "Ana",
  lastName: "Novak",
  email: "ana@test.si",
  password: "geslo123",
  matchedPassword: "geslo123",
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe("POST /api/auth/register", () => {
  test("vrne 400, če se gesli ne ujemata", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({ ...validRegistration, matchedPassword: "drugo123" });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Gesli se ne ujemata.");
  });

  test("ustvari stranko z zgoščenim geslom (201)", async () => {
    bcrypt.hash.mockResolvedValue("hash");
    pool.query
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({
        rows: [{ id: 5, email: "ana@test.si", role: "CUSTOMER" }],
      });

    const res = await request(app)
      .post("/api/auth/register")
      .send(validRegistration);

    expect(res.status).toBe(201);
    expect(res.body.user.role).toBe("CUSTOMER");
    // V bazo se shrani hash, nikoli golo geslo.
    expect(pool.query.mock.calls[1][1]).toContain("hash");
    expect(pool.query.mock.calls[1][1]).not.toContain("geslo123");
  });
});

describe("POST /api/auth/login", () => {
  test("vrne 401 za napačno geslo", async () => {
    pool.query.mockResolvedValueOnce({
      rows: [{ id: 1, email: "ana@test.si", password_hash: "hash", role: "CUSTOMER" }],
    });
    bcrypt.compare.mockResolvedValue(false);

    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "ana@test.si", password: "napacno" });

    expect(res.status).toBe(401);
  });

  test("ob uspešni prijavi vrne JWT z vlogo uporabnika", async () => {
    pool.query.mockResolvedValueOnce({
      rows: [{ id: 3, email: "admin@test.si", password_hash: "hash", role: "ADMIN" }],
    });
    bcrypt.compare.mockResolvedValue(true);

    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "admin@test.si", password: "geslo123" });

    expect(res.status).toBe(200);
    const decoded = jwt.verify(res.body.token, process.env.JWT_SECRET);
    expect(decoded).toMatchObject({ id: 3, role: "ADMIN" });
  });
});
