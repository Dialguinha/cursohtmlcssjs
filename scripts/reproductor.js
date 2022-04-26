function iniciar() 
{
	maximo=700;
	
	medio=document.getElementById('medio');
	barra=document.getElementById('barra');
	progreso=document.getElementById('progreso');
	play=document.getElementById('play');
	silenciar=document.getElementById('silenciar');
	reiniciar=document.getElementById('reiniciar');
	masVolumen=document.getElementById('masVolumen');
	menosVolumen=document.getElementById('menosVolumen');
	adelantar=document.getElementById('adelantar');
	retrasar=document.getElementById('retrasar');

    /* obtener los objetos del resto de elementos necesarios */
	
	play.addEventListener('click', accionPlay, false);
	/* crear los manejadores de eventos para el resto de botones */

	barra.addEventListener('click', desplazarMedio, false);

	silenciar.addEventListener('click', accionSilenciar, false);
	reiniciar.addEventListener('click', accionReiniciar, false);
	masVolumen.addEventListener('click', accionMasVolumen, false);
	menosVolumen.addEventListener('click', accionMenosVolumen, false);
	adelantar.addEventListener('click', accionAdelantar, false);
	retrasar.addEventListener('click', accionRetrasar, false);
}

function redimensionaBarra()
{
	if(!medio.ended)
	{
		var total=parseInt(medio.currentTime*maximo / medio.duration);
		progreso.style.width=total+'px';
	}
	else
	{
		progreso.style.width='0px';
		play.value='\u25BA';
		window.clearInterval(bucle);
	}
}

function desplazarMedio(e)
{
	if(!medio.paused && !medio.ended)
	{
		var ratonX=e.pageX-barra.offsetLeft;
		var nuevoTiempo=ratonX*medio.duration/maximo;
		medio.currentTime=nuevoTiempo;
		progreso.style.width=ratonX+'px';
	}
}

function accionPlay()
{
	if(!medio.paused && !medio.ended) 
	{
		medio.pause();
		play.value='\u25BA';
		window.clearInterval(bucle);
	}
	else
	{
		medio.play();
		play.value='||';
		bucle=setInterval(redimensionaBarra, 1000);
	}
}





function accionSilenciar()
{
if (medio.muted) {

medio.muted = false;
silenciar.value = "silenciar";

}

else
{
	medio.muted = true;
	silenciar.value = "escuchar";
}

}

function accionReiniciar()
{
	medio.pause();
	medio.currentTime = 0;
	medio.load();
}


function accionMasVolumen()
{
	medio.volume +=0.1;
}

function accionMenosVolumen()
{
	medio.volume -=0.1;
}

function accionAdelantar()
{
	medio.currentTime +=5;
}

function accionRetrasar()
{
	medio.currentTime -=5;
}


window.addEventListener('load', iniciar, false);





var input = document.getElementById('email');


input.oninvalid = function(event) { event.target.setCustomValidity('Debes introducir una dirección de correo española (acabada en .es)'); }

const nombres = ['Pedro', 'Ana', 'Alex', 'Juan']

var inputt = document.getElementById('nombre')

if (inputt.contains(nombres) === false) {

	
	inputt.oninvalid = function(event) { event.target.setCustomValidity('El usuario introducido no existe'); }

}