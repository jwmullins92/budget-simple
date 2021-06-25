// Adds fixed or flexible descriptor to transactions

const transactionFixedFlexPicker = () => {
    const category = document.querySelector('#category')
    const fixed = document.querySelector('#isFixed')
    const flexible = document.querySelector('#flexible')
    category.addEventListener('change', (e) => {
        for (let child of category.children) {
            if (child.selected === true && child.getAttribute('class') === 'fixed') {
                fixed.click()
                break
            } else {
                flexible.click()
            }
        }
    })
}