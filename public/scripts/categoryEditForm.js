// Shows and hides input fields depending on the answer to "fixed or flexible" on category new/edit forms

const formFunction = () => {
    const fixed = document.querySelector("#fixed")
    const cancel = document.querySelector("#cancel")
    const payDate = document.querySelector("#pay-date")
    fixed.addEventListener('change', (event) => {
        if (fixed.value === "true") {
            cancel.classList.remove('hide')
            payDate.classList.remove('hide')
        } else {
            cancel.classList.add('hide')
            payDate.classList.add('hide')
        }
    })

    document.querySelector('#confirm').addEventListener('click', (e) => {
        document.querySelector('#edit-category').submit()
    })
}