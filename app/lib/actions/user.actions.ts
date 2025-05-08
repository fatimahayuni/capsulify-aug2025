"use server";

import { CreateUserParams } from "@/app/types";
import pool from "../database/db";

export const createUser = async (params: CreateUserParams) => {
  const client = await pool.connect();

  try {
    await client.query("SET search_path TO capsulify_live");

    const { name, username, email, clerkId } = params;

    const createUserQuery = `
      INSERT INTO users (name, username, email, clerk_id)
      VALUES ($1, $2, $3, $4)
    `;

    const result = await client.query(createUserQuery, [
      name,
      username,
      email,
      clerkId,
    ]);

    sessionStorage.setItem("userId", result.rows[0].id);

    client.release();
  } catch (error) {
    console.error("Error creating user:", error);
    throw new Error("Failed to create user");
  }
};

export const getUserByClerkId = async (clerkId: string) => {
  const client = await pool.connect();
  try {
    await client.query("SET search_path TO capsulify_live");

    console.log("clerk id", clerkId);

    const getUserQuery = `
      SELECT * FROM users
      WHERE clerk_id = $1
    `;

    const user = await client.query(getUserQuery, [clerkId]);

    console.log("User retrieved successfully:", user.rows[0]);

    client.release();
    return user.rows[0];
  } catch (error) {
    console.error("Error getting user by clerkId:", error);
    throw new Error("Failed to get user");
  }
};

export const updateUserBodyType = async (bodyType: string, clerkId: string) => {
  const client = await pool.connect();
  try {
    await client.query("SET search_path TO capsulify_live");

    const bodyTypeQuery = `SELECT id FROM body_shapes WHERE name = $1`;
    const bodyTypeResult = await client.query(bodyTypeQuery, [
      bodyType.toLowerCase(),
    ]);

    if (bodyTypeResult.rows.length === 0)
      throw new Error("body type not found");

    const bodyTypeId = bodyTypeResult.rows[0].id;

    const updateUserQuery = `
      UPDATE users SET body_shape_id = $1, onboarded = true WHERE clerk_id = $2
    `;

    const result = await client.query(updateUserQuery, [bodyTypeId, clerkId]);

    console.log("User updated successfully:", result);
    client.release();
  } catch (error) {
    console.error("Error updating user body type:", error);
    throw new Error("Failed to update user body type");
  }
};

export const updateUser = async (params: CreateUserParams) => {
  const client = await pool.connect();
  try {
    await client.query("SET search_path TO capsulify_live");
    const { name, username, email, clerkId } = params;

    const updateUserQuery = `
      UPDATE users
      SET name = $1, username = $2, email = $3
      WHERE clerk_id = $4
    `;
    const result = await client.query(updateUserQuery, [
      name,
      username,
      email,
      clerkId,
    ]);

    console.log("User updated successfully:", result);
    client.release();
  } catch (error) {
    console.error("Error updating user:", error);
    throw new Error("Failed to update user");
  }
};

export const deleteUser = async (clerkId: string) => {
  const client = await pool.connect();
  try {
    await client.query("SET search_path TO capsulify_live");

    const deleteUserQuery = `
      DELETE FROM capsulify_live.users
      WHERE clerk_id = $1
    `;

    const result = await client.query(deleteUserQuery, [clerkId]);

    console.log("User deleted successfully:", result);
    client.release();
  } catch (error) {
    console.error("Error deleting user:", error);
    throw new Error("Failed to delete user");
  }
};
