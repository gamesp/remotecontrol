var client;
var command;
var groupCommands = ['F', 'L', 'B', 'R'];
var button_L = '<a class="iconL ui-shadow ui-btn ui-corner-all ui-icon-arrow-l ui-btn-icon-notext ui-btn-inline" href="#"></a>';
var button_R = '<a class="iconR ui-shadow ui-btn ui-corner-all ui-icon-arrow-r ui-btn-icon-notext ui-btn-inline" href="#"></a>';
var button_F = '<a class="iconF ui-shadow ui-btn ui-corner-all ui-icon-arrow-u ui-btn-icon-notext ui-btn-inline" href="#"></a>';
var button_B = '<a class="iconB ui-shadow ui-btn ui-corner-all ui-icon-arrow-d ui-btn-icon-notext ui-btn-inline" href="#"></a>';
var groupIconCommands = [button_F, button_L, button_B, button_R];
var previousCommand, arrayCommands = '';
var previousIconCommand, arrayIconCommands = '';


function doConnect() {
    // loading gif
    $('#receiveState').html("<img src=\"img/loading.gif\" alt=\"connecting...\" style=\"width:20px;height:20px;\">");
    // connect with random unique id
    client = new Paho.MQTT.Client('test.mosquitto.org', 8080, 'jsProtoWeb' + Math.floor(Math.random() * 26) + Date.now());
    client.onConnect = onConnect;
    client.onMessageArrived = onMessageArrived;
    client.onConnectionLost = onConnectionLost;
    client.connect({
        onSuccess: onConnect,
        onFailure: onFail,
        useSSL: false
    });
    // debug
    console.info('Connecting to Server...');
}

function doSend(command) {
    message = new Paho.MQTT.Message(command);
    message.destinationName = "/gamesp/protoAlfaESP8266/commands";
    client.send(message);
}

function doDisconnect() {
    client.disconnect();
    $('#receiveState').text("OFF");
    $('#receiveState').css({'color': 'red'});
}

// Web Messaging API callbacks

function onConnect() {
// Subscribe to the topics of robot
    //$('#receiveState').text("ON");
    client.subscribe("/gamesp/protoAlfaESP8266/state");
    client.subscribe("/gamesp/protoAlfaESP8266/executing");
    client.subscribe("/gamesp/protoAlfaESP8266/commands");
    console.info('Conected ');
    $('#receiveState').css({'color': 'green'});
}

function onFail() {
    $('#receiveState').text("Fail - Reload the page");
    $('#receiveState').css({'color': 'red'});
    console.info('Failllllll');
}

function onConnectionLost(responseObject) {
    $('#receiveState').text("OFF - Reload the page");
    $('#receiveState').css({'color': 'red'});
    if (responseObject.errorCode !== 0)
        alert(client.clientId + "\n" + responseObject.errorCode);
}

function onMessageArrived(message) {
    console.info(message.destinationName);
    switch (message.destinationName) {
        case "/gamesp/protoAlfaESP8266/state" :
            $('#receiveState').text(message.payloadString);
            break;
        case "/gamesp/protoAlfaESP8266/executing" :
            $('#receiveExecuting').text(message.payloadString);
            // blink the icon
            blinkCommand(message.payloadString);
            // when not receive commands delete de icon and the array
            if (message.payloadString === 'SLEEP') {
                // delete array commands and icons
                deleteCommands();
            }
            break;
            // change uppercase letter per icon
        case "/gamesp/protoAlfaESP8266/commands" :
            console.info(message.payloadString);
            break;
        default:
            console.info(message.payloadString);
            break;
    }
}

// to create a array of commands and send all together
function createCommand(command) {
    // take previous command
    previousCommand = $('#sendCommands').text();
    // concat with the new
    arrayCommands = previousCommand + command;
    // fill <span> with array
    $('#sendCommands').text(arrayCommands);

    // the same with icons
    // take previous command
    previousIconCommand = $('#sendIconCommands').html();
    // concat with the new
    arrayIconCommands = previousIconCommand + groupIconCommands[$.inArray(command, groupCommands)];
    // fill <span> with array
    $('#sendIconCommands').html(arrayIconCommands);

}

function deleteCommands() {
    // delete commands to send
    $('#sendCommands').text('');
    // delete icons
    $('#sendIconCommands').html('');
    // empty array
    arrayCommands = '';
}

function blinkCommand(command2blink) {
    //TODO blink the icon
    console.info(command2blink);
}

function options() {
    
}

$(document).ready(function () {
    // Connect to broker
    doConnect();
    // forward
    $('#F').click(function () {
        if ($("input:radio[name=radio-choice-h-2]:checked").val() === 'direct') {
            doSend('F');
        } else {
            createCommand('F');
        }
        ;
    });
    // back
    $('#B').click(function () {
        if ($("input:radio[name=radio-choice-h-2]:checked").val() === 'direct') {
            doSend('B');
        } else {
            createCommand('B');
        }
        ;
    });
    // left
    $('#L').click(function () {
        if ($("input:radio[name=radio-choice-h-2]:checked").val() === 'direct') {
            doSend('L');
        } else {
            createCommand('L');
        }
        ;
    });
    // right
    $('#R').click(function () {
        if ($("input:radio[name=radio-choice-h-2]:checked").val() === 'direct') {
            doSend('R');
        } else {
            createCommand('R');
        }
        ;
    });
    // button to send array of commands
    $('#G').click(function () {
        // <span> of array to blank
        $('#sendCommands').text('');
        doSend(arrayCommands);
    });
    // delete commands before send
    $('#delete').click(function() {
        deleteCommands();
    });
    // configuration
    $('#delete').click(function() {
        options();
    });
});