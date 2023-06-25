const wrapper = document.getElementById("wrapper") as HTMLElement
const inputPart = document.getElementById("input-part")as HTMLElement
const infoTxt = document.getElementById("info-text")as HTMLElement
const userInput = document.getElementById("input-city") as HTMLInputElement 
const locationBtn = document.getElementById("location-btn") as HTMLElement
const wIcon = document.getElementById("weather-part-img") as HTMLImageElement
const arrowBack = document.getElementById("arrow-back") as HTMLElement
let url:string

userInput.addEventListener("keyup", function(event) {
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

const weatherDetails = (info: any) => {  
    if(info.cod == "404") {
        infoTxt.classList.replace("pending", "error")
        infoTxt.innerText = `${userInput.value} is not a valid city name`
    } else {
        const city = info.name
        const country = info.sys.country
        const {description, id} = info.weather[0]
        const {feels_like, humidity, temp} = info.main

        if(id == 800) {
            wIcon.src = "icons/clear.svg"
        } else if(id >= 200 && id <= 232) {
            wIcon.src = "icons/storm.svg"
        } else if(id >= 600 && id <= 622) {
            wIcon.src = "icons/snow.svg"
        } else if(id >= 701 && id <= 781) {
            wIcon.src = "icons/haze.svg"
        } else if(id >= 801 && id <= 804) {
            wIcon.src = "icons/cloud.svg"
        } else if((id >= 300 && id <= 321) || (id >= 500 && id <= 531)) {
            wIcon.src = "icons/rain.svg"
        }

        wrapper.querySelector(".temp .numb")!.innerHTML = Math.floor(temp).toString()
        wrapper.querySelector(".weather")!.innerHTML = description
        wrapper.querySelector(".location span")!.innerHTML = `${city}, ${country}`
        wrapper.querySelector(".temp .numb-2")!.innerHTML = Math.floor(feels_like).toString()
        wrapper.querySelector(".humidity span")!.innerHTML = humidity

        infoTxt.classList.remove("pending", "error")
        wrapper.classList.add("active")
    }
}

