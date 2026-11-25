import { vi } from "vitest";

// Lažni odgovor fetch API-ja.
export const jsonResponse = (data, ok = true) => ({
  ok,
  json: async () => data,
});

// Zamenja globalni fetch z mockom, ki zaporedoma vrača podane odgovore.
export const mockFetch = (...responses) => {
  const fetchMock = vi.fn();
  responses.forEach((response) => fetchMock.mockResolvedValueOnce(response));
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
};
