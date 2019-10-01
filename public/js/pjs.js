(() => {
    // expands mobile menu
    function classToggle() {
        const navbarItems = document.querySelector('.nav-items');
        navbarItems.classList.toggle('show');

        // replace the toggle icon
        if(document.getElementById('toggle-icon').className == "fas fa-bars") {
            document.getElementById('toggle-icon').className = "far fa-window-close";
        } else {
            document.getElementById('toggle-icon').className = "fas fa-bars";
        }
        window.getSelection().removeAllRanges();
    }
    // assign event listener to the mobile menu toggle
    document.querySelector('.navbar-toggle').addEventListener('click', classToggle);

    // grab the email form and listen for a submission
    const form = document.forms.namedItem('email-form');
    form.addEventListener('submit', (event) => {
        event.preventDefault(); // do not actually submit a POST request unless Javascript was turned off
        sendData(event.target);
    });
})();


function sendData(form) {
    const formData = new FormData(form);
    const action = form.getAttribute('action');
    if(validateForm(formData)) {
        const json = parseJson(formData);
        postForm(json, action);
        form.reset();
        return;
    }
}

function parseJson(form) {
    let json = {};
    for(let key of form.keys()) {
        json[key] = form.get(key);
    }
    return JSON.stringify(json);
}

function postForm(json, action) {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', action, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(json);

    xhr.onload = () => {
      console.log(`onload ${xhr.status} ${xhr.response}`)
    };

    xhr.onerror = () => {
        console.log(`onerror ${xhr.status} ${xhr.response}`)
    };
}


/*
validate the email form
 */
function validateForm(form) {
    let validated = true;
    for(let key of form.keys()) {
        if (form.has(key) && form.get(key).length > 0) {
            unhighlightInput(key);
        } else {
            validated = false;
            highlightInput(key);
        }
    }
    return validated;
}

/*
put a red line around any failed input fields
 */
function highlightInput(elementId) {
    document.getElementById(elementId).style.border = '1px solid red';
}

function unhighlightInput(elementId) {
    document.getElementById(elementId).style.border = 'none';
}