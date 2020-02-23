const buildList = function () {
    // removing any pre-existing list
    let left = document.querySelector('#left')
    if (left != null) {
        let leftChildren = document.querySelector('#left').children
        for (let i = 0; i < leftChildren.length; i++) {
            if (leftChildren[i].nodeName == "UL") {
                leftChildren[i].parentElement.removeChild(leftChildren[i])
            }
        }
    }
    // building list
    // $.get("/getAllIds", function (data, status) {
    $.get("/usersData", function (data, status) {
        console.log("DATA >>>>> " + data.length)
        let ul = document.createElement('ul')
        ul.setAttribute("id", "notesBox")

        for (let i = data.length - 1; i >= 0; i--) {
            let li = document.createElement('li')
            let button = document.createElement('button')
            let icon = document.createElement('i')
            icon.setAttribute('class', 'fa fa-trash')

            button.setAttribute('class', 'delete')
            li.innerHTML = data[i].title
            button.appendChild(icon)
            li.appendChild(button);
            button.addEventListener('click', function (e) {
                e.stopPropagation();
                removeNote(data[i]._id)
            })
            ul.appendChild(li)

            let left = document.querySelector('#left')
            if (left != null)
                left.insertAdjacentElement("beforeend", ul)

            // li on-click
            li.addEventListener('click', function () {
                buildReadMode(data[i].body)
            })
        }
    })
}

const removeNote = function (id) {
    $.get('/removeNote/' + id)
    buildList()
    clearRight()
}

const clearRight = function () {
    let box = document.querySelector('#outerBox')
    while (box.firstChild) {
        box.removeChild(box.firstChild)
    }
}

const clearScreen = function () {
    const button = document.querySelector('#addNotes')
    let nextElement = button.nextElementSibling
    let span = nextElement.nextElementSibling

    if (nextElement != null && nextElement.nodeName == 'INPUT') {
        nextElement.parentElement.removeChild(nextElement)
    }

    if (span != null && span.nodeName == 'SPAN') {
        span.parentElement.removeChild(span)
    }

    let box = document.querySelector('#outerBox')
    while (box.firstChild) {
        box.removeChild(box.firstChild)
    }
}

const submit = function () {
    let title = $('#addition').val()
    let body = $('#textArea').val()

    if (title !== undefined && body.length !== 0) {
        // $.post("/",
        //     {
        //         title: title,
        //         body: body,
        //     });
        $.post('/saveNotes', {
            title: title,
            body: body
        }).done(function () {
            clearScreen()
            buildRight()
            buildList()
        })

    }
}

const buildRight = function () {
    // build text area
    let box = document.querySelector('#outerBox')
    let textarea = document.createElement('textarea')
    let button = document.createElement('input')

    while (box.firstChild) {
        box.removeChild(box.firstChild)
    }

    textarea.setAttribute("id", "textArea")
    textarea.setAttribute("name", "area2")
    textarea.setAttribute("placeholder", "Enter here.....")

    button.setAttribute("class", "button")
    button.setAttribute("id", "submit")
    button.setAttribute("type", "button")
    button.setAttribute("value", "Save")

    button.addEventListener('click', submit)
    box.appendChild(textarea)
    box.appendChild(button)
}

const buildReadMode = function (data) {
    let box = document.querySelector('#outerBox')
    // console.log("!!!! " + box.firstChild)
    clearScreen()
    while (box.firstChild) {
        box.removeChild(box.firstChild)
    }

    text = document.createElement('p')
    text.setAttribute('class', 'body')
    text.innerHTML = data
    box.appendChild(text)
    // text.innerH
}
