import { initialize, ZoKratesProvider, ResolverResult } from "zokrates-js";
import { getImportPath } from "./common/utils";
import {
  WA_COMPILE,
  WA_SETUP,
  WA_UNIVERSAL_SETUP,
  WA_COMPUTE,
  WA_EXPORT_VERIFIER,
  WA_GENERATE_PROOF,
  WA_ERROR,
} from "./zokrates/constants";

initialize()
  .then((zokratesProvider: ZoKratesProvider) => {
    const onAction = (action) => {
      const { type, payload } = action;
      const provider = payload.options
        ? zokratesProvider.withOptions(payload.options)
        : zokratesProvider;
      try {
        switch (type) {
          case WA_COMPILE: {
            const { location, source, imports } = payload;
            const importResolver = (
              location: string,
              path: string
            ): ResolverResult => {
              const key: string = getImportPath(location, path);
              return imports[key]
                ? { source: imports[key], location: key }
                : null;
            };

            const artifacts = provider.compile(source, {
              location,
              resolveCallback: importResolver,
            });

            // @ts-ignore
            self.postMessage({
              type: type,
              payload: [artifacts, payload.source],
            });
            break;
          }
          case WA_COMPUTE: {
            let computationResult = provider.computeWitness(
              payload.artifacts,
              payload.args
            );
            // @ts-ignore
            self.postMessage({ type: type, payload: computationResult });
            break;
          }
          case WA_SETUP: {
            let keypair = payload.srs
              ? provider.setupWithSrs(payload.srs, payload.program)
              : provider.setup(payload.program);
            // @ts-ignore
            self.postMessage({ type: type, payload: keypair });
            break;
          }
          case WA_UNIVERSAL_SETUP: {
            let srs = provider.universalSetup(payload.size);
            // @ts-ignore
            self.postMessage({ type: type, payload: srs });
            break;
          }
          case WA_EXPORT_VERIFIER: {
            let verifier = provider.exportSolidityVerifier(payload.vk);
            // @ts-ignore
            self.postMessage({
              type: type,
              payload: { verifier },
            });
            break;
          }
          case WA_GENERATE_PROOF: {
            let proof = provider.generateProof(
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
        self.postMessage({ type: WA_ERROR, payload: { error: err, type } });
      }
    };
    self.addEventListener("message", (ev) => onAction(ev.data));
  })
  .catch((e) => console.log(e));
