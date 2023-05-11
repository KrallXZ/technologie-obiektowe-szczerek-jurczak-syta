import Header from "../header/header";
import Footer from "../footer/footer";
import React, { ReactNode } from "react";
import Head from "next/head";

const Layout: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Head>
        <title>Database management system</title>
        <meta name="description" content="Database management system" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <main className="flex-1 bg-gradient-to-b from-[#ff6600] to-[#c19f18] flex grow items-center justify-center">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;