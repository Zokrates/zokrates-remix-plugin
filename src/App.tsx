import React, { useEffect } from "react";
import { Container, Spinner } from "react-bootstrap";
import "./App.css";
import { Accordion, AccordionElement, Header } from "./components";
import { remixClient } from "./remix/RemixClient";
import { Compile } from "./sections/compile/Compile";
import { Compute } from "./sections/compute/Compute";
import { ExportVerifier } from "./sections/export-verifier/ExportVerifier";
import { GenerateProof } from "./sections/generate-proof/GenerateProof";
import { Setup } from "./sections/setup/Setup";
import { onLoaded } from "./state/actions";
import { useDispatchContext, useStateContext } from "./state/Store";
import { ZoKratesWebWorker } from "./zokrates/ZoKratesWebWorker";
import { metadata } from "zokrates-js";

const App: React.FC = () => {
  const state = useStateContext();
  const dispatch = useDispatchContext();

  useEffect(() => {
    const worker = new ZoKratesWebWorker();
    const load = async () => {
      try {
        await remixClient.createClient();
        setTimeout(() => dispatch(onLoaded(worker)), 1000);
      } catch (err) {
        console.log(err);
      }
    };
    load();
    return () => worker.terminate();
  }, []);

  if (!state.isLoaded) {
    return (
      <div className="d-flex flex-column align-items-center justify-content-center h-100">
        <Spinner animation="grow" variant="primary" />
        <small className="mt-2">Connecting to Remix...</small>
      </div>
    );
  }

  return (
    <div id="wrapper">
      <Container>
        <Header />
        <main role="main" className="mb-5">
          <Accordion>
            <AccordionElement
              headerText="Compile"
              iconClass="fa fa-refresh"
              eventKey="0"
            >
              <Compile />
            </AccordionElement>
            <AccordionElement
              headerText="Compute"
              iconClass="fa fa-lightbulb-o"
              eventKey="1"
              disabled={!state.compilationResult}
            >
              <Compute />
            </AccordionElement>
            <AccordionElement
              headerText="Setup"
              iconClass="fa fa-cog"
              eventKey="2"
              disabled={!state.compilationResult}
            >
              <Setup />
            </AccordionElement>
            <AccordionElement
              headerText="Export Verifier"
              iconClass="fa fa-key"
              eventKey="3"
              disabled={!state.setupResult}
            >
              <ExportVerifier />
            </AccordionElement>
            <AccordionElement
              headerText="Generate Proof"
              iconClass="fa fa-check"
              eventKey="4"
              disabled={
                !state.compilationResult ||
                !state.computationResult ||
                !state.setupResult ||
                !state.exportVerifierResult
              }
            >
              <GenerateProof />
            </AccordionElement>
          </Accordion>
        </main>
      </Container>
      <footer className="footer">
        <div className="container">
          <div>
            <span className="mr-1">ZoKrates:</span>
            <a
              target="_blank"
              href={`https://github.com/Zokrates/ZoKrates/tree/${metadata.version}`}
            >
              {metadata.version}
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
