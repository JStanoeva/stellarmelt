import { use } from "react";
import { Site } from "../app/site";
import { useShowArt } from "../hooks/useShowArt";
import DiscographySection from "../sections/discography/DiscographySection";
import { StageMotion } from "../sections/stageMotion";

// For now the page shows the home stage's discography section on its own, under the same planetrise.
export default function DiscographyPage() {
  const { reduced, motionReady } = use(Site);
  useShowArt("discography");

  return (
    <div className="relative h-dvh">
      <title>Discography · Stellarmelt</title>
      <StageMotion value={{ reduced, direction: 1, motionReady }}>
        <DiscographySection headingTag="h1" />
      </StageMotion>
    </div>
  );
}
