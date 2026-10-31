import { use } from "react";
import { Site } from "../app/site";
import HomeStage from "../sections/HomeStage";

export default function HomePage() {
  const { reduced, motionReady } = use(Site);
  return (
    <>
      <title>Stellarmelt</title>
      <HomeStage reduced={reduced} motionReady={motionReady} />
    </>
  );
}
