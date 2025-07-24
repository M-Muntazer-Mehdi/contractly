// TableGridPicker.tsx
import React, { useState } from 'react';

type Props = {
  maxRows?: number;
  maxCols?: number;
  onSelect: (rows: number, cols: number) => void;
};

const TableGridPicker = ({ onSelect }: { onSelect: (rows: number, cols: number) => void }) => {
  const [hoveredRow, setHoveredRow] = useState(2);
  const [hoveredCol, setHoveredCol] = useState(2);

  const maxRows = 7;
  const maxCols = 7;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${maxCols}, 20px)` }}>
      {Array.from({ length: maxRows }).map((_, row) =>
        Array.from({ length: maxCols }).map((_, col) => {
          const selected = row <= hoveredRow && col <= hoveredCol;
          return (
            <div
              key={`${row}-${col}`}
              style={{
                width: 20,
                height: 20,
                backgroundColor: selected ? '#CCE4FF' : '#fff',
                border: '1px solid #ccc',
              }}
              onMouseEnter={() => {
                setHoveredRow(row);
                setHoveredCol(col);
              }}
              onClick={() => onSelect(row + 1, col + 1)}
            />
          );
        })
      )}
    </div>
  );
};


export default TableGridPicker;