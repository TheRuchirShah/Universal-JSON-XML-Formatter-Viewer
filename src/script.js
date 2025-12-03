const input = document.getElementById('input');
const output = document.getElementById('output');
const formatBtn = document.getElementById('formatBtn');

formatBtn.addEventListener('click', () => {
    const rawData = input.value.trim();
    if (!rawData) {
        output.innerHTML = "<p class='text-red-500'>Please paste JSON or XML data first.</p>";
        return;
    }

    try {
        let parsedData;
        if (rawData.startsWith('<')) {
            parsedData = xmlToJson(rawData);
        } else {
            parsedData = JSON.parse(rawData);
        }
        output.innerHTML = renderTree(parsedData);
    } catch (err) {
        output.innerHTML = `<p class='text-red-500'>Error parsing data: ${err.message}</p>`;
    }
});

// Convert XML string to JS object
function xmlToJson(xmlStr) {
    const parser = new DOMParser();
    const xml = parser.parseFromString(xmlStr, 'text/xml');
    function nodeToObj(node) {
        let obj = {};
        if (node.attributes && node.attributes.length > 0) {
            obj["@attributes"] = {};
            Array.from(node.attributes).forEach(attr => {
                obj["@attributes"][attr.nodeName] = attr.nodeValue;
            });
        }
        Array.from(node.childNodes).forEach(child => {
            if (child.nodeType === 3) { // text
                if (child.nodeValue.trim()) obj["#text"] = child.nodeValue.trim();
            } else if (child.nodeType === 1) { // element
                obj[child.nodeName] = nodeToObj(child);
            }
        });
        return obj;
    }
    return nodeToObj(xml.documentElement);
}

// Render tree as collapsible HTML
function renderTree(obj, key = '') {
    if (typeof obj !== 'object' || obj === null) {
        return `<span class="text-gray-700">${key ? key + ': ' : ''}${obj}</span>`;
    }

    let html = `<ul class="ml-4 list-disc">`;
    for (let k in obj) {
        const val = obj[k];
        html += `<li>
            <span class="font-bold text-blue-600 cursor-pointer" onclick="this.nextElementSibling.classList.toggle('hidden')">${k}</span>
            <span class="${typeof val === 'object' ? '' : 'text-gray-700'}">${typeof val === 'object' ? '' : val}</span>`;
        if (typeof val === 'object') {
            html += `<div class="ml-4 hidden">${renderTree(val)}</div>`;
        }
        html += `</li>`;
    }
    html += `</ul>`;
    return html;
}
