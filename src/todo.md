前端
    1. 請求廣告，播廣告
    2. 還沒處理戰鬥和戰鬥的 flag
    3. 某天想個辦法解決 board 越界和畫面不好看

後端

    1. get/rolldice 剩 battle 的 other_param 還沒好，格式照底下 //bir:已完成但很抖

    2. 之後要有 response/setItem 跟 response/buyItem 處理買賣東西或穿脫裝備，還沒想好怎麼做，之後補 //bir:我訂，去看你的todo

    3. 要給我兩個網址吐出全部的商品和全部的物品和裝備 //bir: '/get/allItem' & '/get/allCommodity' 回傳dict(dict)，已完成

    4. 如果請求亂丟東西server不能崩 //bir:還沒做，戒色別搞

    5. '/sellItem'還沒做 //bir:已完成

    6. response/question||event 改成回傳 {"attr": player_attribute, "msg": 選擇後顯示的訊息}

    7. 生個 get/finallist 給我已公開的決賽名單，給我一個隊伍名單的字串之類的 list

    8. 生個 periodicUpdate 給我 {"boss_hp": boss 的血量,"cd":玩家的死亡cd}，我會五秒戳一次，之後看你有沒有需要再加更多定期更新的東西 //bir:已完成，新增"cd"

    9. 不知道你說滑鼠在物品要顯示的屬性在哪，是不是後端還沒送給我，是的話你決定塞進 item 裡給我之後我前端一起改，塞在 descript 的話就不用動 //bir:是descript沒錯
    
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
        "damage_type": str,必為"burn"||"bleed"||"spell"||"slash"||"heal"||"fatigue"，代表四種不同的攻擊或治療或疲勞傷害，使用對應的特效
        "damage": int,表示傷害量
        "effect_def":list,必為[int,int]，表示defender目前的"burn"值及"bleed"值，因為有可能因各種效果使前兩個值發生變化，只有當type不是burn||bleed時才可能發生改變
        "effect_enemy":list，同上，表示defender的對手的狀態
    }


    以下怪物屬性為戰鬥開始時的，要隨著之後的fight改變前端顯示
    mob_attributes = {
        "HP":int,
        "ATK":int,
        "DEF":int,
        "name":str,
        "img":str,(圖片url)
        "msg":str,(屬標移到怪物圖片上時要跳出的說明，做不完的話可以不理這個)
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