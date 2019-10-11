import React from 'react';
import { remixClient } from '../remix/RemixClient';

export const Header: React.FC = () => {

    const style = { maxHeight: "150px" };
    return (
        <header>
            <img className="mx-auto d-block" src="../../zokrates.svg" style={style} />
            <p>
                ZoKrates is a toolbox for zkSNARKs on Ethereum. It helps you use verifiable computation in your DApp, from the specification of your program in a high level language to generating proofs of computation to verifying those proofs in Solidity.
                Get started by creating an <a href="#" onClick={remixClient.createExample}>example</a> file.
            </p>
        </header>
    );
}