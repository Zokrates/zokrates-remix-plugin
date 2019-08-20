import React, { useEffect } from "react";
import { remixClient } from './remix/remix-client'

const App: React.FC = () => {

    useEffect(() => {
        const load = async () => {
            await remixClient.onload()
        }

        load()
    }, [])

    return <div>Hello Remix!</div>;
}

export default App
