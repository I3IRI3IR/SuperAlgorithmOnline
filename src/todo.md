前端
    1. 請求廣告，播廣告
    2. 做好純的背包界面，裝備界面，商店界面
       再用這三個拼出真正觸發時的界面
       背包是半頁寬整頁高，剩下兩個是半頁寬半頁高，右邊固定是背包，左邊沒商店時裝備整個置中
    3. 滑鼠放在背包的東西上要顯示說明和價格和屬性
    4. 寫個打開背包的按鈕，然後 setOpenBackpack(true);
    5. 背包和裝備的參數，在商店是賣東西，休息是穿脫裝備或使用道具，平常開背包是不能操作
    6. 裝備格要有左右手，可以拿雙劍，也可以拿劍盾。我猜可以拿雙盾，不知道能不能靠彈反或被動魔攻打架，然後回血量夠高，接著說這就是等級制
       MMO 的不合理之處。還要有其他防具欄位
    7. 遇到格子是 battle 的時候還沒判斷 other_param 要長怎樣
    8. 走越遠走越快
    9. 串登入介面

後端
    1. 
    get/game-data 不吃輸入，回傳 {"player_name": string, "items": 所有物品的 dict, "player_attributes": dict, "items": dict, "level": int, "boss_hp": int, "total_atk": int}
        "player_attributes"={"HP": int, "ATK": int, "DEF": int, "SPD": int, "EXP": int, "LV": int, "POS": int}
    
    bir:已完成,加新東西記得說
    
    2.
    get/rolldice 不吃輸入，回傳 {"dice": int(這次走幾步),"pos": int(起點格子編號), "type": string(該格類型), "msg": string(事件內容), "other_param": dict}
        "other_param"=switch(type){
            "reward" || "battle" || "event": "player_attributes"
            "question": 一堆選項字串的 list
            "shop": 賣的東西的 dict
            "rest": None
            "battle": 還沒想
        }
    response/question 吃一個 POST，輸入是 {"select": index}，其中 index 是 [0, 該次選項數量) 的 int，回傳一個 "player_attributes"

    3.
    shop 和 items 的 dict 應該要是有圖片和描述和價格和屬性的