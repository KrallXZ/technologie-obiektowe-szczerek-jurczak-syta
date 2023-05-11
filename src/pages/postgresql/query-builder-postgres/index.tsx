import { NextPage } from "next";
import Layout from "../../../components/layout/layout";
import QueryBuilderHeader from "../../../components/query-builder-header/query-builder-header";

const QueryBuilderPostgres: NextPage = () => {
  return (
    <>
      <Layout>
        <QueryBuilderHeader />
      </Layout>
    </>
  );
};

export default QueryBuilderPostgres;