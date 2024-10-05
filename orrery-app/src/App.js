import React, { useState } from 'react';
import MainMenu from './components/MainMenu';
import WormholeScene from './components/WormholeScene';
import PlanetScene from './components/PlanetScene';
import PlanetInfo from './components/PlanetInfo';

const App = () => {
  const [selectedPlanet, setSelectedPlanet] = useState(null);
  const [wormholePhase, setWormholePhase] = useState(false);
  const [explorePhase, setExplorePhase] = useState(false);

  const handlePlanetSelect = (planet) => {
    setSelectedPlanet(planet);
    setWormholePhase(true);  // Start wormhole phase
  };

  const handleWormholeEnd = () => {
    setWormholePhase(false);
  };

  const handleExplore = () => {
    setExplorePhase(true);
  };

  const handleExit = () => {
    setSelectedPlanet(null);
    setWormholePhase(false);
    setExplorePhase(false);
  };

  return (
    <>
      {!selectedPlanet && <MainMenu onPlanetSelect={handlePlanetSelect} />}
      
      {wormholePhase && (
        <WormholeScene onWormholeEnd={handleWormholeEnd} />
      )}

      {!wormholePhase && selectedPlanet && !explorePhase && (
        <PlanetScene planet={selectedPlanet} onExplore={handleExplore} onExit={handleExit} />
      )}

      {explorePhase && (
        <PlanetInfo planet={selectedPlanet} />
      )}
    </>
  );
};

export default App;
