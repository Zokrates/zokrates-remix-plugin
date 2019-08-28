import React, { useEffect, useState } from "react";
import { remixClient } from './remix/remix-client'
import { remixResolver } from './remix/remix-resolver';
import { init, compile as zokrates_compile } from '../../core';
import { compilerProfile } from "@remixproject/plugin";


interface AppState {
    compiled: string;
    loaded: boolean;
}

const App: React.FC = () => {

    const [state, setState] = useState<AppState>({
        compiled: 'idle',
        loaded: false
    });

    useEffect(() => {
        const load = async () => {
            await remixClient.createClient();
            await init(function (location: string, path: string) {
                let result = remixResolver.handleImportCalls(path);
                return { ...result };
            });
            setState({ ...state, loaded: true });
        }
        load()
    }, [])

    const compile = async () => {
        let location = await remixClient.getCurrentFile();
        let source = await remixClient.getFile(location);

        await remixResolver.gatherImports(location, source);

        let compiled = zokrates_compile(source);
        setState({ ...state, compiled: compiled });
    }

    return (
        <main id="wrapper">
            <header className="shadow-sm">
                <h4 className="p-3">ZoKrates Compiler</h4>
            </header>

            <section className="container-fluid">
                <div className="row">
                    <div className="col-lg">
                        <p>ZoKrates will compile this program to an intermediate representation and run a trusted setup protocol to generate proving and verifying keys.</p>
                        <button type="submit" className="btn btn-success ml-0 mr-2" onClick={() => remixClient.createExample()}>Create main.code</button>
                        <hr />
                        <button type="button" className="btn btn-primary" onClick={async () => await compile()}>Compile</button>
                    </div>
                </div>
                <div className="row">
                    <div className="col-lg mt-3">
                        <p>{!state.loaded ? "Zokrates is loading..." : "Zokrates instance loaded."}</p>
                    </div>
                </div>
                <div className="row">
                    <div className="col-lg mt-3">
                        <p>{state.compiled}</p>
                    </div>
                </div>
            </section>
        </main>
    );
}

export default App;
