const envTable = document.getElementById("env-table");

async function loadEnv(){

const res = await fetch(`/environment/${projectId}`);

const vars = await res.json();

envTable.innerHTML="";

vars.forEach(v=>{

const row = document.createElement("tr");

row.innerHTML = `
<td>${v.key}</td>
<td>${v.value}</td>
`;

envTable.appendChild(row);

});

}

document.getElementById("tab-env").onclick = ()=>{

document.getElementById("env-manager").style.display="block";
document.getElementById("file-explorer").style.display="none";

loadEnv();

};

document.getElementById("tab-files").onclick = ()=>{

document.getElementById("env-manager").style.display="none";
document.getElementById("file-explorer").style.display="block";

};
