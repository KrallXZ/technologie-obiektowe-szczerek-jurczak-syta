import { type NextPage } from "next";
import Layout from "../../components/layout/layout";
import LoginMongoDB from "~/components/login/login-mongodb";

const Mongodb: NextPage = () => {
  return (
    <>
      <Layout>
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
            MongoDB
          </h1>
          <LoginMongoDB />
        </div>
      </Layout>
    </>
  );
};

export default Mongodb;
