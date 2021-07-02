// Dynamically shows how much money can still be budgeted on the new or edit budget pages

const amounts = document.querySelectorAll('.budget-input')
const budgetTotal = document.querySelector('#amount')
const budgetRemaining = document.querySelector('#remaining')

const findRemaining = () => {
    total = 0
    for (let a of amounts) {
        if (a.value) {
            total = total + parseInt(a.value)
        }
    }
    return parseInt(budgetTotal.value) - total
}

const renderRemaining = (remaining) => {
    if (remaining > 0) {
        budgetRemaining.classList.add('text-success')
        budgetRemaining.classList.remove('text-danger')
    } else {
        budgetRemaining.classList.add('text-danger')
        budgetRemaining.classList.remove('text-success')
    }
}

budgetRemaining.value = findRemaining()
renderRemaining(budgetRemaining.value)

budgetTotal.addEventListener('keyup', (e) => {
    budgetRemaining.value = findRemaining()
    renderRemaining(budgetRemaining.value)
})

for (let a of amounts) {
    a.addEventListener('keyup', (e) => {
        budgetRemaining.value = findRemaining()
        renderRemaining(budgetRemaining.value)
    })
}