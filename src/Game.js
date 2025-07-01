import React, { useState, useEffect } from "react";
import "./Game.css";
import Board from './Board';

const Game = () => {
  const [player_name, setPlayer_name] = useState("");
  const [player_attributes, setPlayer_attributes] = useState({});
  const [level, setLevel] = useState(0);
  const [boss_hp, setBoss_hp] = useState(0);
  const [total_atk, setTotal_atk] = useState(0);
  const [currentPosition, setCurrentPosition] = useState(0);
  const [shopflag, setShopflag] = useState(false);
  const [cd, setCd] = useState(0);
  const [map,setMap] = useState([]);
  const [avatar,setAvatar] = useState("");

  useEffect(() => {
    fetch("/get/game_data")
      .then((response) => response.json())
      .then((data) => {
        setPlayer_name(data.player_name);
        setPlayer_attributes(data.player_attributes);
        setLevel(data.level);
        setBoss_hp(data.boss_hp);
        setTotal_atk(data.total_atk);
        setCurrentPosition(data.pos);
        setMap(data.map);
        setAvatar(data.icon);
      })
      .catch((error) => console.error("Error loading game data:", error));
    const interval = setInterval(() => {
      fetch("/periodicUpdate")
        .then((response) => response.json())
        .then((data) => {
          setPlayer_attributes(data.playerattr);
          setBoss_hp(data.bosshp);
          setCd(data.cd);
        })
    }, 5000);
  }, []);

  return (
    <div className="game-container">
      <div className="information" style={{display: 'flex'}}>
        <img style={{height:'10vh'}} src={avatar} alt="玩家頭像"></img>
        <div>
          <div className="player-name">{player_name}</div>
          <p style={{whiteSpace: "pre"}}>目前所在層數：{level}     Boss 血量：{boss_hp}      玩家累計傷害：{total_atk}</p>
          <ul className="player-attributes">
            {Object.entries(player_attributes).map(([name,val]) => (!name.includes("FLAG")) && (
              <li key={name} className="player-attribute">
                {name}: {val}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="main-content">
        <div className="boardgen-container">
            <Board player_attributes={player_attributes} setPlayer_attributes={setPlayer_attributes} currentPosition={currentPosition} setCurrentPosition={setCurrentPosition} shopflag={shopflag} setShopflag={setShopflag} cd={cd} player_name={player_name} map={map} avatar={avatar}/>
        </div>
      </div>
    </div>
  );
};

export default Game;
