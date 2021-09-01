const searchBtn = document.getElementById('search-btn');

searchBtn.addEventListener('click', e => {
    e.preventDefault();
    document.getElementById("all-books").innerHTML = "";
    document.getElementById("error-message").innerHTML = "";
    const searchResult = document.getElementById("search-result");
    searchResult.innerHTML = "";
    searchResult.classList.remove('d-none');
    const searchInput = document.getElementById("search-input").value;

    if (searchInput.length > 0) {
        // turn on spin
        document.getElementById("spinner").classList.remove("d-none");
        getBookData(searchInput);
    } else {
        errorMessage(true, searchInput);
    }
    document.getElementById("search-input").value = '';
});


// fetch data
const fetchedData = async (url) => {
    const response = await fetch(url);
    const data = await response.json();

    return data;
}

const getBookData = bookName =>{
    url = `https://openlibrary.org/search.json?q=${bookName}`;
    fetchedData(url)
        .then( data => {
            //trun off spin
            document.getElementById("spinner").classList.add("d-none");
            displayBooks(data, bookName);
        })
        .catch( error => {
            console.log(error);
        });
}

const displayBooks = (data, searchText) =>{
    const { numFound, docs } = data;
    if (numFound === 0){
        errorMessage(false, searchText);
    }

    document.getElementById("search-result").innerHTML = `
                                                        <h5 class="text-secondary">
                                                            <b class="text-dark">"${searchText}"</b> 
                                                            Total found result: ${numFound}, Show result: ${docs.length}
                                                        </h5>
                                                        `;

    docs.forEach((book) => {
        const allBooks = document.getElementById('all-books');
        const { author_name, first_publish_year, publisher, title, cover_i } = book;

        // console.log(author_name, first_publish_year, publisher, title, cover_i);

        const bookDiv = document.createElement('div');

        const img_url = cover_i ? `https://covers.openlibrary.org/b/id/${cover_i}-M.jpg` : "img/not_found.jpg";

        bookDiv.classList.add('col');

        const bookCard = `
                        <div class="card h-100 shadow">
                            <img src= ${ img_url}
                                class="card-img-top img-fluid" alt="..."
                                style="height:350px;"
                                >
                            <div class="card-body">
                                <h5 class="card-title  fw-bold">${title}</h5>
                                <p class="card-text"><span class="fw-bold text-secondary">By:</span> ${author_name}</p>
                                <p class="card-text"><span class="fst-italic">Publishers:</span> ${publisher}</p>
                            </div>
                            <div class="card-footer">
                                <p class="card-text"><span class="fst-italic text-decoration-underline">First publish year:</span> ${first_publish_year}</p>
                            </div>
                        </div>
                        `;
        bookDiv.innerHTML = bookCard;

        allBooks.appendChild(bookDiv);
    })
}

// //function for displaying error message.
const errorMessage = (isNull, searchText) => {
    const errorMessageDiv = document.getElementById("error-message");
    const searchResult = document.getElementById("search-result");

    if (isNull){
        errorMessageDiv.innerHTML = "<h5 class='text-center p-3'><b class='text-danger'>Please enter a book name...</b></h5>"
    } else {
        searchResult.classList.add('d-none');
        errorMessageDiv.innerHTML = `<h5 class='text-center p-3'><b class='text-secondary'>"${searchText}" no result found</b></h5>`
    }
    
};