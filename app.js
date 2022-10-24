function enableTab(id) {
    var el = document.getElementById(id);
    el.onkeydown = function (e) {
        if (e.keyCode === 9) {
            var val = this.value,
                start = this.selectionStart,
                end = this.selectionEnd;

            this.value = val.substring(0, start) + '\t' + val.substring(end);

            this.selectionStart = this.selectionEnd = start + 1;

            return false;
        }
    };
}

enableTab('json-input');

const jsonOutput = document.getElementById('json-output');

function styliseJSON(input) {
    input = input.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    function match_func(match) {
        if (/^"/.test(match)) {
            if (!(/:$/.test(match))) {
                element_class = 'json-prop-string';
            } else {
                element_class = 'json-key';
            }
        } else if (/true|false/.test(match)) {
            element_class = 'json-prop-boolean';
        } else if (/null/.test(match)) {
            element_class = 'json-prop-null';
        } else {
            element_class = 'json-prop-number'
        }
        return '<span class="' + element_class + '">' + match + '</span>';
    }
    result = input.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, match_func);
    return result
}

document.getElementById('json-input').addEventListener('input', function (evt) {
    let json_text = evt.target.value
    var obj;
    try {
        obj = JSON.parse(json_text);
    } catch {
        var replacedText = json_text.replaceAll('True', 'true');
        replacedText = replacedText.replaceAll('False', 'false');
        replacedText = replacedText.replaceAll('\'', '\"');
        replacedText = replacedText.replaceAll('None', 'null');
        console.log(replacedText)
        try {
            obj = JSON.parse(replacedText)
        } catch { }
    }
    if (obj != undefined) {
        let output_text = JSON.stringify(obj, null, 4);
        let stylised = styliseJSON(output_text)
        jsonOutput.innerHTML = stylised;
    } else {
        jsonOutput.innerHTML = ""
    }
});