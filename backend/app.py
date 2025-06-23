from flask import Flask, redirect, request, session, url_for, jsonify
import requests
import random
import json
import os
from SECRET import CLIENT_SECRET
from flask_cors import CORS
import threading
import time
from datetime import datetime

app = Flask(__name__)
app.secret_key = os.urandom(24)

CORS(app, supports_credentials=True)



# 設定你的 Discord 應用資訊
CLIENT_ID = '1366650439910821888'
REDIRECT_URI = 'http://localhost:5000/callback'
API_BASE_URL = 'https://discord.com/api'
SCOPE = 'identify'


def reduce_cooldown():
    id = session['user']['id'] 
    with open("GameControl.json", "r", encoding="utf-8") as file:
        db = json.load(file)
    for value in db.values():
        if isinstance(value, dict):
            value["cd"] = max(value["cd"]-1,0)
    for i in range(len(db["atklist"])-1,-1,-1):
        db["atklist"][i] -= 1
        if db["atklist"][i]==0:
            db["atklist"].pop(i)
            db["atkbuff"] -= 1
    for i in range(len(db["deflist"])-1,-1,-1):
        db["deflist"][i] -= 1
        if db["deflist"][i]==0:
            db["deflist"].pop(i)
            db["defbuff"] -= 1

    with open("GameControl.json", "w", encoding="utf-8") as file:
            json.dump(db, file, ensure_ascii=False, indent=2)

def cooldown_monitor():
    
    while True:
        now = datetime.now()
        seconds_to_next_minute = 60 - now.second
        time.sleep(seconds_to_next_minute)  # 等到整分鐘
        reduce_cooldown()

def get_playerattribute(id):
    id = session['user']['id'] #164253flag 這裡的 id 被變數覆蓋掉了，如果直接讀 session 就沒必要吃參數吧
    with open("GameControl.json", "r", encoding="utf-8") as file:
        db = json.load(file)

    response = {
            'LV'  : db[id]['lv'],
            'POS' : db[id]['pos'],
            'HP'  : db[id]['hp'],
            'ATK' : db[id]['atk'],
            'DEF' : db[id]['def'],
            'SPD' : db[id]['spd'],
            'EXP' : db[id]['exp'],
            "COIN": db[id]['coin'],
            "DICE": db[id]['dice'],
            "BATTLEFLAG" : db[id]['battleflag'],
            "QUESTIONFLAG":db[id]['questionflag'],
            "EVENTFLAG":db[id]['eventflag'],
            "RESTFLAG":db[id]["restflag"],
            "SHOPFLAG":db[id]["shopflag"]
        }
       
    return response

def get_question():
    with open("Question.json", "r", encoding="utf-8") as file:
        question_db = json.load(file)
    q_num = str(random.randint(1,2))
    response = question_db[q_num]
    response['q_num'] = q_num
    return response

def get_event(e_num):
    with open("Event.json", "r", encoding="utf-8") as file:
        event_db = json.load(file)
    response = event_db[str(e_num)]
    response['e_num'] = e_num
    return response

def mapdecode(map, start, step):
    for i in range(36):
        if map[i][0] == start :
            return map[(i+step)%36]
        
def getItemByName(name):
    item_list = [
    {"name":"小劍","icon":"image/littlesword.png","descript":"最基礎的武器,增加10點ATK","price":10,"type":"weapon","equipped":False},
    {"name":"青銅劍","icon":"image/ironsword.png","descript":"無課玩家的好選擇,增加20點ATK","price":50,"type":"weapon","equipped":False},
    {"name":"韌煉之劍","icon":"image/tempered_sword.png","descript":"修行路上的第一把劍,增加20點ATK,戰鬥得到的exp+15%","price":200,"type":"weapon","equipped":False},
    {"name":"漆黑短劍","icon":"image/dark_dagger.png","descript":"暗器,在戰鬥開始前先對敵人造成150點傷害","price":100,"type":"weapon","equipped":False},
    {"name":"逐闇者","icon":"image/black_sword.png","descript":"傳說中黑色劍士的專武,增加128463點ATK","price":128463,"type":"weapon","equipped":False},
    {"name":"闡釋者","icon":"image/interpreter_sword.png","descript":"傳說中黑色劍士的專武,使你的攻擊造成的傷害+1500%","price":128463,"type":"weapon","equipped":False},
    {"name":"閃爍之光","icon":"image/bright_light.png","descript":"細劍使的專武,使你的攻擊造成的傷害增加12345,使你的攻擊無視敵方防禦","price":99999,"type":"weapon","equipped":False},
#   {"name":"疾風擊劍","icon":"image/gale_strike_sword.png","descript":"細劍使的初始武器,增加123點ATK","price":1234,"type":"weapon","equipped":False},
#   {"name":"騎士輕劍","icon":"image/knight_sword.png","descript":"由疾風擊劍融煉而成的武器,有5%的機會再攻擊一次","price":5678,"type":"weapon","equipped":False},
#   {"name":"銀線甲","icon":"image/silver_armor.png","descript":"","price":100,"type":"chest","equipped":False},
    {"name":"午夜大衣","icon":"image/midnight_coat.png","descript":"傳說中黑色劍士的衣裝,使你可以裝備逐闇者與闡釋者,使受到的傷害-5%","price":128463,"type":"chest","equipped":False},
    {"name":"治療水晶","icon":"image/healing_crystal.png","descript":"使用後可回復50%最大HP值","price":500,"type":"item","equipped":False},
    {"name":"還瑰之聖晶石","icon":"image/holy_recovery_crystal.png","descript":"使用後可立即解除戰鬥CD限制","price":1000,"type":"item","equipped":False},
    {"name":"攻擊光環水晶","icon":"image/attack_aura_crystal.png","descript":"使用後全服玩家獲得ATK+1%的增益","price":5000,"type":"item","equipped":False},
    {"name":"防禦光環水晶","icon":"image/defense_aura_crystal.png","descript":"使用後全服玩家獲得DEF+1%的增益","price":5000,"type":"item","equipped":False},
    {"name":"骰子包","icon":"image/dicepack.png","descript":"使用後得到10顆骰子","price":321,"type":"item","equipped":False}
    ]

    for i in item_list:
        if i["name"]==name:
            return i
    return None
        
def getRandItem():
    item_list = [
    {"name":"小劍","icon":"image/littlesword.png","descript":"最基礎的武器,增加10點ATK","price":10,"type":"weapon","equipped":False},
    {"name":"青銅劍","icon":"image/ironsword.png","descript":"無課玩家的好選擇,增加20點ATK","price":50,"type":"weapon","equipped":False},
    {"name":"韌煉之劍","icon":"image/tempered_sword.png","descript":"修行路上的第一把劍,增加20點ATK,戰鬥得到的exp+15%","price":200,"type":"weapon","equipped":False},
    {"name":"漆黑短劍","icon":"image/dark_dagger.png","descript":"暗器,在戰鬥開始前先對敵人造成150點傷害","price":100,"type":"weapon","equipped":False},
    {"name":"逐闇者","icon":"image/black_sword.png","descript":"傳說中黑色劍士的專武,增加128463點ATK","price":128463,"type":"weapon","equipped":False},
    {"name":"闡釋者","icon":"image/interpreter_sword.png","descript":"傳說中黑色劍士的專武,使你的攻擊造成的傷害+1500%","price":128463,"type":"weapon","equipped":False},
    {"name":"閃爍之光","icon":"image/bright_light.png","descript":"細劍使的專武,使你的攻擊造成的傷害增加12345,使你的攻擊無視敵方防禦","price":99999,"type":"weapon","equipped":False},
#    {"name":"疾風擊劍","icon":"image/gale_strike_sword.png","descript":"細劍使的初始武器,增加123點ATK","price":1234,"type":"weapon","equipped":False},
#    {"name":"騎士輕劍","icon":"image/knight_sword.png","descript":"由疾風擊劍融煉而成的武器,有5%的機會再攻擊一次","price":5678,"type":"weapon","equipped":False},
#    {"name":"銀線甲","icon":"image/silver_armor.png","descript":"","price":100,"type":"chest","equipped":False},
    {"name":"午夜大衣","icon":"image/midnight_coat.png","descript":"傳說中黑色劍士的衣裝,使你可以裝備逐闇者與闡釋者,使受到的傷害-5%","price":128463,"type":"chest","equipped":False},
    {"name":"治療水晶","icon":"image/healing_crystal.png","descript":"使用後可回復50%最大HP值","price":500,"type":"item","equipped":False},
    {"name":"還瑰之聖晶石","icon":"image/holy_recovery_crystal.png","descript":"使用後可立即解除戰鬥CD限制","price":1000,"type":"item","equipped":False},
    {"name":"攻擊光環水晶","icon":"image/attack_aura_crystal.png","descript":"使用後全服玩家獲得ATK+1%的增益","price":5000,"type":"item","equipped":False},
    {"name":"防禦光環水晶","icon":"image/defense_aura_crystal.png","descript":"使用後全服玩家獲得DEF+1%的增益","price":5000,"type":"item","equipped":False},
    {"name":"骰子包","icon":"image/dicepack.png","descript":"使用後得到10顆骰子","price":321,"type":"item","equipped":False}
    ]
    return random.choice(item_list)
        
def get_reward(r_num,player_attr):
    msg=""
    def num_0():
        #do
        player_attr["coin"]+=2500
        #write msg
        msg = "金幣2500"
    def num_1():
        #do
        player_attr["atk"]+=5
        #write msg
        msg = "攻擊+5卷軸"
    reward_list = [num_0,num_1]
    reward_list[r_num]()
    response = [player_attr,msg]
    return response

def get_equipment(id):
    response = {
        "weapon1":None,
        "weapon2":None,
        "chest":None
    }
    with open("GameControl.json", "r", encoding="utf-8") as file:
            db = json.load(file)
    for i in db[id]["backpack"].values():
        if i["equipped"] and i["type"]=="weapon":
            if response["weapon1"]==None:
                response["weapon1"]=i
            else:
                response["weapon2"]=i
        elif i["equipped"] and i["type"]=="chest":
            response["chest"]=i
    return response
    
def get_battledict(id,mob,playerdict):
    with open("GameControl.json", "r", encoding="utf-8") as file:
        db = json.load(file)
    playeritem = get_equipment(id)
    Atk = db[id]["atk"]
    damagerate = 1
    sheildrate = 1
    damagetype="slash"
    directdamage = 0
    Def = db[id]["def"]
    # for i in playeritem: #164253flag 這裡要用 dict.values 才會跑到物品本身
    for i in playeritem.values():
        if i==None: #164253flag None 沒判掉
            continue
        if i["name"]=="小劍":
            Atk+=10
        elif i["name"]=="青銅劍":
            Atk+=20
        elif i["name"]=="韌煉之劍":
            Atk+=20
            mob["exp"] = round(mob["exp"]*1.15)
        elif i["name"]=="漆黑短劍":
            mob["hp"]-=150
        elif i["name"]=="逐闇者":
            Atk+=128763
        elif i["name"]=="闇釋者":
            damagerate += 15
        elif i["name"]=="閃爍之光":
            directdamage+=12345
            Atk+=mob["def"]
            damagetype="slash"
        elif i["name"]=="疾風擊劍":
            Atk+=123
        elif i["name"]=="騎士輕劍":
            directdamage+=1234
        elif i["name"]=="銀線甲":
            Def+=20
        elif i["name"]=="午夜大衣":
            Def+=8763
            sheildrate-=0.5
    Atk = round(Atk*(100+db["atkbuff"])*0.01)
    Def = round(Def*(100+db["defbuff"])*0.01)
    turn=0
    battlelist=[]
    while db[id]["hp"]>0 and mob["hp"]>0:
        battlelist.append({
            "defender": "enemy",
            "damage_type": damagetype,
            "damage": max(0,round((Atk-mob["atk"])*damagerate)+directdamage)
        })
        mob["hp"]-=round((Atk-mob["atk"])*damagerate)+directdamage
        #db[id]["damage"]+=round((Atk-mob["atk"])*damagerate)+directdamage
        if mob["hp"]<=0:
            break
        battlelist.append({
            "defender": "player",
            "damage_type": "slash",
            "damage": max(0,round((mob["atk"]-Def)*sheildrate))
        })
        db[id]["hp"]-=round((mob["atk"]-Def)*sheildrate)
        if db[id]["hp"]<=0:
            break
        if turn>(db[id]["lv"]*3)+10:
            battlelist.append({
            "defender": "player",
            "damage_type": "fatigue",
            "damage": (turn - ((db[id]["lv"]*3)+10))**2,
        })
        turn+=1
    if db[id]["hp"]<=0:
        db[id]["cd"]=60
        db["hp"]=0
    else:
        db[id]["coin"]+=mob["coin"]
        db[id]["exp"]+=mob["exp"]
    
    playerdict = db[id]
    return [battlelist,playerdict]
    
def bossfight(id,boss,playerdict):
    with open("GameControl.json", "r", encoding="utf-8") as file:
        db = json.load(file)
    playeritem = get_equipment(id)
    Atk = db[id]["atk"]
    damagerate = 1
    sheildrate = 1
    damagetype="slash"
    directdamage = 0
    Def = db[id]["def"]
    for i in playeritem.values():
        if i["name"]=="小劍":
            Atk+=10
        elif i["name"]=="青銅劍":
            Atk+=20
        elif i["name"]=="韌煉之劍":
            Atk+=20
            boss["exp"] = round(boss["exp"]*1.15)
        elif i["name"]=="漆黑短劍":
            boss["hp"]-=150
        elif i["name"]=="逐闇者":
            Atk+=128763
        elif i["name"]=="闇釋者":
            damagerate += 15
        elif i["name"]=="閃爍之光":
            directdamage+=12345
            Atk+=boss["def"]
            damagetype="slash"
        elif i["name"]=="疾風擊劍":
            Atk+=123
        elif i["name"]=="騎士輕劍":
            directdamage+=1234
        elif i["name"]=="銀線甲":
            Def+=20
        elif i["name"]=="午夜大衣":
            Def+=8763
            sheildrate-=0.5
    Atk = round(Atk*(100+db["atkbuff"])*0.01)
    Def = round(Def*(100+db["defbuff"])*0.01)
    turn=0
    battlelist=[]
    while db[id]["hp"]>0 and boss["hp"]>0 and turn<=db[id]["lv"]+5:
        battlelist.append({
            "defender": "enemy",
            "damage_type": damagetype,
            "damage": max(0,round((Atk-boss["atk"])*damagerate)+directdamage)
        })
        boss["hp"]-=max(0,round((Atk-boss["atk"])*damagerate)+directdamage)
        db[id]["damage"]+=max(0,round((Atk-boss["atk"])*damagerate)+directdamage)
        if boss["hp"]<=0:
            break
        battlelist.append({
            "defender": "player",
            "damage_type": "slash",
            "damage": max(0,round((boss["atk"]-Def)*sheildrate))
        })
        db[id]["hp"]-=round((boss["atk"]-Def)*(100+sheildrate)*0.01)
        if db[id]["hp"]<=0:
            break
        turn+=1
    if db[id]["hp"]<=0:
        db[id]["cd"]=60
        db[id]["hp"]=0
    elif boss["hp"]<=0:
        db[id]["coin"]+=boss["coin"]
        db[id]["exp"]+=boss["exp"]
    else:
        pass
    playerdict = db[id]
    bossdict = boss
    return [battlelist,playerdict,bossdict]


# 點登入時導向 Discord OAuth2
@app.route('/auth/discord')
def login():
    return redirect(
        f"{API_BASE_URL}/oauth2/authorize?client_id={CLIENT_ID}"
        f"&redirect_uri={REDIRECT_URI}&response_type=code&scope={SCOPE}"
    )

@app.route('/session-check', methods=['GET'])
def session_check():
    user = session.get('user')
    if user:
        return jsonify({'user': user})
    return jsonify({'user': None})

@app.route('/callback')
def callback():
    code = request.args.get('code')
    if not code:
        return '錯誤：沒有拿到 code', 400

    try:
        # 用 code 拿 access token
        data = {
            'client_id': CLIENT_ID,
            'client_secret': CLIENT_SECRET,
            'grant_type': 'authorization_code',
            'code': code,
            'redirect_uri': REDIRECT_URI,
            'scope': SCOPE
        }
        headers = {'Content-Type': 'application/x-www-form-urlencoded'}
        token_response = requests.post(f"{API_BASE_URL}/oauth2/token", data=data, headers=headers)
        token_response.raise_for_status()
        token_data = token_response.json()
        access_token = token_data['access_token']

        # 用 access token 取得使用者資料
        user_info_response = requests.get(
            f"{API_BASE_URL}/users/@me",
            headers={'Authorization': f'Bearer {access_token}'}
        )
        user_info_response.raise_for_status()
        user_info = user_info_response.json()

        # 儲存使用者資料到 session
        session['user'] = user_info

        # 檢查或新增玩家資料
        with open("GameControl.json", "r", encoding="utf-8") as file:
            db = json.load(file)

        user_id = user_info['id']
        if user_id not in db:
            new_player = {
                'name': user_info['global_name'],
                'damage': 0,
                'pos': 0,
                'lv': 1,
                'hp': 100,
                'atk': 10,
                'def': 10,
                'spd': 6,
                'exp': 0,
                'backpack': {
                    "0":{"name":"小劍","icon":"image/littlesword.png","descript":"最基礎的武器,增加10點ATK","price":10,"type":"weapon","equipped":False},
                    "1":{"name":"骰子包","icon":"image/dicepack.png","descript":"使用後得到10顆骰子","price":321,"type":"item","equipped":False}
                },
                'shop':["sword","sword","sword"],
                'coin': 0,
                'dice': 10,
                'cd':0,
                'eventcode': 1,
                'battleflag': 0,
                'questionflag': 0,
                'eventflag': 0,
                'restflag': 0,
                'shopflag': 0
            }
            db[user_id] = new_player
        else:
            db[user_id]['name'] = user_info['global_name']

        # 更新檔案
        with open("GameControl.json", "w", encoding="utf-8") as file:
            json.dump(db, file, ensure_ascii=False, indent=2)

        # 成功後重定向到遊戲頁面
        return redirect("http://localhost:3000")  # 假設前端應用的遊戲頁面 URL

    except requests.exceptions.RequestException as e:
        print(f"登入過程中出現錯誤: {e}")
        return '登入過程中出現錯誤，請稍後再試。', 500

@app.route('/dashboard')
def dashboard():
    user = session.get('user')
    if not user:
        return redirect(url_for('login'))
    return jsonify(user)

@app.route('/get/game_data')
def get_game_data():
    id = session['user']['id']
    with open("GameControl.json", "r", encoding="utf-8") as file:
        db = json.load(file)

    with open("Map.json", "r", encoding="utf-8") as file:
        mapdb = json.load(file)
    map = mapdb[str(db["level"])]
    map_ret = []
    for i in map:
        map_ret.append(map[i][1])

    playerattribute = get_playerattribute(id)
    response = {
        "player_name":db[id]['name'],
        "player_attributes":playerattribute,
        "level":db['level'],
        "boss_hp":db['boss_hp'],
        "total_atk":db[id]['damage'], 
        "pos":db[id]['pos'],
        "map":map_ret,
        "allteam":db["allteam"]
    }
    return jsonify(response)

@app.route('/get/rolldice')
def get_rolldice():
    id = session['user']['id']
    with open("GameControl.json", "r", encoding="utf-8") as file:
        db = json.load(file)
    
    if db[id]['dice']<=0:
        return '',200

    with open("Map.json", "r", encoding="utf-8") as file:
        mapdb = json.load(file)
    map = mapdb[str(db["level"])]
    
    db[id]['battleflag']=0
    db[id]['eventflag']=0
    db[id]['questionflag']=0
    db[id]['restflag']=0
    db[id]['shopflag']=0

    
    
    dice = random.randint(5, db[id]['spd'])
    type = mapdecode(map,db[id]['pos'],dice)[1]
    msg=""
    other_param = {}

    if type == "reward":
        r_num = random.randint(0,1)
        res = get_reward(r_num,db[id])
        db[id] = res[0]
        msg = res[1]
        other_param = get_playerattribute(id)
    elif type == "question":
        question = get_question()
        msg = question['Statements']
        other_param = question['Options']
        db[id]['questionflag'] = question['q_num']
    elif type == "event":
        event = get_event(db[id]['eventcode'])
        msg = event['Statements']
        other_param = event['Options']
        db[id]['eventflag'] = event['e_num']
    elif type == "shop":
        products = {
            "1":getRandItem(),
            "2":getRandItem(),
            "3":getRandItem()
        }
        db[id]["shop"]=[products["1"]["name"],products["2"]["name"],products["3"]["name"]]
        db[id]["shop_flag"]=1
        other_param = {
            "products" : products,
            "items" : db[id]["backpack"],
            "equipped" : get_equipment(id)
        }
    elif type == "rest":
        other_param = {
            "items" : db[id]["backpack"],
            "equipped" : get_equipment(id)
        }
    elif type == "battle":
        if mapdecode(map,db[id]['pos'],dice)[0]!=99:
            mobdb_str = "Mob_"+str(db["level"])+".json"
            with open(mobdb_str, "r", encoding="utf-8") as file:
                mobdb = json.load(file)
            
            if db[id]["cd"]==0:
                mob_key = random.choice(list(mobdb.keys()))
                mob = mobdb[mob_key]
                result = get_battledict(id,mob,db[id])
                db[id] = result[1]
                other_param = {
                    "log":result[0],
                    "player_attributes":get_playerattribute(id),
                    "mob_attributes":mob
                }
        else:
            with open("Boss.json", "r", encoding="utf-8") as file:
                bossdb = json.load(file)
            if db[id]["cd"]==0:
                boss_key = random.choice(list(bossdb.keys()))
                boss = bossdb[boss_key]
                result = bossfight(id,boss,db[id])
                other_param = {
                    "log":result[0],
                    "player_attributes":get_playerattribute(id),
                    "mob_attributes":boss
                }
                
                if result[2]["hp"]<=0:
                    db["level"] = result[2]["nextlevel"]
                    db["bosshp"] = result[2]["nexthp"]

            

        


    db[id]['dice']-=1
    response = {
        "dice": dice,
        "pos": db[id]['pos'],#起點
        "type": type,
        "msg": msg,
        "other_param": other_param
    }
    db[id]['pos'] = mapdecode(map,db[id]['pos'],dice)[0]
    
    with open("GameControl.json", "w", encoding="utf-8") as file:
            json.dump(db, file, ensure_ascii=False, indent=2)

    return jsonify(response)

@app.route('/response/question',methods=['POST'])
def response_question():
    data = request.get_json()
    id = session['user']['id']
    with open("GameControl.json", "r", encoding="utf-8") as file:
        db = json.load(file)
    

    with open("QuestionAns.json", "r", encoding="utf-8") as file:
        ansdb = json.load(file)
    
    
    if ansdb[str(db[id]['questionflag'])]['ans'] == data['select']: 
        #do something
        pass
    else:
        #do something
        pass
    

    response = {
        "attr":get_playerattribute(id),
        "msg":ansdb[str(db[id]['questionflag'])]['msg'][data['select']]
    }

    db[id]['questionflag'] = 0

    with open("GameControl.json", "w", encoding="utf-8") as file:
            json.dump(db, file, ensure_ascii=False, indent=2)

    
    return jsonify(response) 

@app.route('/response/event',methods=['POST'])
def response_event():
    data = request.get_json()
    id = session['user']['id']
    with open("GameControl.json", "r", encoding="utf-8") as file:
        db = json.load(file)
    

    with open("EventAns.json", "r", encoding="utf-8") as file:
        ansdb = json.load(file)
    
    
    for i in range(4):
        if i == data['select']: 
            #do something
            db[id]['eventcode'] = ansdb[str(db[id]['eventflag'])]['nextevent'][i]
            break
    
    

    response = {
        "attr":get_playerattribute(id),
        "msg":ansdb[str(db[id]['eventflag'])]['msg'][data["select"]]
    }

    db[id]['eventflag'] = 0

    with open("GameControl.json", "w", encoding="utf-8") as file:
            json.dump(db, file, ensure_ascii=False, indent=2)

    return jsonify(response) 

@app.route('/shopexit')
def shopexit():
    id = session['user']['id']
    with open("GameControl.json", "r", encoding="utf-8") as file:
        db = json.load(file)

    db[id]["shopflag"]=0

    with open("GameControl.json", "w", encoding="utf-8") as file:
            json.dump(db, file, ensure_ascii=False, indent=2)
    return '',200

@app.route('/restexit')
def restexit():
    id = session['user']['id']
    with open("GameControl.json", "r", encoding="utf-8") as file:
        db = json.load(file)

    db[id]["restflag"]=0

    with open("GameControl.json", "w", encoding="utf-8") as file:
            json.dump(db, file, ensure_ascii=False, indent=2)
    return '',200

@app.route('/buyItem',methods=['POST'])
def buyItem():
    data = request.get_json()
    id = session['user']['id']
    returnflag=0
    with open("GameControl.json", "r", encoding="utf-8") as file:
        db = json.load(file)

    name = data["name"]
    item = getItemByName(name)
    if db[id]["shopflag"]==1:
        if name in db[id]["shop"]:
            if db[id]["coin"] >= item["price"]:
                db[id]["coin"] -= item["price"]
                db[id]["shop"].remove(name)
                db[id]["shop"].append("empty")
                db[id]["backpack"][str(len(db[id]["backpack"]))]=item
                
                

    with open("GameControl.json", "w", encoding="utf-8") as file:
            json.dump(db, file, ensure_ascii=False, indent=2)

    return '',200

@app.route('/sellItem',methods="POST")
def sellItem():
    data = request.get_json()
    id = session['user']['id']
    
    with open("GameControl.json", "r", encoding="utf-8") as file:
        db = json.load(file)
    
    name = data["name"]
    item = getItemByName(name)
    if db[id]["shopflag"]==1:
        for i in range(len(db[id]['backpack'])):
            if db[id]['backpack'][str(i)]['name']==name:
                db[id]['coin'] += item['price']
                last_key = str(len(db[id]['backpack']) - 1)
                db[id]['backpack'][str(i)] = db[id]['backpack'][str(last_key)]
                db[id]['backpack'].pop(last_key)
    
    with open("GameControl.json", "w", encoding="utf-8") as file:
            json.dump(db, file, ensure_ascii=False, indent=2)
    
    return '',200

@app.route('/periodicUpdate')
def periodicUpdate():
    id = session['user']['id']
    with open("GameControl.json", "r", encoding="utf-8") as file:
        db = json.load(file)
    response = {
        # "bosshp":db["bosshp"], #164253flag 少打底線
        "bosshp":db["boss_hp"],
        "cd":db[id]["cd"]
    }
    return jsonify(response)

@app.route('/get/allItem')
def getallItem():
    id = session['user']['id']
    with open("GameControl.json", "r", encoding="utf-8") as file:
        db = json.load(file)
    
    response = db[id]["backpack"]
    return jsonify(response)

@app.route('/get/allCommodity')
def getallCommodity():
    id = session['user']['id']
    with open("GameControl.json", "r", encoding="utf-8") as file:
        db = json.load(file)
    
    response = {
        "1":getItemByName(db[id]["shop"][0]),
        "2":getItemByName(db[id]["shop"][1]),
        "3":getItemByName(db[id]["shop"][2])
    }
    return jsonify(response)

@app.route('/get/allEquipment')
def getallEquipment():
    id = session['user']['id']
    return jsonify(get_equipment(id))

@app.route('/get/setItem',methods=['POST'])
def setItem():
    """
    {
        "used":{"name":"str","type":"str","equip":"bool"},
        "change":{"name":"str","type":"str"}
    }
    """
    data = request.get_json()
    id = session['user']['id']
    with open("GameControl.json", "r", encoding="utf-8") as file:
        db = json.load(file)
        
    
    if data["used"]['type'] == "weapon" or data["used"]["type"] == "chest":
        if data["used"]['equip'] == True:
            if data["used"]["name"]=="午夜大衣":
                for i in db[id]["backpack"]:
                    if i["name"]==data["used"]["name"] and i["equipped"]:
                        i["equipped"]=False
                    elif i["name"]=="闇釋者" or i["name"]=="逐闇者":
                        i["equipped"]=False 
            else:
                for i in db[id]["backpack"]:
                    if i["name"]==data["used"]["name"] and i["equipped"]:
                        i["equipped"]=False
                        break
        else:
            if data["used"]["name"]=="闇釋者" or data["used"]["name"]=="逐闇者":
                flag=0
                for i in db[id]["backpack"]:
                    if i["name"]=="午夜大衣" and i["equipped"]:
                        flag=1
                        break
                if flag==1:
                    for i in db[id]["backpack"]:
                        if i["name"]==data["used"]["name"] and not i["equipped"]:
                            i["equipped"]=True
                            break
                    for i in db[id]["backpack"]:
                        if i["name"]==data["change"]["name"] and i["equipped"]:
                            i["equipped"]=False
                            break
                else:
                    pass
            else:
                for i in db[id]["backpack"]:
                    if i["name"]==data["used"]["name"] and not i["equipped"]:
                        i["equipped"]=True
                        break
                for i in db[id]["backpack"]:
                    if i["name"]==data["change"]["name"] and  i["equipped"]:
                        i["equipped"]=False
                        break
        weapon=0
        chest=0
        for i in db[id]["backpack"]:
            if i["equipped"] and i["type"]=="weapon":
                weapon+=1
            elif i["equipped"] and i["type"]=="chest":
                chest+=1
        if weapon<=2 and chest<=1:
            with open("GameControl.json", "w", encoding="utf-8") as file:
                json.dump(db, file, ensure_ascii=False, indent=2)

    elif data["used"]["type"]=="item":
        for i in db[id]["backpack"]:
            if i["name"]==db["used"]["name"]:
                if i["name"]=="治療水晶":
                    db[id]["hp"]+=(db[id]["lv"]**2)*100
                    last_key = str(len(db[id]['backpack']) - 1)
                    db[id]['backpack'][str(i)] = db[id]['backpack'][str(last_key)]
                    db[id]['backpack'].pop(last_key)
                elif i["name"]=="還瑰之聖水晶":
                    db[id]["cd"]=0
                    last_key = str(len(db[id]['backpack']) - 1)
                    db[id]['backpack'][str(i)] = db[id]['backpack'][str(last_key)]
                    db[id]['backpack'].pop(last_key)
                elif i["name"]=="攻擊光環水晶":
                    db["atkbuff"]+=1
                    last_key = str(len(db[id]['backpack']) - 1)
                    db[id]['backpack'][str(i)] = db[id]['backpack'][str(last_key)]
                    db[id]['backpack'].pop(last_key)
                    db["atklist"].append(60)
                elif i["name"]=="防禦光環水晶":
                    db["defbuff"]+=1
                    last_key = str(len(db[id]['backpack']) - 1)
                    db[id]['backpack'][str(i)] = db[id]['backpack'][str(last_key)]
                    db[id]['backpack'].pop(last_key)
                    db["deflist"].append(60)
                elif i["name"]=="骰子包":
                    db[id]["dice"]+=10
                    last_key = str(len(db[id]['backpack']) - 1)
                    db[id]['backpack'][str(i)] = db[id]['backpack'][str(last_key)]
                    db[id]['backpack'].pop(last_key)
                with open("GameControl.json", "w", encoding="utf-8") as file:
                    json.dump(db, file, ensure_ascii=False, indent=2)
                break
    return '',200




if __name__ == '__main__':
    app.run(debug=True, port = 5000)
    cooldown_thread = threading.Thread(target=cooldown_monitor, daemon=True)
    cooldown_thread.start()

"""
session['user']

{
  "accent_color": null,
  "avatar": "4da5f349600536dbcf3c242adcc78099",
  "avatar_decoration_data": null,
  "banner": null,
  "banner_color": null,
  "clan": null,
  "collectibles": null,
  "discriminator": "0",
  "flags": 0,
  "global_name": "BIR",
  "id": "852064504846352394",
  "locale": "zh-TW",
  "mfa_enabled": false,
  "premium_type": 0,
  "primary_guild": null,
  "public_flags": 0,
  "username": "brian142857"
}

"""

