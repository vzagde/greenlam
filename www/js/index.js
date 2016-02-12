/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
        var pushNotification;
        $("#app-status-ul").append('<li>deviceready event received</li>');
        try {
            pushNotification = window.plugins.pushNotification;
            $("#app-status-ul").append('<li>registering ' + device.platform + '</li>');
            if (device.platform == 'android' || device.platform == 'Android' || device.platform == 'amazon-fireos' ) {
                console.log("Notification Debugging: Entered Android APP");
                pushNotification.register(successHandler, errorHandler, {"senderID":"223767762284","ecb":"onNotification"});
            } else {
                pushNotification.register(tokenHandler, errorHandler, {"badge":"true","sound":"true","alert":"true","ecb":"onNotificationAPN"});    // required!
            }
        } catch(err) { 
            txt="There was an error on this page.\n\n"; 
            txt+="Error description: " + err.message + "\n\n"; 
            alert(txt);
        }
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        // var parentElement = document.getElementById(id);
        // var listeningElement = parentElement.querySelector('.listening');
        // var receivedElement = parentElement.querySelector('.received');

        // listeningElement.setAttribute('style', 'display:none;');
        // receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};

function getImage () {
    // alert('in getImage'); 
    
    navigator.camera.getPicture(onSuccess, onFail, { 
        quality: 50,
        destinationType: Camera.DestinationType.DATA_URL
    });
    mainView.router.loadPage('selectedcolor.html');
}

function onSuccess(imageData) {
    // mainView.router.loadPage('selectedcolor.html');
    var image = $('#cameraImg');
    // console.log('img: ' + imageData);
    image.attr('src',"data:image/jpeg;base64," + imageData);
    // image.src = "data:image/jpeg;base64," + imageData;
    // var image = document.getElementById('myImage');
    // image.src = "data:image/jpeg;base64," + imageData;

    // var img = document.getElementById('myImage');
    // var canvas = document.createElement('canvas');
    // canvas.width = image.width;
    // canvas.height = image.height;
    // canvas.getContext('2d').drawImage(image, 0, 0, image.width, image.height);

    $('#cameraImg').click(function(e) {
        // alert('click event');
        
        if(!this.canvas) {
            this.canvas = $('<canvas />')[0];
            this.canvas.width = this.width;
            this.canvas.height = this.height;
            this.canvas.getContext('2d').drawImage(this, 0, 0, this.width, this.height);
        }
        
        var pixelData = this.canvas.getContext('2d').getImageData(event.offsetX, event.offsetY, 1, 1).data;
        
        // $('#output').html('R: ' + pixelData[0] + '<br>G: ' + pixelData[1] + '<br>B: ' + pixelData[2] + '<br>A: ' + pixelData[3]);
        // rgba(0,255,0,0.3)
        var clr =  'rgba(' + pixelData[0] + ',' + pixelData[1] + ',' + pixelData[2] + ',' + pixelData[3]/255 + ')' ;
        // alert(clr);
        $(".pickr").css("left", event.offsetX);
        $(".pickr").css("top", event.offsetY+180);
        $('.selected-color').css("background-color", clr );

        // var hslaClr = color2color( clr, 'hsla' ); // Returns "rgba(64,64,64,0.5)"
        // hslaClr = hslaClr.substr(0, 3) + 'a' + hslaClr.substr(3);
        // // alert(hslaClr);
        // $('.imgClrHSLA').css("background-color", hslaClr );

    });
}

function onFail(message) {
    alert('Failed because: ' + message);
}


            function onNotificationAPN(e) {
                if (e.alert) {
                     $("#app-status-ul").append('<li>push-notification: ' + e.alert + '</li>');
                     // showing an alert also requires the org.apache.cordova.dialogs plugin
                     navigator.notification.alert(e.alert);
                }
                    
                if (e.sound) {
                    // playing a sound also requires the org.apache.cordova.media plugin
                    var snd = new Media(e.sound);
                    snd.play();
                }
                
                if (e.badge) {
                    pushNotification.setApplicationIconBadgeNumber(successHandler, e.badge);
                }
            }
            
            // handle GCM notifications for Android
            function onNotification(e) {
                console.log("Notification Debugging: "+e);
                $("#app-status-ul").append('<li>EVENT -> RECEIVED:' + e.event + '</li>');
                
                switch( e.event )
                {
                    case 'registered':
                    if ( e.regid.length > 0 ) {
                        $("#app-status-ul").append('<li>REGISTERED -> REGID:' + e.regid + "</li>");
                        // Your GCM push server needs to know the regID before it can push to this device
                        // here is where you might want to send it the regID for later use.
                        console.log("regID = " + e.regid);
                    }
                    break;
                    
                    case 'message':
                        // if this flag is set, this notification happened while we were in the foreground.
                        // you might want to play a sound to get the user's attention, throw up a dialog, etc.
                        if (e.foreground)
                        {
                            $("#app-status-ul").append('<li>--INLINE NOTIFICATION--' + '</li>');
                              
                                // on Android soundname is outside the payload. 
                                    // On Amazon FireOS all custom attributes are contained within payload
                                    var soundfile = e.soundname || e.payload.sound;
                                    // if the notification contains a soundname, play it.
                                    // playing a sound also requires the org.apache.cordova.media plugin
                                    var my_media = new Media("/android_asset/www/"+ soundfile);

                            my_media.play();
                        }
                        else
                        {   // otherwise we were launched because the user touched a notification in the notification tray.
                            if (e.coldstart)
                                $("#app-status-ul").append('<li>--COLDSTART NOTIFICATION--' + '</li>');
                            else
                            $("#app-status-ul").append('<li>--BACKGROUND NOTIFICATION--' + '</li>');
                        }
                            
                        $("#app-status-ul").append('<li>MESSAGE -> MSG: ' + e.payload.message + '</li>');
                        //android only
                        $("#app-status-ul").append('<li>MESSAGE -> MSGCNT: ' + e.payload.msgcnt + '</li>');
                        //amazon-fireos only
                        $("#app-status-ul").append('<li>MESSAGE -> TIMESTAMP: ' + e.payload.timeStamp + '</li>');
                    break;
                    
                    case 'error':
                        $("#app-status-ul").append('<li>ERROR -> MSG:' + e.msg + '</li>');
                    break;
                    
                    default:
                        $("#app-status-ul").append('<li>EVENT -> Unknown, an event was received and we do not know what it is</li>');
                    break;
                }
            }
            
            function tokenHandler (result) {
                console.log("Notification Debugging: Entered tokenHandler");
                $("#app-status-ul").append('<li>token: '+ result +'</li>');
                // Your iOS push server needs to know the token before it can push to this device
                // here is where you might want to send it the token for later use.
            }
            
            function successHandler (result) {
                console.log("Notification Debugging: Entered successHandler");
                $("#app-status-ul").append('<li>success:'+ result +'</li>');
            }
            
            function errorHandler (error) {
                console.log("Notification Debugging: Entered errorHandler"+error);
                $("#app-status-ul").append('<li>error:'+ error +'</li>');
            }
// openFB.init('1474734099449266', '', window.localStorage);

$(function() {
    $('#cameraImg').click(function(e) {
        if(!this.canvas) {
            this.canvas = $('<canvas />')[0];
            this.canvas.width = this.width;
            this.canvas.height = this.height;
            this.canvas.getContext('2d').drawImage(this, 0, 0, this.width, this.height);
        }
        var pixelData = this.canvas.getContext('2d').getImageData(event.offsetX, event.offsetY, 1, 1).data;

        var clr =  'rgba(' + pixelData[0] + ',' + pixelData[1] + ',' + pixelData[2] + ',' + pixelData[3]/255 + ')' ;
        $('.imgClrRGBA').css("background-color", clr );
    });
});


