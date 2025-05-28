from flask import Flask, redirect, request, session, url_for, jsonify
import requests
import random
import json
import os
from SECRET import CLIENT_SECRET

app = Flask(__name__)
app.secret_key = os.urandom(24)



# 設定你的 Discord 應用資訊
CLIENT_ID = '1366650439910821888'
REDIRECT_URI = 'http://localhost:5000/callback'
API_BASE_URL = 'https://discord.com/api'
SCOPE = 'identify'

# 點登入時導向 Discord OAuth2
@app.route('/auth/discord')
def login():
    return redirect(
        f"{API_BASE_URL}/oauth2/authorize?client_id={CLIENT_ID}"
        f"&redirect_uri={REDIRECT_URI}&response_type=code&scope={SCOPE}"
    )

# Discord 登入回傳的處理（callback）
@app.route('/callback')
def callback():
    code = request.args.get('code')
    if not code:
        return '錯誤：沒有拿到 code'
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
    r = requests.post(f"{API_BASE_URL}/oauth2/token", data=data, headers=headers)
    r.raise_for_status()
    token_data = r.json()
    access_token = token_data['access_token']


    # 用 access token 取得使用者資料
    user_info = requests.get(f"{API_BASE_URL}/users/@me", headers={
        'Authorization': f'Bearer {access_token}'
    }).json()
    session['user'] = user_info
    
    with open("GameControl.json", "r", encoding="utf-8") as file:
        db = json.load(file)
    

    if user_info['id'] not in db:
        new_player = {
            'name' : user_info['global_name'] ,
            'damage' : 0,
            'pos' : 0,
            'lv' : 1,
            'hp' : 100,
            'atk' : 10,
            'def' : 10,
            'spd' : 6,
            'exp' : 0,
            'item' : {},
            'dice' : 10,
        }
        db[user_info['id']] = new_player

        # 寫回檔案
        with open("GameControl.json", "w", encoding="utf-8") as file:
            json.dump(db, file, ensure_ascii=False, indent=2)
    else:
        db[user_info['id']]['name'] = user_info['global_name']

        # 寫回檔案
        with open("GameControl.json", "w", encoding="utf-8") as file:
            json.dump(db, file, ensure_ascii=False, indent=2)


    user = session.get('user')
    if not user:
        return jsonify({'error': 'not logged in'}), 401
    return jsonify(user)
    #return redirect(url_for('dashboard'))

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

    response = get_playerattribute(id)
    
    return jsonify(response)



#todo
@app.route('/get/rolldice')
def get_rolldice():
    
    id = session['user']['id']
    with open("GameControl.json", "r", encoding="utf-8") as file:
        db = json.load(file)
    
    with open("Map.json", "r", encoding="utf-8") as file:
        mapdb = json.load(file)
    map = mapdb[str(db["level"])]
    
    #下面這段是我為了測試前端功能寫的，你可以註解掉
    #test start
    
    '''
    type, msg, other_param = random.choice([
        ["question",
            *random.choice([
                ["問題A", ["選項1", "選項2"]],
                ["問題B", ["選項1", "選項2"]],
            ])
        ],
        ["shop",None,None],
        ["rest","休息",None],
        ["reward",
            *random.choice([
                ["獎勵A", {"屬性1": 10, "屬性2": -5}],
            ])
        ],
        ["battle", "boss A 的一串戰鬥過程之類的", {"屬性1": 8}],
        ["event",
            *random.choice([
                ["特殊事件A", {"屬性1": 998244353, "骰子券": 1}],
            ])
        ],
    ])
    if type == "reward":
        #todo : 在這裡更新資料庫裡的玩家屬性
        pass
    #todo : 其他事件也要記得更新資料庫

    #todo : new_position 
    '''
    #test end
    
    dice = random.randint(1, db[id]['spd'])
    type = mapdecode(map,db[id]['pos'],dice)[1]
    other_param = {}

    if type == "rest":
        other_param = None
    elif type == "reward"  or type == "event":
        other_param = get_playerattribute(id)
    elif type == "question":
        other_param = ["A","B","C","D"]
    elif type == "shop":
        other_param = None
    elif type == "battle":
        other_param = None
    response = {
        "dice": dice,
        "pos": db[id]['pos'],#起點
        "type": type,
        "msg": "msg",
        "other_param": other_param,
    }
    db[id]['pos'] = mapdecode(map,db[id]['pos'],dice)[0]
    db[id]['dice']-=1
    with open("GameControl.json", "w", encoding="utf-8") as file:
            json.dump(db, file, ensure_ascii=False, indent=2)



    return jsonify(response)


            


if __name__ == '__main__':
    app.run(debug=True, port = 5000)

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

def get_playerattribute(id):
    id = session['user']['id']
    with open("GameControl.json", "r", encoding="utf-8") as file:
        db = json.load(file)

    response = {
        'player_name' : db[id]['name'],
        'item' : db[id]['item'],
        'player_attributes' : {
            'LV' : db[id]['lv'],
            'POS' : db[id]['pos'],
            'HP' : db[id]['hp'],
            'ATK' : db[id]['atk'],
            'DEF' : db[id]['def'],
            'SPD' : db[id]['spd'],
            'EXP' : db[id]['exp'],
        },
        'level' : db['level'],
        'boss_hp' : db['boss_hp'],
        'total_atk' : db[id]['damage'],
    }
    return response

def mapdecode(map, start, step):
    for i in range(36):
        if map[i][0] == start :
            return map[(i+step)%36]