var addNewTask = function() {
    var newTask = $('input').val();
    $('.item_list').append('<div class="item">' + newTask + '</div>');
    $('input').val("");
}
