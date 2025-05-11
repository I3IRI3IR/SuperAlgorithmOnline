import React, { useState } from "react";
import "./Board.css";
import diceImage from './image/dice.jpg';

const Board = ({ setMsgList }) => {
  const boardSize = 10; // 棋盤尺寸
  const cells = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 19, 29, 39, 49, 59, 69, 79, 89, 99, 98, 97, 96, 95, 94, 93, 92, 91, 90, 80, 70, 60, 50, 40, 30, 20, 10];
  const [currentPosition, setCurrentPosition] = useState(0);
  const [isMoving, setIsMoving] = useState(false);

  const rollDice = () => {
    if (isMoving) return; // 防止在移動期間觸發新的骰子事件

    fetch("get/rolldice")
      .then((response) => response.json())
      .then((data) => {
        const diceRoll = data.dice;
        const targetPosition = (currentPosition + diceRoll) % cells.length;

        setMsgList(msgList => [...msgList, `骰子點數: ${diceRoll}, 目標位置: ${cells[targetPosition]}`]);
        movePiece(targetPosition);

        // 根據事件類型處理邏輯
        if (data.type === "question") {
          // 問題事件
        } else if (data.type === "shop") {
          // 商店事件
        } else if (data.type === "reward") {
          // 獎勵事件
        } else if (data.type === "battle") {
          // 戰鬥事件
        } else if (data.type === "event") {
          // 其他事件
        }
      });
  };

  const movePiece = (targetPosition) => {
    setIsMoving(true);

    const stepDelay = 300; // 每步移動的延遲時間 (毫秒)
    let currentIndex = currentPosition;

    const interval = setInterval(() => {
      currentIndex = (currentIndex + 1) % cells.length; // 下一格的位置
      setCurrentPosition(currentIndex);

      if (currentIndex === targetPosition) {
        clearInterval(interval);
        setIsMoving(false); // 移動完成
      }
    }, stepDelay);
  };

  const calculatePosition = (index) => {
    const row = Math.floor(index / boardSize);
    const col = index % boardSize;
    return { top: `${row * 75}px`, left: `${col * 75}px` };
  };

  return (
    <div className="board-container">
      <div className="board">
        {Array.from({ length: boardSize * boardSize }, (_, index) => (
          <div
            key={index}
            className={cells.includes(index) ? "cell" : "empty-cell"}
          >
            {cells.includes(index) && <span>{index}</span>}
          </div>
        ))}
        {/* 棋子 */}
        <div
          className="piece"
          style={calculatePosition(cells[currentPosition])}
        ></div>
      </div>
      <button className="dice-button" onClick={rollDice}>
        <img src={diceImage} alt="骰子" className="dice-image" />
      </button>
    </div>
  );
};

export default Board;
