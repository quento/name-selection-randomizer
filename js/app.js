$(document).ready(function () {
    //Initialize tooltips
    $('.nav-tabs > li a[title]').tooltip();
    
    //Wizard
    $('a[data-toggle="tab"]').on('show.bs.tab', function (e) {
        var $target = $(e.target);    
        if ($target.parent().hasClass('disabled')) {
            return false;
        }
    });


    $(".next-step").click(function (e) {
        var $active = $('.wizard .nav-tabs li.active');
        $active.next().removeClass('disabled');
        nextTab($active);
    });

    $(".prev-step").click(function (e) {
        var $active = $('.wizard .nav-tabs li.active');
        prevTab($active);
    });

    // Determine # of list boxes to show based on selection.
    $("#save-step-1").on('click', function(){
        var $list_num = $('#list-num').val();
        hideLists($list_num);
        if ($list_num > 1)        
            showList($list_num);
    });

    // List is globally accessable
    var $lists_obj_array = [];
    var canvas, ctx;

    $("#save-step-2").on('click', function() {
        
        // TODO: Save list to JSON data
        var $list_num = $('#list-num').val();
        
        // console.log("Array Length before " + $lists_obj_array.length);
        // Use list length as array length
        // Save list and title as single item in multidimensional array.
        for(var i = 0; i <= $list_num-1; i++) {
            var num = i + 1;
            $lists_obj_array[i] = {
                "number": num,
                "listname": $('#listName' + num).val(),
                "list": [ 
                    CreateListArray($('#list' + num).val())//.split("\n")
                ],
            };     
            
        }

        // TROUBLESHOOTING - Look at the array
        // console.log("Num items " + $list_num);
        // console.log("Array Length after " + $lists_obj_array.length);
        // console.log($lists_obj_array);
        // $.each($lists_obj_array,function(index, value){
        //     console.log(index + " - " + value);
        // });

        // Save to file
        //SaveData($lists_obj_array);

        // Populate randomizer form
        PopulateRandomizerFields($lists_obj_array);
        
        //addTextToCanvas($lists_obj_array);       
    });

    $("#save-step-3").on('click', function(){
        
        // Run marquee to scroll list
        var list1anim = setTimeout(function(){
            scrollList("displayList1");
        }, 500);
        //scrollList("displayList2");

        // Randomly select winner by picking random index value
        var list_array = $lists_obj_array[0].list[0]
        var winner_index = Math.floor(Math.random() * list_array.length);
        var random_winner = list_array[winner_index];
        
        console.log($lists_obj_array[0].list[0]);
        console.log("Random winnner " + random_winner);

        // Pop selected from list
        list_array.splice(winner_index, 1);
        
        console.log(list_array);
        // After 6 seconds, Show winner, Use setInterval
        setTimeout(function(){
            $('#list1-winners').html(random_winner);
        }, 6000);
        
        // Stop marquee

        // Reload list minus winner
              
        
    });
    
    $('#prev-step-3').on('click', function(){
        
        $("#play_spin_sound")[0].pause();
        $("#play_spin_sound").currentTime = 0;

        $('.marquee').marquee('pause');
    });
});


/******************** Functions *************************/

function PopulateRandomizerFields(lists_obj_array) {
    console.log("Data to pop " + lists_obj_array);

    for(var i = 0; i <= lists_obj_array.length-1; i++) {
        var listNumber = lists_obj_array[i].number;
        console.log("number = " + lists_obj_array[i].number);
        console.log("listname = " + lists_obj_array[i].listname);
        console.log("list = " + lists_obj_array[i].list.join("~"));
        // populate list views
        $('#displayName' + listNumber).html(lists_obj_array[i].listname);
        //$('#displayList' + listNumber).html(lists_obj_array[i].list.join("\n"));
        // Get the list from select box in step 1.
        $('#displayList' + listNumber).html($('#list' + listNumber).val().replace(/(?:\r\n|\r|\n)/g,"<br>"));        
    }
    runRandomizer(lists_obj_array);
}

function RunTextTopToBottom() {
    step++;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(canvas.width / 2, step);
    ctx.fillText("John Doe", 0, 0);
    ctx.fillText("Peter Pan", 0, 30);
    ctx.fillText("Jane Jax", 0, 60);
    ctx.fillText("Paul Young", 0, 90);
    ctx.fillText("Matt Old", 0, 120);
    ctx.restore();
    if (step == steps)
        step = 0;
    if (step < steps)
        var t = setTimeout('RunTextTopToBottom()', 15);
}

function addTextToCanvas(lists_obj_array){    
    var item_num;

    for(var j = 0; j <= lists_obj_array.length-1; j++){     
        var line_spacing = 35; 
        // change number from zero based to work with content ids.
        item_num = j + 1;
        // Create the canvas object
        canvas = document.getElementById("displayList" + item_num);
        //console.log(canvas);
        ctx = canvas.getContext("2d");
        
        // Display the list name
        $('#displayName' + item_num).html(lists_obj_array[j].listname);

        // Basic text settings
        //ctx.textBasline = "top";
        
        //ctx.font = '34px "Segoe UI"';
        //ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
        ctx.fillStyle = "blue";
        ctx.font = "20pt Verdana";
        //ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        step = 0;
        steps = canvas.height + 10;
        
        for(var i = 0; i <= lists_obj_array[j].list[0].length-1; i++){            
            ctx.fillText(lists_obj_array[j].list[0][i], 0, line_spacing);
            line_spacing += 35;
        }
        //RunTextTopToBottom(); 
               
    }      
}



function runRandomizer(lists_obj_array){
   // Make canvas scroll, fast then slow

   // Randomly Select item from array

   // Pop selected item from array

   // Update the canvas list displayed
}

function scrollList(element_name) {
    // Speed up marquee
    $('#' + element_name)
    .bind('beforeStarting', function(){
        // play spinning wheel audio
        $("#play_spin_sound")[0].play();
    })
    .bind('finished', function(){
        // play winner found audio
        $("#play_winner_sound")[0].play();
    })
    .marquee({ 
        duration: 500,
        speed:850,
        //gap: 50,
        delayBeforeStart: 0,        
        direction: 'down',        
        duplicated: false,
        //startVisible: true,                
    });
}

function CreateListArray(list_txt){
    list_txt = $.trim(list_txt);
    return list_txt.split("\n");
}

function SaveData(lists_array){
        
    console.log("In saveDate" + JSON.stringify(lists_array));
    // Save to file via ajax
    $.ajax({
        contentType: "application/json",
        dataType: "json",
        type: "POST",
        url: "save.php",
        data: JSON.stringify(lists_array)
    })
    .done(function(data){
        console.log("Ajax success!" + data);
    })
    .fail(function(data) {
        console.log("Ajax failed!\n" + JSON.stringify(data));
    }).always(function(){
        console.log("Ajax complete!");
    });    
}
function showList(list_num){    
    switch(list_num) {            
        case "6":
            $('#list-group-6').css('display', 'block');
            $('#display-list-group-6').css('display', 'block');                
        case "5":
            $('#list-group-5').css('display', 'block');
            $('#display-list-group-5').css('display', 'block');                    
        case "4":
            $('#list-group-4').css('display', 'block');
            $('#display-list-group-4').css('display', 'block');                     
        case "3":
            $('#list-group-3').css('display', 'block');
            $('#display-list-group-3').css('display', 'block');                      
        case "2":
            $('#list-group-2').css('display', 'block');
            $('#display-list-group-2').css('display', 'block');            
            break;
    }
}

function hideLists(list_num) {   
    $("div[id^='list-group-']").each(function() {
        $(this).css('display', 'none');        
    }); 
    $("div[id^='display-list-group-']").each(function() {
        $(this).css('display', 'none');        
    });  
}

function nextTab(elem) {
    $(elem).next().find('a[data-toggle="tab"]').click();
}
function prevTab(elem) {
    $(elem).prev().find('a[data-toggle="tab"]').click();
}