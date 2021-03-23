import { SuperTest, Test } from "supertest";

export async function getAuth(request: SuperTest<Test>): Promise<[string, string]> {
  const res = await request
    .post("/login/")
    .send({ id: "root", password: process.env.ROOT_USER_PASSWORD || "password" });
  return ["Authorization", `Bearer ${res.text}`];
}
