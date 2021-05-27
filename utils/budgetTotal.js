const totaler = (nums) => {
    let total = 0;
    for (let num of nums) {
        total += num.amount
    } return total
}

module.exports = totaler