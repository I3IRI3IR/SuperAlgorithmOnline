import React, { useState, useRef } from "react";
import "./Board.css";

const Equipment = ({equipments, doItem, usedItem}) => {
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
    <ul className="equipment" style={{ position: 'relative' }}>
      {Object.entries(equipments).map(([key, equipment], index) => equipment ? (
        <div style={{display: 'flex'}} key={index}>
          {<img ref={(el) => (imgRef.current[index] = el)} src={equipment.icon} className="item" alt="裝備欄" onMouseEnter={() => setHoveredIndex(index)} onMouseLeave={() => setHoveredIndex(null)} onClick={() => { usedItem[Object.keys(usedItem).length===0?'used':'change']={"name": equipment.name, "type": equipment.type, "equip": equipment.equipped}; doItem(usedItem); }}></img>}
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
              <p>價格：{equipment.price}</p>
              <p>物品描述：{equipment.descript}</p>
            </div>
          )}
        </div>
      ) : (
        <div style={{display: 'flex'}} key={index}>
          <img /*debugflag 這裡之後要改一張沒東西的照片之類的*/ src="/image/question.png" className="item" alt="空裝備欄" onClick={() => { usedItem['change']={"name": null, "type": null}; doItem(usedItem); }}></img>
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
  const imgStyle = {
    border: item.equipped ? '3px solid gold' : 'none',  // 如果 item.equip 為 true，設置金色邊框
    cursor: 'pointer'
  };
  return (
    <div style={{ position: 'relative' }}>
      <img src={item.icon} className="item" ref={isHovered ? imgRef : null} alt="物品" style={imgStyle} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)} onClick={() => {
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
      {Object.entries(products).map(([key, product],index) => product ? (
        <div key={key}>
          {<img ref={(el) => (imgRef.current[index] = el)} src={"/"+product.icon} className="item" alt="商品" onMouseEnter={() => setHoveredIndex(index)} onMouseLeave={() => setHoveredIndex(null)} onClick={() => buyItem(product.name)}></img>}
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
        </div>) : (
          <div style={{display: 'flex'}}>
            <img key={index} /*debugflag 這裡之後要改一張沒東西的照片之類的*/ src="/image/question.png" className="item" alt="空商品欄"></img>
          </div>
        )
      )}
    </ul>
  );
};

const Board = ({ player_attributes, setPlayer_attributes, currentPosition, setCurrentPosition, shopflag, setShopflag, cd, player_name, map, avatar }) => {
  const boardSize = 10; // 棋盤尺寸
  const cells = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 19, 29, 39, 49, 59, 69, 79, 89, 99, 98, 97, 96, 95, 94, 93, 92, 91, 90, 80, 70, 60, 50, 40, 30, 20, 10];
  const [isMoving, setIsMoving] = useState(false);
  const [isEvent, setIsEvent] = useState(false);
  const [items, setItems] = useState([]);
  const [products, setProducts] = useState([]);
  const [equipments, setEquipments] = useState({});
  const [eventType, setEventType] = useState("");
  const [eventMsg, setEventMsg] = useState("");
  const [eventParam, setEventParam] = useState([]);
  const [openBackpack, setOpenBackpack] = useState(false);
  const [openFinal, setOpenFinal] = useState(false);
  const [usedItem, setUsedItem] = useState({});
  const [eventResult, setEventResult] = useState(false);
  const [finallist, setFinallist] = useState([]);
  const [stillBattle,setStillBattle] = useState(false);
  const [enemyAttr,setEnemyAttr] = useState({});
  const [playerAttr,setPlayerAttr] = useState({});
  const [enemyName,setEnemyName] = useState("");
  const [defender,setDefender] = useState("");
  const [vfximg,setVfximg] = useState("");
  const [finallistName,setFinallistName] = useState(["NO ERROR NO PAIN",
"一輩子的競程",
"還沒想好",
"义煞氣a斜咖高中生义",
"成屍設計",
"我從不覺得打競程開心過",
"掛號下放code就會隊",
"嗯嗯嗯對對對",
"成雙全對",
"黃偉紅橙黃綠藍靛紫超強 鄭宸翔出國",
"PTHS",
"diaobwoah",
"成大已保送此隊的所有人",
"ShadowVortex",
"你高幾啊？我高師大",
"廢物",
"清明碼畜群",
"怪阿祖",
"想蹭飯的菜雞",
"無界塾",
"佾然",
"fast but no bug",
"pmshOWO",
"小皮帶飛",
"未命名",
"有本事葬送我嗎?",
"製作鎳不可活",
"松鼠被壓扁是鬆餅還是薯餅",
"略懂蔥碎",
"w9079r",
"火箭隊",
"想去台南玩一天",
"SHCH104",
"從來不覺得debug開心過",
"成功大學舞萌太少、、、",
"staback",
"KLD",
"嘉義高中",
"轉生C++適應不良，回歸py卻成為世界最強",
"我們隊沒人上成大資工qq",
"邦邦邦邦",
"不要狗叫",
"pmπ隊",
"5e3 剛好吃屋馬",
"Who’s your daddy",
"啊~啊~啊咦↑啊咦↑啊→啊↑啊↓啊~啊~",
"我R值拼到萬五了",
"高能之低智商",
"贏了還不是沒女朋友",
"是又怎樣",
"戰機洗白軍團",
"要被當了",
"Not error",
"好險有大學",
"while(true){tle;}",
"你竟敢無視燈",
"火鍋不會加芋頭",
"Kabigon",
"程式貓AC小隊",
"左右觀察隨便進決賽⚡🥵❤️",
"西格瑪都只寫pA",
"程式三劍客",
"交給你了",
"寫不出來對不隊",
"我怎麼會知道",
"Fantasy 謙",
"我寫的都隊",
"都碼隊",
"綠檸檬",
"mice_in_wall",
"冠儒這一隊",
"L.F.C.",
"唐狗針模擬退火爆砸TLE滅台題帥到飛起",
"麵包機",
"完蛋了忘記今天有比賽",
"das war ein befeh！",
"py_cpp",
"卷毛程式",
"Thunderbyte",
"314別狗叫",
"小丑馬戲團🤡",
"GPT 1.0 Users",
"BOB",
"X-211OXO",
"蔡到家",
"Jeopardy大字囉",
"我步偉啦",
"紛至沓來",
"dp好難啊",
"好ㄟ的小隊",
"404 Not Found AC",
"超py",
"我們學校有359萬的鐵球",
"O(k ㏒²n ㏒㏒n ㏒㏒㏒n)",
"alan評分3.0",
"曹氏宗親會",
"絕對是冠軍",
"就叫不知道",
"恩恩餓甲雞",
"你開心就好",
"Super idol der 笑容",
"新興革命軍",
"建均要用重補修統治世界",
"潘潘子統治世界",
"ㄏㄚˊㄇㄚˋ",
"大雄中帝國",
"聯合國教邱科文組織",
"超級瑪利歐派",
"大安地頭蛇",
"白熊",
"陽光宅男隊",
"大江大海江大海",
"APCS帶我飛",
"TKUP",
"温力翰會與我們同在的!!11!",
"鍵結電子隊",
"桃子不吃竹筍",
"堆滿 Bug 也 AC",
"薇閣碼農",
"404 Not Found",
"laugoat",
"阿對對對",
"成大邀請賽第 808 隊",
"Fang",
"這隊只有兩個人",
"USACO為什麼cutoff是850",
"Rookie",
"龍貓龍貓",
"想就隊",
"Tralalero Tralala",
"我是參賽選手，這就是隊伍名稱",
"港未來",
"仁武高中代表隊",
"Exception1688",
"兼職中的爆肝高中生",
"meowmeowmeow",
"絨貓",
"有看頭",
"Oreo",
"嗚嗚嗚我要沒有大學了",
"終焉監域",
"戒色別搞",
"陳威任真打競程的電神的吉吉加上倘分的mingyee",
"2^31-1"])

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
          setStillBattle(true);
          setPlayerAttr({
            "HP":player_attributes["HP"],
            "ATK":player_attributes["ATK"],
            "DEF":player_attributes["DEF"]
          });
          setPlayer_attributes(data.other_param['player_attributes']);
          setEnemyName(data.other_param['mob_attributes']['name']);
          setEnemyAttr({
            "HP":data.other_param['mob_attributes']["hp"],
            "ATK":data.other_param['mob_attributes']["atk"],
            "DEF":data.other_param['mob_attributes']["def"],
            "img":data.other_param['mob_attributes']["img"]
          });
          let currentPlayerAttr = {
            "HP":player_attributes["HP"],
            "ATK":data.other_param['real_attr']["atk"],
            "DEF":data.other_param['real_attr']["def"]
          };
          let currentEnemyAttr = {
            "HP":data.other_param['mob_attributes']["hp"],
            "ATK":data.other_param['mob_attributes']["atk"],
            "DEF":data.other_param['mob_attributes']["def"],
            "img":data.other_param['mob_attributes']["img"]
          };
          const stepDelay = 500;
          let idx=0,n=data.other_param['log'].length;
          
          const interval = setInterval(() => {
            if (idx>=n) {
              clearInterval(interval);
              setStillBattle(false);
            }
            if(data.other_param['log'][idx]['defender'] === "player"){
              setDefender('player');
              const updated = { ...currentPlayerAttr, HP: currentPlayerAttr.HP - data.other_param['log'][idx]['damage'] };
              setPlayerAttr(updated);
              currentPlayerAttr.HP-=data.other_param['log'][idx]['damage'];
            }
            else{
              setDefender('enemy');
              const updated = { ...currentEnemyAttr, HP: currentEnemyAttr.HP - data.other_param['log'][idx]['damage'] };
              setEnemyAttr(updated);
              currentEnemyAttr.HP-=data.other_param['log'][idx]['damage'];
            }
            let type=data.other_param['log'][idx]['damage_type'];
            setVfximg(`/image/${type}_1.png`);
            setTimeout(()=>setVfximg(`/image/${type}_2.png`), 150);
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
    setUsedItem({});
    getItems();
    getEquipment();
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
              <div className="battle-popup" style={{ display: 'flex', justifyContent: 'space-between'}}>
                <div>
                  <div style={{display: 'flex'}}>
                    <p>{player_name}</p>
                    <div style={{position: 'relative'}}>
                      <img src={avatar} alt="玩家圖片" style={{height:'75px'}}></img>
                      {defender==='player' && <img
                        src={vfximg}
                        alt="傷害特效"
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          height: '75px', // 調整與主圖片的大小一致
                          width: '75px', // 調整寬度
                          pointerEvents: 'none', // 防止疊加圖片干擾點擊事件
                        }}
                      />}
                    </div>
                  </div>
                  <p>體力：{playerAttr['HP']}</p>
                  <p>攻擊力：{playerAttr['ATK']}</p>
                  <p>防禦力：{playerAttr['DEF']}</p>
                </div>
                <div>
                  <div style={{display: 'flex'}}>
                    <p>{enemyName}</p>
                    <div style={{position: 'relative'}}>
                      <img src={enemyAttr['img']} alt="敵人圖片" style={{height:'75px'}}></img>
                      {defender==='enemy' && <img
                        src={vfximg}
                        alt="傷害特效"
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          height: '75px', // 調整與主圖片的大小一致
                          width: '75px', // 調整寬度
                          pointerEvents: 'none', // 防止疊加圖片干擾點擊事件
                        }}
                      />}
                    </div>
                  </div>
                  <p>體力：{enemyAttr['HP']}</p>
                  <p>攻擊力：{enemyAttr['ATK']}</p>
                  <p>防禦力：{enemyAttr['DEF']}</p>
                </div>
              </div>
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
              <div className="battle-popup" style={{ display: 'flex', justifyContent: 'space-between'}}>
                <div>
                  <div style={{display: 'flex'}}>
                  <p>{player_name}</p>
                    <img src={avatar} alt="玩家圖片" style={{height:'75px'}}></img>
                  </div>
                  <p>體力：{playerAttr['HP']}</p>
                  <p>攻擊力：{playerAttr['ATK']}</p>
                  <p>防禦力：{playerAttr['DEF']}</p>
                </div>
                <div>
                  <div style={{display: 'flex'}}>
                    <p>{enemyName}</p>
                    <img src={enemyAttr['img']} alt="敵人圖片" style={{height:'75px'}}></img>
                  </div>
                  <p>體力：{enemyAttr['HP']}</p>
                  <p>攻擊力：{enemyAttr['ATK']}</p>
                  <p>防禦力：{enemyAttr['DEF']}</p>
                </div>
              </div>
              {!stillBattle && <button className="close-battle" onClick={() => setIsEvent(false)}>離開戰鬥</button>}
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
                {finallistName.map((team, index) => <p key={index} style={{margin: 3, border: finallist[index] === 1 ? '3px solid gold' : 'none'}}>{team}</p>)}
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
