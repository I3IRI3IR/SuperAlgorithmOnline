前端
    1. 請求廣告，播廣告
    2. 補完裝備界面
    3. 滑鼠放在背包裝備商店的東西上要顯示說明和價格和屬性
    4. 寫個打開背包的按鈕，然後 setOpenBackpack(true); 並且要求裝備和物品表
    5. 走越遠走越快
    6. 可以查看決賽之碑的按鈕
    7. setItem 還沒寫，寫了會向後端送這是 index 多少的物品，後端自行判斷現在的 flag 是要買賣還是裝備，或其實都不是所以操作無效
    8. buyItem 還沒寫，寫了會向後端送這是 index 多少的商品


後端
    1. get/game_data 的 items 刪掉
    2. response/event，一切同 response/question，但是看起來你需要開一個不同的路徑才能決定用 q_num 或是去撈 event 的表
    3. get/rolldice 只剩 other_param 還沒好，event 看起來是你那邊建表而已，前端完全當作 question 做了
       shop 要給我商品表跟背包表跟裝備表
       rest 要給我背包表跟裝備表
       battle 要給我一堆要照順序做的操作的 dict list(講 list 不講 array 是因為比較 python)
    4. 有空可以在底下定一下 get/rolldice 裡面 battle 回傳的打架過程要長怎樣，我不完全確定你想呈現啥還有呈現他需要哪些參數
    5. equipment 同上一點，不是很知道你需要多少格子和哪些格子，同時因為這點不知道裝備要不要被包在 items 裡面
    6. 之後要有 response/setItem 跟 response/buyItem 處理買賣東西或穿脫裝備，還沒想好怎麼做，之後補
    7. 要給我兩個網址吐出全部的商品和全部的物品和裝備

api 長相（雖然這好像不是 todo）
"item"={"icon": string(那張圖片的 url), "descript": string(那個物品的文字敘述), "price": int(價格), /*這裡不知道要不要顯示一些裝備屬性*/}
"player_attributes"={"HP": int, "ATK": int, "DEF": int, "SPD": int, "EXP": int, "LV": int, "POS": int}
get/game_data(){
    return {"player_name": string, "player_attributes": dict, "level": int, "boss_hp": int, "total_atk": int, "pos": int};
}
POST response/question({"select": index(其中 index 是 [0, 該次選項數量) 的 int)}){
    return "player_attributes": dict
}
get/rolldice(){
    打架過程={還沒定，你定，我沒想好要長怎樣}
    "other_param"=switch(type){
        "reward": "player_attributes"
        "question": list[string](一堆選項字串的 list)
        "event": list[string](一堆選項字串的 list)
        "shop": {"products": dict{item}(商品們), "items": dict{item}(物品們), "equipment": dict{item}(裝備們)}
        "rest": {"items": dict{item}(物品們), "equipment": dict{item}(裝備們)}
        "battle": {"log": list[打架過程](打架過程們), "player_attributes": dict(戰鬥結束後玩家的最終屬性)}
    }
    return {"dice": int(這次走幾步),"pos": int(起點格子編號), "type": string(該格類型), "msg": string(事件內容), "other_param": dict}
}