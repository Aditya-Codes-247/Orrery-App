const planetsData = {
    Venus: {
      Planet_Name: "Venus",
      Type: "Terrestrial",
      Distance_from_Sun_AU: "0.72",
      Diameter_km: "12104",
      Rotation_Period_days: "243",
      Orbital_Period_years: "0.615",
      Moons: "0",
      Rings: "No",
      Temperature_Range_C: "-173 to 427",
      Atmosphere_Composition: ["Carbon Dioxide", "Nitrogen", "Sulfur Dioxide", "Argon"],
      Surface_Characteristics: "Rocky surface with volcanic plains",
      Interesting_Facts: "Venus is the hottest planet in the solar system.",
      Mass_10_24kg: "4.87",
      Escape_velocity_kms: "10.36"
    },
    // Add more planets similarly
  };
  
  export const getPlanetInfo = (planet) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(planetsData[planet]);
      }, 500);  // Simulate network delay
    });
  };
  