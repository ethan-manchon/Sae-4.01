import React from "react";

const colors = {
  0: "#e5e5e5",
  1: "#9B2C2C",
  2: "#D44949",
  3: "#DCA02D",
  4: "#387F95",
  5: "#48AE65",
};

const getColor = (power, index) => {
  if (power > index) {
    return colors[power];
  }
  return colors[0];
};

const indicatorIndexes = [0, 1, 2, 3, 4];

const Indicators = ({ score }: { score: number }) => (
  <div className="indicator-container mt-2">
    {indicatorIndexes.map((indicatorIndex) => (
      <div
        className="indicator"
        key={indicatorIndex}
        style={{ backgroundColor: getColor(score + 1, indicatorIndex) }}
      />
    ))}
  </div>
);

export { Indicators };
