import type { NextPage } from "next";
import Image from "next/future/image";
import Head from "next/head";
import Listings from "../components/Listings";
// import { trpc } from "../utils/trpc";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>HOME+</title>
        <meta name="description" content="HOME+ by create-t3-app" />
        {/* <link rel="icon" href="/favicon.ico" /> */}
      </Head>
      <main className="relative sm:text-center lg:flex lg:items-center lg:bg-blue-800 lg:text-left 4xl:grid 4xl:grid-cols-[1fr_765px_765px_1fr]">
        <div className="order-2 basis-1/2 4xl:col-[3/5] 4xl:row-[1/2]">
          <Image
            src="/img/home-main.jpg"
            width={960}
            height={640}
            alt="House"
            className="h-[680px] w-full object-cover lg:h-auto lg:max-h-[640px]"
          />
        </div>
        <div className="spacer 4xl:spacer-reset absolute top-0 left-0 h-[680px] basis-1/2 bg-gradient-to-t from-blue-800 pt-10 md:pt-20 lg:static lg:h-[unset]  lg:from-[none]  lg:pt-0 4xl:col-[2/3] 4xl:row-[1/2] 4xl:pr-20">
          <h1 className="text-xl font-semibold leading-snug text-blue-100 md:text-2xl lg:text-lg xl:text-xl 4xl:text-2xl">
            Find your future <span className="text-blue-500">home</span> with
            us!
          </h1>
          <p className="mt-2.5 text-sm font-light leading-snug text-white lg:text-[1.375rem] lg:text-blue-100 xl:text-sm">
            With over 160 years of experience, more than 130 UK offices, and
            thousands of potential buyers and tenants on our database, we`ll
            make sure your property gets in front of the right people.
          </p>
        </div>
      </main>
      {/* <Listings /> */}
    </>
  );
};

export default Home;
