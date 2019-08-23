import React, { useEffect, useState } from "react";
import { remixClient } from './remix/remix-client'
import { remixResolver } from './remix/remix-resolver';
import { ZoKrates } from '../../core/js/library';

interface AppState {
    zokratesInstance: any;
    compiled: string;
}

const App: React.FC = () => {

    const [state, setState] = useState<AppState>({
        zokratesInstance: null,
        compiled: 'idle'
    });

    useEffect(() => {
        const load = async () => {
            await remixClient.createClient();
            let instance = await new ZoKrates().init((location: string, path: string) => {
                let result = remixResolver.handleImportCalls(path);
                return { source: result.source, location: result.location };
            });
            setState({ ...state, zokratesInstance: instance });
        }
        load()
    }, [])

    const compile = async (source: string) => {
        await remixResolver.gatherImports('', "main");

        let compiled = state.zokratesInstance.compile(source);
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
                        <button type="button" className="btn btn-primary" onClick={() => {
                            compile("def main() -> ():\nreturn");
                        }}>Compile</button>
                    </div>
                </div>
                <div className="row">
                    <div className="col-lg mt-3">
                        <p>{!state.zokratesInstance ? "Zokrates is loading..." : "Zokrates instance loaded."}</p>
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
