import React, { useState, useEffect } from "react";
import "./Game.css";
import Board from './Board';

const Msgbox = ({msgList, setMsgList, msg, setMsg}) => {
  const sendMsg = () => {
    setMsgList((msgList) => [...msgList, msg]);
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
  const [player_attributes, setPlayer_attributes] = useState({});
  const [level, setLevel] = useState(0);
  const [boss_hp, setBoss_hp] = useState(0);
  const [total_atk, setTotal_atk] = useState(0);
  const [currentPosition, setCurrentPosition] = useState(0);

  useEffect(() => {
    fetch("/get/game_data")
      .then((response) => response.json())
      .then((data) => {
        setPlayer_name(data.player_name);
        setPlayer_attributes(data.player_attributes[0]);
        setLevel(data.level);
        setBoss_hp(data.boss_hp);
        setTotal_atk(data.total_atk);
        setCurrentPosition(data.pos);
      })
      .catch((error) => console.error("Error loading game data:", error));
  }, []);

  const [msg, setMsg] = useState("");
  const [msgList, setMsgList] = useState([]);

  return (
    <div className="game-container">
      <div className="information">
        <div className="player-name">{player_name}</div>
        <p style={{whiteSpace: "pre"}}>目前所在層數：{level}     Boss 血量：{boss_hp}      玩家累計傷害：{total_atk}</p>
        <ul className="player-attributes">
          {Object.entries(player_attributes).map(([name,val]) => (
            <li key={name} className="player-attribute">
              {name}: {val}
            </li>
          ))}
        </ul>
      </div>
      <div className="main-content">
        <div className="boardgen-container">
            <Board setMsgList={setMsgList} player_attributes={player_attributes} setPlayer_attributes={setPlayer_attributes} currentPosition={currentPosition} setCurrentPosition={setCurrentPosition}/>
        </div>
        <Msgbox msgList={msgList} setMsgList={setMsgList} msg={msg} setMsg={setMsg}/>
      </div>
    </div>
  );
};

export default Game;
