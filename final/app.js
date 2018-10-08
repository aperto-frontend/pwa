if('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js')
        .then(function() { console.log('ServiceWorker registered'); });
}

if (document.readyState !== 'loading') {
    initUI();
} else {
    document.addEventListener('DOMContentLoaded', function() {
        initUI();
    });
}



function initUI() {
    var contentButton = document.getElementById('content-button');
    console.log(contentButton);

    contentButton.addEventListener('click', function() {
        fetch('content-data.json')
            .then(function(response) {
                return response.json();
            })
            .then(function(myJson) {
                alert(JSON.stringify(myJson));
            });
    });
}