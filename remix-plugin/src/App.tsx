import React, { useEffect } from "react";
import { Container } from "react-bootstrap";
import { initialize } from '../../core';
import './App.css';
import { Accordion, AccordionElement, Footer, Header } from './components';
import { remixClient } from './remix/remix-client';
import { remixResolver } from './remix/remix-resolver';
import { Compilation } from './sections/compilation/Compilation';
import { ComputeWitness } from './sections/compute-witness/ComputeWitness';
import { useDispatchContext, useStateContext } from './state/Store';

const App: React.FC = () => {

    const state = useStateContext();
    const dispatch = useDispatchContext();

    useEffect(() => {
        const load = async () => {
            try {
                initialize(remixResolver.syncResolve).then(() => dispatch({ type: 'set_loaded' }))
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
                        <AccordionElement headerText="Setup" iconClass="fa fa-cog" eventKey="1">
                            TBD
                        </AccordionElement>
                        <AccordionElement headerText="Export Verifier" iconClass="fa fa-key" eventKey="2">
                            TBD
                        </AccordionElement>
                        <AccordionElement headerText="Compute Witness" iconClass="fa fa-lightbulb-o" eventKey="3">
                            <ComputeWitness />
                        </AccordionElement>
                        <AccordionElement headerText="Generate Proof" iconClass="fa fa-check" eventKey="4">
                            TBD
                        </AccordionElement>
                    </Accordion>
                </main>
            </Container>
            <Footer isLoaded={state.isLoaded}></Footer>
        </div>
    );
}

export default App;
