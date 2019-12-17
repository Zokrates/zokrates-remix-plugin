import React, { useEffect } from 'react';
import { Container } from 'react-bootstrap';
import { initialize } from 'zokrates-js';
import './App.css';
import { Accordion, AccordionElement, Footer, Header } from './components';
import { remixClient } from './remix/RemixClient';
import { remixResolver } from './remix/RemixResolver';
import { Compilation } from './sections/compilation/Compilation';
import { ComputeWitness } from './sections/compute-witness/ComputeWitness';
import { ExportVerifier } from './sections/export-verifier/ExportVerifier';
import { GenerateProof } from './sections/generate-proof/GenerateProof';
import { Setup } from './sections/setup/Setup';
import { onLoaded } from './state/actions';
import { useDispatchContext, useStateContext } from './state/Store';

const App: React.FC = () => {

    const state = useStateContext();
    const dispatch = useDispatchContext();

    useEffect(() => {
        const load = async () => {
            try {
                initialize(remixResolver.syncResolve).then((provider) => dispatch(onLoaded(provider)))
                await remixClient.createClient();
            } catch(err) {
                console.log(err)
            }
        }
        load()
    }, [])

    return (
        <div id="wrapper">
            <Container>
                <Header />
                <main role="main">
                    <Accordion>
                        <AccordionElement headerText="Compilation" iconClass="fa fa-refresh" eventKey="0">
                            <Compilation />
                        </AccordionElement>
                        <AccordionElement headerText="Setup" iconClass="fa fa-cog" eventKey="1" disabled={!state.compilationResult}>
                            <Setup />
                        </AccordionElement>
                        <AccordionElement headerText="Export Verifier" iconClass="fa fa-key" eventKey="2" disabled={!state.setupResult}>
                            <ExportVerifier />
                        </AccordionElement>
                        <AccordionElement headerText="Compute Witness" iconClass="fa fa-lightbulb-o" eventKey="3" disabled={!state.compilationResult}>
                            <ComputeWitness />
                        </AccordionElement>
                        <AccordionElement headerText="Generate Proof" iconClass="fa fa-check" eventKey="4" disabled={!state.compilationResult || !state.witnessResult || !state.setupResult || !state.exportVerifierResult}>
                            <GenerateProof />
                        </AccordionElement>
                    </Accordion>
                </main>
            </Container>
            <Footer isLoaded={state.isLoaded}></Footer>
        </div>
    );
}

export default App;
