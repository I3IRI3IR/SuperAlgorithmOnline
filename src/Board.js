import React, { useState } from "react";
import "./Board.css";
import diceImage from './image/dice.jpg';

const Backpack = ({ option }) => {
  return (<></>);
};

const Shop = () => {
  return (<></>);
};

const Equipment = ({ option }) => {
  return (<></>);
};

const Board = ({ setMsgList, items, setItem, player_attributes, setPlayer_attributes}) => {
  const boardSize = 10; // 棋盤尺寸
  const cells = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 19, 29, 39, 49, 59, 69, 79, 89, 99, 98, 97, 96, 95, 94, 93, 92, 91, 90, 80, 70, 60, 50, 40, 30, 20, 10];
  const [currentPosition, setCurrentPosition] = useState(0);
  const [isMoving, setIsMoving] = useState(false);
  const [isEvent, setIsEvent] = useState(false);
  const [eventType, setEventType] = useState("");
  const [eventMsg, setEventMsg] = useState("");
  const [eventParam, setEventParam] = useState("");
  const [openBackpack, setOpenBackpack] = useState(false);

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
          setPlayer_attributes(data.other_param);

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

  const answerQuestion = (index) => {
    setIsEvent(false);
    console.log(index);
    fetch("response/question", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({"select": index}),
    })
      .then((response) => response.json())
      .then((data) => setPlayer_attributes(data));
  };

  return (
    <div className="board-container">
      {isEvent && (
        <div className="event-box">
          { eventType === "question" ? (
            <ul className="question-options">
              {eventParam.map((option, index) => (
                <button key={index} className="question-option" onClick={() => answerQuestion(index)}>
                  {option}
                </button>
              ))}
            </ul>
          ) : eventType === "shop" ? (
            <>
              <div style={{ display: 'flex' }}>
                <>
                  <Shop></Shop>
                  <Equipment option={"sell"}></Equipment>
                </>
                <Backpack option={"sell"}></Backpack>
              </div>
              <button className="close-shop" onClick={() => setIsEvent(false)}>離開商店</button>
            </>
          ) : eventType === "rest" ? (
            <>
              <div style={{ display: 'flex' }}>
                <Equipment option={"adjust"}></Equipment>
                <Backpack option={"adjust"}></Backpack>
              </div>
              <button className="rest" onClick={() => setIsEvent(false)}>結束休息</button>
            </>
          ) : (
            <>
              <p className="event-msg"> { eventMsg } </p>
              <button className="close-event" onClick={() => setIsEvent(false)}>
                確定
              </button>
            </>
          )}
        </div>
      )}
      {openBackpack &&(
        <>
          <div style={{ display: 'flex' }}>
            <Equipment option={"forbid"}></Equipment>
            <Backpack option={"forbid"}></Backpack>
          </div>
          <button className="rest" onClick={() => setOpenBackpack(false)}>退出背包</button>
        </>
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
