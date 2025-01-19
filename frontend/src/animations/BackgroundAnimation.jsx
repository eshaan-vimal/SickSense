import React, { useEffect, useState } from "react";

const BackgroundAnimation = ({ sectionId }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const gridSize = 20; // Adjust the number of grid items for density

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  const calculateOpacity = (gridX, gridY) => {
    const distance = Math.sqrt(
      Math.pow(mousePosition.x - gridX, 2) +
      Math.pow(mousePosition.y - gridY, 2)
    );
    return distance < 200 ? 1 - distance / 200 : 0;
  };

  const createGrid = () => {
    const gridItems = [];
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const gridItemSize = 50; // Size of each grid item

    for (let i = 0; i < Math.ceil(windowHeight / gridItemSize); i++) {
      for (let j = 0; j < Math.ceil(windowWidth / gridItemSize); j++) {
        const gridX = j * gridItemSize + gridItemSize / 2;
        const gridY = i * gridItemSize + gridItemSize / 2;

        gridItems.push(
          <div
            key={`${i}-${j}`}
            className="absolute bg-blue-500 rounded-full"
            style={{
              width: "8px",
              height: "8px",
              left: `${gridX}px`,
              top: `${gridY}px`,
              opacity: calculateOpacity(gridX, gridY),
            }}
          />
        );
      }
    }
    return gridItems;
  };

  return (
    <div
      id={sectionId}
      className="absolute inset-0 pointer-events-none"
    >
      {createGrid()}
    </div>
  );
};

export default BackgroundAnimation;
