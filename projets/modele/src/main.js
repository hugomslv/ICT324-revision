import "./style.css"
import vite_logo from "./assets/vite.svg"
import { add, rotate } from "./math.js"

const app = document.querySelector("#app")

// Image importée depuis src/ : Vite calcule le bon chemin (avec base)
const img_src = document.createElement("img")
img_src.src = vite_logo
img_src.alt = "Vite"
app.appendChild(img_src)

// Fichier de public/ utilisé dans le JS : TOUJOURS préfixer avec BASE_URL
const img_public = document.createElement("img")
img_public.src = `${import.meta.env.BASE_URL}images/logo.png`
img_public.alt = "Logo"
img_public.width = 40
app.appendChild(img_public)

document.querySelector("#result").textContent =
  `add(1, 2) = ${add(1, 2)} | rotate([ 1, 2, 3 ]) = ${rotate([ 1, 2, 3 ])}`
