// ------------------------------------------
//  GLOBAL VARIABLES
// ------------------------------------------

/** Modifying the terms in the URL for the randomuser API gives only specific results wer're looking for, rather than 
 * having to search through uneeded data.
 */
const randomUserUrl = `https://randomuser.me/api/?results=12&inc=name,picture,email,location,phone,dob&noinfo&nat=us,gb,nz`;
const gallery = document.getElementById('gallery');
let employeeInfo = [];
//const overlay = document.querySelector(".overlay");
const modalContainer = document.querySelector('.modal-container');
const modal = document.querySelector('.modal-info-container');
const closeModalBtn = document.querySelector('.modal-close-btn');
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
        let index = [i];
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
            </div>
        </div>`
    gallery.innerHTML = html;
    }
    
}

function showModal(index) {

    let{name, dob, phone, email, location: {city, street, state, postcode}, picture } = employeeInfo[index];
    console.log(employeeInfo[index]);

    const modalHTML =`
                    <img class="modal-img" src="https://place-hold.it/125x125" alt="profile picture">
                    <h3 id="name" class="modal-name cap">name</h3>
                    <p class="modal-text">email</p>
                    <p class="modal-text cap">city</p>
                    <hr>
                    <p class="modal-text">(555) 555-5555</p>
                    <p class="modal-text">123 Portland Ave., Portland, OR 97204</p>
                    <p class="modal-text">Birthday: 10/21/2015</p>
                    <p class="title">${titles[Math.floor(Math.random()*employeeInfo.length)]}</p>
                    <button class="prev">Previous</button>
                    <button class="next">Next</button>
    `;
    modalContainer.classList.remove("hidden");
    modal.innerHTML = modalHTML;

}


gallery.addEventListener('click', e => {

    //make sure the click is not on the gridContainer itself
    if (e.target !== gallery) {

    // select the card element based on its proximity to actual element clicked
    const card = e.target.closest(".card");
    const index = card.getAttribute('data-index');

    showModal(index);
    }
});

closeModalBtn.addEventListener('click', () => {
    modalContainer.classList.add("hidden");
});
