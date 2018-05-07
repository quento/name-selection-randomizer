$(document).ready(function () {
    "use strict";

    //Initialize tooltips
    $('.nav-tabs > li a[title]').tooltip();
    
    /************************** Wizard Behavior  **************************/
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
    
    
    /***********************************************************************/
    /************************** Name Randomizer  ***************************/
    /***********************************************************************/

    // Container to hold list objects
    var $lists_obj_array = [];
    // Individual lists used per session
    var $list1 = [],
        $list2 = [], 
        $list3 = [], 
        $list4 = [], 
        $list5 = [], 
        $list6 = []; 

    /************* Step 1 - Select Number of Lists ****************************/    
    $("#save-step-1").on('click', function(){
        var $list_num = $('#list-num').val();
        hideLists($list_num);
        if ($list_num > 1)        
            showList($list_num);
    });

    /************* Step 2 - Add Lists ****************************/
    $("#save-step-2").on('click', function() {
        
        // Save Step 1 Number of lists
        var $list_num = $('#list-num').val();
        
        // Save number, list and title as an object
        $lists_obj_array = createListObjectsArray($list_num);

        // Populate randomizer form
        PopulateRandomizerFields($lists_obj_array);
          
    });

    /************* Step 3 - Run Randomizer ***********************/
    $("#save-step-3").on('click', function(){
        var startScroll;
        var current_list = [];
        var winner_random_index = 0;
        var random_winner,
            unique_list,
            winner_timeout_array = [],
            current_num = 0,
            showWin = [];
            
        // Run marquee to scroll list
        startScroll = setTimeout(function(){ 
                // Start scroll for all available items
                for(var i = 1; i <= $lists_obj_array.length; i++) {
                    scrollList("displayList" + i); 
                }
            }, 
            500);
        
        $("#play_spin_sound")[0].play();
    
        for(var i = 1; i <= $lists_obj_array.length; i++) {            
            current_list = $lists_obj_array[i-1].list[0];
            current_num = $lists_obj_array[i-1].number;
            winner_random_index = Math.floor(Math.random() * current_list.length);
            random_winner = current_list[winner_random_index];
            
            // Remove winner from the list
            current_list.splice(winner_random_index, 1);
            
            winner_timeout_array[i] = setTimeout(function(){
                    console.log("setTimeout occurring => " + i);
                    // Stop all marquee
                    $("#step3 [id^='displayList'").marquee('pause');
                    
                    //Play winner sound
                    $("#play_winner_sound")[0].play();
        
                    // Display winner                     
                    showWin[i] = showWinner("#displayList" + current_num, "<h3>" + random_winner + "</h3>");
                    
                    $('#list' + current_num + '-winners').append(random_winner + "<br>");

                },6500);  
                
                
            // TROUBLESHOOTING - Test loop values
            console.log(i + " Random winnner " + random_winner);
            console.log("Winner removed from list" + current_list);            
        }
        //console.log(winner_timeout_array);
        
    });
    
    $('#prev-step-3').on('click', function(){
        
        $("#play_spin_sound")[0].pause();
        $("#play_spin_sound").currentTime = 0;

        $('.marquee').marquee('pause');
    });
});


/******************** Functions *************************/

function createListObjectsArray($list_num){
    var _list_obj_array = [],
        num;

    for(var i = 0; i <= $list_num-1; i++) {
        num = i + 1;
        
        _list_obj_array[i] = {
            "number": num,
            "listname": $('#listName' + num).val(),
            "list": [ 
                CreateListArray($('#list' + num).val())//.split("\n")
            ],
        };     
        
    }
    return _list_obj_array;
}

function PopulateRandomizerFields(lists_obj_array) {
    console.log("Data to pop: ");
    console.log(lists_obj_array);

    for(var i = 0; i <= lists_obj_array.length-1; i++) {
        var listNumber = lists_obj_array[i].number;
        //console.log("number = " + lists_obj_array[i].number);
        //console.log("listname = " + lists_obj_array[i].listname);
        //console.log("list = " + lists_obj_array[i].list);
        // populate list views
        $('#displayName' + listNumber).html(lists_obj_array[i].listname);
        //$('#displayList' + listNumber).html(lists_obj_array[i].list.join("\n"));
        // Get the list from select box in step 1.
        $('#displayList' + listNumber).html($('#list' + listNumber).val().replace(/(?:\r\n|\r|\n)/g,"<br>"));        
    }
    
}

function showWinner(containerID, msg_text){
    //console.log("Container ID " + containerID);
    $('<div class="winner">' + msg_text + '</div>').css({
        position: "absolute",
        width: "100%",
        height: "100%",
        top: 0,
        left: 0,
        background: "yellow",
        padding: "35px 0",
    }).appendTo($(containerID).css("position", "relative"));
    
    // Remove winner display after 3 seconds
    var hide_winner = setTimeout(function(){
        $(containerID + " .winner").slideUp();   
        // Show winner box
        $(containerID).siblings(".winner-container").slideDown();     
    }, 3000);

}

function scrollList(element_name) {
    // Speed up marquee
    $('#' + element_name)    
    .marquee({ 
        //duration: 3500,
        speed:650,
        //gap: 0,
        delayBeforeStart: 0,        
        direction: 'up',        
        duplicated: true,
        startVisible: true,                
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