function saveAsJSON(content, filename, key) {
    console.log("Hello")
    let filenameKey = key + '_filename'
    sessionStorage.setItem(key, JSON.stringify(content))
    sessionStorage.setItem(filenameKey, filename.substr(0,filename.indexOf('.')) + '.json')
}

function loadJSON(key){
    let filenameKey = key + '_filename'
    let file = new File([new Blob([sessionStorage.getItem(key)])], 
    sessionStorage.getItem(filenameKey))
    console.log(file.name)
    return file;
}