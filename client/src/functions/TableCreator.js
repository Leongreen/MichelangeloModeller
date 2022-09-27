
function generateATable(labels, data) {
    let returnHTML = "";
    returnHTML += "<div class='overflow-x-auto sm:-mx-8 lg:-mx-12'>";
    returnHTML += "<div class='py-2 inline-block w-full sm:px-6 lg:px-8'>";
    returnHTML += "<div class='overflow-hidden'>";
    returnHTML += "<table class='w-full border'>";
    returnHTML += "<thead class='border-b'><tr class='border-b'>"
    for (let i = 0; i < labels.length; i++) {
        returnHTML += "<th scope='col' class='bg-gray-100 text-sm font-medium text-gray-900 px-6 py-4 text-center'>"
        returnHTML += labels[i]
        returnHTML += "</th>"
    }
    returnHTML += "</tr></thead> <tbody>"
    // TODO: Identify the longest array in the data
    for (let i = 0; i < data[0].length; i++){
        returnHTML +="<tr class='border-b'>"
        for (let k = 0; k < data.length; k++){
            returnHTML += "<td scope='col' class='bg-white text-sm font-medium text-gray-900 px-6 py-4 text-center hover:bg-gray-100 hover:transition'>"
            returnHTML += data[k][i];
            returnHTML += "</td>"
        }
        returnHTML+= "</tr>"
    }
    returnHTML += "</tbody></table></div></div></div>"

    return returnHTML;
}

export default generateATable;