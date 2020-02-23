document.addEventListener('DOMContentLoaded', function () {
    // buildList()

    let path = $(location).attr('pathname')


    if (path == '/add') buildList()

    $("#addNotes").on('click', function () {
        buildRight()
        let input = document.createElement('input')
        input.setAttribute("type", "text")
        input.setAttribute("class", "newInputClass")
        input.setAttribute("id", "addition")
        input.setAttribute("placeholder", "Enter title")
        input.setAttribute("autocomplete", "off")

        let button = document.querySelector('#addNotes')

        let afterElement = button.nextElementSibling
        if (afterElement === null || afterElement.nodeName === "UL") {
            document.querySelector('#addNotes').insertAdjacentElement("afterend", input)
            let span = document.createElement('span')
            span.setAttribute('class', 'breaker')
            input.insertAdjacentElement("afterend", span)
        }
    })
})
