import { useSQLiteDB } from "../services/database";
import type { User } from "@/components/types/user";

const { performSQLAction } = useSQLiteDB();

export async function registerUser(
  username: string,
  password: string
): Promise<boolean> {
  try {
    const result = await performSQLAction(async (db) => {
      // Check if user already exists
      const existingUser = await db?.query(
        `SELECT * FROM users WHERE username = ?`,
        [username]
      );

      if (existingUser?.values && existingUser.values.length > 0) {
        return false; // User already exists
      }

      // Insert new user
      await db?.run(`INSERT INTO users (username, password) VALUES (?, ?)`, [
        username,
        password,
      ]);
      return true; // Registration successful
    });
    return result;
  } catch (error: any) {
    alert(`Auth register user Error: ${error.message}`);
    return false;
  }
}

export async function authenticateUser(
  username: string,
  password: string
): Promise<User | null> {
  try {
    const user = await performSQLAction(async (db) => {
      const res = await db.query(
        `SELECT * FROM users WHERE username = ? AND password = ?`,
        [username, password]
      );

      if (res?.values && res.values.length > 0) {
        return res.values[0];
      }
      return null;
    });

    if (!user) throw new Error("Invalid credentials");
    return user;
  } catch (error: any) {
    throw new Error(error.message || "Authentication failed");
  }
}
