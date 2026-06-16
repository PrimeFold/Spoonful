import { describe, it, expect } from "vitest";
import request from "supertest";
import { prisma } from "../lib/auth/auth";
import { app } from "../lib/app";



describe("Better Auth Integration", () => {
  it("should sign up and then sign in", async () => {
    const email = `test-${Date.now()}@gmail.com`;
    const password = "Password123!";

    console.log("Testing with:", { email, password });
    const signup = await request(app)
      .post("/api/auth/sign-up/email")
      .send({
        name: "Test User",
        email,
        password,
      });

    console.log("SIGNUP STATUS:", signup.status);
    console.log("SIGNUP BODY:", signup.body);

    expect(signup.status).toBeLessThan(400);

    // Verify user exists
    const user = await prisma.user.findUnique({
      where: { email },
    });

    expect(user).toBeTruthy();

    console.log("USER:", user);

    // Verify account exists
    const account = await prisma.account.findFirst({
      where: {
        userId: user!.id,
      },
    });

    console.log("ACCOUNT:", account);

    expect(account).toBeTruthy();

    // Login
    const signin = await request(app)
      .post("/api/auth/sign-in/email")
      .send({
        email,
        password,
      });

    console.log("SIGNIN STATUS:", signin.status);
    console.log("SIGNIN BODY:", signin.body);

    expect(signin.status).toBe(200);
  });
});