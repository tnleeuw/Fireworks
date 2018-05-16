
$(document).ready(function(){
    var imagesLandscape=[
        'images/backgrounds/IMG_0369.jpg',
        'images/backgrounds/IMG_0622.jpg',
        'images/backgrounds/IMG_0878.jpg',
        'images/backgrounds/IMG_0879.jpg',
        'images/backgrounds/IMG_0884.jpg',
        'images/backgrounds/IMG_0892.jpg',
        'images/backgrounds/IMG_6010_mod.jpg',
        'images/backgrounds/IMG_6023.jpg',
        'images/backgrounds/IMG_6136.jpg',
        'images/backgrounds/IMG_6182.jpg',
    ];

    var randomNumber = Math.floor(Math.random() * imagesLandscape.length);
    var bgImg = 'url(' + imagesLandscape[randomNumber] + ')';

    // TODO: This doesn't work for all aspect ratios. Have portrait images for portrait window sizes.
    $('body').css({'background':bgImg, 'background-size': 'cover' });

});
