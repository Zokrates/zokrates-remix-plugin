import React, { useEffect, useState } from "react";
import { remixClient } from './remix/remix-client'
import { remixResolver } from './remix/remix-resolver';
import { initialize } from '../../core';

import { Compilation } from './sections/Compilation';
import { Footer } from './components/Footer';

import './App.css';
import { Container, Accordion, Card } from "react-bootstrap";

const App: React.FC = () => {

    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        const load = async () => {
            await remixClient.createClient();
            await initialize(remixResolver.syncResolve);

            setLoaded(true);
        }
        load()
    }, [])

    return (
        <div id="wrapper">
            <main role="main" className="mt-1">
                <Container>
                    <img className="mx-auto d-block" src="./zokrates.svg" style={{ maxHeight: "150px" }} />
                    <p>ZoKrates will compile your program to an intermediate representation and run a trusted setup protocol to generate proving and verifying keys.</p>
                    <Accordion defaultActiveKey="0">
                        <Card>
                            <Accordion.Toggle as={Card.Header} eventKey="0">
                                Compilation
                            </Accordion.Toggle>
                            <Accordion.Collapse eventKey="0">
                                <Card.Body>
                                    <Compilation />
                                </Card.Body>
                            </Accordion.Collapse>
                        </Card>

                        <Card>
                            <Accordion.Toggle as={Card.Header} eventKey="1">
                                Setup
                            </Accordion.Toggle>
                            <Accordion.Collapse eventKey="1">
                                <Card.Body>TBD</Card.Body>
                            </Accordion.Collapse>
                        </Card>

                        <Card>
                            <Accordion.Toggle as={Card.Header} eventKey="2">
                                Export Verifier
                            </Accordion.Toggle>
                            <Accordion.Collapse eventKey="2">
                                <Card.Body>TBD</Card.Body>
                            </Accordion.Collapse>
                        </Card>

                        <Card>
                            <Accordion.Toggle as={Card.Header} eventKey="3">
                                Compute Witness
                            </Accordion.Toggle>
                            <Accordion.Collapse eventKey="3">
                                <Card.Body>TBD</Card.Body>
                            </Accordion.Collapse>
                        </Card>


                        <Card>
                            <Accordion.Toggle as={Card.Header} eventKey="4">
                                Generate Proof
                            </Accordion.Toggle>
                            <Accordion.Collapse eventKey="4">
                                <Card.Body>TBD</Card.Body>
                            </Accordion.Collapse>
                        </Card>

                    </Accordion>
                </Container>
            </main>

            <Footer isLoading={!loaded}></Footer>
        </div>
    );
}

export default App;
