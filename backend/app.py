from flask import Flask, redirect, request, session, url_for, jsonify
import requests
import random
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

#todo

#todo
@app.route('/get/game_data')
def get_game_data():
    response = {}
    
    return jsonify(response)

#todo
@app.route('/get/rolldice')
def get_rolldice():
    
    
    #下面這段是我為了測試前端功能寫的，你可以註解掉
    
    #test start
    
    dice = random.randint(1, 6)
    #todo : new_position 

    #test end


    response = {
        "dice": dice,
        #"position": new_position,
        "type": "event",
    }
    """
    {
        用session知道是誰丟的,自己在後端處理完,最後把走到的格子種類丟回去,如果是問答之類的把問題內容也一起丟回去,其他需要附屬資源的格子種類同理
    }
    """
    
    
    return jsonify(response)

if __name__ == '__main__':
    app.run(debug=True, port = 5000)

