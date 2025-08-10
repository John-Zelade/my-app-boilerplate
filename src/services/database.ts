import { useRef } from "react";
import {
  SQLiteDBConnection,
  SQLiteConnection,
  CapacitorSQLite,
} from "@capacitor-community/sqlite";
import { usersTable } from "./schema";

//const SCHEMA_VERSION = 3;
const SQLITE_DB_NAME = "my_database.db";

const TABLES = [usersTable];
// At top-level outside the hook to make it shared
let sqliteRef: SQLiteConnection | null = null;
let dbRef: SQLiteDBConnection | null = null;
let initPromise: Promise<void> | null = null;

export const useSQLiteDB = () => {
  if (!SQLITE_DB_NAME) {
    throw new Error(
      "SQLITE_DB_NAME is not defined in the environment variables"
    );
  }

  // Wrapper to ensure DB initialized and open before running any action
  const performSQLAction = async <T>(
    action: (db: SQLiteDBConnection) => Promise<T>
  ): Promise<T> => {
    if (!initPromise) {
      initPromise = initializeDB();
    }
    await initPromise;

    if (!dbRef) throw new Error("Database is not initialized");

    if (!(await dbRef.isDBOpen()).result) {
      await dbRef.open();
    }

    return action(dbRef);
  };

  // Initialize the database connection and schema
  const initializeDB = async () => {
    //alert("Starting DB initialization...");

    if (!sqliteRef) {
      sqliteRef = new SQLiteConnection(CapacitorSQLite);
      //alert("SQLiteConnection instance created");
    }

    const sqlite = sqliteRef;

    await sqlite.checkConnectionsConsistency();

    //alert(`Connections consistency: ${consistency.result}`);

    const exists = (await sqlite.isConnection(SQLITE_DB_NAME, false)).result;
    //alert(`Does DB connection exist? ${exists}`);

    if (exists) {
      dbRef = await sqlite.retrieveConnection(SQLITE_DB_NAME, false);
      //alert("DB connection retrieved");
    } else {
      dbRef = await sqlite.createConnection(
        SQLITE_DB_NAME,
        false,
        "no-encryption",
        1,
        false
      );
      //alert("DB connection created");
    }

    if (dbRef && !(await dbRef.isDBOpen()).result) {
      await dbRef.open();
      //alert("DB opened");
    } else {
      //alert("DB already open");
    }

    const db = dbRef;

    for (const tableSQL of TABLES) {
      await db.execute(tableSQL);
      /* alert(
        `Executed table creation SQL: ${tableSQL.split("\n")[0].slice(0, 40)}...`
      ); */
    }

    //alert("Database initialized and tables created successfully!");
  };

  ////alert("Database initialized successfully");
  return { performSQLAction };
};
