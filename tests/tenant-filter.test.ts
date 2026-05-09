import { describe, expect, it } from "vitest";

function clientAccessWhere(clientId: string, therapistId: string) {
  return { id: clientId, therapistId };
}

describe("filtrage multi-tenant", () => {
  it("inclut toujours therapistId dans la requête d'accès client", () => {
    expect(clientAccessWhere("c1", "t1")).toEqual({ id: "c1", therapistId: "t1" });
  });
});
