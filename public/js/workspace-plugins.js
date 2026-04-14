const pluginGrid = document.getElementById("plugin-grid")

const plugins = [

{ id:"express", name:"Express", description:"Fast Node.js web framework" },

{ id:"mongoose", name:"Mongoose", description:"MongoDB object modeling tool" },

{ id:"jsonwebtoken", name:"JWT Auth", description:"Authentication using JSON Web Tokens" },

{ id:"cookie-parser", name:"Cookie Parser", description:"Parse cookies in Express apps" },

{ id:"dotenv", name:"Dotenv", description:"Environment variables manager" },

{ id:"nodemon", name:"Nodemon", description:"Auto restart server on changes" },

{ id:"bcrypt", name:"Bcrypt", description:"Secure password hashing" },

{ id:"multer", name:"Multer", description:"Handle file uploads" },

{ id:"axios", name:"Axios", description:"HTTP client for APIs" },

{ id:"cors", name:"CORS", description:"Enable cross origin requests" },

{ id:"helmet", name:"Helmet", description:"Security middleware for Express" },

{ id:"body-parser", name:"Body Parser", description:"Parse request bodies" },

{ id:"uuid", name:"UUID", description:"Generate unique identifiers" },

{ id:"chalk", name:"Chalk", description:"Colorful console logs" },

{ id:"moment", name:"Moment", description:"Date and time utilities" },

{ id:"socket.io", name:"Socket.io", description:"Realtime websocket communication" },

{ id:"express-session", name:"Express Session", description:"Session management middleware" },

{ id:"passport", name:"Passport", description:"Authentication middleware" },

{ id:"nodemailer", name:"Nodemailer", description:"Send emails with Node.js" },

{ id:"compression", name:"Compression", description:"Gzip compression middleware" }

]


// create cards

plugins.forEach(plugin=>{

const card=document.createElement("div")
card.className="plugin-card"

card.innerHTML=`

<h3>${plugin.name}</h3>

<p>${plugin.description}</p>

<button onclick="installPlugin('${plugin.id}')">
Install
</button>

`

pluginGrid.appendChild(card)

})


// install plugin

function installPlugin(plugin){

fetch(`/workspace/${projectId}/install-plugin`,{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({plugin})

})

.then(res=>res.json())

.then(data=>{

if(data.success){

alert(plugin + " installed successfully")

loadFiles()

}else{

alert("Installation failed")

}

})

}
function loadFiles(){

  fetch(`/workspace/${projectId}/files`)
  .then(res => res.json())
  .then(files => {

    const tree = document.getElementById("file-tree")
    tree.innerHTML = ""

    files.forEach(file => {

      const li = document.createElement("li")
      li.textContent = file.name

      li.onclick = () => openFile(file._id)

      tree.appendChild(li)

    })

  })

}
