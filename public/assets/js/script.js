// save task on click
const submitBtn = document.querySelector("#createTodo");
submitBtn.addEventListener("submit", function (event) {
    event.preventDefault();

    const input = document.querySelector("#createTodo [name=todo]").value.trim();
    let newTodo = { todo: input };

    $.ajax("/api/tasks", {
        type: "POST",
        data: newTodo
    }).then(
        function () {
            location.reload();
        }
    )
})


// determine whether header is off or on based on content of task array
const header = () => {
    $.ajax("/api/headers", {
        type: "GET",
    }).then(
        function (res) {
            if (res.complete[0]) {
                document.querySelector(".complete").classList.remove("d-none");
            }
            if (!res.complete[0]) {
                document.querySelector(".complete").classList.add("d-none");
            }
            if (res.incomplete[0]) {
                document.querySelector(".incomplete").classList.remove("d-none");
            }
            if (!res.incomplete[0]) {
                document.querySelector(".incomplete").classList.add("d-none");
            }
        }
    );
}
header();


// Done! button updates status of tasks
let done = document.querySelectorAll(".doneTodo");
for (i = 0; i < done.length; i++) {
    // loop through all Done! buttons and create an event listener
    done[i].addEventListener("click", function (event) {
        event.preventDefault();
        // get the id of the button that triggered the click
        let id = event.currentTarget.id

        $.ajax("/api/tasks/" + id, {
            type: "PUT",
        }).then(
            function() {
                location.reload();
            }
        )
    })
}


const deleteBtn = document.querySelector("#delete");
deleteBtn.addEventListener("submit", function(event) {
    event.preventDefault();

    $.ajax("/api/tasks", {
        type: "DELETE"
    }).then(
        function() {
            location.reload();
        }
    )
});