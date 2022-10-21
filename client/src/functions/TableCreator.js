function generateATable(labels, data) {
    let returnHTML = "";
    returnHTML += "<div class='overflow-x-auto '>";
    returnHTML += "<div class='inline-block w-full h-full'>";
    returnHTML += "<div class='overflow-x-auto relative shadow-sm sm:rounded-lg'>";
    returnHTML += "<table class='w-full text-xs text-gray-700  bg-gray-50  dark:text-gray-400'>";
    returnHTML += "<thead class='border-b'><tr class='border-b'>"
    for (let i = 0; i < labels.length; i++) {
        returnHTML += "<th scope='col' class='rounded-t-lg  text-sm font-medium text-gray-900 px-6 py-2 text-center'>"
        returnHTML += labels[i]
        returnHTML += "</th>"
    }
    returnHTML += "</tr></thead> <tbody>"
    // TODO: Identify the longest array in the data
    for (let i = 0; i < data[0].length; i++){
        returnHTML +="<tr class='border-b'>"
        for (let k = 0; k < data.length; k++){
            returnHTML += "<td scope='col' class='bg-white text-sm font-medium text-gray-900 px-6 py-2 text-center hover:bg-gray-100 hover:transition'>"
            returnHTML += data[k][i];
            returnHTML += "</td>"
        }
        returnHTML+= "</tr>"
    }
    returnHTML += "</tbody></table></div></div></div>"

    return returnHTML;
}

export default generateATable;