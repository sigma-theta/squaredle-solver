import React, { useState } from "react";
import "./App.css";
import dict from "./dictionary.js"

const App = () => {
  const [gridSize, setGridSize] = useState(3);
  const [maxLength, setMaxLength] = useState(7);
  const initialGrid = Array.from({ length: gridSize }, () =>
    Array.from({ length: gridSize }, () => "")
  );
  const [grid, setGrid] = useState(initialGrid);
  const [solution, setSolution] = useState<string[]>([]);


  const handleGridSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGridSize(parseInt(e.target.value));
  };

  const handleMaxLengthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMaxLength(parseInt(e.target.value));
  };

  const reset = () => {
    setGrid(initialGrid);
    setSolution([]);
  };

  const Grid = () => {
    /*const [grid, setGrid] = useState(
      Array.from({ length: gridSize }, () =>
        Array.from({ length: gridSize }, () => "")
      )
    );*/

    const handleChange = (
      row: number,
      column: number,
      event: React.ChangeEvent<HTMLInputElement>
    ) => {
      let copy = [...grid];
      copy[row][column] = event.target.value;
      setGrid(copy);

      //console.log(grid);
    };

    return (
      <div className="grid">
        <table>
          <tbody>
            {grid.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((column, columnIndex) => (
                  <td key={columnIndex}>
                    <input
                      className="letters"
                      value={grid[rowIndex][columnIndex]}
                      type="string"
                      onChange={(e) => handleChange(rowIndex, columnIndex, e)}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const solve = (
    mtx: string[][],
    maxLength: number,
    mtx_size: number
  ): string[] => {
    const words: string[] = [];
    var visited = new Set<string>();
    visited.add("0, 0");

    /*const wordExists = (word: string) => {
      if (words.includes(word)) {
        return true;
      } else {
        return false;
      }
    };*/

    const isValid = (row: number, col: number, word: string): boolean => {
      if (row < 0 || row >= mtx_size || col < 0 || col >= mtx_size) {
        return false;
      }

      if (word.length < 4 || word.length > maxLength) {
        return false;
      }

      /*if (!wordExists(word)) {
        return false;
      }*/
      return true;
    };

    const dfs = (row: number, col: number, word: string) => {
      if (word.length > maxLength) {
        return;
      }

      if (isValid(row, col, word) /*&& words.includes(word)*/) {
        words.push(word);
      }

      for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
          let new_row = row + i;
          let new_col = col + j;

          if (
            new_row >= 0 &&
            new_row < mtx_size &&
            new_col >= 0 &&
            new_col < mtx_size &&
            !(i === 0 && j === 0)
          ) {
            if (!visited.has(`${new_row}, ${new_col}`)) {
              visited.add(`${new_row}, ${new_col}`);
              dfs(new_row, new_col, word + mtx[new_row][new_col]);
              visited.delete(`${new_row}, ${new_col}`);
            }
          }
        }
      }
    };

    for (let i = 0; i < mtx_size; i++) {
      for (let j = 0; j < mtx_size; j++) {
        visited.add(`${i}, ${j}`);
        dfs(i, j, "");
        visited.delete(`${i}, ${j}`);
      }
    }

    const validWords = words.filter(word => dict.includes(word))
    
    return Array.from(new Set(validWords)).sort((a, b) => {
      if (a.length !== b.length) {
        return a.length - b.length;
      } else {
        return a.localeCompare(b);
      }
    });
  };

  return (
    <main className="container">
      <div className="inputs">
        <p className="label">Set grid size</p>
        <input
          className="param-input"
          type="number"
          id="grid-size"
          defaultValue={3}
          value={gridSize}
          min="3"
          onChange={handleGridSizeChange}
        />
        <p className="label">Set max word length</p>
        <input
          className="param-input"
          type="number"
          id="max-length"
          defaultValue={7}
          value={maxLength}
          min="3"
          onChange={handleMaxLengthChange}
        />
      </div>
      <Grid />
      <div className="buttons">
        <button
          className="solve-btn"
          onClick={() => setSolution(solve(grid, maxLength, gridSize))}
        >
          Solve
        </button>
        <button className="reset-btn" onClick={() => reset()}>
          Reset
        </button>
      </div>
      <div className="output">{solution.join("\r\n")}</div>
    </main>
  );
};

export default App;
