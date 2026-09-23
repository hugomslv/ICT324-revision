import "./style.css"
import vite_logo from "./assets/vite.svg"
import { double, dire_bonjour } from "./exemples.js"

const app = document.querySelector("#app")

// image de src/assets : on l'IMPORTE
const img1 = document.createElement("img")
img1.src = vite_logo
img1.alt = "Vite"
app.appendChild(img1)

// image de public/ utilisée dans le JS : BASE_URL devant
const img2 = document.createElement("img")
img2.src = `${import.meta.env.BASE_URL}images/logo.png`
img2.alt = "Logo"
img2.width = 40
app.appendChild(img2)

const p = document.createElement("p")
p.textContent = `${dire_bonjour("Hugo")} double(21) = ${double(21)}`
app.appendChild(p)
