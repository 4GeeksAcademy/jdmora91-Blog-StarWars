import React, { useState, useEffect, useRef } from "react";
import { Card } from "../components/Card";
import { StarsBackground } from "../components/StarsBackground";
import "./Home.css";

export const Home = () => {
  const [characters, setCharacters] = useState([]);
  const [planets, setPlanets] = useState([]);
  const [starships, setStarships] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Refs para los contenedores de cada carrusel
  const charsRef = useRef(null);
  const planetsRef = useRef(null);
  const shipsRef = useRef(null);
  const animationId = useRef(null); // Añadido para manejar la animación

  // Fetch para personajes
  const fetchCharacters = async () => {
    try {
      const response = await fetch("https://www.swapi.tech/api/people");
      const data = await response.json();
      setCharacters(data.results);
    } catch (error) {
      console.error("Error fetching characters:", error);
    }
  };

  // Fetch para planetas
  const fetchPlanets = async () => {
    try {
      const response = await fetch("https://www.swapi.tech/api/planets");
      const data = await response.json();
      setPlanets(data.results);
    } catch (error) {
      console.error("Error fetching planets:", error);
    }
  };

  // Fetch para naves
  const fetchStarships = async () => {
    try {
      const response = await fetch("https://www.swapi.tech/api/starships");
      const data = await response.json();
      setStarships(data.results);
    } catch (error) {
      console.error("Error fetching starships:", error);
    }
  };

  // Función de animación (añadida)
  const animate = () => {
    [charsRef, planetsRef, shipsRef].forEach(ref => {
      if (ref.current) {
        ref.current.scrollLeft += 0.5; // Velocidad de desplazamiento
        if (ref.current.scrollLeft >= (ref.current.scrollWidth / 2)) {
          ref.current.scrollLeft = 0;
        }
      }
    });
    animationId.current = requestAnimationFrame(animate);
  };

  // Efecto para animar los carruseles
  useEffect(() => {
    animationId.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId.current);
  }, []);

  useEffect(() => {
    Promise.all([fetchCharacters(), fetchPlanets(), fetchStarships()])
      .then(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-center mt-5">Loading...</div>;

  return (
    <div className="home-container">
      <StarsBackground />
      
      {/* Sección Personajes */}
      <h2 className="section-title">Characters</h2>
      <div 
        ref={charsRef} 
        className="card-carousel"
        onMouseEnter={() => cancelAnimationFrame(animationId.current)}
        onMouseLeave={() => animationId.current = requestAnimationFrame(animate)}
      >
        <div className="card-track">
          {[...characters, ...characters].map((character, index) => (
            <Card
              key={`${character.uid}-${index}`}
              id={character.uid}
              name={character.name}
              type="character"
            />
          ))}
        </div>
      </div>

      {/* Sección Planetas */}
      <h2 className="section-title">Planets</h2>
      <div 
        ref={planetsRef} 
        className="card-carousel"
      >
        <div className="card-track">
          {[...planets, ...planets].map((planet, index) => (
            <Card
              key={`${planet.uid}-${index}`}
              id={planet.uid}
              name={planet.name}
              type="planet"
            />
          ))}
        </div>
      </div>

      {/* Sección Naves */}
      <h2 className="section-title">Starships</h2>
      <div 
        ref={shipsRef} 
        className="card-carousel"
      >
        <div className="card-track">
          {[...starships, ...starships].map((starship, index) => (
            <Card
              key={`${starship.uid}-${index}`}
              id={starship.uid}
              name={starship.name}
              type="starship"
            />
          ))}
        </div>
      </div>
    </div>
  );
};