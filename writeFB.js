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
var selCustomerListNoPackages = document.getElementById("customerListNoPackages");
var selActivePackages = document.getElementById('selActivePackages');
var btnAddPackageToCust = document.getElementById('btnAddPackageToCust');
var addClicked = false;

firebase.database().ref('packages/').orderByChild('active').equalTo(true).once('value').then(function (snapshot) {
    snapshot.forEach(function (childSnapshot) {
        var option = document.createElement("option");
        option.text = childSnapshot.key;
        option.value = childSnapshot.key;
        selActivePackages.add(option);
    });
});





btnRandomCust.addEventListener('click', function () {
    var path = '/randomCustomers/' + Math.floor(Math.random() * 10901);
    firebase.database().ref(path).once('value').then(function (snapshot) {
        randomCustomer = snapshot.val();
        document.getElementById('randomCustomer').innerHTML = JSON.stringify(randomCustomer, null, 1);

    });
});

btnCust.addEventListener('click', function () {
    if (document.getElementById('randomCustomer').innerHTML != 'Click on Generate Customer') {
        var randomCustomerName = randomCustomer.name;
        var randomCustomerPhone = randomCustomer.phone;
        var randomCustomerRegistered = randomCustomer.registered;

        var customerListJson = { "name": randomCustomerName, "registered": randomCustomerRegistered };

        // firebase.database().ref('/customers/').child(randomCustomerPhone).update(randomCustomer);
        // firebase.database().ref('/customerList/').child(randomCustomerPhone).update(customerListJson);
       

        var updatedUserData = {};

        updatedUserData["customers/" + randomCustomerPhone] = randomCustomer;
        updatedUserData["customerList/" + randomCustomerPhone] = customerListJson;
         addClicked = true;

        firebase.database().ref().update(updatedUserData, function (error) {
            document.getElementById('randomCustomer').innerHTML = 'Click on Generate Customer';
           
            if (error) {
                console.log("Error updating data:", error);
            }
        });
    }
    else {
        document.getElementById('randomCustomer').innerHTML = "Click on Generate Customer";
    }
});


firebase.database().ref('/customerList/').on('child_added', function (snapshot) {

    if ((snapshot.val().package === undefined)) {

        var option = document.createElement("option");
        option.text = snapshot.val().name;
        option.value = snapshot.key;
        selCustomerListNoPackages.add(option);

        if (addClicked) {
            selCustomerListNoPackages.className += " glowing-border";
            setTimeout(function () { selCustomerListNoPackages.classList.toggle('glowing-border'); }, 2000);
        }
    }
});


selCustomerListNoPackages.addEventListener("change", function () {
    console.log(this.value);
});


Date.prototype.addDays = function (days) {
    this.setDate(this.getDate() + parseInt(days));
    return this;
};



btnAddPackageToCust.addEventListener("click", function () {

    var updatedPackageData = {};

    firebase.database().ref('packages/' + selActivePackages.value).once('value').then(function (snapshot) {
        var selectedPackage = snapshot.val();
        var currentDate = new Date();
        var expiryDate = (new Date()).addDays(selectedPackage.validity);

        var currentPackage = {
            "activation": currentDate.toISOString().slice(0, 10),
            "dataConsumed": 0,
            "dataTotal": selectedPackage.dataTotal,
            "expiry": expiryDate.toISOString().slice(0, 10),
            'packageName': selectedPackage.package,
            'speedDown': selectedPackage.speedDown,
            'speedUp': selectedPackage.speedUp
        };

        updatedPackageData['customers/' + selCustomerListNoPackages.value + '/currentPackage'] = currentPackage;
        updatedPackageData['customerList/' + selCustomerListNoPackages.value + '/package'] = selectedPackage.package;
        updatedPackageData['packages/' + selectedPackage.package + '/customers/' + selCustomerListNoPackages.value] = { "activation": currentPackage.activation, "expiry": currentPackage.expiry };

        firebase.database().ref().update(updatedPackageData, function (error) {

            if (error) {
                console.log("Error updating data:", error);
            }
            else {
           
                selCustomerListNoPackages.remove(selCustomerListNoPackages.selectedIndex);
                selActivePackages.value = 'none';
            }
        });
    });
});