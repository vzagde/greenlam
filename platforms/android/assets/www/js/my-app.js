// Initialize your app

var base_url = "http://casaestilo.in/greenlam_admin/index.php/json/";
var img_url = "http://casaestilo.in/greenlam_admin/assets/uploads/files/";

var page_id = '';
var lam_id = '';
var lam_img = '';
var lam_content = '';
var lam_title = '';
var edge_id = 0;
var edge_img = '';
var user_data = '';
var token = 'nothing';
var myApp = new Framework7({
    material: true,
    materialPageLoadDelay: 200,
    sortable: false,
    swipeout: false,
    // init: false
});

// Lockr.set('token', 'nothing');

var $$ = Dom7;

var mainView = myApp.addView('.view-main');
// mainView.hideNavbar();

myApp.onPageInit('index', function(page){
    mainView.hideNavbar();
})

myApp.onPageInit('talktous', function(page){
    mainView.showNavbar();
    $('#idname').text('Talk to Us');
    $(".callus").click(function(){
        console.log("success");
        window.open('tel:+919769102406', '_system');
    })
})

myApp.onPageInit('about', function (page) {
    mainView.showNavbar();
    $('#idname').text('About Us');
});

myApp.onPageInit('thankyou', function (page) {
    mainView.showNavbar();
     $('#idname').text('Thankyou');
});

myApp.onPageInit('selectedcolor', function (page) {
    mainView.showNavbar();
     $('#idname').text('Select Color');
    $('.clrSlctrLmnt').click(function(event) {
        var color = $('.selected-color').css('background-color');
        console.log('color: '+color);
        var hexClr = rgbToHex(color);
        hexClr = hexClr.substring(1);
        console.log('hex color: '+hexClr);
        Lockr.set('color', hexClr);
        mainView.router.loadPage('matchinglaminate.html');
    });
});

myApp.onPageInit('login', function (page) {
    mainView.showNavbar();
    $('#idname').text('Login');
    $('#loginForm').attr('action', base_url+'login');

    $('#loginForm').ajaxForm(function(data) {
        console.log(data);
        // data = JSON.parse(data);
        console.log(data);
        user_data = data.user;
        console.log('login: ' + data);
        if(data.msg.indexOf('SUCCESS')>=0) {
            myApp.alert('successfully logged in', 'Success');
            token = data.token;
            // Lockr.set('token', data.token);
            $('#loginForm').resetForm();
            mainView.router.loadPage(page_id);
        } else {
            myApp.alert('please provide appropeiate data.', 'Error');
        }
    });

    openFB.init('1007458002645274', '', window.localStorage);
    $(".login-btn").click(function(){
        console.log("FB LOGIN BUTTON Triggered");
        openFB.login('email',
            function() {
                get_info();
            },
            function() {
                console.log('Facebook login failed');
            }
        );
    })

    function get_info(){
        openFB.api({
            path: '/me',
            success: function(data){
                console.log(data.id);
                console.log(data.name);
                $.ajax({
                    url: base_url+'fbLogin',
                    type: 'POST',
                    dataType: 'json',
                    data: {
                        fbID: data.id,
                        fbName: data.name
                    },
                })
                .done(function(data) {
                    data = JSON.parse(data);
                    user_data = data.user;
                    console.log("success");
                    if(data.msg.indexOf('SUCCESS')>=0) {
                        myApp.alert('successfully logged in', 'Success');
                        token = data.token;
                        // Lockr.set('token', data.token);
                        $('#loginForm').resetForm();
                        mainView.router.loadPage(page_id);
                    } else {
                        myApp.alert('please provide appropeiate data.', 'Error');
                    }
                })
                .fail(function(erroe) {
                    console.log("error: "+error);
                })
                .always(function() {
                    console.log("complete");
                });
                
            },
            error: function(response){
                console.log('Not able to access data');
            }
        });
    }
});

myApp.onPageInit('register', function (page) {
    mainView.showNavbar();
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

    //Function executes on change of first select option field 
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

    //Function To List out Cities in Second Select tags
    function city(arr){
        $("#city").empty();//To reset cities
        $("#city").append("<option>--Select--</option>");
        $(arr).each(function(i){//to list cities
            $("#city").append("<option value=\""+arr[i].value+"\">"+arr[i].display+"</option>")
        });
    }

    $('#registerForm').ajaxForm(function(data) {
        console.log(data);
        data = JSON.parse(data);
        console.log('register: ' + data);
        if (data.msg.indexOf("SUCCESS") >= 0) {
            myApp.alert('Registered successfully.', 'Success');
            token = data.token;
            $('#registerForm').resetForm();
        } else {
            myApp.alert('please provide appropriate data.', 'Error');
        }
    });
});

myApp.onPageInit('forgotpw', function (page) {
    mainView.showNavbar();
     $('#idname').text('Forgot Password');
    // $('#passwordForm').attr('action', base_url+'forgot_password');
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
            console.log("error: "+JSON.stringify(data));
        })
        .always(function() {
            console.log("complete");
        });
        
    });
});

myApp.onPageInit('offers', function (page) {
    mainView.showNavbar();
     $('#idname').text('Offers');
    $.ajax({
        url: base_url+'offers',
        type: 'GET',
        crossDomain: true,
        dataType: 'JSON'
    })
    .done(function(data) {
        // data = JSON.parse(data);
        // console.log("faqs: "+data);
        $.each(data, function(index, val) {
            var title = val.offer_title;
            var image = val.image;
            var desc = val.description;
            console.log('t: ' +  title );
            console.log('d: ' +  desc );
            console.log('i: ' + image);

            // <div class="faq-item">There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form?</div>
                // <div class="faq-item-data">It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).</div>

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

            // $('.color-boxes-wrapper').append('<span class="color-box" data-color="'+val.avg_color+'" style="background:'+ val.avg_color+ '"></span>')
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
        console.log("error");
    })
    .always(function() {
        console.log("complete");
    });

});

myApp.onPageInit('myselections', function (page) {
    mainView.showNavbar();
     $('#idname').text('My Selections');
});

// myApp.onPageInit('laminateselector', function (page) {
//     mainView.showNavbar();
//     $(function () {
//         var tabContainers = $('div.tabs > div');
//         tabContainers.hide().filter(':first').show();
//         $('.tabs-boxes-wrapper a').click(function () {
//             tabContainers.hide();
//             tabContainers.filter(this.hash).show();
//             $('.tabs-boxes-wrapper a').removeClass('active');
//             $(this).addClass('active');
//             return false;
//         }).filter(':first').click();
//     });

//     $('.save').click(function(event) {
//         // alert('save');
//         $.ajax({
//             url: base_url + 'save_laminate/' + $(this).data('lid'),
//             type: 'POST',
//             dataType: 'JSON'
//         })
//         .done(function(data) {
//             console.log("save: " + data);
//         })
//         .fail(function(error) {
//             error = JSON.stringify(error);
//             console.log("error" + error);
//         })
//         .always(function() {
//             console.log("complete");
//         });
        
//     });

//     $('.color-boxes-wrapper img').click(function(){
//         $('.color-boxes-wrapper img').removeClass('active-box');
//         $(this).addClass('active-box');
//     })

// });

myApp.onPageInit('colorselector', function (page) {
    mainView.showNavbar();
     $('#idname').text('Select Color');

    $.ajax({
        url: base_url + 'laminates_colors',
        dataType : 'JSON',
        crossDomain: true,
        type: 'GET'
    })
    .done(function(data) {
        // <span class="color-box"></span>
        $('.color-boxes-wrapper').html('');
        $.each(data, function(index, val) {
            var sp = $(document.createElement('span'));
            sp.addClass('color-box')
            .css('background',val.hex_color)
            .data('color',val.hex_color)

            $('.color-boxes-wrapper').append(sp);
            // $('.color-boxes-wrapper').append('<span class="color-box" data-color="'+val.avg_color+'" style="background:'+ val.avg_color+ '"></span>')
        });

        $('.color-box').click(function(event) {
            // console.log('clrpkr bg: ' + $(this).data('color'));
            var t = $(this).data('color');
            // $(this).removeClass('active-box');
            $('.selected-color').css('background',t);
            $(this).addClass('active-box');
        });


    })
    .fail(function(msg) {
        console.log("error: " + msg);
    })
    .always(function() {
        console.log("complete");
    });

    $('.clrSlctrLmnt').click(function(event) {
        var color = $('.selected-color').css('background-color');
        console.log('color: '+color);
        var hexClr = rgbToHex(color);
        hexClr = hexClr.substring(1);
        console.log('hex color: '+hexClr);
        Lockr.set('color', hexClr);
        mainView.router.loadPage('matchinglaminate.html');
    });

    // $('.color-boxes-wrapper .color-box').each(function(index,val){
    //     $(val).css('background',getRandomColor());
    // })


});

myApp.onPageInit('faqs', function (page) {
    mainView.showNavbar();
     $('#idname').text('FAQ');

    $.ajax({
        url: base_url+'faqs',
        type: 'GET',
        crossDomain: true,
        dataType: 'JSON'
    })
    .done(function(data) {
        // data = JSON.parse(data);
        // console.log("faqs: "+data);
        $.each(data, function(index, val) {
            var title = val.FAQs_title;
            var desc = val.description;
            console.log('t: ' +  title );
            console.log('d: ' +  desc );

            // <div class="faq-item">There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form?</div>
                // <div class="faq-item-data">It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).</div>

            var t = $(document.createElement('div'));
            t.addClass('faq-item')
            .text(title)

            var d = $(document.createElement('div'));
            d.addClass('faq-item-data')
            .text(desc);

            $('.faqs-wrapper').append(t).append(d);

            // $('.color-boxes-wrapper').append('<span class="color-box" data-color="'+val.avg_color+'" style="background:'+ val.avg_color+ '"></span>')
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
        console.log("error");
    })
    .always(function() {
        console.log("complete");
    });

});

myApp.onPageInit('feedback', function (page) {
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
                }
            })
        }
    })
});

myApp.onPageInit('matchinglaminate', function (page) {
    mainView.showNavbar();
     $('#idname').text('Select Laminate');

    var color = Lockr.get('color');
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
        console.log(obj);
        $.each(data, function(index, val) {
            var text = '<li style="" class="og-expanded brd '+val.type+'">'+
                        '<a href="" class="open_pop" data-id="'+val.id+'" data-img="'+img_url+val.image+'" data-title="Veggies sunt bona vobis" data-description="Komatsuna prairie turnip wattle seed artichoke mustard horseradish taro rutabaga ricebean carrot black-eyed pea turnip greens beetroot yarrow watercress kombu."> <img src="'+img_url+val.image+'" alt="">'+
                        '<img src="img/heart-icon.png" class="heart_empty"></a>'+
                        '<div class="og-expander popup'+val.id+'" style="transition: height 350ms ease; height: 646px;">'+
                        '<div class="og-expander-inner"><span class="og-close"></span>'+
                        '<div class="og-details"> <h3>'+val.name+'</h3> <p>'+val.description+'</p><a href=""><span class="fa fa-share-alt"></span> Share</a> <a class="saveLaminate" data-id="'+val.id+'" href="#"><span class="fa fa-heart"></span> Save</a> <a  class="getLaminate" data-id="'+val.id+'" href="#"><span class="fa fa fa-check-circle-o"></span> Get this</a> </div></div></div></li>';
            $('#og-grid').append(text)
        });
        $(".brd").hide();
        $('.Laminates').show();
    })
    .fail(function(jqXHR, textStatus, errorThrown) {
        console.log("error: "+jqXHR);
    })
    .always(function() {
        console.log("complete");
    });

    $('.open_pop').click(function(){
        $('.og-expander').hide();
        console.log('hii');
        $('.open_pop').removeClass('active-box1');
        $('.brd').removeClass('active-box');
        $('.heart_empty').css("visibility" , "hidden");
        $(this).parent().addClass('active-box');
        $(this).addClass('active-box1');
        $(this).find('.heart_empty').css("visibility" , "visible");
        lam_id = $(this).data("id");
        lam_img = $(this).children().attr("src");
    });

    $(".matching_laminate").click(function(){
        if (lam_id) {
            // if (user_data) {
                mainView.router.loadPage('selected-edgeband.html');
            // } else {
            //     page_id = "selected-edgeband.html";
            //     mainView.router.loadPage('login.html');
            // }
        } else {
            myApp.alert('Please select the laminate', 'ALERT');
        }
    })

    $(".clicklam").click(function(){
        $(".clicklam").removeClass("active");
        $(this).addClass("active");
        $(".brd").hide();
        var type_id = '.'+$(this).data("typeid");
        $(type_id).show();
    })

    $(".saveLaminate").click(function(){
        var id = $(this).data("id");
        $.ajax({
            url: base_url+"save_laminate",
            type: "POST",
            crossDomain: true,
            data: {lid: id, token: token, page_id: "matchinglaminate.html"},
            success: function(response){
                // greenlam_mirza/www
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
        var id = $(this).data("id");
        console.log(Lockr.get("token"));
        $.ajax({
            url: base_url+"get_laminate",
            type: "POST",
            crossDomain: true,
            data: {lid: id, token: token, page_id: "quote.html"},
            success: function(response){
                var obj = JSON.parse(response);
                console.log(obj);
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



    $('.open_pop').click(function(){
        var id = ".popup"+$(this).data("id");
        $(id).show();
        var image = $(this).data("img");
        console.log("image: "+image)
        $('.lmntImg').css('background-image', 'url('+image+')');
    });

    $('.og-close').click(function() {
        console.log('hola');
        $('.og-expander').hide();
        $('.open_pop').removeClass('active-box1');
        $('.brd').removeClass('active-box');
        $('.heart_empty').css("visibility" , "hidden");
    });

});


myApp.onPageInit('complementarylaminate', function (page) {
    mainView.showNavbar();
    $('#idname').text('Select Laminate');

    $('.open_pop').click(function(){
        $('.open_pop').removeClass('active-box1');
        $('.brd').removeClass('active-box');
        $(this).parent().addClass('active-box');
        $(this).addClass('active-box1');
    });


    $('.open_pop').click(function(){
        var id = ".popup"+$(this).data("id");
        $(id).show();
    });

    $('.og-close').click(function() {
        console.log('hola');
        $('.og-expander').hide();
        $('.open_pop').removeClass('active-box1');
    }); 
});

myApp.onPageInit('catalogueselector', function (page) {
    console.log("catalogueselector");
    mainView.showNavbar();
     $('#idname').text('Catalogue');

    $.ajax({
        url: base_url+'browse_laminates/',
        type: 'GET',
        crossDomain: true,
        dataType: 'JSON',
        async: false
    })
    .done(function(data) {
        $.each(data, function(index, val) {
            var text = '<li style="" class="og-expanded brd"> '+
                        '<a href="" class="open_pop" data-id="'+val.id+'" data-largesrc="img/catalogue-box2.png" data-title="Veggies sunt bona vobis" data-description="Komatsuna prairie turnip wattle seed artichoke mustard horseradish taro rutabaga ricebean carrot black-eyed pea turnip greens beetroot yarrow watercress kombu."> '+
                        '<img src="'+img_url+val.image+'" alt=""> '+
                        '</a> <div class="og-expander popup'+val.id+'" style="transition: height 350ms ease; height: 646px;"> '+
                        '<div class="og-expander-inner"> <span class="og-close"></span>'+
                        '<div class="og-details"> '+
                        '<h3>'+val.name+'</h3> '+
                        '<p>'+val.description+'</p>'+
                        '<a href="" class="sharelam" data-shareid="'+val.id+'"><span class="fa fa-share-alt"></span>Share</a>'+
                        '<a href="" class="savelam" data-saveid="'+val.id+'"><span class="fa fa-heart"></span> Save</a>'+
                        '<a href="" class="getlam" data-getid="'+val.id+'"><span class="fa fa fa-check-circle-o"></span> Get this</a>'+
                        '</div></div></div></li>';
            $('.og-grid').append(text);
        });
        // console.log("catalogue: "+data);
    })
    .fail(function() {
        console.log("error");
    })
    .always(function() {
        console.log("complete");
    });
    
    $(".savelam").click(function(){
        var id = $(this).data("saveid");
        $.ajax({
            url: base_url+"save_laminate",
            type: "POST",
            crossDomain: true,
            data: {lid: id, token: token, page_id: "catalogue-selector.html"},
            success: function(response){
                // greenlam_mirza/www
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

    $(".getlam").click(function(){
        var id = $(this).data("getid");
        console.log(Lockr.get("token"));
        $.ajax({
            url: base_url+"get_laminate",
            type: "POST",
            crossDomain: true,
            data: {lid: id, token: token, page_id: "quote.html"},
            success: function(response){
                var obj = JSON.parse(response);
                console.log(obj);
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

    $(".proceed-to-edgband").click(function(){
        console.log(user_data);
        if (lam_id) {
            if (user_data) {
                mainView.router.loadPage('selected-edgeband.html');
            } else {
                page_id = "selected-edgeband.html";
                mainView.router.loadPage('login.html');
            }
        } else {
            myApp.alert("Please Select Laminate", "ALERT");
        }
    })

    $('.open_pop').click(function(){
        $('.og-expander').hide();
        $('.open_pop').removeClass('active-box1');
        $('.brd').removeClass('active-box');
        $(this).parent().addClass('active-box');
        $(this).addClass('active-box1');
    });


    $('.open_pop').click(function(){
        lam_id = $(this).data("id");
        var id = ".popup"+lam_id;
        $(id).show();
    });

    $('.og-close').click(function() {
        console.log('hola');
        $('.og-expander').hide();
        $('.open_pop').removeClass('active-box1');
        $('.brd').removeClass('active-box');
    }); 
});

myApp.onPageInit('quote', function(page){
    mainView.showNavbar();
     
    $(".color_url").css("background", "url('"+img_url+lam_img+"')");
    if (edge_img) {
        $(".edge_url").css("background", "url('"+edge_img+"')");
    }
    $("#lamtitle").text(lam_title);
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
                    quote_type : $("#ch1").val(),
                    contact_via : $("#r1").val(),
                    token : token,
                },
                success: function(data){
                    console.log(data);
                    if (data != "SUCCESS") {
                        myApp.alert("We couldn't process your request Please try again in sometime", "ALERT");
                    } else {
                        mainView.router.loadPage('thankyou.html');
                    }
                }
            });            

            // $('#quoteRegister').attr('action', base_url+'register_quote');
            // $('#quoteRegister').ajaxForm(function (data) {
            //     console.log(data);
            //     if (data == "SUCCESS") {
            //     } else {
            //         myApp.alert("We couldn't process your request Please try again in sometime", "ALERT");
            //     }
            // })
        }
    })
})

myApp.onPageInit('selected-edgeband', function(page){
    mainView.showNavbar();
     $('#idname').text('Select Edgeband');
    $('.laminateImage').css('background-image', img_url+lam_img);
    $.ajax({
        url: base_url+'get_edgband',
        type: 'POST',
        dataType: 'JSON',
        crossDomain: true,
        data: {lid: lam_id, token: token, page_id: 'selected_edgeband.html'},
        async: false
    })
    .done(function(data) {
        console.log(data);
        $.each(data.result, function(index, val) {

            var text = '<li style="" class="og-expanded brd"> '+
                        '<a href="" class="open_pop frst" data-id="'+val.id+'" data-largesrc="img/catalogue-box2.png" data-title="Veggies sunt bona vobis" data-description="Komatsuna prairie turnip wattle seed artichoke mustard horseradish taro rutabaga ricebean carrot black-eyed pea turnip greens beetroot yarrow watercress kombu."> '+
                        '<img src="'+img_url+val.image+'" alt=""> '+
                        // '<img src="img/heart-icon.png" class="heart">'+
                        '</a> <div class="og-expander popup'+val.id+'" style="transition: height 350ms ease; height: 646px;"> '+
                        '<div class="og-expander-inner"> <span class="og-close"></span>'+
                        '<div class="og-details"> '+
                        // '<h3>'+val.name+'</h3> '+
                        // '<p>'+val.description+'</p>'+
                        '<a href="" class="sharelam" data-shareid="'+val.id+'"><span class="fa fa-share-alt"></span>Share</a>'+
                        '<a href="" class="savelam" data-saveid="'+val.id+'"><span class="fa fa-heart"></span> Save</a>'+
                        '<a href="" class="getlam" data-getid="'+val.id+'"><span class="fa fa fa-check-circle-o"></span> Get this</a>'+
                        '</div></div></div></li>';
            // $('.og-grid').append(text);

            // var text =  '<div class="frst" data-edgeid="'+val.id+'">'+
                        // '    <img src="'+img_url+val.image+'" style="width:80px;height:80px;margin-bottom:20px;" class="edge">'+
                        // '</div>';
            $('.edge_wrap').append(text);
        });

        lam_img = data.laminate.image;
        lam_content = data.laminate.description;
        lam_title = data.laminate.title;
        user_data = data.userdata;
        $(".laminateImage").css("background", "url('"+img_url+lam_img+"')");

        $('.open_pop').click(function(){
            $('.og-expander').hide();
            $('.open_pop').removeClass('active-box1');
            $('.brd').removeClass('active-box');
            // $('.heart_empty').css("visibility" , "hidden");
            $(this).parent().addClass('active-box');
            $(this).addClass('active-box1');
            // $(this).find('.heart_empty').css("visibility" , "visible");
            lam_id = $(this).data("id");
            lam_img = $(this).children().attr("src");
        });

        $(".open_pop").click(function(){
            lam_id = $(this).data("id");
            var id = ".popup"+lam_id;
            $(id).show();
        })

        $(".savelam").click(function(){
            var id = $(this).data("saveid");
            $.ajax({
                url: base_url+"save_laminate",
                type: "POST",
                crossDomain: true,
                data: {lid: id, token: token, page_id: "catalogue-selector.html"},
                success: function(response){
                    // greenlam_mirza/www
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

        $('.og-close').click(function() {
            console.log('hola');
            $('.og-expander').hide();
            $('.open_pop').removeClass('active-box1');
            $('.brd').removeClass('active-box');
            $('.heart_empty').css("visibility" , "hidden");
        });

        $(".getlam").click(function(){
            var id = $(this).data("getid");
            console.log(Lockr.get("token"));
            $.ajax({
                url: base_url+"get_laminate",
                type: "POST",
                crossDomain: true,
                data: {lid: id, token: token, page_id: "quote.html"},
                success: function(response){
                    var obj = JSON.parse(response);
                    console.log(obj);
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
    });
    
    $('.edge').click(function(){
        $('.edge').removeClass('active-laminate');
        $(this).addClass('active-laminate');
    });

    $('.frst').click(function(){
        $('.heart').css("visibility" , "hidden");
        $(this).find('.heart').css("visibility" , "visible");
        edge_id = $(this).data("edgeid");
        edge_img = $(this).children().attr("src");
    });

    $(".edgelaminate").click(function(){
        if (edge_id) {
            mainView.router.loadPage('quote.html');
        } else {
            myApp.alert("Please Select Edgeband", "ALERT");
        }
    })
})

myApp.onPageInit('myselections', function(page){
    mainView.showNavbar();
    $.ajax({
        url: base_url+'quote_laminates',
        type: 'POST',
        dataType: 'JSON',
        crossDomain: true,
        data: {token: token, page_id: 'myselections.html'},
        async: false,
    })
    .done(function(response){
        console.log(response);
        if (response.msg == "LOGIN") {
            // page_id = response.page_id;
            // myApp.confirm(
            //     'Please login to proceed', 
            //     'Warn',
            //     function(){
            //         mainView.router.loadPage('login.html');
            //     },
            //     function(){
            //         mainView.router.loadPage('index.html');
            //     }
            // );
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
                        '<a href=""><span class="fa fa-share-alt"></span> Share</a>'+
                        '</div>'+
                        '</div>';
            })
            $("#myselections").html(html);
        }
    })
    .fail(function(){
        console.log("error");
    })
    .always(function(){
        console.log("complete");
    })
});


myApp.onPageInit('saved', function(page){
    mainView.showNavbar();
     $('#idname').text('Saved');
    console.log('token: '+token);
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
                // myApp.confirm(
                //     'Please login to proceed', 
                //     'Warn',
                //     function(){
                //         mainView.router.loadPage('login.html');
                //     },
                //     function(){
                //         mainView.router.loadPage('index.html');
                //     }
                // );
            var html = "<p style='width: 100%; font-size: 1.2em; text-align: center;'>You do not Saved Laminates</p>";
            $("#saved_data").html(html);
        } else {
            $.each(response.data, function(index, val){
                html += '<div class="sel-block">'+
                            '<div class="sel-color" style="background-image: url('+img_url+val.image+');"></div>'+
                            '<div class="sel-title">'+val.hex_color+'</div>'+
                            '<div class="sel-desc">'+val.description+'</div>'+
                            '<div class="sel-actions">'+
                            '<a href=""><span class="fa fa-share-alt"></span> Share</a>'+
                            '<a style="float:right;" href=""><span class="fa fa-check-circle-o"></span> Get this</a>'+
                            '</div>'+
                            '</div>';
            })
            $("#saved_data").html(html);
        }
    })
    .fail(function(data) {
         console.log('fail: '+JSON.stringify(data));
    });

    
    // $.ajax({
    //     url: base_url+'saved_laminates',
    //     type: 'POST',
    //     // dataType: 'JSON',
    //     data: {'token': token, 'page_id': 'saved.html'},
    //     // async: false,
    // })
    // .done(function(response){
    //     console.log(response);
    //     if (response.msg == "LOGIN") {
    //         page_id = response.page_id;
    //         console.log(page_id);
    //             myApp.confirm(
    //                 'Please login to proceed', 
    //                 'Warn',
    //                 function(){
    //                     mainView.router.loadPage('login.html');
    //                 },
    //                 function(){
    //                     mainView.router.loadPage('index.html');
    //                 }
    //             );
    //         // mainView.router.loadPage({url: 'login.html'});
    //     } else {
    //         console.log('Sucess in saved');
    //         $.each(response.data, function(index, val){
    //             console.log(val);
    //             var html = '<div class="sel-block">'+
    //                         '<div class="sel-color" style="background: #ae9376;"></div>'+
    //                         '<div class="sel-title">BBC124</div>'+
    //                         '<div class="sel-desc">It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.</div>'+
    //                         '<div class="sel-actions">'+
    //                         '<a href=""><span class="fa fa-share-alt"></span> Share</a>'+
    //                         '<a style="float:right;" href=""><span class="fa fa-check-circle-o"></span> Get this</a>'+
    //                         '</div>'+
    //                         '</div>';
    //         })
    //         $("#saved_data").html(html);
    //     }
    // })
    // .fail(function(){
    //     console.log('fail');
    // })
    // .always(function(){
    //     console.log('always')
    // })
});

// myApp.onPageInit('login', function (page) {
    // $(".fb_login").click(function(){
        // console.log('Success');
        // openFB.login(function (response){
        //     console.log(response);
        //     if(response.status === 'connected') {
        //         alert('Facebook login succeeded, got access token: ' + response.authResponse.token);
        //     } else {
        //         alert('Facebook login failed: ' + response.error);
        //     }
        // });
        // openFB.login('email',
        //     function() {
        //         console.log('Facebook login succeeded');
        //         // get_info();
        //     },
        //     function() {
        //         console.log('Facebook login failed');
        //     });
    // });
// });

//check if user is already logged in
$(window).ready(function(){
    
    // var login_token = Lockr.get('login_token');

    // // if token does not exist, do not check. Redirect to login page directly.
    // if (typeof login_token == 'undefined'){
    //     myApp.closeModal('.loading-screen');
    //     mainView.router.loadPage('login.html');
    //     return false;
    // }
 
});



// var dynamicPageIndex = 0;
// function createContentPage() {

//     $.ajax({
//         type: "GET",
//         url: base_url+'api/get_dynamic_page',
//         crossDomain:true,
//         success: function(data){
//             mainView.router.loadContent(data);
//         }
//     })
// }

// function register(){
//     var formData = myApp.formToJSON('#register-form');
//     // console.log(formData);

//     // myApp.popup('.loading-screen');

//     $.ajax({
//         url: base_url+'api/register',
//         type: 'POST',
//         crossDomain:true,
//         data: formData,
//         success: function(data){
//             // console.log(data);
//             myApp.closeModal('.loading-screen');
//             mainView.router.loadPage('login.html');
//         }
//     })
// }

function rgbToHex(color) {
    var bg = color.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
    function hex(x) {
      return ("0" + parseInt(x).toString(16)).slice(-2);
    }
    return     "#" + hex(bg[1]) + hex(bg[2]) + hex(bg[3]);
}

function getRandomColor() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}