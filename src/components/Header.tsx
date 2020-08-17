import React, { useState, useEffect } from 'react';
import { remixClient } from '../remix/RemixClient';

export const Header: React.FC = () => {

    const getTheme = () => document.documentElement.style.getPropertyValue('--theme');
    const [theme, setTheme] = useState(getTheme() || 'light');

    useEffect(() => {
        const observer = new MutationObserver(() => setTheme(getTheme()));
        observer.observe(document.documentElement, { 
            attributes: true, 
            attributeFilter: ["style"] 
        });
        return () => {
            observer.disconnect();
        };
    }, []);

    let style = { maxHeight: "150px" };
    if (theme == 'dark') {
        style = Object.assign(style, { filter: "invert(1)" });
    }

    return (
        <header>
            <img className="mx-auto d-block" src="../../zokrates.svg" style={style} />
            <p>
                <a href="https://github.com/Zokrates/ZoKrates" target="_blank">ZoKrates</a> is a toolbox for zkSNARKs on Ethereum. It helps you use verifiable computation in your DApp, from the specification of your program in a high level language to generating proofs of computation to verifying those proofs in Solidity.
                Get started by creating an <a href="#" onClick={remixClient.createExample}>example</a> file.
            </p>
        </header>
    );
}