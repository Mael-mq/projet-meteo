let selectville = document.querySelector("#selectville")
let glooker = document.querySelector("#glooker");

selectville.addEventListener("change", function(){
    if(this.value == "stlo"){
        glooker.src = "https://lookerstudio.google.com/embed/reporting/1993e7dd-55d0-42fb-8806-25294ead57b6/page/0PkDD";
    }else if(this.value == "lisieux"){
        console.log("ui")
        glooker.src = "https://lookerstudio.google.com/embed/reporting/2cb541b8-8dc4-42bc-bea6-91b0a1866b3d/page/p_ffy4molt2c";
    }else if(this.value == "evreux"){
        glooker.src = "https://lookerstudio.google.com/embed/reporting/784daafa-695e-4359-8911-246c9502582c/page/p_ffy4molt2c";
    }
})