// ------------------------------------------
//  GLOBAL VARIABLES
// ------------------------------------------

/** Modifying the terms in the URL for the randomuser API gives only specific results wer're looking for, rather than 
 * having to search through uneeded data.
 */
const randomUserUrl = `https://randomuser.me/api/?results=12&inc=name,picture,email,location,phone,dob&noinfo&nat=us,gb,nz`;
const gallery = document.getElementById('gallery');
let employeeInfo = [];
const modalContainer = document.querySelector('.modal-container');
const modal = document.querySelector('.modal-info-container');
const closeModalBtn = document.querySelector('.modal-close-btn');
const searchButton = document.getElementById('search-submit');

// ------------------------------------------
//  FUN ADDITIONS
// ------------------------------------------

const titles = ['Best Scooper', 'Best Service', 'Tastiest', 'Creamiest', 'Most Innovative', 'Scooper-Dooper', 
'Best Flavors', 'Best in Show', 'Friendliest', 'Golden Scooper', 'Customer Service', 'Rocky Road', 'Sweet Dreamer', 'Dairy Delight', 'Moo-licious', 'Sweetest'];

const flavEmoji = ['&#x1F366', '&#x1F367', '&#x1F368', '&#x1F36A', '&#x1F382', '&#x1F370', '&#x1F36B', '&#x1F36C', '&#x1F36D', '&#x1F36E', '&#x1F36F', '&#x2615', '&#x1F375', '&#x1F95C', '&#x1F353', 
    '&#x1F352', '&#x1F351', '&#x1F34D', '&#x1F34C'];

console.log(flavEmoji.length);

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
                <h3 id="name" class="card-name cap">${name.first} ${name.last} ${flavEmoji[Math.floor(Math.random()*flavEmoji.length)]}</h3>
                <p class="card-text">${email}</p>
                <p class="card-text cap">${city}, ${state}</p>
            </div>
        </div>`
    gallery.innerHTML = html;
    }
    
}

function showModal(index) {

    let{name, dob, phone, location: {city, street, state, postcode}, picture } = employeeInfo[index];
    let date = new Date(dob.date)

    const modalHTML =`
        <div class="modal-style">
            <img class="modal-img" src="${picture.large}" alt="${name}'s picture">
            <h3 id="name" class="modal-name cap">${name.first} ${name.last}</h3>
            <p class="modal-text">${name.first[0]}${name.last}@jays.com</p>
            <p class="modal-text cap">${city}</p>
            <hr>
            <p class="modal-text">${phone}</p>
            <p class="modal-text">${street.number} ${street.name}, ${city}, ${state} ${postcode}</p>
            <p class="modal-text">Birthday: ${date.getMonth()+1}/${date.getDate()}</p>
            //This adds a random title to each employee's modal entry.
            <p class="title">${titles[index]}</p>
            <button class="prev">Previous</button>
            <button class="next">Next</button>
        </div>
    `;
    modalContainer.classList.remove("hidden");
    modal.innerHTML = modalHTML;

    const prev = document.querySelector('.prev');
    prev.addEventListener('click', e => {
        if (index > 0) {
            index--;
            showModal(index);
        } else {
            index = employeeInfo.length - 1;
            showModal(index);
        }
    });
    
    const next = document.querySelector('.next');
    next.addEventListener('click', e => {
        if(index < employeeInfo.length -1) { 
            index++;
        showModal(index);
        } else {
            index = 0;
        showModal(index);
        }
    });
}
/** This closes the modal window */
closeModalBtn.addEventListener('click', () => {
    modalContainer.classList.add("hidden");
});

/**This event listener waits for the individual card element to be clicked and calls the @showModal
 * function that opens the modal window.  
 */
gallery.addEventListener('click', e => {
    /**This ensures that the click is captured on the cards in the gallery.*/
    if (e.target !== gallery) {
    /**
     * @param card  the card element is the target for the click and used as a reference*/
    const card = e.target.closest('.card');
    /**
     * @param index (number) is taken from the card element from the for loop and passed as an argument
     * to the showModal() function
    */
    const index = card.getAttribute('data-index');

    showModal(index);
    }
});

searchButton.addEventListener('click', () => {
    searchPeople();
});


// This function searches the photos based on input into the search bar.

function searchPeople() {
    //This variable is set based on what's entered into the search input box.
    const searchInput = document.querySelector('.search-input').value;
    
    //This variable pulls up a nodeList that is used to access the names taken from the randomNames API.
    const name = document.querySelectorAll('.card-name');    
 
    //Sets a variable for the cards for the search
    const card = document.querySelectorAll('.card');
   
    //This loop includes logic that looks for input from the captions and matches it up with the searchInput.
    for (let i = 0; i < name.length; i++) {
    if (name[i].innerHTML.toLowerCase().includes(searchInput.toLowerCase()) ) {
    card[i].style.display = "";
    } else {
    card[i].style.display = "none";
       }
    }
}
