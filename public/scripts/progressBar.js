let category = document.querySelectorAll('.cat-tracker')
let progressBar = document.querySelectorAll('.prog-bar')
let progress = document.querySelectorAll('.percent-complete')

for (let i = 0; i < category.length; i++) {
    w = parseInt(progress[i].innerText)
    progressBar[i].setAttribute('style', `background-image: linear-gradient(90deg, #cbe1ff ${w}%, white ${w}%)!important`)
    if (w >= 100) {
        progressBar[i].style.width = `100%`
        progressBar[i].setAttribute('style', `background-image: linear-gradient(90deg, #F07470 25%, #DC1C13 100%)!important`)
    }
}