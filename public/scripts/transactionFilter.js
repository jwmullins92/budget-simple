const category = document.querySelector('#category');
const trs = document.querySelector('#trs')
const date = document.querySelector('#date')

const filter = (category, date) => {
    const children = trs.children
    for (let child of children) {
        child.classList.add('hide')
        child.classList.remove('d-flex')
        child.classList.remove('list-group-item')
        if (!category.value && !date.value) {
            child.classList.remove('hide')
            child.classList.add('d-flex')
            child.classList.add('list-group-item')
            continue
        }
        if (child.innerText.includes(category.value) && parseInt(date.value) === parseInt(child.children[1].innerText)) {
            child.classList.remove('hide')
            child.classList.add('d-flex')
            child.classList.add('list-group-item')
            continue
        }
        if (child.innerText.includes(category.value) && !date.value) {
            child.classList.remove('hide')
            child.classList.add('d-flex')
            child.classList.add('list-group-item')
        }
    }
}

category.addEventListener('change', (event) => {
    filter(category, date)
})

date.addEventListener('change', (event) => {
    filter(category, date)
})