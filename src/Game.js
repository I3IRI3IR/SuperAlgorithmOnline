import React, { useState, useEffect } from "react";
import "./Game.css";
import Board from './Board';

const Boardgen = () => {
  return (
    <div className="boardgen-container">
      {Board()}
    </div>
  );
};

const Msgbox = () => {
  const [msg, setMsg] = useState("");
  const [msgList, setMsgList] = useState([]);

  const sendMsg = () => {
    setMsgList([...msgList, msg]);
    setMsg(""); // 清空輸入框
  };

  return (
    <div className="msgbox-container">
      <div className="msg">
        {msgList.map((msg, index) => (
          <p key={index}>{msg}</p>
        ))}
      </div>
      <input
        className="msg-input"
        type="text"
        value={msg}
        onChange={(e) => setMsg(e.target.value)}
        placeholder="在這裡輸入訊息..."
      />
      <button className="msg-send" onClick={sendMsg}>
        送出
      </button>
    </div>
  );
};

const Game = () => {
  const [player_name, setPlayer_name] = useState("");
  const [player_attributes, setPlayer_attributes] = useState([]);
  const [items, setItems] = useState([]);
  const [level, setLevel] = useState(0);
  const [boss_hp, setBoss_hp] = useState(0);
  const [total_atk, setTotal_atk] = useState(0);

  useEffect(() => {
    fetch("/get/game-data")
      .then((response) => response.json())
      .then((data) => {
        setPlayer_name(data.player_name);
        setPlayer_attributes(data.player_attributes);
        setItems(data.items);
        setLevel(data.level);
        setBoss_hp(data.boss_hp);
        setTotal_atk(data.total_atk);
      })
      .catch((error) => console.error("Error loading game data:", error));
  }, []);

  return (
    <div className="game-container">
      <div className="information">
        <div className="player-name">{player_name}</div>
        <ul className="player-attributes">
          {player_attributes.map((attr, index) => (
            <li key={index} className="player-attribute">
              {attr.name}: {attr.val}
            </li>
          ))}
        </ul>
        <ul className="items">
          {items.map((item, index) => (
            <li key={index} className="item">
              {item.name}: {item.num}
            </li>
          ))}
        </ul>
        <p>目前所在層數：{level}     Boss 血量：{boss_hp}      玩家累計傷害：{total_atk}</p>
      </div>
      <div className="main-content">
        <Boardgen />
        <Msgbox />
      </div>
    </div>
  );
};

export default Game;
