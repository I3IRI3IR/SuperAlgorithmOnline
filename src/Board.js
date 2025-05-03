import React, { useState, useEffect } from "react";
import "./Board.css";
import diceImage from './image/dice.jpg'

function Board() {
  const boardSize = 10; // 棋盤尺寸
  const cells = Array.from({ length: boardSize * boardSize }, (_, index) => {
    const row = Math.floor(index / boardSize);
    const col = index % boardSize;

    // 只保留邊緣格子（上邊、下邊、左邊、右邊）
    if (
      row === 0 || // 上邊
      row === boardSize - 1 || // 下邊
      col === 0 || // 左邊
      col === boardSize - 1 // 右邊
    ) {
      return true; // 是邊緣格子
    }
    return false; // 內部格子
  });

  const rollDice = () => {
    fetch("get/rolldice")
    .then((response) => response.json())
    .then((data) =>{
      alert(data);
    })
  };

  return (
    <div className="board-container">
      <div className="board">
        {cells.map((isEdge, index) =>
          isEdge ? (
            <div key={index} className="cell" />
          ) : (
            <div key={index} className="empty-cell" />
          )
        )}
      </div>
      <button className="dice-button" onClick={rollDice}>
        <img src={diceImage} alt="骰子" className="dice-image" />
      </button>
    </div>
  );
}

export default Board;
