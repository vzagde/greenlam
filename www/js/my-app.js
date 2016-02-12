// Initialize your app

var base_url = "http://casaestilo.in/greenlam_admin/index.php/json/";
var img_url = "http://casaestilo.in/greenlam_admin/assets/uploads/files/";

var page_id = 'index.html';
var lam_id = '';
var lam_img = '';
var lam_content = '';
var lam_title = '';
var edge_id = 0;
var edge_title = '';
var edge_content = '';
var edge_img = '';
var user_data = '';
var token = 'nothing';
var prevPage = 'index.html';

var myApp = new Framework7({
    material: true,
    materialPageLoadDelay: 200,
    sortable: false,
    swipeout: false,
    cache: false,
});

openFB.init('1007458002645274', '', window.localStorage);

var $$ = Dom7;

// View Main
var mainView = myApp.addView('.view-main');

// Index Page
myApp.onPageInit('index', function(page){
    mainView.hideNavbar();
    document.addEventListener(
        "backbutton", 
        function () {
            navigator.notification.confirm(
               'Do you want to quit', 
               onConfirmQuit, 
               'QUIT TITLE', 
               'OK,Cancel'  
            );
        }, 
        false
    );
    function onConfirmQuit(button){
       if(button == "1"){
         navigator.app.exitApp(); 
       }
    }
    console.log('index init');
})


// Pallet color selector
myApp.onPageInit('colorselector', function (page) {
    mainView.showNavbar();
    document.addEventListener("backbutton", function () {
         mainView.router.loadPage('index.html');
    }, false);
    $('#idname').text('Select Color');

    $.ajax({
        url: base_url + 'laminates_colors',
        dataType : 'JSON',
        crossDomain: true,
        type: 'GET'
    })
    .done(function(data) {
        $('.color-boxes-wrapper').html('');
        $.each(data, function(index, val) {
            var sp = $(document.createElement('span'));
            sp.addClass('color-box')
            .css('background',val.hex_color)
            .data('color',val.hex_color)
            $('.color-boxes-wrapper').append(sp);
        });

        $('.color-box').click(function(event) {
            console.log('hiii');
            $('.color-box').css('border','none');
            $(this).css('border','2px solid #c1d700');
            var t = $(this).data('color');
            $('.selected-color').css('background',t);
        });
    })
    .fail(function(msg) {

    })
    .always(function() {

    });

    $('.clrSlctrLmnt').click(function(event) {
        var color = $('.selected-color').css('background-color');
        var hexClr = rgbToHex(color);
        hexClr = hexClr.substring(1);
        Lockr.set('color', hexClr);
        mainView.router.loadPage('matchinglaminate2.html');
    });
});

// Matching laminate / Comlimentry laminates
myApp.onPageInit('matchinglaminate2', function(page){
    mainView.showNavbar();
    $('#idname').text('Select Laminate');
    document.addEventListener("backbutton", function () {
         mainView.router.loadPage('colorselector.html');
    }, false);

    var color = Lockr.get('color');
    $(".lmntImg").css("background-color", "#"+color);

    var link = base_url+'laminateByColor/'+color;
    $.ajax({
        url: link,
        type: 'GET',
        crossDomain: true,
        dataType: 'JSON',
        async: false
    })
    .done(function(data) {
        var obj = JSON.stringify(data);
        $.each(data, function(index, val) {
            var text = '<div class="item-container brd '+val.type+'" data-title="'+val.name+'" data-description="'+val.description+'" data-image="'+img_url+val.image+'" data-id="'+val.id+'">'+
                        '<img src="'+img_url+val.image+'" alt="">'+
                        '</div>';
            $('#machinglaminatelist').append(text);
        });
        $(".brd").hide();
        $('.Laminates').show();
    })
    .fail(function(jqXHR, textStatus, errorThrown) {

    })
    .always(function() {

    });


    // var k = $('.main-container').html();

    // $('.main-container').append(k);
    // $('.main-container').append(k);
    // $('.main-container').append(k);
    // $('.main-container').append(k);
    // $('.main-container').append(k);
    // $('.main-container').append(k);
    // $('.main-container').append(k);
    // $('.main-container').append(k);

    $('.item-container img').on('click', function () {
        $('.item-container img').removeClass('active-box');
        $(this).addClass('active-box');
        myApp.popup('.popup-about');
        $('.popup-overlay').removeClass('modal-overlay-visible');
        $('.modal-overlay-visible').css('opacity','0');
    });

    $(".clicklam").click(function(){
        $(".clicklam").removeClass("active");
        $(this).addClass("active");
        $(".brd").hide();
        var type_id = '.'+$(this).data("typeid");
        $(type_id).show();
    })

    $('.close-popup').click(function(){
        $('.popup-about').fadeOut('slow');
        $('.item-container img').removeClass('active-box');
    });

    $('.btn').click(function(){
        $(this).css('display','block');
    });

    $(".item-container").click(function(){
        $("#matchinglamabout").empty();
        lam_img = $(this).data("image");
        lam_title = $(this).data("title");
        lam_content = $(this).data("description");
        lam_id = $(this).data("id");
        var html = '<img src="img/cross.png" class="close-popup cross-btn">'+
                    '<h1 class="item-title">'+lam_title+'</h1>'+
                    '<img src="'+lam_img+'" class="item-expanded-img" alt="">'+
                    '<p class="item-desc">'+lam_content+'</p>'+
                    '<div class="link-container">'+
                    '<a href="" class="shareBtn share-link"><span class="fa fa-share-alt"></span> Share</a>'+
                    '<a class="saveLaminate share-link" data-id="'+lam_id+'" href="#"><span class="fa fa-heart"></span> Save</a>'+
                    '<a class="getLaminate share-link" data-id="'+lam_id+'" href="#"><span class="fa fa fa-check-circle-o"></span> Get this</a>'+
                    '</div>';
        $("#matchinglamabout").html(html);
        $('.shareBtn').click(function(event) {
            console.log('share');
            $('.overlay-popup').fadeIn('slow');
            $('.share-popup').fadeIn('slow');
        });

        $(".saveLaminate").click(function(){
            var id = $(this).data("id");
            $.ajax({
                url: base_url+"save_laminate",
                type: "POST",
                crossDomain: true,
                data: {lid: id, token: token, page_id: "matchinglaminate2.html"},
                success: function(response){
                    var obj = response;
                    page_id = obj.page_id;
                    if (obj.msg == "SUCCESS") {
                        myApp.alert("You have Selected this Laminate to save", "SUCCESS");
                    } else if (obj.msg == "EXIST") {
                        myApp.alert("You have already Selected this Laminate to save", "ALERT");
                    } else {
                        mainView.router.loadPage('login.html');
                    }
                }
            })
        })

        $(".getLaminate").click(function(){
            var id = $(this).data("id");
            $.ajax({
                url: base_url+"get_laminate",
                type: "POST",
                crossDomain: true,
                data: {lid: id, token: token, page_id: "quote.html"},
                success: function(response){
                    var obj = response;
                    page_id = obj.page_id;
                    lam_id = obj.laminates_id;
                    lam_img = obj.image;
                    lam_content = obj.content;
                    lam_title = obj.title;
                    if (obj.msg == "LOGIN") {
                        mainView.router.loadPage('login.html');
                    } else {
                        user_data = obj.userdata;
                        mainView.router.loadPage('quote.html');
                    }
                }
            })
        })
    })

   
    $('.cros-btn').click(function(){
        $('.overlay-popup').fadeOut('fast');
        $('.share-popup').fadeOut('fast');
    });

    

    

    $(".matching_laminate").click(function(){
        if (lam_id) {
            mainView.router.loadPage('selected-edgeband2.html');
        } else {
            myApp.alert('Please select the laminate', 'ALERT');
        }
    })
})

// Select Edge Band
myApp.onPageInit('selected-edgeband2', function(page){
    $('#idname').text('Select Edgeband');
    mainView.showNavbar();
    document.addEventListener("backbutton", function () {
         mainView.router.loadPage('catalogueselector2.html');
    }, false);

    $.ajax({
        url: base_url+'get_edgband',
        type: 'POST',
        dataType: 'JSON',
        crossDomain: true,
        data: {lid: lam_id, token: token, page_id: 'selected_edgeband.html'},
        async: false
    })
    .done(function(data) {
        $.each(data.result, function(index, val) {
            var text = '<div class="item-container" data-title="'+val.name+'" data-description="'+val.description+'" data-image="'+img_url+val.image+'" data-id="'+val.id+'">'+
                        '<img src="'+img_url+val.image+'" alt="">'+
                        '</div>';
            $('#selectedgeband').append(text);
        });
        console.log(data);
        lam_img = data.laminate.image;
        lam_content = data.laminate.description;
        // lam_title = data.laminate.title;
        console.log(lam_title);
        user_data = data.userdata;
        $('.selected-color').css('background-image', 'url("'+img_url+lam_img+'")');
    });

    $('.item-container img').on('click', function () {
        $('.item-container img').removeClass('active-laminate');
        $(this).addClass('active-laminate');
        myApp.popup('.popup-about');
        $('.popup-overlay').removeClass('modal-overlay-visible');
        $('.modal-overlay-visible').css('opacity','0');
    });

    $('.close-popup').click(function(){
        $('.popup-about').fadeOut('slow');
        $('.item-container img').removeClass('active-laminate');
    });

    $(".item-container").click(function(){
        $("#selectedgebandabout").empty();
        edge_img = $(this).data("image");
        edge_title = $(this).data("title");
        edge_content = $(this).data("description");
        edge_id = $(this).data("id");
        var html = '<img src="img/cross.png" class="close-popup cross-btn">'+
                    '<h1 class="item-title">'+edge_title+'</h1>'+
                    '<img src="'+edge_img+'" class="item-expanded-img" alt="">'+
                    '<p class="item-desc">'+edge_content+'</p>'+
                    '<div class="link-container">'+
                    '<a href="" class="shareBtn share-link"><span class="fa fa-share-alt"></span> Share</a>'+
                    '<a class="saveLaminate share-link" data-id="'+edge_id+'" href="#"><span class="fa fa-heart"></span> Save</a>'+
                    '<a class="getLaminate share-link" data-id="'+edge_id+'" href="#"><span class="fa fa fa-check-circle-o"></span> Get this</a>'+
                    '</div>';
        $("#selectedgebandabout").html(html);
        $('.shareBtn').click(function(event) {
            console.log('share');
            $('.overlay-popup').fadeIn('slow');
            $('.share-popup').fadeIn('slow');
        });
    })

    $('.cros-btn').click(function(){
        $('.overlay-popup').fadeOut('fast');
        $('.share-popup').fadeOut('fast');
    });

    $(".saveLaminate").click(function(){
        var id = $(this).data("saveid");
        $.ajax({
            url: base_url+"save_laminate",
            type: "POST",
            crossDomain: true,
            data: {lid: id, token: token, page_id: "catalogue-selector.html"},
            success: function(response){
                var obj = JSON.parse(response);
                page_id = obj.page_id;
                if (obj.msg == "SUCCESS") {
                    myApp.alert("You have Selected this Laminate to save", "SUCCESS");
                } else if (obj.msg == "EXIST") {
                    myApp.alert("You have already Selected this Laminate to save", "ALERT");
                } else {
                    mainView.router.loadPage('login.html');
                }
            }
        })
    })

    $(".getLaminate").click(function(){
        var id = $(this).data("getid");
        $.ajax({
            url: base_url+"get_laminate",
            type: "POST",
            crossDomain: true,
            data: {lid: id, token: token, page_id: "quote.html"},
            success: function(response){
                var obj = JSON.parse(response);
                page_id = obj.page_id;
                edge_id = obj.laminates_id;
                edge_img = obj.image;
                if (obj.msg == "LOGIN") {
                    mainView.router.loadPage('login.html');
                } else {
                    user_data = obj.userdata;
                    mainView.router.loadPage('quote.html');
                }
            }
        })
    })

    $(".edgelaminate").click(function(){
        if (edge_id) {
            mainView.router.loadPage('quote.html');
        } else {
            myApp.alert("Please Select Edgeband", "ALERT");
        }
    })
})

//Quote Page
myApp.onPageInit('quote', function(page){
    mainView.showNavbar();
    console.log(lam_title);
    document.addEventListener("backbutton", function () {
         mainView.router.loadPage('index.html');
    }, false);
    var quote_type = '';
    var contact_via = '';

    $("#ch1").click(function(){
        if(this.checked){
            quote_type = this.value;
            if (token == 'nothing') {
                page_id = "quote.html";
                mainView.router.loadPage('login.html');
            }
        }
    })
     
    $("#ch2").click(function(){
        if(this.checked){
            quote_type = this.value;
            if (token == 'nothing') {
                page_id = "quote.html";
                mainView.router.loadPage('login.html');
            }
        }
    })


    $("#r1").click(function(){
        if(this.checked){
            contact_via = this.value;
            if (token == 'nothing') {
                page_id = "quote.html";
                mainView.router.loadPage('login.html');
            }
        }
    })
     
    $("#r2").click(function(){
        if(this.checked){
            contact_via = this.value;
            if (token == 'nothing') {
                page_id = "quote.html";
                mainView.router.loadPage('login.html');
            }
        }
    })

    $(".color_url").css("background-image", "url('"+img_url+lam_img+"')");
    console.log(edge_img);
    if (edge_img) {
        $(".edge_url").css("background-image", "url('"+edge_img+"')");
    }
    console.log(lam_title);
    $("#lamtitle").html(lam_title);
    $("#lamcontent").html(lam_content);
    $("#name").val(user_data.first_name);
    $("#city").val(user_data.city);
    $("#state").val(user_data.state);
    $("#pincode").val(user_data.pincode);
    $("#contact").val(user_data.phone);
    $("#email").val(user_data.email);
    $('#token').val(token);
    $('#lid').val(lam_id);
    $('#eid').val(edge_id);

    $(".submit_all_data").click(function(){
        var pin = /^\d{6}$/;
        var phoneno = /^\d{10}$/;
        var em_val = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (!$("#name").val()) {
            myApp.alert("Please Enter Your Name", "ALERT");
        } else if (!$("#city").val()) {
            myApp.alert("Please Enter City", "ALERT");
        } else if (!$("#state").val()) {
            myApp.alert("Please Enter State", "ALERT");
        } else if (!$("#pincode").val()) {
            myApp.alert("Please Enter Pincode", "ALERT");
        } else if(!$('#pincode').val().match(pin)){ 
            myApp.alert("Please Enter Valid Pin", "ALERT");
        } else if (!$("#contact").val()) {
            myApp.alert("Please Enter Your Mobile Number", "ALERT");
        } else if(!$('#contact').val().match(phoneno)){ 
            myApp.alert("Please Enter Valid Mobile Number", "ALERT");
        } else if (!$("#email").val()) {
            myApp.alert("Please Enter Your Email Id", "ALERT");
        } else if(!$('#email').val().match(em_val)){  
            myApp.alert("Please Enter Valid Email Id", "ALERT");
        } else if ($("input[name='ch1']").serializeArray().length == 0) {
            myApp.alert("Please Select One of Quote / Samples", "ALERT");
        } else if ($("input[name='r1']").serializeArray().length == 0) {
            myApp.alert("Please Select One of your preferences", "ALERT");
        } else {                


            $.ajax({
                url: base_url+'register_quote',
                type: 'POST',
                dataType: 'json',
                crossDomain: true,
                data: {
                    user_id : token,
                    laminates_id : lam_id,
                    edgeband_id : edge_id,
                    name : $("#name").val(),
                    city : $("#city").val(),
                    state : $("#state").val(),
                    pincode : $("#pincode").val(),
                    visitor : $("#visitor").val(),
                    contact : $("#contact").val(),
                    email : $("#email").val(),
                    quote_type : quote_type,
                    contact_via : contact_via,
                    token : token,
                },
                success: function(data){
                    // console.log(data);
                    if (data != "SUCCESS") {
                        myApp.alert("We couldn't process your request Please try again in sometime", "ALERT");
                    } else {
                        mainView.router.loadPage('thankyou.html');
                    }
                }
            });            
        }
    })
})

// Camera click View
myApp.onPageInit('selectedcolor', function (page) {
    mainView.showNavbar();
    document.addEventListener("backbutton", function () {
         mainView.router.loadPage('index.html');
    }, false);
    $('#idname').text('Select Color');
    $('.clrSlctrLmnt').click(function(event) {
        var color = $('.selected-color').css('background-color');
        var hexClr = rgbToHex(color);
        hexClr = hexClr.substring(1);
        Lockr.set('color', hexClr);
        mainView.router.loadPage('matchinglaminate2.html');
    });
});

// Login Page
myApp.onPageInit('login', function (page) {
    mainView.showNavbar();

    document.addEventListener("backbutton", function () {
         mainView.router.loadPage('index.html');
    }, false);

    $('#idname').text('Login');
    $('#loginForm').attr('action', base_url+'login');

    $('#loginForm').ajaxForm(function(data) {

        user_data = data.user;

        if(data.msg.indexOf('SUCCESS')>=0) {
            myApp.alert('successfully logged in', 'Success');
            token = data.token;

            $('#loginForm').resetForm();
            mainView.router.loadPage(page_id);
        } else {
            myApp.alert('please provide appropeiate data.', 'Error');
        }
    });

    
    $(".login-btn").click(function(){

        openFB.login('email',
            function() {
                get_info();
            },
            function() {

            }
        );
    })

    function get_info(){
        openFB.api({
            path: '/me',
            success: function(fbData){
                $.ajax({
                    url: base_url+'fbLogin',
                    type: 'POST',
                    dataType: 'json',
                    async: false,
                    crossDomain: true,
                    data: {
                        fbID: fbData.id,
                        fbName: fbData.name
                    },
                })
                .done(function(response) {
                    var obj = response;
                    user_data = obj.user;
                    if(obj.msg.indexOf('SUCCESS')>=0) {
                        myApp.alert('successfully logged in', 'Success');
                        token = obj.token;
                        console.log('fbToken: '+token);
                        // Lockr.set('token', data.token);
                        $('#loginForm').resetForm();
                        mainView.router.loadPage(page_id);
                    } else {
                        myApp.alert('please provide appropeiate data.', 'Error');
                    }
                })
                .fail(function(erroe) {

                })
                .always(function() {

                });
                console.log('after ajax');
            },
            error: function(response){

            }
        });
    }
});

// Register Page
myApp.onPageInit('register', function (page) {
    mainView.showNavbar();
    document.addEventListener("backbutton", function () {
         mainView.router.loadPage('index.html');
    }, false);
    $('#idname').text('Register');
    $('#registerForm').attr('action', base_url+'register');

    var MAHARASHTRA = [
        {display: "Mumbai", value: "Mumbai" }, 
        {display: "Pune", value: "Pune" }
    ];
        
    var GUJRAT = [
        {display: "Surat", value: "Surat" }, 
        {display: "Ahmadabad", value: "Ahmadabad" }
    ];
        
    var UP = [
        {display: "Lucknow", value: "Lucknow" }, 
        {display: "Agra", value: "Agra" }
    ];

    $("#state").change(function(){

        var select = $("#state option:selected").val();
        switch(select){
            case "MAHARASHTRA":
                city(MAHARASHTRA);
            break;

            case "GUJRAT":
                city(GUJRAT);
            break;

            case "UP":
                city(UP);
            break;

            default:
                $("#city").empty();
                $("#city").append("<option>--Select--</option>");
            break;
        }
    });

    function city(arr){
        $("#city").empty();
        $("#city").append("<option>--Select--</option>");
        $(arr).each(function(i){
            $("#city").append("<option value=\""+arr[i].value+"\">"+arr[i].display+"</option>")
        });
    }

    $('#registerForm').ajaxForm(function(data) {

        data = JSON.parse(data);

        if (data.msg.indexOf("SUCCESS") >= 0) {
            myApp.alert('Registered successfully.', 'Success');
            token = data.token;
            $('#registerForm').resetForm();
        } else {
            myApp.alert('please provide appropriate data.', 'Error');
        }
    });
});

// Forgot Password
myApp.onPageInit('forgotpw', function (page) {
    mainView.showNavbar();
    document.addEventListener("backbutton", function () {
         mainView.router.loadPage('index.html');
    }, false);
    $('#idname').text('Forgot Password');

    $('#forgtBtn').click(function(event) {
        var email = $('#email').val();
        $.ajax({
            url: base_url+'reset_password',
            type: 'POST',
            crossDomain: true,
            dataType: 'JSON',
            data: {email: email},
        })
        .done(function(data) {
            if(data.msg=="SUCCESS") {
                myApp.alert('Your new password is: '+data.password);
            } else {
                myApp.alert('Invalid email.');
            }
        })
        .fail(function(data) {

        })
        .always(function() {

        });
        
    });
});

// Offers Page
myApp.onPageInit('offers', function (page) {
    mainView.showNavbar();
    document.addEventListener("backbutton", function () {
         mainView.router.loadPage('index.html');
    }, false);
    $('#idname').text('Offers');
    $.ajax({
        url: base_url+'offers',
        type: 'GET',
        crossDomain: true,
        dataType: 'JSON'
    })
    .done(function(data) {

        $.each(data, function(index, val) {
            var title = val.offer_title;
            var image = val.image;
            var desc = val.description;

            var o = $(document.createElement('div'));
            o.addClass('offer');

            var om = $(document.createElement('div'));
            om.addClass('offer-media');

            var i = $(document.createElement('img'));
            i.attr('src', img_url + image);
            om.append(i);

            o.append(om);

            var oc = $(document.createElement('div'));
            oc.addClass('offer-content');

            var ot = $(document.createElement('p'));
            ot.addClass('offer-title')
            .append(title);
            oc.append(ot);

            var od = $(document.createElement('p'));
            od.addClass('offer-description')
            .append(desc);
            oc.append(od);

            o.append(oc);

            $('.offers-wrapper').append(o);

        });

            $('.faq-item').click(function(e) {
                if ($(this).next('.faq-item-data').css('display') != 'block') {
                    $('.active').slideUp('fast').removeClass('active');
                    $(this).next('.faq-item-data').addClass('active').slideDown('slow');
                } else {
                    $('.active').slideUp('fast').removeClass('active');
                }
            });
    })
    .fail(function() {

    })
    .always(function() {

    });
});

// FAQ's Page
myApp.onPageInit('faqs', function (page) {
    mainView.showNavbar();
    document.addEventListener("backbutton", function () {
         mainView.router.loadPage('index.html');
    }, false);
    $('#idname').text('FAQ');

    $.ajax({
        url: base_url+'faqs',
        type: 'GET',
        crossDomain: true,
        dataType: 'JSON'
    })
    .done(function(data) {

        $.each(data, function(index, val) {
            var title = val.FAQs_title;
            var desc = val.description;

            var t = $(document.createElement('div'));
            t.addClass('faq-item')
            .text(title)

            var d = $(document.createElement('div'));
            d.addClass('faq-item-data')
            .text(desc);

            $('.faqs-wrapper').append(t).append(d);
        });

            $('.faq-item').click(function(e) {
                if ($(this).next('.faq-item-data').css('display') != 'block') {
                    $('.active').slideUp('fast').removeClass('active');
                    $(this).next('.faq-item-data').addClass('active').slideDown('slow');
                } else {
                    $('.active').slideUp('fast').removeClass('active');
                }
            });
    })
    .fail(function() {

    })
    .always(function() {

    });
});

//Feed Back Page
myApp.onPageInit('feedback', function (page) {
    document.addEventListener("backbutton", function () {
         mainView.router.loadPage('index.html');
    }, false);
    mainView.showNavbar();
    $('#idname').text('Feedback');

    $('#feedback').attr('action', base_url+'feedback');
    $(".feedback_btn").click(function(){
        var em_val = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if(!$("#messg").val()){
            myApp.alert('Please Enter your Feedback', 'ALERT');
        } else if (!$("#name_feedback").val()) {
            myApp.alert('Please Enter Your Name', 'ALERT');
        } else if (!$("#email_feedback").val()) {
            myApp.alert('Please Enter Your Email', 'ALERT');
        } else if(!$('#email_feedback').val().match(em_val)){ 
            myApp.alert('Please Enter Your Valid Email Id', 'ALERT');
        } else {
            $.ajax({
                url: base_url+'feedback',
                type: 'POST',
                crossDomain: true,
                data: {name: $("#name_feedback").val(),email: $("#email_feedback").val(),msg: $("#messg").val()},
                success: function(response){
                    console.log(response);
                    if(response) {
                        $("#messg").val('');
                        $("#name_feedback").val('');
                        $("#email_feedback").val('')

                        $('.form-wrapper').hide();
                        $('.thnkFeed').show();
                    }
                }
            })
        }
    })
});

// My Selection Laminates Page
myApp.onPageInit('myselections', function(page){
    mainView.showNavbar();
    document.addEventListener("backbutton", function () {
         mainView.router.loadPage('index.html');
    }, false);
    $('#idname').text('My Selections');
    $.ajax({
        url: base_url+'quote_laminates',
        type: 'POST',
        dataType: 'JSON',
        crossDomain: true,
        data: {token: token, page_id: 'myselections.html'},
        async: false,
    })
    .done(function(response){

        if (response.msg == "LOGIN") {

            var html = "<p style='width: 100%; font-size: 1.2em; text-align: center;'>You do not have any Lamitates Selection</p>";
            $("#myselections").html(html);
        } else {
            var html = '';
            $.each(response.data, function(index, val){
                html+=  '<div class="sel-block">'+
                        '<div class="sel-color" style="background-image: url('+img_url+val.image+');"></div>'+
                        '<div class="sel-title">'+val.hex_color+'</div>'+
                        '<div class="sel-desc">'+val.description+'</div>'+
                        '<div class="sel-actions">'+
                        '<a class="shareBtn" href=""><span class="fa fa-share-alt"></span> Share</a>'+
                        '</div>'+
                        '</div>';
            })
            $("#myselections").html(html);
        }
    })
    .fail(function(){

    })
    .always(function(){

    });

    $('.shareBtn').click(function(event) {
        console.log('share');
        $('.overlay-popup').fadeIn('slow');
        $('.share-popup').fadeIn('slow');
    });
    $('.cros-btn').click(function(){
        $('.overlay-popup').fadeOut('fast');
        $('.share-popup').fadeOut('fast');
    });
});

// Saved Laminates Page
myApp.onPageInit('saved', function(page){
    mainView.showNavbar();
    document.addEventListener("backbutton", function () {
         mainView.router.loadPage('index.html');
    }, false);
    $('#idname').text('Saved');

    $.ajax({
        url: base_url+'saved_laminates',
        type: 'POST',
        crossDomain: true,
        dataType: 'json',
        data: {'token': token, 'page_id': 'saved.html'},
    })
    .done(function(response) {
        page_id = response.page_id;
        var html = '';
        if (response.msg == 'LOGIN') {
            var html = "<p style='width: 100%; font-size: 1.2em; text-align: center;'>You do not Saved Laminates</p>";
            $("#saved_data").html(html);
        } else {
            $.each(response.data, function(index, val){
                html += '<div class="sel-block">'+
                            '<div class="sel-color" style="background-image: url('+img_url+val.image+');"></div>'+
                            '<div class="sel-title">'+val.hex_color+'</div>'+
                            '<div class="sel-desc">'+val.description+'</div>'+
                            '<div class="sel-actions">'+
                            '<a class="shareBtn" href=""><span class="fa fa-share-alt"></span> Share</a>'+
                            '<a style="float:right;" href=""><span class="fa fa-check-circle-o"></span> Get this</a>'+
                            '</div>'+
                            '</div>';
            })
            $("#saved_data").html(html);
            $('.shareBtn').click(function(event) {
                console.log('share');
                $('.overlay-popup').fadeIn('slow');
                $('.share-popup').fadeIn('slow');
            });
            
            $('.cros-btn').click(function(){
                $('.overlay-popup').fadeOut('fast');
                $('.share-popup').fadeOut('fast');
            });
        }
    })
    .fail(function(data) {

    });
});

// Catalouge Selector
myApp.onPageInit('catalogueselector2', function (page) {
    mainView.showNavbar();
    $('#idname').text('Select Laminate');
    document.addEventListener("backbutton", function () {
         mainView.router.loadPage('index.html');
    }, false);
    var text = '';
    $.ajax({
        url: base_url+'browse_laminates/'+token,
        type: 'GET',
        crossDomain: true,
        dataType: 'JSON',
        async: false
    })
    .done(function(data) {
        $.each(data, function(index, val) {
            var text = '<div class="item-container" data-title="'+val.name+'" data-description="'+val.description+'" data-image="'+img_url+val.image+'" data-id="'+val.id+'">'+
                    '<img src="'+img_url+val.image+'" alt="">'+
                    '</div>';
            $("#catalogueselect").append(text);
        });
    })
    .fail(function() {

    })
    .always(function() {

    });
    
    // prevPage = 'index.html';
    // var k = $('.main-container').html();

    // $('.main-container').append(k);
    // $('.main-container').append(k);
    // $('.main-container').append(k);
    // $('.main-container').append(k);
    // $('.main-container').append(k);
    // $('.main-container').append(k);
    // $('.main-container').append(k);
    // $('.main-container').append(k);

    $('.item-container img').on('click', function () {
        $('.item-container img').removeClass('active-box');
        $(this).addClass('active-box');
        myApp.popup('.popup-about');
        $('.popup-overlay').removeClass('modal-overlay-visible');
        $('.modal-overlay-visible').css('opacity','0');
    });

    $('.close-popup').click(function(){
        $('.popup-about').fadeOut('slow');
        $('.item-container img').removeClass('active-box');
    });
    $('.btn').click(function(){
        $(this).css('display','block');
    });

    $(".item-container").click(function(){
        $("#laminatespop").empty();
        lam_img = $(this).data("image");
        lam_title = $(this).data("title");
        lam_content = $(this).data("description");
        lam_id = $(this).data("id");
        var html = '<img src="img/cross.png" class="close-popup cross-btn">'+
                    '<h1 class="item-title">'+lam_title+'</h1>'+
                    '<img src="'+lam_img+'" class="item-expanded-img" alt="">'+
                    '<p class="item-desc">'+lam_content+'</p>'+
                    '<div class="link-container">'+
                    '<a href="" class="shareBtn share-link" data-id="'+lam_id+'"><span class="fa fa-share-alt"></span> Share</a>'+
                    '<a class="saveLaminate share-link" data-id="'+lam_id+'" href="#"><span class="fa fa-heart"></span> Save</a>'+
                    '<a class="getLaminate share-link" data-id="'+lam_id+'" href="#"><span class="fa fa fa-check-circle-o"></span> Get this</a>'+
                    '</div>';
        console.log(html);
        $("#laminatespop").html(html);
        $('.shareBtn').click(function(event) {
            console.log('share');
            $('.overlay-popup').fadeIn('slow');
            $('.share-popup').fadeIn('slow');
        });

        $(".saveLaminate").click(function(){
            var id = $(this).data("id");
            $.ajax({
                url: base_url+"save_laminate",
                type: "POST",
                crossDomain: true,
                data: {lid: id, token: token, page_id: "catalogue-selector.html"},
                success: function(response){
                    var obj = response;
                    page_id = obj.page_id;
                    if (obj.msg == "SUCCESS") {
                        myApp.alert("You have Selected this Laminate to save", "SUCCESS");
                    } else if (obj.msg == "EXIST") {
                        myApp.alert("You have already Selected this Laminate to save", "ALERT");
                    } else {
                        mainView.router.loadPage('login.html');
                    }
                }
            })
        })

        // getLaminate
        $(".getLaminate").click(function(){
            var id = $(this).data("id");
            console.log('getLaminate: '+id);
            $.ajax({
                url: base_url+"get_laminate",
                type: "POST",
                crossDomain: true,
                data: {lid: id, token: token, page_id: "quote.html"},
                success: function(response){
                    var obj = response;

                    page_id = obj.page_id;
                    lam_id = obj.laminates_id;
                    lam_img = obj.image;
                    lam_content = obj.content;
                    lam_title = obj.title;
                    if (obj.msg == "LOGIN") {
                        mainView.router.loadPage('login.html');
                    } else {
                        user_data = obj.userdata;
                        mainView.router.loadPage('quote.html');
                    }
                }
            })
        })
    })
    
    $('.cros-btn').click(function(){
        $('.overlay-popup').fadeOut('fast');
        $('.share-popup').fadeOut('fast');
    });

    

    $(".proceed-to-edgband").click(function(){
        if (lam_id) {
            // if (user_data) {
                mainView.router.loadPage('selected-edgeband2.html');
            // } else {
            //     page_id = "selected-edgeband2.html";
            //     mainView.router.loadPage('login.html');
            // }
        } else {
            myApp.alert("Please Select Laminate", "ALERT");
        }
    })

});

// About Page
myApp.onPageInit('about', function (page) {
    mainView.showNavbar();

    document.addEventListener("backbutton", function () {
         mainView.router.loadPage('index.html');
    }, false);

    $('#idname').text('About Us');
    $('.shareBtn').click(function(event) {
        $('.overlay-popup').fadeIn('slow');
        $('.share-popup').fadeIn('slow');
    });

    $(".share_msg").click(function(){
        console.log("Click Event Triggered");
    })

    $('.cros-btn').click(function(){
        $('.overlay-popup').fadeOut('fast');
        $('.share-popup').fadeOut('fast');
    });
});

// Backbutton Function
// function gotoPrevPage(){
//     // mainView.history.split(",");
//     // var page_history = mainView.history.length;
//     // console.log(page_history);
//     // prev = mainView.history[page_history-2];
//     // console.log('mineee: '+prev);
//     mainView.router.back();
// }

// RGB to Hex Color code Function
function rgbToHex(color) {
    var bg = color.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
    function hex(x) {
      return ("0" + parseInt(x).toString(16)).slice(-2);
    }
    return     "#" + hex(bg[1]) + hex(bg[2]) + hex(bg[3]);
}
