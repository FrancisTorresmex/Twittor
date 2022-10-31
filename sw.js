//imports
importScripts('js/sw_utils.js');

const STATIC_CACHE_NAME = 'static-v1';
const DYNAMIC_CACHE_NAME = 'dynamic-v1';
const INMUTABLE_CACHE_NAME = 'inmutable-v1';

//cosas necesariar a guardar en cache para el arranque o funcionamiento de la app
const App_shell = [
    //'/',
    'index.html',
    '/css/style.css',
    'img/favicon.ico',
    'img/avatars/hulk.jpg',
    'img/avatars/thor.jpg',
    'img/avatars/wolverine.jpg',
    'img/avatars/ironman.jpg',
    'img/avatars/spiderman.jpg',
    'js/app.js',
    'js/sw_utils.js'
]; 

//lo que no se modificara nunca como librerias de terceros etc
const App_shell_inmutable = [
    'https://fonts.googleapis.com/css?family=Quicksand:300,400',
    'https://fonts.googleapis.com/css?family=Lato:400,300',
    'https://use.fontawesome.com/releases/v5.3.1/css/all.css',
    'css/animate.css',
    'js/libs/jquery.js',
];


//instalación del sw
self.addEventListener('install', e => {

    //abrir o crear el cache
    const cacheStatic = caches.open(STATIC_CACHE_NAME).then(cache => {
        cache.addAll(App_shell);
    });
    const cacheInmutble = caches.open(INMUTABLE_CACHE_NAME).then(cache => {
        cache.addAll(App_shell_inmutable);
    });

    e.waitUntil( Promise.all([cacheStatic, cacheInmutble]) ); //esperar a que se cumplan las promesas antes de seguir

});


//al activarse (luego de la instalación) (recuerda: solo es al instalarse la primera vez o remplazarse cuando se activa)
self.addEventListener('activate', e => {

    //Eliminar las caches staticas viejas 
    const resp = caches.keys().then(keys => {

        keys.forEach(key => {
            if (key !== STATIC_CACHE_NAME && key.includes('static')) {
                return caches.delete(key);
            }
        });

    });

    e.waitUntil(resp);

});


self.addEventListener('fetch', e => {

    //Usando la forma: cache with network fallback
    //obtener el recurso del cache si existe, si no lo busca en internet
    const respuesta = caches.match( e.request ).then(resp => {

        if (resp) {
            return resp;
        }else{
            return fetch(e.request).then(newResp => {
                return actualizarCacheDinamico(DYNAMIC_CACHE_NAME, e.request, newResp);            
            });

            console.log(e.request.url);
        }
        
    });

    e.respondWith(respuesta);

});