const submitBtn = document.querySelector("#createTodo");
submitBtn.addEventListener("submit", function (event) {
    event.preventDefault();
    // WHAT IS HAPPENING HERE AND HOW DO I WRITE THIS IN JAVASCRIPT INSTEAD OF JQUERY?
    let newTodo = {
        todo: $("#createTodo [name=todo]").val().trim()
    };

    $.ajax("/api/tasks", {
        type: "POST",
        data: newTodo
    }).then(
        function () {
            console.log("new task created");
            location.reload();
        }
    )
})

