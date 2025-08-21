import React, { useState, useEffect } from "react";
import { useLoaderData, useNavigate } from "react-router-dom";
import { StoreLocal } from "../components/StoreLocal";
import "./DetailPage.css";

// Datos de ejemplo para cuando las APIs fallen
const getSampleData = (type, id) => {
  const samples = {
    character: {
      "1": { 
        name: "Luke Skywalker", 
        gender: "male", 
        hair_color: "blond", 
        eye_color: "blue", 
        birth_year: "19BBY",
        description: "Luke Skywalker, un humilde granjero de Tatooine, se convirtió en el héroe que salvó la galaxia. Entrenado en los caminos de la Fuerza por Obi-Wan Kenobi y Yoda, enfrentó al Imperio Galáctico y redimió a su padre, Darth Vader, del lado oscuro."
      },
      "2": { 
        name: "C-3PO", 
        gender: "n/a", 
        hair_color: "n/a", 
        eye_color: "yellow", 
        birth_year: "112BBY",
        description: "C-3PO es un droide de protocolo humanoide programado para la etiqueta y la etiqueta. Fluente en más de seis millones de formas de comunicación, a menudo actúa como traductor en misiones críticas para la Alianza Rebelde."
      }
    },
    planet: {
      "1": { 
        name: "Tatooine", 
        climate: "arid", 
        terrain: "desert", 
        population: "200000",
        description: "Tatooine es un mundo desértico orbitando alrededor de un par de estrellas en los Territorios del Borde Exterior. Conocido por sus peligrosos habitantes como los tusken raiders y su población de contrabandistas, fue el hogar de la infancia de Anakin y Luke Skywalker."
      },
      "2": { 
        name: "Alderaan", 
        climate: "temperate", 
        terrain: "grasslands, mountains", 
        population: "2000000000",
        description: "Alderaan era un planeta pacífico conocido por su belleza natural y su dedicación a las artes y la educación. Tragicamente destruido por la Estrella de la Muerte del Imperio, sirvió como terrible demostración del poder imperial."
      }
    },
    starship: {
      "2": { 
        name: "CR90 corvette", 
        model: "CR90 corvette", 
        manufacturer: "Corellian Engineering Corporation", 
        cost_in_credits: "3500000",
        description: "La corbeta CR90, comúnmente conocida como corbeta Corelliana, es una nave versátil utilizada tanto para transporte como para combate. Su diseño elegante y velocidad la hacen popular entre diplomáticos y fuerzas rebeldes por igual."
      },
      "3": { 
        name: "Star Destroyer", 
        model: "Imperial I-class Star Destroyer", 
        manufacturer: "Kuat Drive Yards", 
        cost_in_credits: "150000000",
        description: "El Destructor Estelar Imperial clase Victoria-I es el símbolo del poder militar del Imperio Galáctico. Con 1,600 metros de longitud, lleva a bordo más de 37,000 tripulantes, incluyendo tropas de asalto, cazas TIE y equipos de ocupación planetaria."
      }
    }
  };
  
  return samples[type]?.[id] || {
    name: "Elemento Desconocido",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur."
  };
};

// Texto Lorem Ipsum para descripciones extendidas
const loremIpsum = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.

Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet.

Consectetur.`;

export const DetailPage = () => {
  const { type, id } = useLoaderData();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const storeKey = `starwars_${type}_${id}`;
      const storedData = StoreLocal.read(storeKey);
      
      if (storedData) {
        console.log("⭐ ¡Usando datos de StoreLocal!");
        setData(storedData);
        setLoading(false);
        return;
      }

      try {
        console.log("🌍 Buscando en internet...");
        
        // Usar datos de ejemplo directamente
        const sampleData = getSampleData(type, id);
        if (sampleData) {
          console.log("📋 Usando datos de ejemplo");
          StoreLocal.save(storeKey, sampleData);
          setData(sampleData);
        } else {
          throw new Error("No hay datos disponibles para este elemento");
        }
        
      } catch (error) {
        console.error("Error:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [type, id, navigate]);

  if (loading) return <div className="loading-spinner">Loading...</div>;
  if (error) return <div className="error-message">Error: {error}</div>;
  if (!data) return <div className="error-message">Data not available</div>;

  return (
    <div className="detail-page">
      <div className="detail-content">
        <div className="detail-image-container">
          <img
            src={`https://raw.githubusercontent.com/tbone849/star-wars-guide/master/build/assets/img/${type}s/${id}.jpg`}
            alt={data.name}
            className="detail-image"
            onError={(e) => {
              e.target.src = "https://via.placeholder.com/400x500/333/fff?text=Imagen+No+Disponible";
            }}
          />
        </div>
        
        <div className="detail-info-container">
          <h1>{data.name}</h1>
          
          <div className="detail-description">
            <h3>Descripción</h3>
            <p>{data.description || loremIpsum}</p>
          </div>
          
          <div className="detail-specs">
            <h3>Especificaciones</h3>
            {type === "character" && (
              <div className="specs-grid">
                <div className="spec-item">
                  <strong>Género:</strong> {data.gender || "Desconocido"}
                </div>
                <div className="spec-item">
                  <strong>Color de pelo:</strong> {data.hair_color || "Desconocido"}
                </div>
                <div className="spec-item">
                  <strong>Color de ojos:</strong> {data.eye_color || "Desconocido"}
                </div>
                <div className="spec-item">
                  <strong>Año de nacimiento:</strong> {data.birth_year || "Desconocido"}
                </div>
              </div>
            )}
            
            {type === "planet" && (
              <div className="specs-grid">
                <div className="spec-item">
                  <strong>Clima:</strong> {data.climate || "Desconocido"}
                </div>
                <div className="spec-item">
                  <strong>Terreno:</strong> {data.terrain || "Desconocido"}
                </div>
                <div className="spec-item">
                  <strong>Población:</strong> {data.population ? `${data.population} habitantes` : "Desconocida"}
                </div>
              </div>
            )}
            
            {type === "starship" && (
              <div className="specs-grid">
                <div className="spec-item">
                  <strong>Modelo:</strong> {data.model || "Desconocido"}
                </div>
                <div className="spec-item">
                  <strong>Fabricante:</strong> {data.manufacturer || "Desconocido"}
                </div>
                <div className="spec-item">
                  <strong>Costo:</strong> {data.cost_in_credits ? `${data.cost_in_credits} créditos` : "Desconocido"}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <button className="back-button" onClick={() => navigate(-1)}>
        ← Volver al Inicio
      </button>
    </div>
  );
};