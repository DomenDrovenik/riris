const { authenticateToken, authorizeRoles } = require("../src/middleware/auth");

const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("auth middleware", () => {
  test("authenticateToken vrne 401, če Authorization header manjka", () => {
    const res = mockRes();
    const next = jest.fn();

    authenticateToken({ headers: {} }, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  test("authorizeRoles vrne 403, če vloga ni dovoljena", () => {
    const res = mockRes();
    const next = jest.fn();

    authorizeRoles("ADMIN")({ user: { role: "CUSTOMER" } }, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(next).not.toHaveBeenCalled();
  });
});
