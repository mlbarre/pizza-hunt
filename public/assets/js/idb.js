let db; // create variable to hold db connection
const request = indexedDB.open('pizza_hunt', 1); //establish a connection to IndexedDB database called 'pizza_hunt' and set it to version 1

// this event will emit if the database version changes (nonexistant to version 1, v1 to v2, etc.)
request.onupgradeneeded = function(event) {
    // save a ref to the database
    const db = event.target.result;
  // create an object store (table) called `new_pizza`, set it to have an auto incrementing primary key of sorts 
    db.createObjectStore('new_pizza', { autoIncrement: true });
};

// upon a successful request
request.onsuccess = function(event) {
    // when db is successfully created with its object store (from onupgradedneeded event above) or simply established a connection, save reference to db in global variable
    db = event.target.result;

    // check if app is online, if yes run uploadPizza() function to send all local db data to api
    if (navigator.onLine) {
    // we haven't created this yet, but we will soon, so let's comment it out for now
    // uploadPizza();
    }
};

request.onerror = function(event) {
    console.log(event.target.errorCode); // log error here
};

// this function will be executed if we attempt to submit a new pizza and there's no internet connection
function saveRecord(record) {
    const transaction = db.transaction(['new_pizza'], 'readwrite'); // open a new transaction with the database with read and write permissions

    const pizzaObjectStore = transaction.objectStore('new_pizza'); // access the object store for `new_pizza`

    pizzaObjectStore.add(record); // add record to your store with add method
};

function uploadPizza() {
    const transaction = db.transaction(['new_pizza'], 'readwrite'); // open a transaction on your db
    const pizzaObjectStore = transaction.objectStore('new_pizza'); // access your object store
    const getAll = pizzaObjectStore.getAll(); // get all records from store and set to a variable

    getAll.onsuccess = function() { // upon a successful .getAll() execution, run this function

    if (getAll.result.length > 0) { // if there was data in indexedDb's store, let's send it to the api server
      fetch('/api/pizzas', {
        method: 'POST',
        body: JSON.stringify(getAll.result),
        headers: {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/json'
        }
    })
        .then(response => response.json())
        .then(serverResponse => {
          if (serverResponse.message) {
            throw new Error(serverResponse);
        }
          const transaction = db.transaction(['new_pizza'], 'readwrite'); // open one more transaction
        
          const pizzaObjectStore = transaction.objectStore('new_pizza'); // access the new_pizza object store

          pizzaObjectStore.clear(); // clear all items in your store

        alert('All saved pizza has been submitted!');
        })
        .catch(err => {
          console.log(err);
        });
    }
  };
};


window.addEventListener('online', uploadPizza); // listen for app coming back online