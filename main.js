/* -------------- Converting functions -------------- */
function getRGBbinValues(str){
    let match = str.match(/rgba?\((\d{1,3}), ?(\d{1,3}), ?(\d{1,3})\)?(?:, ?(\d(?:\.\d?))\))?/)
    let rgbBinValues = []
    if (match){
        for(i = 1; i < 4; i++){
            rgbBinValues.push(match[i] == "255")
        }
    }
    return rgbBinValues
}

function getRGBfromBinValues(rgbBinValues) {
    let rgb255ls = []
    for(let i = 0; i < 3; i++){
        rgb255ls.push(rgbBinValues[i]? "255": "0")
    }
    return "rgb(" + rgb255ls[0] + ", " + rgb255ls[1] + ", " + rgb255ls[2] + ")"
}

/* -------------- Primary function -------------- */
function addBinPrimaryColors(rgb1, rgb2, isLights, isSameType) {
    let result = []
    let isSameColor = true
    for(let i = 0; i < 3; i++){
        result[i] = rgb1[i] || rgb2[i]
        if(isSameColor){
            isSameColor = rgb1[i] == rgb2[i]
        } 
    }
    if(!isLights && !isSameType && !isSameColor) {
        result = [false, false, false]
    }
    return result
}

/* -------------- Secondary function -------------- */
function addBinSecondaryColors(rgb1, rgb2) {
    let result = []
    for(let i = 0; i < 3; i++){
        result[i] = rgb1[i] && rgb2[i]
    }
    return result
}

/* -------------- Primary & Secondary function -------------- */
function addBinPrimaryAndSecondaryColors(rgbPrimary, rgbSecondary, isLights) {
    let isComplementary = true
    for(let i = 0; i < 3; i++){
        if(rgbPrimary[i] && rgbSecondary[i]){
            isComplementary = false
            break
        }
    }
    if(isComplementary){
        return isLights? [true, true, true]: [false, false, false]
    } else {
        return isLights? rgbSecondary: rgbPrimary
    }
}

/* -------------- Main logic -------------- */
var rgb1 = null  // color, type
var rgb2 = null  // color, type

function computeAndFillInCanvas(rgb1, rgb2){
    let result = ""
    let isLights = rgb1[1] && rgb2[1]
    let isSameType = rgb1[1] == rgb2[1]
    if(rgb1[3]) {  // white & color
        binValues = rgb2[0]
    } else if (rgb2[3]) {  // white & color
        binValues = rgb1[0]
    } else if(rgb1[4] || rgb2[4]){  // black & color
        binValues = [false, false, false]
    } else {  // colors
        if(rgb1[2] == rgb2[2]){
            if(rgb1[2]) {
                binValues = addBinPrimaryColors(rgb1[0], rgb2[0], isLights, isSameType)
            } else {
                binValues = addBinSecondaryColors(rgb1[0], rgb2[0])
            }
        } else {
            let rgbPrimary, rgbSecondary
            if(rgb1[2]){
                rgbPrimary = rgb1[0]
                rgbSecondary = rgb2[0]
            } else {
                rgbPrimary = rgb2[0]
                rgbSecondary = rgb1[0]
            }
            binValues = addBinPrimaryAndSecondaryColors(rgbPrimary, rgbSecondary, isLights)
        }
    }
    result = getRGBfromBinValues(binValues)
    $("#result").css({"background-color": result})
}

/* -------------- Onclick event observing -------------- */
$("#trush-icon").click(function(){
    rgb1 = null
    rgb2 = null
    //TODO refactor this shit:
    $("#result").css({"background-color": "#ffffff"})
    $(".color").each(function(){
        $(this).css({
            "border": "0px",
            "height": "60px",
            "width": "60px"
        })
    })
})

$(".color").click(function () {
    let rgbBinValues = getRGBbinValues($(this).css("background-color"))
    let isLight = $(this).parent().attr("id") == "lights"
    let isPrimary = $(this).hasClass("primary")
    let isWhite = $(this).hasClass("white")
    let isBlack = $(this).hasClass("black")
    if(!rgb1){
        rgb1 = [rgbBinValues, isLight, isPrimary, isWhite, isBlack]
    } else if (!rgb2) {
        rgb2 = [rgbBinValues, isLight, isPrimary, isWhite, isBlack]
    } else {
        alert("Use the trush button to reset.")
        return
    }
    $(this).css({
        "border": "3px solid rgba(255, 255, 255, 0.5)",
        "height": "54px",
        "width": "54px"
    })
    if(rgb1 && rgb2){
        computeAndFillInCanvas(rgb1, rgb2)
    }
})
