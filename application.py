import os
import requests

from flask import Flask, render_template, request, jsonify
from flask_socketio import SocketIO, emit

app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
socketio = SocketIO(app)

debug = False

channel_msg_limit = 100

if (debug):
    channels = ['general', 'zijprivate', 'debug']
    messages = {
                    "general": [ ["Doge", "Much general.", "2019-9-25 1:30PM"], ["Zeke", "What socket.", "2019-9-25 1:32PM"], ["Sally", "So not REST.", "2019-9-25 11:30AM"], ["Doge", "Such emitting.", "2019-9-25 11:33PM"] ],
                    "zijprivate": [ ["zoj", "Much general.", "2019-9-25 1:30PM"], ["zij", "What socket.", "2019-9-25 1:32PM"], ["kij", "So not REST.", "2019-9-25 11:30AM"], ["zoj", "Such emitting.", "2019-9-25 11:33PM"] ],
                    "debug": [  ]
                }
    for i in range(channel_msg_limit):
        messages['debug'].append(["Zij", "Message " + str(i), "2020-2-11 6:58PM"])
else:
    channels = ['general']
    messages = {
                    "general": [ ["Administrator", "Welcome to Flack!", "Eternal"], ["Administrator", "Create a new channel on the left!", "Eternal"], ["Administrator", "Note: First character must be an alphabet.", "Eternal"], ["Administrator", "Or not... Whatever you prefer.", "Eternal"], ["Administrator", "But if it's not... We'll append an _ in front of it, just sayin'", "Eternal"] ]
                }


votes = {"yes": 0, "no": 0, "maybe": 0}

@app.route("/")
def index():
    return render_template("index.html", votes=votes)


@socketio.on("add channel")
def add_channel(data):
    newChannel = data['channel']
    if newChannel not in channels:
        channels.append(newChannel)
        messages[newChannel] = []
    else:
        emit("channel exists", {}, broadcast=True)
    emit("load channels", {"channels": channels}, broadcast=True)
    change_channel({'newchannel': newChannel})

@socketio.on("joined channel")
def join_channel(data):
    joinedChannel = data['channel']
    msgs = messages[joinedChannel]
    emit("list channel msgs", msgs, broadcast=True)

@socketio.on("connect")
def channel_list():
    emit("load channels", {"channels": channels}, broadcast=True)

@socketio.on("change channel")
def change_channel(data):
    newchannel = {'channel': data['newchannel']}
    join_channel(newchannel)
    emit("load channels", {"channels": channels}, broadcast=True)

@socketio.on("send msg")
def send_msg(data):
    channel = data['channel']
    if len(messages[channel]) >= channel_msg_limit:
        messages[channel].pop(0)
    messages[channel].append(data['msg'])
    msgs = messages[channel]
    emit("list channel msgs", msgs, broadcast=True)

if __name__ == '__main__':
    socketio.run(app)