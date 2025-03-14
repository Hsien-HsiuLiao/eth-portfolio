import MultiSigWalletApp from "./_components/MultiSigWalletApp";
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
        <h1 className="text-4xl my-0">Multi-Signature Wallet</h1>
        <p className="text-neutral">
          
          <br /> {" "}
          <code className="italic bg-base-300 text-base font-bold [word-spacing:-0.5rem] px-1">
        {/*   <a href="https://github.com/Hsien-HsiuLiao/multisig-wallet">Github</a> */}
          </code>{" "}
        </p>
              <MultiSigWalletApp />

      </div>
    </>
  );
};

export default Portfolio;
