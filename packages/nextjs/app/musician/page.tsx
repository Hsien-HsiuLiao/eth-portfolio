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
          Musician dApp
          <br /> Check{" "}
          <code className="italic bg-base-300 text-base font-bold [word-spacing:-0.5rem] px-1">
          <a href="https://github.com/Hsien-HsiuLiao/Buy-Music-with-Ethereum-dApp">Github</a>
          </code>{" "}
        </p>
      </div>
    </>
  );
};

export default Portfolio;
