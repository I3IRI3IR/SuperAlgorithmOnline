前端
    1. 請求廣告，播廣告
    2. 補完裝備界面
    3. 滑鼠放在背包裝備商店的東西上要顯示說明和價格和屬性
    4. 寫個打開背包的按鈕
    5. 走越遠走越快
    6. 可以查看決賽之碑的按鈕
    7. setItem 還沒寫，寫了會向後端送，後端自行判斷現在的 flag 是要裝備或使用，或其實都不是所以操作無效 //bir:不可以是買賣，送名字data['name'](str)
    8. buyItem 還沒寫，寫了會向後端送 //bir:改成傳回data['name'](str)，後端知道所有事情以及合不合法
    9. response/question||event 應該還要有返回的訊息顯示結果，目前只有player_attr
    10.item類道具在背包介面要可以被使用然後消耗
    11.sellItem 還沒寫，寫了會向後端送物品的名字，後端做事，回傳'',200
    12.shopexit 還沒寫，不需要內容，回傳'',200
    13.restexit 還沒寫，不需要內容，回傳'',200
    14.
    //bir:所有不合法請求後端都只會回一個'',204 (No connect)，請忽略並不要訪問response.data，你如果想要200我可以輕鬆地改

後端
    1. get/rolldice 剩 battle 的 other_param 還沒好，格式照底下

    2. 之後要有 response/setItem 處理買賣東西或穿脫裝備，還沒想好怎麼做，之後補 //bir:我訂，去看你的todo

    3. 如果請求亂丟東西server不能崩 //bir:還沒做，戒色別搞

    4. 怪物設計&事件設計


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
        "damage_type": str,必為"burn"||"bleed"||"spell"||"knife"||"heal"||"fatigue"，代表四種不同的攻擊或治療或疲勞傷害，使用對應的特效
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