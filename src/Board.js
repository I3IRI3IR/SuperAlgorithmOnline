import React, { useState, useEffect } from "react";
import "./Board.css";
import diceImage from './image/dice.jpg'

const Board = ({setMsgList}) => {
  const boardSize = 10; // 棋盤尺寸
  const cells = [0,1,2,3,4,5,6,7,8,9,19,29,39]

  const rollDice = () => {
    fetch("get/rolldice")
    .then((response) => response.json())
    .then((data) =>{
      alert(data);
      setMsgList(msgList => [...msgList, data.event]);
      if(data.type==="question"){
        //同商店強制彈窗答完 fetch，但我不知道怎麼處理他要是故意不答做別的事
        //答完同底下 useEffect 更新
      }
      else if(data.type==="shop"){
        //不知道你打算怎麼觸發商店，顯示個隱藏 div 之類的嗎，後端記得紀錄現在是可購買的狀態，避免有人自己不合法的偷戳商店
        //然後我覺得商店的內容物一開始初始化就要傳好，所以這裡只有在決定要購物的時候才會 fetch
      }
      else if(data.typ === "reward"){
        
      }
      else if(data.type === "battle")
      {

      }
      else if(data.type==="event")
      {
        
      }
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
