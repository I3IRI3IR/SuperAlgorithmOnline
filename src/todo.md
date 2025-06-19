前端
    1. 請求廣告，播廣告
    2. 還沒寫 mob.img 跟 mob.msg 和每回合大家的血量變動和顯示的那個介面本身（最後一個應該超快寫完）
    3. 某天想個辦法解決 board 越界和畫面不好看
    4. image 要整個搬到 /public 下不然前端根本讀不到

後端

    1. get/rolldice 剩 battle 的 other_param 還沒好，格式照底下 //bir:已完成但很抖

    4. 如果請求亂丟東西server不能崩 //bir:還沒做，戒色別搞

    6. response/question||event 改成回傳 {"attr": player_attribute, "msg": 選擇後顯示的訊息} //bir:已完成

    7. 生個 get/finallist 給我已公開的決賽名單，給我一個隊伍名單的字串之類的 list
    
    10. 怪物設計&事件設計 //bir:燒起來了，丟包給顏羅王

api 長相（雖然這好像不是 todo）

"item"={
    "icon": string(那張圖片的 url),
    "descript": string(那個物品的文字敘述),
    "price": int(價格),
    "type": str(必為"weapon"||"chest"||"item"),
    "name": str(物品名字，作為判斷道具效果的flag)
    "equipped": bool(表示此物品有沒有被裝備)
    }
    //bir:item類道具在背包介面要可以被使用然後消耗

"equipment"={
    "weapon1":"item",
    "weapon2":"item",
    "chest":"item",

    //以上皆可為null
}


"player_attributes"={"HP": int, "ATK": int, "DEF": int, "SPD": int, "EXP": int, "LV": int, "POS": int}

get/game_data(){
    return {"player_name": string, "player_attributes": dict, "level": int, "boss_hp": int, "total_atk": int, "pos": int};
}
POST response/question({"select": index(其中 index 是 [0, 該次選項數量) 的 int)}){
    return "player_attributes": dict
}
get/rolldice(){
    


    戰鬥規則: 每次輪到某方攻擊時，該方承受他的"burn"+"bleed"點傷害，然後以atk攻擊對手的def且最少0點傷害，最後"burn"減少1點且最少為0，戰鬥持續到一方HP<=0立刻結束
             speel類攻擊無視對方防禦，但此類武器通常會使自身攻擊減成或固定為某數值

    fight = {
        "defender": str,必為"player"||"enemy"，表示誰受到傷害
        "damage_type": str,必為"spell"||"slash"||"fatigue"，代表兩種不同的攻擊或治療或疲勞傷害，使用對應的特效
        "damage": int,表示傷害量
    }


    以下怪物屬性為戰鬥開始時的，要隨著之後的fight改變前端顯示
    mob_attributes = {
        "HP":int,
        "ATK":int,
        "DEF":int,
        "name":str,
        "img":str,(圖片url)
        "msg":str,(屬標移到怪物圖片上時要跳出的說明，做不完的話可以不理這個) //bir:現在沒有
    }




    "other_param"=switch(type){
        "reward": "player_attributes"
        "question": list[string](一堆選項字串的 list)
        "event": list[string](一堆選項字串的 list)
        "shop": {"products": dict{item}(商品們), "items": dict{item}(物品們), "equipment": dict{item}(裝備們)}
        "rest": {"items": dict{item}(物品們), "equipment": dict{item}(裝備們)}
        "battle": {"log": list[dict](dict的結構為"fight"), "player_attributes": dict(戰鬥結束後玩家的最終屬性), "mob_attributes":dict(怪物的各種屬性)}
    }

    return {"dice": int(這次走幾步),"pos": int(起點格子編號), "type": string(該格類型), "msg": string(事件內容), "other_param": dict}
}