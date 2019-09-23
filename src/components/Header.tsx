import React from 'react';
import { remixClient } from '../remix/remix-client';

export const Header: React.FC = () => {

    return (
        <header>
            <img className="mx-auto d-block" src="../../zokrates.svg" style={{ maxHeight: "150px" }} />
            <p>
                ZoKrates will compile your program to an intermediate representation and run a trusted setup protocol to generate proving and verifying keys. 
                Get started by creating an <a href="#" onClick={remixClient.createExample}>example</a> file.
            </p>
        </header>
    );
}