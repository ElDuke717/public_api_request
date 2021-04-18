// ------------------------------------------
//  GLOBAL Variables
// ------------------------------------------

/** Modifying the terms in the URL for the randomuser API gives only specific results wer're looking for, rather than 
 * having to search through uneeded data.
 */
const randomUserUrl = `https://randomuser.me/api/?results=12&inc=name,picture,email,location,phone,dob&noinfo&nat=us,gb,nz`;
const gallery = document.getElementById('gallery');
let employeeInfo = [];
const titles = ['Best Scooper', 'Best Service', 'Tastiest', 'Creamiest', 'Most Innovative', 'Scooper-Dooper', 
'Best Flavors', 'Best in Show', 'Friendliest', 'Golden Scooper', 'Customer Service', 'Rocky Road', 'Sweet Dreamer', 'Dairy Delight', 'Moo-licious', 'Sweetest'];

// ------------------------------------------
//  FETCH FUNCTIONS
// ------------------------------------------
    

function fetchData(url) {
    return fetch(url)
        .then(checkStatus)
        .then(res => res.json())
        .then(res => res.results)
        .then(data => generateHTML(data))
        .catch(error => console.log('Looks like there was a problem', error))
}

fetchData(randomUserUrl);

// ------------------------------------------
//  HELPER FUNCTIONS
// ------------------------------------------

function checkStatus(response) {
    if(response.ok) {
        return Promise.resolve(response);
    } else {
        return Promise.reject(new Error(response.statusText));
    }
}

function generateHTML(data) {
    employeeInfo = data;
    console.log(employeeInfo)

    let html = '';
    
    for (i = 0; i < employeeInfo.length; i++) { 
        /**Each input is assigned a variable to make the html more concise. */
        let index = employeeInfo[i];
        let name = employeeInfo[i].name;
        let email = employeeInfo[i].email;
        let city = employeeInfo[i].location.city;
        let state = employeeInfo[i].location.state;
        let picture = employeeInfo[i].picture;

        html += `
        <div class="card" data-index="${index}">
            <div class="card-img-container">
                <img class="card-img" src="${picture.large}" alt="profile picture">
            </div>
            <div class="card-info-container">
                <h3 id="name" class="card-name cap">${name.first} ${name.last}</h3>
                <p class="card-text">${email}</p>
                <p class="card-text cap">${city}, ${state}</p>
                <p class="title">${titles[Math.floor(Math.random()*employeeInfo.length)]}</p>
            </div>
        </div>`
    gallery.innerHTML = html;
    }
    
}

function showModal(index) {

    let{name, dob, phone, email, location: {city, street, state, postcode}, picture } = employeeInfo[i];
    console.log(employeeInfo[i]);

}
