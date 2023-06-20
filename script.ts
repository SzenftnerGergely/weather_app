const wrapper: HTMLElement = document.querySelector(".wrapper") as HTMLElement,
inputPart: HTMLElement = wrapper.querySelector(".input-part")as HTMLElement,
infoTxt: HTMLElement = inputPart.querySelector(".info-text")as HTMLElement,
inputField = inputPart.querySelector("input")!,
locationBtn: HTMLElement = inputPart.querySelector("button") as HTMLElement,
wIcon: any = document.querySelector(".weather-part img"),
arrowBack: HTMLElement = wrapper.querySelector("header i") as HTMLElement

let api:string

inputField.addEventListener("keyup", e => {
    if(e.key == "Enter" && inputField.value !== "") {
        requestAPi(inputField.value)
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
    api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=9804707eddf44dbc8fc4327e1340f4e8`
    fetchData()
}

const onError = (error: any) => {
    infoTxt.innerText = error.message
    infoTxt.classList.add("error")
}

const requestAPi = (city: string) => {
    api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=9804707eddf44dbc8fc4327e1340f4e8`
    fetchData()
}

const fetchData = () => {
    infoTxt.innerText = "Getting weather details..." 
    infoTxt.classList.add("pending")

    fetch(api).
    then(response => response.json()).
    then(result => weatherDetails(result))
}

const weatherDetails = (info: any) => {  
    if(info.cod == "404") {
        infoTxt.classList.replace("pending", "error")
        infoTxt.innerText = `${inputField.value} is not a valid city name`
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

        wrapper.querySelector(".temp .numb")!.innerHTML = `${Math.floor(temp)}`
        wrapper.querySelector(".weather")!.innerHTML = description
        wrapper.querySelector(".location span")!.innerHTML = `${city}, ${country}`
        wrapper.querySelector(".temp .numb-2")!.innerHTML = `${Math.floor(feels_like)}`
        wrapper.querySelector(".humidity span")!.innerHTML = `${humidity}%`

        infoTxt.classList.remove("pending", "error")
        wrapper.classList.add("active")
    }
}

