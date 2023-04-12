import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";

import { api } from "~/utils/api";

const Home: NextPage = () => {
  const hello = api.example.hello.useQuery();

  return (
    <>
      <Head>
        <title>Database management system</title>
        <meta name="description" content="Database management system" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#ff6600] to-[#c19f18]">
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
              target="_blank"
            >
              <h3 className="text-2xl font-bold">PostgreSQL</h3>
              <div className="text-lg">
                Connect to your PostgreSQL database and start querying. 🥹
              </div>
            </Link>
            <Link
              className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20"
              href="/mongodb"
              target="_blank"
            >
              <h3 className="text-2xl font-bold">MongoDB</h3>
              <div className="text-lg">
                Connect to your MongoDB database and start querying. 🥹
              </div>
            </Link>
            <Link
              className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20"
              href="/neo4j"
              target="_blank"
            >
              <h3 className="text-2xl font-bold">Neo4J</h3>
              <div className="text-lg">
                Connect to your Neo4J database and start querying. 🥹
              </div>
            </Link>
          </div>
          <p className="text-2xl text-white">
            {hello.data ? hello.data.greeting : "Loading tRPC query..."}
          </p>
        </div>
      </main>
    </>
  );
};

export default Home;
