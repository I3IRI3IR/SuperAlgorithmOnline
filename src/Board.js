import React, { useState } from "react";
import "./Board.css";
import diceImage from './image/dice.jpg';

const Equipment = () => {
  return (<></>);
};

const Backpack = ({items, setItem}) => {
  return (
    <>
      <Equipment></Equipment>
      <ul className="backpack">
        {items.map((item, index) => (
          <img key={index} src={item.icon} className="item" onClick={() => setItem(index)}></img>
        ))}
      </ul>
    </>
  );
};

const Shop = ({products, buyItem}) => {
  return (
    <ul className="shop">
      {products.map((product, index) => (
        <img key={index} src={product.icon} className="item" onClick={() => buyItem(index)}></img>
      ))}
    </ul>
  );
};

const Board = ({ setMsgList, player_attributes, setPlayer_attributes, currentPosition, setCurrentPosition}) => {
  const boardSize = 10; // 棋盤尺寸
  const cells = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 19, 29, 39, 49, 59, 69, 79, 89, 99, 98, 97, 96, 95, 94, 93, 92, 91, 90, 80, 70, 60, 50, 40, 30, 20, 10];
  const [isMoving, setIsMoving] = useState(false);
  const [isEvent, setIsEvent] = useState(false);
  const [items, setItems] = useState([]);
  const [products, setProducts] = useState([]);
  const [eventType, setEventType] = useState("");
  const [eventMsg, setEventMsg] = useState("");
  const [eventParam, setEventParam] = useState("");
  const [openBackpack, setOpenBackpack] = useState(false);
  const [switchToShop, setSwitchToShop] = useState(true);

  const rollDice = () => {
    if (isMoving || isEvent) return; // 防止在移動期間或顯示事件觸發新的骰子事件

    fetch("get/rolldice")
      .then((response) => response.json())
      .then((data) => {
        setMsgList(msgList => [...msgList, `骰子點數: ${data.dice}, 起始位置: ${data.pos}, 事件類型: ${data.type}`]);
        movePiece(data.dice, data.pos);

        // 根據事件類型處理邏輯

        setIsEvent(true);
        setEventMsg(data.msg);
        setEventType(data.type);
        setEventParam(data.other_param);
        if (data.type === "reward") {
          setPlayer_attributes(data.other_param);
          setIsEvent(false);
        } else if (data.type === "battle") {

        } else if (data.type === "event") {
          
        }
      });
  };

  const movePiece = (step, pos) => {
    setIsMoving(true);

    const stepDelay = 300; // 每步移動的延遲時間 (毫秒)
    let currentIndex = currentPosition;

    const interval = setInterval(() => {
      pos = (pos + 1) % cells.length; // 下一格的位置
      --step;
      setCurrentPosition(pos);

      if (step<=0) {
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

  const answerEvent = (index) => {
    setIsEvent(false);
    console.log(index);
    fetch("response/event", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({"select": index}),
    })
      .then((response) => response.json())
      .then((data) => setPlayer_attributes(data));
  };

  const setItem = (index) => {

  };

  const buyItem = (index) => {

  };

  return (
    <div className="board-container">
      {isEvent && (
        <div className="event-box">
          { eventType === "question" ? (
            <ul className="question-options">
              <p>{eventMsg}</p>
              {eventParam.map((option, index) => (
                <button key={index} className="question-option" onClick={() => answerQuestion(index)}>
                  {option}
                </button>
              ))}
            </ul>
          ) : eventType === "shop" ? (
            <>
              { switchToShop ? (<Shop products={products} buyItem={buyItem}></Shop>) : (<Backpack items={items} setItem={setItem}></Backpack>) }
              <button className="switch-shop" onClick={() => setSwitchToShop(!switchToShop)}>切換商店或背包</button>
              <button className="close-shop" onClick={() => setIsEvent(false)}>離開商店</button>
            </>
          ) : eventType === "rest" ? (
            <>
              <Backpack items={items} setItem={setItem}></Backpack>
              <button className="rest" onClick={() => setIsEvent(false)}>結束休息</button>
            </>
          ) : eventType === "event" ? (
            <div className="event-popup">
              {console.log(eventMsg)}
              <p style={{textAlign:"center"}}>{eventMsg}</p>
              <ul className="event-options">
                {eventParam.map((option, index) => (
                  <button key={index} className="event-option" onClick={() => answerEvent(index)}>
                    {option}
                  </button>
                ))}
              </ul>
            </div>
          ) : (//eventType === "battle"
            <>
              <button className="rest" onClick={() => setIsEvent(false)}>離開戰鬥</button>
              {/*上面只是暫時用來可以退出用的按鈕*/}
              {/*還沒做，要照 todo 做*/}
            </>
          )}
        </div>
      )}
      {openBackpack &&(
        <>
          <Backpack items={items} setItem={setItem}></Backpack>
          <button className="leave-backpack" onClick={() => setOpenBackpack(false)}>退出背包</button>
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
