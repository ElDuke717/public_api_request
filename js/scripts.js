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
const modalInfoContainer = document.querySelector('.modal-info-container');
const closeModalBtn = document.getElementById('modal-close-btn');
const searchButton = document.getElementById('search-submit');

// ------------------------------------------
//  FUN ADDITIONS
// ------------------------------------------

/** These two arrays hold fun stuff that's added to each employee profile.  Flavors are chosen based on index and added to each 
 * employee's card to populate their favorite flavor.  The flavEmoji array holds the hexidecimal code for different sweet food emojis
 * that are randomly added to each employee's directory card. 
 */

const flavors = ['Chocolate', 'Vanilla', 'Strawberry', 'Cookies and Cream', 'Mint Chocolate Chip', 'Cheesecake', 
'Rocky Road', 'Moosetracks', 'Neopolitan', 'Cookie Dough', 'Pistachio', 'Butter Pecan', 'Vegan Vanilla', 'Fudge Swirl', 'Peanut Butter', 'Lemon Chiffon'];

const flavEmoji = ['&#x1F366', '&#x1F367', '&#x1F368', '&#x1F36A', '&#x1F382', '&#x1F370', '&#x1F36B', '&#x1F36C', '&#x1F36D', '&#x1F36E', '&#x1F36F', '&#x2615', '&#x1F375', '&#x1F95C', '&#x1F353', 
    '&#x1F352', '&#x1F351', '&#x1F34D', '&#x1F34C'];

// ------------------------------------------
//  FETCH FUNCTIONS
// ------------------------------------------
    
/** The fetchData function is called when the page loads fetches data from
 * @param url (string)  which is the url passed into it.  It has the @checkStatus function chained to it to resolve the Promise object that is returned.  The 
 * results key is then extracted and passed to @generateHTML to make HTML based on string interpolation with the employeeData passed to it. 
*/
function fetchData(url) {
    return fetch(url)
        .then(checkStatus)
        .then(res => res.json())
        .then(res => res.results)
        .then(data => generateHTML(data))
        .catch(error => console.log('Looks like there was a problem', error))
}
//Call to fetchData to get randomUser info from the api.
fetchData(randomUserUrl);

// ------------------------------------------
//  HELPER FUNCTIONS
// ------------------------------------------

/**The checksStatus function accepts the argument 
 * @param response (string) and will resolve the Promise object passed to it the response it receives is 'OK'.  Otherwise, the Promise
 * will be rejected and an error message is returned.
 */

function checkStatus(response) {
    if(response.ok) {
        return Promise.resolve(response);
    } else {
        return Promise.reject(new Error(response.statusText));
    }
}

/**generateHTML accepts the employee data passed as an object to it from the fetchData method.  
 * @param data (object) parsed data from the randomUser API.  HTML for each card is generated based on the data passed into it.
 */
function generateHTML(data) {
    employeeInfo = data;
    //set html variable to empty before it's populated below.
    let html = '';
    
    for (i = 0; i < employeeInfo.length; i++) { 
        //Each input is assigned a variable to make the html more concise. 
        let index = [i];
        let name = employeeInfo[i].name;
        let email = employeeInfo[i].email;
        let city = employeeInfo[i].location.city;
        let state = employeeInfo[i].location.state;
        let picture = employeeInfo[i].picture;
        //Populates the HTML with the data for each employee.  
        html = `
        <div class="card" data-index="${index}">
            <div class="card-img-container">
                <img class="card-img" src="${picture.large}" alt="profile picture">
            </div>
            <div class="card-info-container">
                <h3 id="name" class="card-name cap">${name.first} ${name.last} ${flavEmoji[Math.floor(Math.random()*flavEmoji.length)]}</h3>
                <p class="card-text">${name.first[0]}${name.last}@jays.com</p>
                <p class="card-text cap">${city}, ${state}</p>
            </div>
        </div>`
    //appends the HTML to the gallery section on the page. 
    gallery.insertAdjacentHTML('beforeend', html);
    }
    
}

/** showModal is called by the event listener below.  It accepts the employeeInfo data at a specific index - 
 * @param index (number) is passed as the argument and the data from employeeInfo is passed into it from the employeeInfo array.
 * The employeeInfo array is simplified a bit to make the code cleaner by setting the employeeInfo[index] to a new object that 
 * leaves some of the data out.  
 */
function showModal(index) {
    //Setting the data to a new object to keep the data concise.
    let{name, dob, phone, location: {city, street, state, postcode}, picture } = employeeInfo[index];
    //The birtday data is reorganized by creating a new Date object and passing in the date data from the employeeInfo.  
    let date = new Date(dob.date)
    //The modal is created with the HTML below.
    const modalHTML =`
            <div class="modal-contents">
                <img class="modal-img" src="${picture.large}" alt="${name}'s picture">
                <h3 id="name" class="modal-name cap">${name.first} ${name.last}</h3>
                <p class="modal-text">${name.first[0]}${name.last}@jays.com</p>
                <p class="modal-text cap">${city}</p>
                <hr>
                <p class="modal-text">${phone}</p>
                <p class="modal-text">${street.number} ${street.name}, ${city}, ${state} ${postcode}</p>
                <p class="modal-text">Birthday: ${date.getMonth()+1}/${date.getDate()}</p>
                <!--This adds a favorite ice cream flavor to each employee's modal entry. --!>
                <p class="title">Favorite Flavor: ${flavors[index]}</p>
                <button class="prev">Previous</button>
                <button class="next">Next</button>
            </div>
            `;
    //The modalContainer overlay is shown (a shadow over the existing directory)
    modalContainer.classList.remove("hidden");
    //The modal HTML is added 
    modalInfoContainer.innerHTML = modalHTML;
    
    /**Here is the code for the Previous and Next buttons.  Every time the prev button is pressed, the index from employeeInfo
     * decrements and moves to the previous employee entry.  It works as long as the index is greater than zero.  The Next button
     * works the same way, but increments with each push, as long as the index is less than the length of the employeeInfo array.
     */
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
    
    //increments to the next index
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

// This closes the modal window
closeModalBtn.addEventListener('click', () => {
    modalContainer.classList.add("hidden");
});

/**This event listener waits for the individual card element to be clicked and calls the @showModal
 * function that opens the modal window.  
 */
gallery.addEventListener('click', e => {
    //This ensures that the click is captured on the cards in the gallery.
    if (e.target !== gallery) {
    //the card element is the target for the click and used as a reference
    const card = e.target.closest('.card');
    //number is taken from the card element from the for loop and passed as an argument
    //to the showModal() function
    const index = card.getAttribute('data-index');
    //showModal is called at the index of the card item clicked on.   
    showModal(index);
    }
});

//Search button event listener that calls the searchPeople function when it's clicked on. 
searchButton.addEventListener('click', () => {
    searchPeople();
});

/**searchPeople is called when the search button is clicked.  It takes the value from the search input box and checks to 
 * see if the any part of the input string is included via includes() method in the name variable.  If a part of the name 
 * matches up, then the card is displayed.
 */
function searchPeople() {
    //searchInput is set based on what's entered into the search input box.
    const searchInput = document.querySelector('.search-input').value;
    //name pulls up a nodeList that is used to access the names taken from the card variable.
    const name = document.querySelectorAll('.card-name');    
    //Sets a constant that represents all the cards to be searched
    const card = document.querySelectorAll('.card');
    const noResult = document.querySelector('.no-result');
    //This loop includes logic that looks for input from the card names and matches it up with the searchInput. 
    for (let i = 0; i < name.length; i++) {
    if (name[i].innerHTML.toLowerCase().includes(searchInput.toLowerCase()) ) {
    card[i].style.display = '';
    noResult.classList.add('hidden');
    } else {
    card[i].style.display = 'none';
        }
    }
}
