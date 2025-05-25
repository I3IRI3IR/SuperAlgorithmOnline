import React, { useState } from "react";
import "./Board.css";
import diceImage from './image/dice.jpg';

const Board = ({ setMsgList }) => {
  const boardSize = 10; // 棋盤尺寸
  const cells = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 19, 29, 39, 49, 59, 69, 79, 89, 99, 98, 97, 96, 95, 94, 93, 92, 91, 90, 80, 70, 60, 50, 40, 30, 20, 10];
  const [currentPosition, setCurrentPosition] = useState(0);
  const [isMoving, setIsMoving] = useState(false);
  const [isEvent, setIsEvent] = useState(false);
  const [eventType, setEventType] = useState("");
  const [eventMsg, setEventMsg] = useState("");
  const [eventParam, setEventParam] = useState("");

  const rollDice = () => {
    if (isMoving || isEvent) return; // 防止在移動期間或顯示事件觸發新的骰子事件

    fetch("get/rolldice")
      .then((response) => response.json())
      .then((data) => {
        const diceRoll = data.dice;
        const targetPosition = (currentPosition + diceRoll) % cells.length;

        setMsgList(msgList => [...msgList, `骰子點數: ${diceRoll}, 目標位置: ${cells[targetPosition]}, 事件類型: ${data.type}`]);
        movePiece(targetPosition);

        // 根據事件類型處理邏輯
        setIsEvent(true);
        setEventMsg(data.msg);
        setEventType(data.type);
        setEventParam(data.other_param);
        if (data.type === "reward" || data.type === "battle" || data.type === "event") {
          Object.entries(data.other_param).forEach(([key, value]) => {
            //對所有屬性 key 更新 value，建議不要用加減的，用設定的，避免奇怪 racing 讓值變怪
          });
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
      {isEvent && (
        <div className="event-box">
          { eventType === "question" ? (
            <ul className="question-options">
              {eventParam.map((option, index) => (
                <button key={index} className="question-option" onClick={()=>{setIsEvent(false);/*在這裡把 index 當選項送回去*/}}>
                  {option}
                </button>
              ))}
            </ul>
          ) : eventType === "shop" ? (
            <button className="shop" onClick={()=>setIsEvent(false)}>待加入獨立畫面</button>
          ) : eventType === "rest" ? (
            <button className="rest" onClick={()=>setIsEvent(false)}>待處理調整裝備和使用道具，應該會跟商店重疊很多</button>
          ) : (
            <>
              <p className="event-msg"> { eventMsg } </p>
              <button className="close-event" onClick={()=>setIsEvent(false)}>
                確定
              </button>
            </>
          )}
        </div>
      )}
      <div className="board">
        {Array.from({ length: boardSize * boardSize }, (_, index) => (
          <div
            key={index}
            className={cells.includes(index) ? "cell" : "empty-cell"}
          >
            {cells.includes(index) && <span>{index}</span>}
          </div>
        ))}
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
