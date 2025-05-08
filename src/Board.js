import React, { useState, useEffect } from "react";
import "./Board.css";
import diceImage from './image/dice.jpg'

const Board = ({setMsgList}) => {
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
      setMsgList(msgList => [...msgList, data.event]);
      if(data.type==="question"){
        //同商店強制彈窗答完 fetch，但我不知道怎麼處理他要是故意不答做別的事
        //答完同底下 useEffect 更新
      }
      else if(data.type==="shop"){
        //不知道你打算怎麼觸發商店，顯示個隱藏 div 之類的嗎，後端記得紀錄現在是可購買的狀態，避免有人自己不合法的偷戳商店
        //然後我覺得商店的內容物一開始初始化就要傳好，所以這裡只有在決定要購物的時候才會 fetch
      }
      /*else if(data.typ=== 獎勵或事件或戰鬥){
        這裡應該不會真的更新東西，直接掛 useEffect 讓他自己更新
      }*/
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
