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
const rand = (Math.floor((Math.random(titles.length))*10));
console.log(rand);
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

function generateHTML(data) {
    employeeInfo = data;
    console.log(employeeInfo)

    let html = '';
    
    for (i = 0; i < employeeInfo.length; i++) { 
    html += `
    <div class="card">
        <div class="card-img-container">
            <img class="card-img" src="${employeeInfo[i].picture.medium}" alt="profile picture">
        </div>
        <div class="card-info-container">
            <h3 id="name" class="card-name cap">${employeeInfo[i].name.first} ${employeeInfo[i].name.last}</h3>
            <p class="card-text">${employeeInfo[i].email}</p>
            <p class="card-text cap">${employeeInfo[i].location.city}, ${employeeInfo[i].location.state}</p>
            <p class="title">${titles[Math.floor(Math.random()*employeeInfo.length)]}</p>
        </div>
    </div>`
    gallery.innerHTML = html;
    }
    
}


function checkStatus(response) {
    if(response.ok) {
        return Promise.resolve(response);
    } else {
        return Promise.reject(new Error(response.statusText));
    }
}