import { type NextPage } from "next";
import Layout from "../../components/layout/layout";
import LoginNeo4j from "~/components/login/login-neo4j";

const Neo4j: NextPage = () => {
  return (
    <>
      <Layout>
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
            Neo4j
          </h1>
          <LoginNeo4j/>
        </div>
      </Layout>
    </>
  );
};

export default Neo4j;
