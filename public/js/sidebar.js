const sidebar = document.getElementById("sidebar")
const overlay = document.getElementById("overlay")

document.getElementById("menuBtn").onclick = () => {

sidebar.style.left = "0"
overlay.style.display = "block"

}

document.getElementById("closeSidebar").onclick = closeSidebar

overlay.onclick = closeSidebar

function closeSidebar(){

sidebar.style.left = "-260px"
overlay.style.display = "none"

}
