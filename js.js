

// key event listener sur le document entier 
var Key = null;

window.addEventListener('keydown', function (e) {
        Key = e.keyCode;
        //document.getElementById("key").innerHTML = Key ;
    }
, false);


window.addEventListener('keyup', function (e) {
       
        Key = null;
        //document.getElementById("key").innerHTML = Key ;
    
    }
, false);
    

window.addEventListener('touchstart', function (e) {Key = 90}, false);
window.addEventListener('touchend', function (e) {Key= null}, false);

class params{
    constructor(){
        this.LoopIntervale = 30; // temps en ms a laquelle la boucle va se repeter
        
        this.Basealtitude= 250; // altitude a laquel commence le lem
            this.altitude= this.Basealtitude; // altitude actuelle du lem
        
        this.gravite = 4/1000*this.LoopIntervale; // la gravité appliqué a chaque tour de boucle. le premier chiffe est en m/s divisé par les 1000ms de base du setIntervale multiplié par le temps entre chaque boucle. 
        
        this.vitesseactuelle = 0; // la vitesse a laquelle le lem tombe actuellement
            this.vitesseMax = 30; // la vitesse de chute max que le lem ne peux pas dépassé.
            this.vitesseCrash = 8; // vitesse a ne pas dépasser, sinon, comme dis la nasa, "Nous avons un probleme..."
        
        this.carburant = 200; // le carburant dans les reservoirs
            this.carburantMax = this.carburant; // la capacité des reservoirs
            this.ConsocCarburant = 15/1000*this.LoopIntervale; // la conso de carburant par seconde de pousée / par le 1000ms du SetInterval * le temps entre chaque boucle.
        
        this.VitesseImpulsion = 7/1000*this.LoopIntervale; // chaque impulsion va réduire la vitesse de Xm par secondes impulsion
        
        this.vais = ""; // contiendra le elementId du vaisseau
            //pour garder une sorte de grandeur, tout se fait en %
            this.vaisTopOrigine = 10; // l'originetop du vaisseau en pourcent du cadre actuel. 
            this.vaisLeftOrigine = 47; // l'origine Left du vaisseau en pourcent du cadre actuel. 
            
            this.vaisTop = this.vaisTopOrigine; // le top actuel
            this.vaisLeft = this.vaisLeftOrigine; // le top actuel 
            
            this.vaisHeight = 6;
            this.vaisWidth = 6;
            
            this.roulis = 0; // en deg
                this.roulisGain = 0.5/1000*this.LoopIntervale; // en deg par secondes de tanguage
                
                this.inclinaison = 0; // en deg
                this.inclinaisonMax = 8;
                
                this.tanguage = 0.8/1000*this.LoopIntervale; // en deg par secondes de tanguage
                
                
        this.sol = "";
            this.solTop = 80;
            this.solLeft = 10;
            
            this.solHeight = 3;
            this.solWidth = 80;
        
        this.timestamp = Date.now();
            this.loopCount = 0;
            this.TotalTs = 0;
        
        this.disPointeVaiseauSol = this.solTop-(this.vaisTop+this.vaisHeight);
    }
}


function init(){
    
    
    var param = new params();
    var waitTime = 1000; 
    
    document.getElementById("End").innerHTML = "Try to land without crashing your ship.<br/>The ideal speed is below "+param.vitesseCrash+" meters per second.<br/> Good luck Commander. <br/>";
    
    setTimeout(
        function(){
            
            document.getElementById("End").innerHTML += "<br /> Press a key to start.";
            var go = setInterval( 
                function(){
                    restart(param,go);
                    
                },
                param.LoopIntervale); 
        }
    , waitTime);
    
    
}

function restart(param,reset)
{   
    if(Key !== null ) // si on appuye sur une touche, on reset l'objet, on redessine les objet et on recommence
    {
    
        param = new params(); 
        param.vais = drawVais(param);
        param.sol = drawSol(param);
        clearInterval(reset);
        document.getElementById("End").innerHTML = "";
        setTimeout(
            function(){
                var go = setInterval( 
                    function(){
                        loop(param,go);
                        
                    },
                    param.LoopIntervale); 
            }
            ,200);
    }   
}   
    

function loop(param,go){
    
    //on commence par tomber
        //on prend la vitesse actuelle, si elle n'est pas au max, on l'augmente de vitesse + gravité .)
        if(param.vitesseactuelle <= param.vitesseMax){ param.vitesseactuelle += param.gravite}
        
        //on verifie quand meme qu'on est pas au dessus de la vitesse max, sinon, on la cap a vitesse max
        if(param.vitesseactuelle > param.vitesseMax){param.vitesseactuelle = param.vitesseMax}
        
            
        // on affiche la vitesse
        document.getElementById("VActu").innerHTML = "Spd : " + Math.round(param.vitesseactuelle);
        //console.log(param.vitesseactuelle + " va / " + param.vitesseMax +" vm / "+ param.gravite + " G/ " + param.loopCount + "LP /");
        
    //On calcule l'altitude, 
        // c'est simple, c'est l'altitude - la vitesse de chute ( en ms) donc /1000*loopintervale :D
        param.altitude -= param.vitesseactuelle/1000*param.LoopIntervale;
        
        // on affiche l'altitude =>
            document.getElementById("Alt").innerHTML = "Alt : " + Math.round(param.altitude);
    
    
    
    
    // Les mouvements.
    // Z = 90 Q = 81 D = 68
            
    // on verifie si Z = 90 est appuyée via la variable Key et l'event défini au dessus => 
    if(Key == 90 && param.carburant > 0)
    {
        // on enleve 1 de carburant
        param.carburant -= param.ConsocCarburant ;
        // et on diminue la vitesse de chute d'autant que de vitesse d'impulsion 
        param.vitesseactuelle -= param.VitesseImpulsion;
    
        // si l'inclinaison est a 0,  tanguage
        if(param.inclinaison == 0){
            param.inclinaison += param.tanguage;
        }
        // si l'inclinaison est négative, on l'amplifie negativement
        if(param.inclinaison < 0){
            param.inclinaison -= param.tanguage;
        }
        // si l'inclinaison est positive, on l'amplifie positivement
        if(param.inclinaison > 0){
            param.inclinaison += param.tanguage;
        }
        
            
    }
    // Z = 90 Q = 81 D = 68
    
    if(Key == 81 && param.carburant > 0)
    {
        // on enleve 1 de carburant
        param.carburant -= param.ConsocCarburant ;
        // et on diminue la vitesse de chute d'autant que de vitesse d'impulsion 
        param.roulis -= param.roulisGain;
    
        // ON applique un roulis => param.roulis += param.roulisGain; // a voir plus tard
    }
    
    if(Key == 68 && param.carburant > 0)
    {
        // on enleve 1 de carburant
        param.carburant -= param.ConsocCarburant ;
        // et on diminue la vitesse de chute d'autant que de vitesse d'impulsion 
        param.roulis += param.roulisGain;
    
        // ON applique un roulis => param.roulis += param.roulisGain; // a voir plus tard
    }
    // On calcule l'inclinaison
    param.inclinaison += param.roulis; // en deg
    
    if(param.inclinaison > 0 && param.inclinaison > 180)(param.inclinaison -= 360);
    if(param.inclinaison < 0 && param.inclinaison < -180)(param.inclinaison += 360);
    
    // dans tous les cas, on affiche le carburant restant et le roulis
    document.getElementById("Carb").innerHTML = Math.round(param.carburant) +" / "+ param.carburantMax;
    document.getElementById("Incl").innerHTML = Math.round(param.inclinaison) +" °";
    // et on redessine le vaisseau.
    drawVais(param);
    
    
    
    
    
    
    
    
    
    
    // calcule du temps écoulé
    let ts = Date.now() - param.timestamp; // ce bloc sert a savoir combien de ms se sont écoulé depuis la derniere iteration
    param.TotalTs+= ts;
    param.timestamp = Date.now();
    //document.getElementById("time").innerHTML = " Time : "+ param.TotalTs/1000 +" Sec";
    
    // calcule de la partie graphique
    // on calcule la distance entre les deux objet, de la pointe du vaisseau soit top+height au top du sol.
    // ( fait dans l'objet)
    // donc la pointe est a 16 % et le sol top a 80%, ca donne 64% a descendre en 150m d'altitude.
    // donc chaque m doit valoir (64/150) % 
    let PcM = param.disPointeVaiseauSol / param.Basealtitude ; 
    // ensuite, on fait top = basetop + altitude* pcm
    param.vaisTop = param.vaisTopOrigine + (param.Basealtitude-param.altitude)*PcM;
    // puis, on met a jour la position du vaisseau => 
    param.vais.style.top = param.vaisTop+"%";
    // on met l'altitude et la vitesse au meme top que le vaisseau
    document.getElementById("Alt").setAttribute("style", "position:absolute; top : "+param.vaisTop+"%");
    document.getElementById("VActu").setAttribute("style", "position:absolute; top : "+param.vaisTop+"%; left:90%;");
    document.getElementById("Carb").setAttribute("style", "position:absolute; top : "+ (param.vaisTop-5) +"%; left:45%;");
    document.getElementById("Incl").setAttribute("style", "position:absolute; top : "+ param.vaisTop +"%; left:55%;");
    
    
    
    // calcule des conditions de victoires
    // si on touche le sol, on définit si on est dans les parametre pour gagner ou pour perdre et on lance la fontion désignée.
    
    if(param.altitude <= 0 ){ // si je touche le sol
        if(
            (
                (param.inclinaison > 0 && param.inclinaison > param.inclinaisonMax)
                || 
                (param.inclinaison < 0 && param.inclinaison < param.inclinaisonMax)
            )
            
            || 
                param.vitesseactuelle > param.vitesseCrash 
        )
        {
            clearInterval(go);
            lost(param);param.altitude = 0;
            return params;
            
        }
        else{
            go = clearInterval(go);
            win(param);
            params[0] = 0;
            console.log(param.vitesseactuelle + " / " + param.vitesseCrash); 
        
        return params;
        }
    }
    
    
    
    param.loopCount++; // sert a compté le nombre de boucle qui ont été lancée.
    
    
    return params;
    
}


function win(param){
    
    document.getElementById("Alt").innerHTML = "";
    document.getElementById("VActu").innerHTML = "";
    document.getElementById("Carb").innerHTML = "";
    document.getElementById("Ass").innerHTML = "";
    document.getElementById("time").innerHTML = "";
    document.getElementById("End").innerHTML = "Landed Safely in "+param.TotalTs/1000+"S. Well done Commander.";
    
    setTimeout(
    function()
    {
        document.getElementById("End").innerHTML += "<br /><br />Press AnyKey to restart";
        var reset = setInterval( 
            function()
            {
                restart(param,reset);},param.LoopIntervale); 
        
            }
    ,1000);
    
    
}
function lost(param){
    document.getElementById("Alt").innerHTML = "";
    document.getElementById("VActu").innerHTML = "";
    document.getElementById("Carb").innerHTML = "";
    document.getElementById("Ass").innerHTML = "";
    document.getElementById("time").innerHTML = "";
    document.getElementById("End").innerHTML = "Ouups !!!<br /> You crash yourself at " +Math.round(param.vitesseactuelle)+ "M/S.<br /> pitch angle : " +Math.round(param.inclinaison)+"<br />"+Math.round(param.carburantMax-param.carburant)+" Fuel Used <br /> Nothing remains of the ship ... nor of the crew ";
    
    setTimeout(
    function()
    {
        document.getElementById("End").innerHTML += "<br /><br />Press AnyKey to restart";
        var reset = setInterval( 
            function()
            {
                restart(param,reset);},param.LoopIntervale); 
        
            }
    ,1000);
    
}

function drawVais(param) {
    var vais = document.getElementById("Vais");
  
    vais.style.position = "absolute";
    vais.style.top = param.vaisTop+"%";
    vais.style.left = param.vaisLeft+"%";
  
    vais.style.width = param.vaisWidth+"%";
    vais.style.height = param.vaisHeight+"%";
  
  
  
    ctx = vais.getContext('2d');
    ctx.clearRect(0, 0, vais.width, vais.height);
    ctx.beginPath();

    ctx.translate(vais.width/2, vais.height/2);// on déplace le point du début du dessin au centre pour pouvoir tourner.
    
    ctx.rotate((Math.PI / 180) * 0); // on met le dessin a 0°
    ctx.rotate((Math.PI / 180) * param.roulis); // on incline le dessin a l'inclinaison calculée
    
    
    ctx.translate(-(vais.width/2), -(vais.height/2)); // on revient au debut
    
    
    ctx.fillStyle = "#ffffff";
    ctx.moveTo(vais.width/2, vais.height); // start at top left corner of canvas
    ctx.lineTo(vais.width, vais.height-vais.height); // go 200px to right (x), straight line from 0 to 0
    ctx.lineTo(vais.width-vais.width, vais.height-vais.height); // go to horizontal 100 (x) and vertical 200 (y)
    ctx.fill(); // connect and fill
    
    return vais;
}

function drawSol(param) {
      var Sol = document.getElementById("Sol");
  
    Sol.style.position = "absolute";
    Sol.style.top = param.solTop+"%";
    Sol.style.left = param.solLeft+"%";
  
    Sol.style.width = param.solWidth+"%";
    Sol.style.height = param.solHeight+"%";
  
  
  
    ctx = Sol.getContext('2d');
    ctx.beginPath();

    ctx.fillStyle = "#ffffff";
    ctx.moveTo(Sol.width/2, Sol.height); // start at top left corner of canvas
    ctx.lineTo(Sol.width, Sol.height-Sol.height); // go 200px to right (x), straight line from 0 to 0
    ctx.lineTo(Sol.width-Sol.width, Sol.height-Sol.height); // go to horizontal 100 (x) and vertical 200 (y)
    ctx.fill(); // connect and fill
    
    
    return Sol;
}
