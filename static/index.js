document.addEventListener('DOMContentLoaded', () => {

    // Connect to websocket
    var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

    // When connected, configure buttons
    socket.on('connect', () => {

        // upon successfully connecting:
        // 1. configure buttons
        // 2. get local storage user data
        // 3. load relevant settings

        // 1. configure buttons:
        //     1. add channel
        //     2. send message
        //     3. any other additional buttons

        // 2. get local storage user data
        //     1. see if any user data 
        //     2. check for last saved channel (if new user, then go to general)

        // 3. load relevant settings
        //     1. load the messages for selected channel
        //     2. load channels

        
        // 1.1. add channel button
        const add_channel_btn = configure_form_btn('new_channel_name', 'add_channel_btn');

        add_channel_btn.onclick = () => {
            const newchannel = get_form_data('new_channel_name').trim().replace(/[&\/\\#,+()$~%.'":*?<>{}]/g,'_').replace(/ /,'-').replace(/(\d+)/g, "_$1");
            socket.emit('add channel', {'channel': newchannel, 'selected_channel': selectedchannel});
            document.querySelector("#add_channel_btn").disabled = true;
            return false;
        };

        // 1.2. send message button
        const send_msg_btn = configure_form_btn('text_input', 'send_msg_btn');

        send_msg_btn.onclick = () => {
            var timestamp2 = getTimeStamp();
            const newmsg = get_form_data('text_input');
            var timestamp = getTimeStamp();
            const newmessage = [localStorage.getItem("username"), newmsg, timestamp];
            document.querySelector("#send_msg_btn").disabled = true;
            socket.emit('send msg', {'channel': localStorage.getItem("selectedchannel"), 'msg': newmessage});
            return false;
        };


        // 2.1. check for user data
        if (!localStorage.getItem("username")) {
            alert("You're new here...");
            var person = promptName();
    
            while (person == null || person == "") {
                alert("You must enter a name, mr hacker man!");
                var person = promptName();
            }
            localStorage.setItem("username", person);
        }
        else {
            var person = localStorage.getItem("username");
        }
        var welcome = document.querySelector("#welcome");
        welcome.innerHTML = localStorage.getItem("username");
        alert("You are signed in as " + person + ".");
    });

    // 3.1. load the messages in selected channel
    socket.on("list channel msgs", data => {
        channel_msg = document.querySelector("#channel-chat");
        channel_msg.innerHTML = "";
        for (const elem of data) {
            const div = document.createElement('div');
            div.innerHTML = "<span>[" + elem[2] + "]&lt;" + elem[0] + "&gt; " + elem[1] + "</span>";
            channel_msg.append(div);
        };
        // alert("something");
    });

    // 3.2. load channels
    socket.on("load channels", data => {
        channels_list = document.querySelector("#channels");
        channels_list.innerHTML = "";
        for (const elem of data['channels']) {
            const li = document.createElement("li");
            if (elem === localStorage.getItem("selectedchannel")) {
                // const li = document.createElement("li");
                li.innerHTML = '<a class="waves-effect sidenav-close grey lighten-1" href="#" id="' + elem + '">#' + elem + '</a></li><br>';
                channels_list.append(li);
            }
            else {
                // const li = document.createElement("li");
                li.innerHTML = '<a class="waves-effect sidenav-close" href="#" id="' + elem + '">#' + elem + '</a></li><br>';
                channels_list.append(li);
            }
            li.onclick = () => {
                if (elem !== localStorage.getItem("selectedchannel")) {
                    const oldchannel = selectedchannel;
                    localStorage.setItem("selectedchannel", elem);
                    socket.emit("change channel", {'newchannel': elem, 'oldchannel': oldchannel});
                }
            };
        };

        // 2.2. check for last selected channel
        if (!localStorage.getItem("selectedchannel")) {
            selectedchannel = "general";
            localStorage.setItem("selectedchannel", "general");
            document.querySelector("#" + selectedchannel).classList.add("grey", "lighten-1");
        }
        else {
            selectedchannel = localStorage.getItem("selectedchannel");
            document.querySelector("#" + selectedchannel).classList.add("grey", "lighten-1");
        }
        socket.emit('joined channel', {'channel': selectedchannel});
    });

    socket.on("list channels", function(data) {
        selectedchannel = localStorage.getItem("selectedchanel");

        const channel_ul = document.querySelector("#channel-list");
        while (channel_ul.firstChild) {
            channel_ul.removeChild(channel_ul.firstChild);
        }

        for (channel of data['channels']) {
            const li = document.createElement('li');

            li.chn = channel;
            li.onclick = () => {
                if (li.chn !== selectedchannel) {
                    const old_channel = selectedchannel;
                    localStorage.setItem("selectedchannel", li.chn);
                    socket.emit('change channel', {'channel': li.chn, 'old_channel': old_channel})
                }
            };

            if (channel === selectedchannel) {
                li.innerHTML = '<a class="waves-effect sidenav-close grey lighten-1" href="#">#' + channel + '</a>';
            }
            else {
                li.innerHTML = '<a class="waves-effect sidenav-close" href="#">#' + channel + '</a>';
            }

            channel_ul.append(li);
        }
    });

    socket.on("channel exists", data => {
        alert("Channel already exists! Choose a different channel name!");
    });

    function configure_form_btn(form_id, btn_id) {
        const btn = document.querySelector("#" + btn_id);
        btn.disabled = true;

        document.querySelector("#" + form_id).onkeyup = (key) => {
            if (document.querySelector("#" + form_id).value.trim().length > 0) {
                btn.disabled = false;
            } else {
                btn.disabled = true;
            }

            if (key.keyCode === 13) {
                btn.click();
            }
        };

        return btn;
    }

    function get_form_data(form_id) {
        const msg_text = document.querySelector("#" + form_id).value;
        document.querySelector("#" + form_id).value = "";
        return msg_text;
    }

    // Prompt Name function
    function promptName() {
        var person = prompt("Please enter your name:", "Russian blblbl guy (Vitas)");
        return person;
    }

    function getTimeStamp() {
        let now = new Date();
        let dateyDate = now.getFullYear()+'-'+(now.getMonth()+1)+'-'+now.getDate();
        let hr = now.getHours();
        let min = ('0' + now.getMinutes()).slice(-2);   // https://stackoverflow.com/questions/8935414/getminutes-0-9-how-to-display-two-digit-numbers
        let ampm = 'AM';
        if (hr >= 12) {
            hr = hr - 12;
            ampm = 'PM';
        }
        return (dateyDate + ' ' + hr + ':' + min + ampm);
    }

});
