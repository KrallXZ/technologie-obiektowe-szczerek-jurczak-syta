import { type NextPage } from "next";
import React from "react";
import Layout from "../components/layout/layout";
import Link from "next/link";

const Main: NextPage = () => {
  return (
    <>
      <Layout>
        <div
          className="flex flex-col items-center justify-center">
          <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
            <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
              Database Management System
            </h1>
            <p className="text-2xl text-white">
              Choose your database, authentication, and start querying.
            </p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 md:gap-8">
              <Link
                className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20"
                href="/postgresql"
              >
                <h3 className="text-2xl font-bold">PostgreSQL</h3>
                <div className="text-lg">
                  Connect to your PostgreSQL database and start querying. 🥹
                </div>
              </Link>
              <Link
                className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20"
                href="/mongodb"
              >
                <h3 className="text-2xl font-bold">MongoDB</h3>
                <div className="text-lg">
                  Connect to your MongoDB database and start querying. 🥹
                </div>
              </Link>
              <Link
                className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20"
                href="/neo4j"
              >
                <h3 className="text-2xl font-bold">Neo4J</h3>
                <div className="text-lg">
                  Connect to your Neo4J database and start querying. 🥹
                </div>
              </Link>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default Main;
