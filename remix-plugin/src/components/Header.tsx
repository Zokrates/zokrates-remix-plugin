import React from 'react';

export const Header: React.FC = ({ children }) => {

    return (
        <header>
            <img className="mx-auto d-block" src="../../zokrates.svg" style={{ maxHeight: "150px" }} />
            <p>ZoKrates will compile your program to an intermediate representation and run a trusted setup protocol to generate proving and verifying keys.</p>      
        </header>
    );
}