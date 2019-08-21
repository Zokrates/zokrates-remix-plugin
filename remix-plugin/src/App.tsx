import React, { useEffect, useState } from "react";
import { remixClient } from './remix/remix-client'

const App: React.FC = () => {

    useEffect(() => {
        const load = async () => {
            await remixClient.createClient();
        }

        load()
    }, [])

    return (
    <main id="wrapper">
        <header className="shadow-sm">
            <h4 className="p-3">ZoKrates Compiler</h4>
        </header>
        
        <section className="container-fluid">
            <div className="row">
                <div className="col-lg">
                    <p>ZoKrates will compile this program to an intermediate representation and run a trusted setup protocol to generate proving and verifying keys.</p>
                    <button type="submit" className="btn btn-success ml-0 mr-2" onClick={() => remixClient.createExample()}>Create example.code</button>
                    <hr/>
                    <button type="button" className="btn btn-primary">Compile</button>
                </div>
            </div>
        </section>
    </main>
    ); 
}

export default App;
