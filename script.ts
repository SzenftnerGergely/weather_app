const wrapper = document.getElementById("wrapper") as HTMLElement
const inputPart = document.getElementById("input-part")as HTMLElement
const infoTxt = document.getElementById("info-text")as HTMLElement
let searchInput = document.getElementById("input-city") as HTMLInputElement 
const locationBtn = document.getElementById("location-btn") as HTMLElement
const wIcon = document.getElementById("weather-part-img") as HTMLImageElement
const arrowBack = document.getElementById("arrow-back") as HTMLElement
let url:string

const searchWrapper = document.querySelector(".autocomplete-search-box") as HTMLElement
const resultsWrapper = document.querySelector(".results") as HTMLElement
 
let searchable:string[] = []
fetch('city.list.json')
    .then((response) => response.json())
    .then(data => {
        for(let i = 0; i< data.length; i++){
            searchable.push(data[i].name)
        }

    })
searchable = searchable.sort()

searchInput.addEventListener("keyup", () => {
    let results:string[] = []
    let input = searchInput.value
    if(input.length > 2){
        results = searchable.filter((item:string) => {
            if(item[0].toLowerCase() == input[0].toLowerCase() ){
                if(item.toLowerCase().includes(input.toLowerCase())){
                    return item.toLowerCase()
                }
            }
        })
    }
     renderResults(results)
    })

function renderResults(results:string[]) {
    if(results.length < 2){
        return searchWrapper.classList.remove("show")
    }

    let content = results
        .map((item) => {
        return `<li><a class"a-tag" href="#">${item}</a></li>`
    })
    .join("")

    searchWrapper.classList.add("show")
    resultsWrapper.innerHTML = `<ul>${content}</ul>`
} 


searchInput.addEventListener("keyup", function(event) {
    const target = event.target as HTMLInputElement
    if(event.key == "Enter" && target.value !== "") {
        requestAPi(target.value)
    }
})

locationBtn.addEventListener("click", () => {
    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(onSuccess, onError)
    } else {
        alert("Your browser does not support geolocation api")
    }
})

arrowBack.addEventListener("click", () => {
    wrapper.classList.remove("active")
})

const onSuccess = (position: any) => {
    const{latitude, longitude} = position.coords
    url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=9804707eddf44dbc8fc4327e1340f4e8`
    fetchData()
}

const onError = (error: any) => {
    infoTxt.innerText = error.message
    infoTxt.classList.add("error")
}

const requestAPi = (city: string) => {
    url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=9804707eddf44dbc8fc4327e1340f4e8`
    fetchData()
}

const fetchData = () => {
    infoTxt.innerText = "Getting weather details..." 
    infoTxt.classList.add("pending")

    fetch(url).
    then(response => response.json()).
    then(result => weatherDetails(result))
}

const IMAGE_URLS:Record<string, string> = {
    sunny: "https://www.sommerwhitemd.com/wp-content/uploads/2020/03/sunshine_305095987-scaled.jpeg",
    cloudy: "https://www.metoffice.gov.uk/binaries/content/gallery/metofficegovuk/hero-images/weather/cloud/crepuscular-rays-around-cumulus-cloud.jpg",
    rainy: "https://destinationgoldcoast.stylelabs.cloud/api/public/content/98b9aa3b14374f36a30ecc0378f24d11?v=f68cb960",
    hazey: "https://nats.aero/blog/wp-content/uploads/2016/03/Fog-at-London-Luton-Airport-e1471884173900.jpg",
    snowy: "https://nsidc.org/sites/default/files/images/adam-chang-IWenq-4JHqo-unsplash.jpg",
    stormy: "https://earth.stanford.edu/sites/default/files/styles/responsive_large/public/media/image/2021-09/SupercellStorms2%20hero.jpeg?itok=ngvlbBJm"
}
const setBackground = (image:string) => {
    document.body.style.background = `url(${IMAGE_URLS[image]}) center, no-repeat`
}

const weatherDetails = (info: any) => {  
    if(info.cod == "404") {
        infoTxt.classList.replace("pending", "error")
        infoTxt.innerText = `${searchInput.value} is not a valid city name`
    } else {
        const city = info.name
        const country = info.sys.country
        let {description, id} = info.weather[0]
        const {feels_like, humidity, temp} = info.main

        if(id == 800) {
            wIcon.src = "https://media.tenor.com/f0Aj3B7lzZ0AAAAM/monkey-chill-monkey.gif"
            description = "Csudijó idő"
            setBackground('sunny')
        } else if(id >= 200 && id <= 232) {
            wIcon.src = "https://thumbs.gfycat.com/ConcernedWateryAmmonite-max-1mb.gif"
            description = "Fúúúúúj, villám"
            setBackground('stormy')
        } else if(id >= 600 && id <= 622) {
            wIcon.src = "https://www.icegif.com/wp-content/uploads/winter-icegif-18.gif"
            description = "Nyáron hó??"
            setBackground('snowy')
        } else if(id >= 701 && id <= 781) {
            wIcon.src = "https://legendary-digital-network-assets.s3.amazonaws.com/wp-content/uploads/2018/10/13021021/giphy.gif"
            description = "Jó nagy fene köd"
            setBackground('hazey')
        } else if(id >= 801 && id <= 804) {
            wIcon.src = "https://media0.giphy.com/media/Uslju768RmdzLmHr9U/giphy.gif"
            description = "Felhővonulás"
            setBackground('cloudy')
        } else if((id >= 300 && id <= 321) || (id >= 500 && id <= 531)) {
            wIcon.src = "https://i.pinimg.com/originals/65/b2/08/65b2083d500ccfdc9af6eab049d793b2.gif"
            description = "Gumicukrok fedezékbe!"
            setBackground('rainy')
        }

        wrapper.querySelector(".temp .numb")!.innerHTML = Math.floor(temp).toString()
        wrapper.querySelector(".weather")!.innerHTML = description
        wrapper.querySelector(".location span")!.innerHTML = `${city}, ${country}`
        wrapper.querySelector(".temp .numb-2")!.innerHTML = Math.floor(feels_like).toString()
        wrapper.querySelector(".humidity span")!.innerHTML = humidity + "%"

        infoTxt.classList.remove("pending", "error")
        wrapper.classList.add("active")
    }
}

const setInputValue = () => window.onclick = e => {
    const target = e.target as HTMLElement 
    if(target.attributes[0]) {
        searchInput.value = target.innerText
        requestAPi(searchInput.value)
    } 
}

searchInput.addEventListener("click", setInputValue)

