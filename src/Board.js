import React, { useState, useRef } from "react";
import "./Board.css";

const Equipment = ({equipments, doItem, usedItem}) => {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <ul className="equipment" style={{ position: 'relative' }}>
      {Object.entries(equipments).map(([key, equipment], index) => equipment ? (
        <div style={{display: 'flex'}}>
          <img key={index} src={equipment.icon} className="item" alt="裝備欄" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)} onClick={() => { usedItem['change']={"name": equipment.name, "type": equipment.type}; doItem(usedItem); }}></img>
          {isHovered && (
            <div
              style={{
                position: 'absolute',
                bottom: '-30px',
                left: '0',
                width: '100%',
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                color: 'white',
                padding: '5px',
                fontSize: '14px',
                textAlign: 'center',
                borderRadius: '4px',
                pointerEvents: 'none', // 不阻擋滑鼠
                zIndex: 1003
              }}
            >
              <p>價格：{equipment.price}</p>
              <p>物品描述：{equipment.descript}</p>
            </div>
          )}
        </div>
      ) : (
        <div style={{display: 'flex'}}>
          <img key={index} /*debugflag 這裡之後要改一張沒東西的照片之類的*/ src="/image/question.png" className="item" alt="空裝備欄" onClick={() => { usedItem['change']={"name": null, "type": null}; doItem(usedItem); }}></img>
        </div>
      ))}
    </ul>
  );
};

const Item = ({item, isSell, doItem, setUsedItem}) => {
  const [showButton, setShowButton] = useState(false);
  const imgRef = useRef(null);
  const [buttonPosition, setButtonPosition] = useState({ top: 0, left: 0 });
  const [isHovered, setIsHovered] = useState(false);
  return (
    <div style={{ position: 'relative' }}>
      <img src={item.icon} className="item" ref={isHovered ? imgRef : null} alt="物品" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)} onClick={() => {
        if (imgRef.current) {
          const rect = imgRef.current.getBoundingClientRect();
          setButtonPosition({
            top: window.scrollY + 5, // 5px 下移一點點
            left: window.scrollX
          });
          setShowButton(!showButton);
        }
      }}></img>
      {isHovered && (
        <div
          style={{
            position: 'absolute',
            bottom: '-30px',
            left: '0',
            width: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            color: 'white',
            padding: '5px',
            fontSize: '14px',
            textAlign: 'center',
            borderRadius: '4px',
            pointerEvents: 'none', // 不阻擋滑鼠
            zIndex: 1003
          }}
        >
          <p>價格：{item.price}</p>
          <p>物品描述：{item.descript}</p>
        </div>
      )}
      {showButton && (
        <button
          style={{
            position: 'absolute',
            top: buttonPosition.top,
            left: buttonPosition.left,
            zIndex: 1008,
            cursor: 'pointer'
          }}
          onClick={ () => isSell ? doItem(item.name) : item.type === "item" ? doItem({"used": {"name": item.name, "type": "item", "equip": false}}) : setUsedItem({"used": {"name": item.name, "type": item.type, "equip": item.equipped}}) }
        >{isSell ? "賣出" : item.type === "item" ? "使用" : "裝備"}</button>
      )}
    </div>
  )
}

const Backpack = ({items, isSell, doItem, setUsedItem}) => {
  return (
    <ul className="backpack">
      {Object.keys(items).length!==0 ? Object.entries(items).map(([key, item],index) => (
          <Item key={index} item={item} isSell={isSell} doItem={doItem} setUsedItem={setUsedItem}></Item>
        )) : <p>背包為空</p> //debugflag 這裡之後要加一張沒東西的照片之類的
      }
    </ul>
  );
};

const Shop = ({products, buyItem}) => {
  const [hoveredIndex, setHoveredIndex] = useState(null); // 儲存當前懸停的商品索引
  const imgRef = useRef([]);
  const [buttonPosition, setButtonPosition] = useState({ top: 0, left: 0 });
  const getPopupPosition = (index) => {
    if (!imgRef.current[index]) return { left: 0, top: 0 };

    const item = imgRef.current[index];
    const rect = item.getBoundingClientRect();
    
    // 計算彈窗的位置（這裡是底部加一些距離）
    return {
      left: window.scrollX,  // 彈窗的左邊要與商品的左邊對齊
      top: rect.top + window.scrollY + 10,  // 彈窗的頂部在商品底部下方一些距離
    };
  };
  return (
    <ul className="shop" style={{ position: 'relative' }}>
      {Object.entries(products).map(([key, product],index) => (
        <div key={key}>
          {product.icon!=="" && <img ref={(el) => (imgRef.current[index] = el)} src={"/"+product.icon} className="item" alt="商品" onMouseEnter={() => setHoveredIndex(index)} onMouseLeave={() => setHoveredIndex(null)} onClick={() => buyItem(product.name)}></img>}
          {hoveredIndex === index && (
            <div
              style={{
                position: 'absolute',
                left: `${getPopupPosition(index).left}px`,  // 根據位置動態設定
                top: `${getPopupPosition(index).top}px`,  // 根據位置動態設定
                width: '100%',
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                color: 'white',
                padding: '5px',
                fontSize: '14px',
                textAlign: 'center',
                borderRadius: '4px',
                pointerEvents: 'none', // 不阻擋滑鼠
                zIndex: 1003
              }}
            >
              <p>價格：{product.price}</p>
              <p>物品描述：{product.descript}</p>
            </div>
          )}
        </div>
      ))}
    </ul>
  );
};

const Board = ({ setMsgList, player_attributes, setPlayer_attributes, currentPosition, setCurrentPosition, shopflag, setShopflag, cd, player_name, map, finallistName }) => {
  const boardSize = 10; // 棋盤尺寸
  const cells = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 19, 29, 39, 49, 59, 69, 79, 89, 99, 98, 97, 96, 95, 94, 93, 92, 91, 90, 80, 70, 60, 50, 40, 30, 20, 10];
  const [isMoving, setIsMoving] = useState(false);
  const [isEvent, setIsEvent] = useState(false);
  const [items, setItems] = useState([]);
  const [products, setProducts] = useState([]);
  const [equipments, setEquipments] = useState({});
  const [eventType, setEventType] = useState("");
  const [eventMsg, setEventMsg] = useState("");
  const [eventParam, setEventParam] = useState("");
  const [openBackpack, setOpenBackpack] = useState(false);
  const [openFinal, setOpenFinal] = useState(false);
  const [usedItem, setUsedItem] = useState({});
  const [eventResult, setEventResult] = useState(false);
  const [finallist, setFinallist] = useState([]);
  const [stillBattle,setStillBattle] = useState(false);
  const [enemyAttr,setEnemyAttr] = useState({});
  const [playerAttr,setPlayerAttr] = useState({});
  const [enemyName,setEnemyName] = useState("");

  const rollDice = () => {
    if (isMoving || isEvent) return; // 防止在移動期間或顯示事件觸發新的骰子事件

    fetch("get/rolldice")
      .then((response) => {
        const contentType = response.headers.get('Content-Type');
        if (contentType && contentType.includes('application/json')) {
          return response.json();  // 是 JSON
        } else {
          return null;
        }
      })
      .then((data) => {
        if(!data)return;
        const updated = { ...player_attributes, DICE: player_attributes.DICE - 1 };
        setPlayer_attributes(updated);
        setMsgList(msgList => [...msgList, `骰子點數: ${data.dice}, 起始位置: ${data.pos}, 事件類型: ${data.type}`]);
        movePiece(data.dice, data.pos);

        // 根據事件類型處理邏輯

        setIsEvent(true);
        setEventMsg(data.msg);
        setEventType(data.type);
        setEventParam(data.other_param);
        if (data.type === "rest") {
          // setPlayer_attributes(data.other_param);//debugflag 後端做好後要讓它活
          setIsEvent(false);
        } else if (data.type === "reward") {
          setPlayer_attributes(data.other_param);
        } else if (data.type === "battle") {
          if(Object.keys(data.other_param).length===0){
            setIsEvent(false);
            return;
          }
          console.log(data);
          // setStillBattle(true);
          setEventParam(data.other_param['log']);
          setPlayerAttr({
            "HP":player_attributes["HP"],
            "ATK":player_attributes["ATK"],
            "DEF":player_attributes["DEF"]
          });
          setPlayer_attributes(data.other_param['player_attributes']);
          console.log(data.other_param['mob_attributes']['hp']);
          setEnemyName(data.other_param['mob_attributes']['name']);
          setEnemyAttr({
            "HP":data.other_param['mob_attributes']["hp"],
            "ATK":data.other_param['mob_attributes']["atk"],
            "DEF":data.other_param['mob_attributes']["def"]
          });
          return;
          const stepDelay = 500;
          let idx=0,n=eventParam['log'].length;
          
          const interval = setInterval(() => {
            if(eventParam[idx]['defender'] === "player"){
              setPlayerAttr(playerAttr['HP']);
            }
            else{
              // setEnemyAttr();
            }
            ++idx;
            if (idx>=n) {
              clearInterval(interval);
              setStillBattle(false);
            }
          }, stepDelay);

        } else if (data.type === "shop") {
          setProducts(data.other_param['products']);
          setItems(data.other_param['items']);
          setEquipments(data.other_param['equipped']);
          setShopflag(true);
        }
      });
  };

  const movePiece = (step, pos) => {
    setIsMoving(true);
    const moveStep = (step,pos,stepDelay=350) => {
      pos = (pos + 1) % cells.length; // 下一格的位置
      setCurrentPosition(pos);
      if (step===1)stepDelay=300;
      else if(step===2)stepDelay=200;
      else stepDelay=Math.max(stepDelay-50,100);
      --step;
      if (step<=0) setIsMoving(false);
      else setTimeout(()=>moveStep(step,pos,stepDelay), stepDelay);
    };
    moveStep(step,pos);
  };

  const calculatePosition = (index) => {
    const row = Math.floor(index / boardSize);
    const col = index % boardSize;
    return { top: `${row * 61}px`, left: `${col * 61}px` };
  };

  const answerQuestion = (index) => {
    setEventResult(true);
    fetch("response/question", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({"select": index}),
    })
      .then((response) => response.json())
      .then((data) => {setPlayer_attributes(data.attr);setEventMsg(data.msg);});
  };

  const answerEvent = (index) => {
    setEventResult(true);
    fetch("response/event", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({"select": index}),
    })
      .then((response) => response.json())
      .then((data) => {setPlayer_attributes(data.attr);setEventMsg(data.msg);});
  };

  const getItems = () => {
    fetch("get/allItem")
      .then((response) => response.json())
      .then((data) => {
        setItems(data);
      });
  };

  const getProducts = () => {
    fetch("get/allCommodity")
      .then((response) => response.json())
      .then((data) => {
        setProducts(data);
      });
  };

  const getEquipment = () => {
    fetch("get/allEquipment")
      .then((response) => response.json())
      .then((data) => {
        setEquipments(data);
      });
  };

  const doItem = (param) => {
    fetch("get/setItem", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(param),
    })
      .then((response) => response.json())
      .then((data) => setPlayer_attributes(data));
    getItems();
  };

  const sellItem = (name) => {
    fetch("sellItem", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({"name": name}),
    })
    getItems();
  };

  const buyItem = (name) => {
    fetch("buyItem", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({"name": name}),
    })
    getItems();
    getProducts();
  };

  const leaveShop = (name) => {
    fetch("shopexit");
    setShopflag(false);
    setIsEvent(false);
  };

  const getFinallist = () => {
    fetch("get/finallist")
      .then((response) => response.json())
      .then((data) => {
        setFinallist(data);
      });
  };

  const mapdecode = (index, cells) => {
    for(let i=0;i<cells.length;++i)if(cells[i]==index)return i;
  }

  return (
    <div className="board-container">
      <img src="/image/background.jpg" className="background" alt="背景" />
      {isEvent ||
      player_attributes['BATTLEFLAG'] ||
      player_attributes['QUESTIONFLAG'] ||
      player_attributes['EVENTFLAG'] ||
      player_attributes['SHOPFLAG'] ? (
        <div className="event-box">
          { stillBattle ? (
            <>
            </>
          ) : eventResult ? (
            <div className="eventResult">
              <p>{eventMsg}</p>
              <button className="close-event" onClick={() => { 
                setIsEvent(false);setEventResult(false);
                player_attributes['QUESTIONFLAG']=false;
                player_attributes['EVENTFLAG']=false;
                setPlayer_attributes(player_attributes);
              }}>確定</button>
            </div>
          ) : eventType === "question" || player_attributes['QUESTIONFLAG'] ? (
            <ul className="question-options">
              <p>{eventMsg}</p>
              {eventParam.map((option, index) => (
                <button key={index} className="question-option" onClick={() => answerQuestion(index)}>
                  {option}
                </button>
              ))}
            </ul>
          ) : eventType === "shop" || player_attributes['SHOPFLAG'] ? (
            <div className="shop-box">
              <div className="shop-popup">
                <Shop products={products} buyItem={buyItem}></Shop>
                <Backpack items={items} isSell={true} doItem={sellItem} setUsedItem={setUsedItem}></Backpack>
              </div>
              <button className="close-shop" onClick={() => leaveShop()}>離開商店</button>
            </div>
          ) : eventType === "event" || player_attributes['EVENTFLAG'] ? (
            <div className="event-popup">
              <p style={{textAlign:"center"}}>{eventMsg}</p>
              <ul className="event-options">
                {eventParam.map((option, index) => (
                  <button key={index} className="event-option" onClick={() => answerEvent(index)}>
                    {option}
                  </button>
                ))}
              </ul>
            </div>
          ) : eventType === "reward" ? (
            <div className="event-popup">
              <p style={{textAlign:"center"}}>恭喜你在寶箱獲得以下東西：</p>
              <p style={{textAlign:"center"}}>{eventMsg}</p>
              <button className="close-event" onClick={() => setIsEvent(false)}>確定</button>
            </div>
          ) : (eventType === "battle" || player_attributes['BATTLEFLAG']) && (
            <>
              <div className="battle-popup" style={{display:'flex'}}>
                <div>
                  <p>{player_name}</p>
                  <p>體力：{playerAttr['HP']}</p>
                  <p>攻擊力：{playerAttr['ATK']}</p>
                  <p>防禦力：{playerAttr['DEF']}</p>
                </div>
                <div>
                  <p>{enemyName}</p>
                  <p>體力：{enemyAttr['HP']}</p>
                  <p>攻擊力：{enemyAttr['ATK']}</p>
                  <p>防禦力：{enemyAttr['DEF']}</p>
                </div>
              </div>
              {!stillBattle && <button className="close-battle" onClick={() => setIsEvent(false)}>離開戰鬥</button>}
              {/*上面只是暫時用來可以退出用的按鈕*/}
              {/*還沒做，要照 todo 做*/}
              {/*這裡很可能可以棄用*/}
            </>
          )}
        </div>
      ) : openBackpack ? (
        <div className="event-box">
          <div className="backpack-box">
            <div className="backpack-popup">
              <Equipment equipments={equipments} doItem={doItem} usedItem={usedItem}></Equipment>
              <Backpack items={items} isSell={false} doItem={doItem} setUsedItem={setUsedItem}></Backpack>
            </div>
            <button className="close-backpack" onClick={() => { getItems();getEquipment();setOpenBackpack(false); }}>退出背包</button>
          </div>
        </div>
      ) : openFinal && (
        <div className="event-box">
          <div className="final-box">
            <div className="final">
              <div className="finallist">
                {finallistName.map((team, index) => (
                  <p key={index}>{team}</p>
                ))}
              </div>
              <button className="close-final" onClick={() => { setOpenFinal(false); }}>退出決賽名單</button>
            </div>
          </div>
        </div>
      )}
      <div className="board">
        {Array.from({ length: boardSize * boardSize }, (_, index) => (
          <div
            key={index}
            className={cells.includes(index) ? "cell" : "empty-cell"}
          >
            {cells.includes(index) && <><img className="map-image" alt="地圖格" src={"/image/"+map[mapdecode(index,cells)]+".png"}></img></>}
          </div>
        ))}
        <div
          className="piece"
          style={calculatePosition(cells[currentPosition])}
        ><img className="piece" alt="棋子" src="/image/chess.png"></img></div>
      </div>
      <button className="dice-button" onClick={rollDice}>
        <img src="/image/dice.jpg" alt="骰子" className="dice-image" />
      </button>
      <button className="backpack-button" onClick={() => {getItems();getEquipment();setOpenBackpack(true);}}>
        <img src="/image/backpack.png" alt="背包" className="backpack-image" />
      </button>
      <button className="final-button" onClick={() => { setOpenFinal(true);getFinallist(); }}>
        <img src="/image/final.png" alt="決賽之碑" className="final-image" />
      </button>
    </div>
  );
};

export default Board;
