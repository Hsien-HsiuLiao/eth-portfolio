import type { NextPage } from "next";
import { getMetadata } from "~~/utils/scaffold-eth/getMetadata";

export const metadata = getMetadata({
  title: "Portfolio Projects",
  description: "Hsien-Hsiu's test page",
});

const Portfolio: NextPage = () => {
  return (
    <>
      
      <div className="text-center mt-8 bg-secondary p-10">
        <h1 className="text-4xl my-0">Portfolio</h1>
        <p className="text-neutral">
          Blockchain e-commerce
          <br /> {" "}
          <a href="https://github.com/Hsien-HsiuLiao/blockchain-ecommerce-app">Github</a>
          {" "}
        </p>
      </div>
    </>
  );
};

export default Portfolio;
