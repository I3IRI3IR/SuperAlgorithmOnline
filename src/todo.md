前端
    1. 請求廣告，播廣告
    2. 補完裝備界面
    3. 滑鼠放在背包裝備商店的東西上要顯示說明和價格和屬性
    4. 寫個打開背包的按鈕，然後 setOpenBackpack(true); 並且要求裝備和物品表
    5. 走越遠走越快
    6. 可以查看決賽之碑的按鈕
    7. setItem 還沒寫，寫了會向後端送這是 index 多少的物品，後端自行判斷現在的 flag 是要買賣還是裝備，或其實都不是所以操作無效 //bir:不可以是買賣，一樣送名字(str)
    8. buyItem 還沒寫，寫了會向後端送這是 index 多少的商品 //bir:改成傳回商品的名字(str)，後端知道所有事情以及合不合法
    9. response/question||event 應該還要有返回的訊息顯示結果，目前只有player_attr
    10.item類道具在背包介面要可以被使用然後消耗
    11.sellItem 還沒寫，寫了會向後端送物品的名字，後端做事
    12.shopexit 還沒寫，不需要內容
    13.restexit 還沒寫，不需要內容
    14.
    //bir:所有不合法請求後端都只會回一個204 No connect，請忽略並不要訪問response.data，你如果想要200我可以輕鬆地改

後端
    2. response/event，一切同 response/question，但是看起來你需要開一個不同的路徑才能決定用 q_num 或是去撈 event 的表 //bir:完成一部分，剩下result的格式未定
    3. get/rolldice 只剩 other_param 還沒好，event 看起來是你那邊建表而已，前端完全當作 question 做了
       shop 要給我商品表跟背包表跟裝備表
       rest 要給我背包表跟裝備表
       battle 要給我一堆要照順序做的操作的 dict list(講 list 不講 array 是因為比較 python)
    4. 有空可以在底下定一下 get/rolldice 裡面 battle 回傳的打架過程要長怎樣，我不完全確定你想呈現啥還有呈現他需要哪些參數 //bir:已完成

    5. equipment 同上一點，不是很知道你需要多少格子和哪些格子，同時因為這點不知道裝備要不要被包在 items 裡面 
       //bir:裝備會占用背包空間，也就是不用檢查裝備脫不脫得下來，格子就只有武器格*2和胸甲(防裝)格

    6. 之後要有 response/setItem 跟 response/buyItem 處理買賣東西或穿脫裝備，還沒想好怎麼做，之後補

    7. 要給我兩個網址吐出全部的商品和全部的物品和裝備

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