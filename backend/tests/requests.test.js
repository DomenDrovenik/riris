jest.mock("../src/db", () => ({ query: jest.fn() }));

const request = require("supertest");
const pool = require("../src/db");
const app = require("../src/app");
const { tokenFor, customer, technician, admin } = require("./helpers");

const auth = (user) => ({ Authorization: `Bearer ${tokenFor(user)}` });

const existing = (status, technicianId = technician.id) => ({
  rows: [{ id: 10, status, technician_id: technicianId }],
});

beforeEach(() => {
  jest.clearAllMocks();
});

describe("servisni zahtevki", () => {
  test("zavrne neveljavno vrsto aparata (400)", async () => {
    const res = await request(app)
      .post("/api/requests")
      .set(auth(customer))
      .send({
        title: "Toaster ne dela",
        description: "Ne greje.",
        applianceType: "TOASTER",
        brand: "X",
        model: "Y",
      });

    expect(res.status).toBe(400);
    expect(pool.query).not.toHaveBeenCalled();
  });

  test("stranka dobi samo svoje zahtevke", async () => {
    pool.query.mockResolvedValueOnce({ rows: [] });

    await request(app).get("/api/requests").set(auth(customer));

    const [sql, values] = pool.query.mock.calls[0];
    expect(sql).toContain("WHERE customer_id = $1");
    expect(values).toEqual([customer.id]);
  });

  test("ne dovoli dodelitve uporabniku, ki ni serviser (400)", async () => {
    pool.query.mockResolvedValueOnce({ rows: [{ id: 1, role: "CUSTOMER" }] });

    const res = await request(app)
      .patch("/api/requests/10/assign")
      .set(auth(admin))
      .send({ technicianId: 1 });

    expect(res.status).toBe(400);
  });

  test("za status RESOLVED zahteva zaključni komentar (400)", async () => {
    pool.query.mockResolvedValueOnce(existing("IN_PROGRESS"));

    const res = await request(app)
      .patch("/api/requests/10/status")
      .set(auth(technician))
      .send({ status: "RESOLVED", comment: "   " });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Zaključni komentar je obvezen.");
  });

  test("administrator zapre rešen zahtevek (RESOLVED -> CLOSED)", async () => {
    pool.query
      .mockResolvedValueOnce(existing("RESOLVED"))
      .mockResolvedValueOnce({ rows: [{ id: 10, status: "CLOSED" }] });

    const res = await request(app)
      .patch("/api/requests/10/status")
      .set(auth(admin))
      .send({ status: "CLOSED" });

    expect(res.status).toBe(200);
    expect(res.body.request.status).toBe("CLOSED");
  });
});
