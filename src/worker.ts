import { initialize, ZoKratesProvider, ResolverResult } from "zokrates-js";
import { getImportPath } from "./common/utils";
import {
  WA_COMPILE,
  WA_SETUP,
  WA_COMPUTE,
  WA_EXPORT_VERIFIER,
  WA_GENERATE_PROOF,
  WA_ERROR,
} from "./zokrates/constants";

initialize()
  .then((zokratesProvider: ZoKratesProvider) => {
    const onCompile = (source: string, location: string, imports: object) => {
      const importResolver = (
        location: string,
        path: string
      ): ResolverResult => {
        const key: string = getImportPath(location, path);
        return imports[key] ? { source: imports[key], location: key } : null;
      };
      return zokratesProvider.compile(source, {
        location,
        resolveCallback: importResolver,
      });
    };
    const onAction = (action) => {
      const { type, payload } = action;
      try {
        switch (type) {
          case WA_COMPILE: {
            let artifacts = onCompile(
              payload.source,
              payload.location,
              payload.imports
            );
            // @ts-ignore
            self.postMessage({
              type: type,
              payload: [artifacts, payload.source],
            });
            break;
          }
          case WA_COMPUTE: {
            let computationResult = zokratesProvider.computeWitness(
              payload.artifacts,
              payload.args
            );
            // @ts-ignore
            self.postMessage({ type: type, payload: computationResult });
            break;
          }
          case WA_SETUP: {
            let keypair = zokratesProvider.setup(payload.program);
            // @ts-ignore
            self.postMessage({ type: type, payload: keypair });
            break;
          }
          case WA_EXPORT_VERIFIER: {
            let verifier = zokratesProvider.exportSolidityVerifier(
              payload.vk,
              payload.abiVersion
            );
            // @ts-ignore
            self.postMessage({
              type: type,
              payload: { verifier, abiVersion: payload.abiVersion },
            });
            break;
          }
          case WA_GENERATE_PROOF: {
            let proof = zokratesProvider.generateProof(
              payload.program,
              payload.witness,
              payload.pk
            );
            // @ts-ignore
            self.postMessage({ type: type, payload: proof });
            break;
          }
          default:
            break;
        }
      } catch (err) {
        // @ts-ignore
        self.postMessage({ type: WA_ERROR, payload: err });
      }
    };
    self.addEventListener("message", (ev) => onAction(ev.data));
  })
  .catch((e) => console.log(e));
