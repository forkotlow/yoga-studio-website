const menuBtn = document.querySelector("#menu-btn")
const navLinks = document.querySelector("#nav-links")
const menuBtnIcon = menuBtn.querySelector("i");


//NAV BAR MENU BUTTON
menuBtn.addEventListener("click", ()=>{
    //console.log("clickkk");    
    navLinks.classList.toggle("open");
    const isOpen = navLinks.classList.contains("open");
    menuBtnIcon.setAttribute("class", isOpen ? "ri-close-line": "ri-menu-line" );
})

navLinks.addEventListener("click", ()=>{
    navLinks.classList.remove("open");
    menuBtnIcon.setAttribute("class", "ri-menu-line");
})

//REGISTRATION PAGE DATA VALIDATION
const form = document.querySelector("#signup_form");
const avatar = document.querySelector("#avatar");
const fullname = document.querySelector("#fullname");
const email = document.querySelector("#email");
const password = document.querySelector("#password");
const cpassword = document.querySelector("#confirm_password");


form.addEventListener("submit", ()=>{
    event.preventDefault();
    //console.log("submitted.....");
    signup_form_validation();

})

const signup_form_validation = () => {
    const v_fullname = fullname.value.trim();
    const v_email = email.value.trim();
    const v_password = password.value.trim();
    const v_cpassword = cpassword.value.trim();

    if(v_fullname !== "" && v_fullname.length >= 2){
        console.log("success fullname");   
        //send to server
    }

    if(v_email !== "" && v_email.length >= 2){

        const validEmail = (email) => {
            const atSymbol = email.indexOf("@");
            if(atSymbol < 1) return false;

            var dot = email.lastIndexOf(".");
            if(dot <= atSymbol + 2) return false;
            if(dot === email.length - 1) return false;

            return true;
        }

        if(!(validEmail(v_email))){     
            //error
            console.log("error email");
        }else{
            //send to server
            console.log("success email");   
        }



    }

    if(v_cpassword !== "" && v_cpassword.length > 5){
        //over
    }else{console.log("error confirm password");   }

    if(v_password !== "" && v_password.length > 5 && v_password === v_cpassword ){
        console.log("success password");   
        //send to server
    }else{  console.log("error password");   }

}




//SIGN UP PASSWORD REVEAL
const passwordBtn = document.querySelector("#password-eye");

passwordBtn.addEventListener("click",() => {
    const passwordInput =document.querySelector("#password");
    const icon = passwordBtn.querySelector(i);
    const isVisible = icon.classList.contains("ri-eye-line");
    passwordInput.type =isVisible ? "password": "text";
    icon.setAttribute("class", isVisible? "ri-eye-off-line" : "ri-eye-line");
})


//INDEX PAGE ANIMATIONS
const scrollRevealOption = {
    distance: "50px" ,
    origin:"bottom" ,
    duration: 1000,
}

ScrollReveal().reveal(".header_container div" , { 
    ...scrollRevealOption, 
    delay: 200,
 });

 ScrollReveal().reveal(".why_content li", {
    origin: "right",
    interval: 200,
 })

 ScrollReveal().reveal(".classes_images", {
    duration: 800,
    origin: "left",
    interval: 200,
 })

ScrollReveal().reveal(".instructors_card", {
    ...scrollRevealOption,
    interval: 200
})

ScrollReveal().reveal(".membership_card",{
    ...scrollRevealOption,
    interval:100
})
