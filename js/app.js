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

    $("#save-step-2").on('click', function() {
        // TODO: Save list to JSON data
        var $list_num = $('#list-num').val();

        var $listName1 = $('#listName1').val()
        var $list1 = $('#list1').val()

        console.log($listName1);
        console.log($list1);

        var $list_array_1 =  $list1.split("\n");
        console.log("2nd Item is " + $list_array_1[1]);
    });
});


/******************** Functions *************************/

function showList(list_num){
    console.log("Num of lists " + list_num);
    switch(list_num) {            
        case "6":
            $('#list-group-5').css('display', 'block');
            console.log("Goes in 5");            
        case "5":
            $('#list-group-5').css('display', 'block');
            console.log("Goes in 5");            
        case "4":
            $('#list-group-4').css('display', 'block');
            console.log("Goes in 4");            
        case "3":
            $('#list-group-3').css('display', 'block');
            console.log("Goes in 3");            
        case "2":
            $('#list-group-2').css('display', 'block');
            console.log("Goes in 2");
            break;
    }
}

function hideLists(list_num) {
   console.log("hide attempt ...");
    $("div[id^='list-group-']").each(function() {
        $(this).css('display', 'none');
        console.log("hide ..");
    });  
}

function nextTab(elem) {
    $(elem).next().find('a[data-toggle="tab"]').click();
}
function prevTab(elem) {
    $(elem).prev().find('a[data-toggle="tab"]').click();
}