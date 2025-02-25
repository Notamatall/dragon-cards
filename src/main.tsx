import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import AudioProvider from "./providers/audio-provider";
import DragonCardProvider from "./providers/dragon-card-provider";
import ResourcesProvider from "./providers/resource-provider";
import LoaderProvider from "./providers/loader-provider";
import CardGame from "./components/card-game/card-game";
import "styles/index";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ResourcesProvider>
      <AudioProvider>
        <LoaderProvider>
          <DragonCardProvider>
            <CardGame />
          </DragonCardProvider>
        </LoaderProvider>
      </AudioProvider>
    </ResourcesProvider>
  </StrictMode>,
);
