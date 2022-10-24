console.log();
var section = document.getElementById("guid-section");

function add_guid() {
    var tag = document.createElement("p");
    var text = document.createTextNode(crypto.randomUUID());
    tag.appendChild(text);
    section.appendChild(tag);
    tag.addEventListener('click', ((event) => {
        navigator.clipboard.writeText(event.target.textContent);
        event.target.classList.add('clicked')
    }));
}

for (var i = 0; i < 100; i++) {
    add_guid();
}