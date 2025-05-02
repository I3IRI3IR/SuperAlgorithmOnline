const Board=()=>{
    return(
        <></>
    );
};
const Msgbox=()=>{
    const [msg,setMsg]=useState();
    return(
        <div className="msgbox-container">
            <div className="msg">{msg.map((msg,index)=>(<p key={index}>{msg}</p>))}</div>
            <input
                className="msg-input"
                type="text"
                value={msg}
                onChange={e=>setMsg(e.target.value)}
                placeholder="" //這裡記得整活啊，寫點甚麼
            />
            <button className="msg-send" onClick={sendMsg}>送出</button>
        </div>
    );
};
export default Game=({player_name,player_attributes,items})=>{
    /*parameter
    string player_name;
    player_attributes=dict({name(屬性名字):val(值)};
    //暫定是包含 atk,speed,xp,lv
    items=dict({name(道具名字):num(道具數量)}); //玩家的所有道具
    int level; //目前所在層數
    double boss_hp; //我不知道這是哪個 boss 的血量，目前最高層的？
    double total_atk; //玩家累計傷害
    */
    const [player_name,setPlayer_name]=useState("");
    const [player_attributes,setPlayer_attributes]=useState({});
    const [items,setItems]=useState({});
    const [level,setLevel]=useState(0);
    const [boss_hp,setBoss_hp]=useState(0);
    const [total_atk,setTotal_atk]=useState(0);
    useEffect(()=>{
        fetch("/load/game-data")
        .then(response=>response.json())
        .then(data=>{
            setPlayer_name(data.player_name);
            setPlayer_attributes(data.player_attributes);
            setItems(data.items);
            setLevel(data.level);
            setBoss_hp(data.boss_hp);
            setTotal_atk(data.total_atk);
        })
        .catch(error=>console.error("Error loading game data:", error));
    },[]);
    player_attributes=player_attributes.map(item=>(<li key={item.name} className="player-attribute">{item.val}</li>));
    items=<></>; //這裡不知道道具數量，不確定要用甚麼樣顯示
    return (
        <div className="game-container">
            <div className="information">
                <div className="player-name">{player_name}</div>
                <ul className="player-attributes">{player_attributes}</ul>
                <ul calssName="items">{items}</ul>
                <p>目前所在層數：{level}</p>
                <p>boss 血量：{boss_hp}</p>
                <p>玩家累計傷害：{total_atk}</p>
            </div>
            <Board/>
            <Msgbox/>
        </div>
    );
};