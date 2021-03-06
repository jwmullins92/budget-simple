// Gives functionality to the fixed and flex tables to allow editing a single cell

const allowEditCells = () => {
    const editButton = [...document.querySelectorAll('.edit-amount')]
    const amount = [...document.querySelectorAll('.form-div')]
    const form = [...document.querySelectorAll('.amount-form')]
    for (let b of editButton) {
        b.addEventListener('click', (e) => {
            if (editButton.indexOf(b)) {
                let index = editButton.indexOf(b)
                amount[index].children[0].classList.toggle('hide')
                amount[index].children[1].classList.toggle('hide')
                amount[index].children[1].children[0].children[3 * index + 1].classList.toggle('hide')
                amount[index].children[1].children[0].children[3 * index + 2].classList.toggle('hide')
            } else {
                let index = 0
                amount[index].children[0].classList.toggle('hide')
                amount[index].children[1].classList.toggle('hide')
                amount[index].children[1].children[0].children[3 * index + 1].classList.toggle('hide')
                amount[index].children[1].children[0].children[3 * index + 2].classList.toggle('hide')
            }
            b.classList.toggle('bi-check-lg')
            b.classList.toggle('text-danger')
            b.classList.toggle('bi-x-lg')
        })
    }
}