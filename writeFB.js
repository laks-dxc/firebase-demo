var config = {
    apiKey: "AIzaSyDQ5dFon7mJvf-gQdrWZ5oJAFsvoboDsxU",
    authDomain: "fir-demo-56b19.firebaseapp.com",
    databaseURL: "https://fir-demo-56b19.firebaseio.com",
    storageBucket: "fir-demo-56b19.appspot.com",
    messagingSenderId: "156592969504"
  };
  firebase.initializeApp(config);

var btnRandomCust = document.getElementById("btnRandomCust");
var btnCust = document.getElementById('btnAddCust');
var randomCustomer;

btnRandomCust.addEventListener('click',function(){
    var path = '/randomCustomers/' + Math.floor(Math.random() * 10901);
    firebase.database().ref(path).once('value').then(function(snapshot) {
    randomCustomer = snapshot.val();
    document.getElementById('randomCustomer').innerHTML = JSON.stringify(randomCustomer, null, 1);
    btnCust.disabled=false;    
  });
});

btnCust.addEventListener('click',function(){
    if(document.getElementById('randomCustomer').innerHTML != '') 
    {
        var randomCustomerName = randomCustomer.name;
        var randomCustomerPhone = randomCustomer.phone;
        var randomCustomerRegistered = randomCustomer.registered;

        var customerListJson = {"name": randomCustomerName, "registered": randomCustomerRegistered};
  
        // firebase.database().ref('/customers/').child(randomCustomerPhone).update(randomCustomer);
        // firebase.database().ref('/customerList/').child(randomCustomerPhone).update(randomCustomerPhone);

        var updatedUserData = {};

        updatedUserData["customers/" + randomCustomerPhone] = randomCustomer;
        updatedUserData["customerList/" + randomCustomerPhone] = customerListJson;

       firebase.database().ref().update(updatedUserData, function (error) {
            if (error) {
                console.log("Error updating data:", error);
            }
        });
    }
    else
    {
        document.getElementById('randomCustomer').innerHTML = "Click on Generate Customer";
    }
});