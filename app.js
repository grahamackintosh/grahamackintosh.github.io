function enableTab(id) {
    var el = document.getElementById(id);
    el.onkeydown = function (e) {
        if (e.keyCode === 9) { // tab was pressed
            // get caret position/selection
            var val = this.value,
                start = this.selectionStart,
                end = this.selectionEnd;

            // set textarea value to: text before caret + tab + text after caret
            this.value = val.substring(0, start) + '\t' + val.substring(end);

            // put caret at right position again
            this.selectionStart = this.selectionEnd = start + 1;

            // prevent the focus lose
            return false;
        }
    };
}
// Enable the tab character onkeypress (onkeydown) inside textarea...
// ... for a textarea that has an `id="my-textarea"`
enableTab('json-input');

const jsonOutput = document.getElementById('json-output');

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
        jsonOutput.value = output_text;
    }
});