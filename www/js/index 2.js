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
        console.log(navigator.camera);

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


// camera code
function getImage () {
    alert('in getImage'); 
    console.log('in getImage');
    navigator.camera.getPicture(onSuccess, onFail, { 
        quality: 50,
        destinationType: Camera.DestinationType.DATA_URL
    });
}

function onSuccess( imageData ) {
    alert('onSuccessCamera');
    // mainView.router.loadPage('selectedcolor.html');
    // var image = document.getElementById('camera');
    // image.src = "data:image/jpeg;base64," + imageData;

    // var img = document.getElementById('myImage');
    // var canvas = document.createElement('canvas');
    // canvas.width = img.width;
    // canvas.height = img.height;
    // canvas.getContext('2d').drawImage(img, 0, 0, img.width, img.height);
}

function onFail( message ) {
    alert('Failed because: ' + message);
}


$(function() {
    
    $('#myImage').click(function(e) {
        
        if(!this.canvas) {
            this.canvas = $('<canvas />')[0];
            this.canvas.width = this.width;
            this.canvas.height = this.height;
            this.canvas.getContext('2d').drawImage(this, 0, 0, this.width, this.height);
        }
        
        var pixelData = this.canvas.getContext('2d').getImageData(event.offsetX, event.offsetY, 1, 1).data;
        
        $('#output').html('R: ' + pixelData[0] + '<br>G: ' + pixelData[1] + '<br>B: ' + pixelData[2] + '<br>A: ' + pixelData[3]);
        
        // rgba(0,255,0,0.3)
        var clr =  'rgba(' + pixelData[0] + ',' + pixelData[1] + ',' + pixelData[2] + ',' + pixelData[3]/255 + ')' ;
        // alert(clr);
        $('.imgClrRGBA').css("background-color", clr );

        var hslaClr = color2color( clr, 'hsla' ); // Returns "rgba(64,64,64,0.5)"
        hslaClr = hslaClr.substr(0, 3) + 'a' + hslaClr.substr(3);
        // alert(hslaClr);
        $('.imgClrHSLA').css("background-color", hslaClr );

    });
});



