var userParam = null;

var validReload = true;

window.addEventListener('keydown', function (e) {
    //To check redirection using F5 tags  
    if (e.keyCode == 116) {
        //alert(validReload)
        validReload = false;
    }
});

//window.addEventListener('beforeunload', function (e) {
//    //To check redirection using F5 tags  
//    if (e) {
//        e.returnValue = "Are you sure you want to laeave the page?";
//        return "Are you sure you want to laeave the page?";
//    }
//}); works on normal logout

window.addEventListener('unload', function (event) {
    if (userParam !== null && validReload) {
        var urlBase = window.location.protocol + '//' + window.location.hostname + (window.location.port ? ':' + window.location.port : '') + "/api/";
        var url = urlBase + "Login/Logout";

        fetch(url, {
            method: 'POST', // or 'PUT'
            headers: {
                'Content-Type': 'application/json',
                'UserID': userParam.userID
            },
        })
            .then(response => response.json())
            .then(data => {
                console.log('Success:', data);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
        //sessionStorage.setItem("LoginCreate", true);
    }
});


window.addEventListener('load', function (event) {

    var userProfile = JSON.parse(sessionStorage.getItem("userProfile"));
    if(userProfile == null) return;
    window.userParam = userProfile;

    var urlBase = window.location.protocol + '//' + window.location.hostname + (window.location.port ? ':' + window.location.port : '') + "/api/";
    var url = urlBase + "Login/LoginCreate";

    fetch(url, {
        method: 'POST', // or 'PUT'
        headers: {
            'Content-Type': 'application/json',
            'UserID': userProfile.userID
        },
        body: JSON.stringify(userProfile),
    })
        .then(response => {
            response.json()

        })
        .then(data => {

           // sessionStorage.setItem("LoginCreate", false);

            console.log('Success:', data);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
});

