// Makes progess bar on the dashboard fill to the appropriate amount

let category = document.querySelectorAll('.cat-tracker')
let progressBar = document.querySelectorAll('.prog-bar')
let progress = document.querySelectorAll('.percent-complete')

for (let i = 0; i < category.length; i++) {
    w = parseInt(progress[i].innerText)
    progressBar[i].setAttribute('style', `background-image: linear-gradient(90deg, #198754 ${w}%, white ${w}%)!important`) // progress bar color if less than 100% (green)
    if (w === 100) {
        progressBar[i].style.width = `100%`
        progressBar[i].setAttribute('style', `background-image: linear-gradient(90deg, #ffc107 0%, #ffc107 100%)!important`) // progress bar color if exactly 100% (yellow)
    }
    if (w > 100) {
        progressBar[i].style.width = `100%`
        progressBar[i].setAttribute('style', `background-image: linear-gradient(90deg, #DC1C13 0%, #DC1C13 100%)!important`) // progress bar color if greater than 100% (red)
    }
}