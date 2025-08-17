import React, { useState, useEffect } from "react";
import { useLoaderData, useNavigate } from "react-router-dom";
import "./DetailPage.css";

export const DetailPage = () => {
  const { type, id } = useLoaderData();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`https://www.swapi.tech/api/${type}s/${id}`);
        if (!response.ok) throw new Error("Failed to fetch");
        const result = await response.json();
        
        if (!result.result) throw new Error("Data not found");
        setData(result.result.properties);
      } catch (error) {
        console.error("Fetch error:", error);
        navigate("/not-found");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [type, id, navigate]);

  if (loading) return <div className="loading-spinner">Loading...</div>;
  if (!data) return <div className="error-message">Data not available</div>;

  return (
    <div className="detail-page">
      <h1>{data.name}</h1>
      
      <div className="detail-image-container">
        <img
          src={`https://raw.githubusercontent.com/tbone849/star-wars-guide/master/build/assets/img/${type}s/${id}.jpg`}
          alt={data.name}
          className="detail-image"
          onError={(e) => {
            e.target.src = "https://via.placeholder.com/400x300?text=Image+Not+Found";
          }}
        />
      </div>
      
      <div className="detail-info">
        {type === "character" && (
          <>
            <p><strong>Gender:</strong> {data.gender}</p>
            <p><strong>Hair Color:</strong> {data.hair_color}</p>
            <p><strong>Eye Color:</strong> {data.eye_color}</p>
          </>
        )}
        
        {type === "planet" && (
          <>
            <p><strong>Climate:</strong> {data.climate}</p>
            <p><strong>Terrain:</strong> {data.terrain}</p>
          </>
        )}
        
        {type === "starship" && (
          <>
            <p><strong>Model:</strong> {data.model}</p>
            <p><strong>Manufacturer:</strong> {data.manufacturer}</p>
          </>
        )}
      </div>
      
      <button 
        className="back-button"
        onClick={() => navigate(-1)}
      >
        ← Back to Home
      </button>
    </div>
  );
};