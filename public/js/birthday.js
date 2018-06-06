function pickImage() {
    var imgList =  (window.innerWidth < window.innerHeight) ? imagesPortrait : imagesLandscape;
    var randomNumber = Math.floor(Math.random() * imgList.length);
    return 'url(' + imgList[randomNumber] + ')';
}

var imagesLandscape=[
    'images/backgrounds/IMG_0369.jpg',
    'images/backgrounds/IMG_0622.jpg',
    'images/backgrounds/IMG_0878.jpg',
    'images/backgrounds/IMG_0879.jpg',
    'images/backgrounds/IMG_0884.jpg',
    'images/backgrounds/IMG_0892.jpg',
    'images/backgrounds/IMG_6010_mod.jpg',
    'images/backgrounds/IMG_6023.jpg',
    'images/backgrounds/IMG_20150721_073551.jpg',
    'images/backgrounds/IMG_20150721_073630.jpg',
    'images/backgrounds/IMG_20150729_074506.jpg',
    'images/backgrounds/IMG_20150729_093540.jpg',
    'images/backgrounds/IMG_20150729_105555.jpg',
    'images/backgrounds/IMG_20150729_115306.jpg',
    'images/backgrounds/IMG_20150729_125913.jpg',
    'images/backgrounds/IMG_20150731_101316.jpg',
    // 'images/backgrounds/IMG_20160427_095902.jpg',
    // 'images/backgrounds/IMG_6136.jpg',
    // 'images/backgrounds/IMG_6182.jpg',
];
var imagesPortrait = [
    'images/backgrounds/DSC_0303.jpg',
    'images/backgrounds/IMG_0018.jpg',
    'images/backgrounds/IMG_0502.jpg',
    'images/backgrounds/IMG_2154.jpg',
    'images/backgrounds/IMG_3743.jpg',
    'images/backgrounds/IMG_4375.jpg',
    'images/backgrounds/IMG_4415.jpg',
    'images/backgrounds/IMG_20160911_134950.jpg',
];

function setBackgroundImage(bgImg) {
    $('body').css({'background': bgImg, 'background-size': 'cover'});
}

function onWindowResize() {
    setBackgroundImage(pickImage());
}

$(document).ready(function(){
    onWindowResize();
    window.onresize = onWindowResize;

});
