import { SuperTest, Test } from "supertest";

export async function getAuth(request: SuperTest<Test>): Promise<[string, string]> {
  const res = await request.post("/login/").send({ id: "stark", password: "super-secret" });
  return ["Authorization", `Bearer ${res.text}`];
}
