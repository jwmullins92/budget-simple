const alternate = (lastColSecondRow) => {
    let cells = [...document.querySelectorAll('.alt')]
    altRows = []
    for (let i = 0; i < cells.length; i++) {
        if (cells.indexOf(cells[i]) % lastColSecondRow === 0) {
            row = cells.slice(i, i + lastColSecondRow / 2)
            altRows.push(row)
        }
    }
    for (let row of altRows) {
        for (let cell of row) {
            cell.classList.remove('table-alt')
        }
    }

}

