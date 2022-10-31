//archivo para agregarle utilidades al sw.js, aqui iran las funciones para que en sw,js no haya tanto código

//Guardar el cache dinamico
function actualizarCacheDinamico( dynamicCache, request, response ) {

    if (response.ok) {
        //guardar en cache
        return caches.open(dynamicCache).then(cache => {

            cache.put(request, response.clone());
            return response.clone();
        });

    }else{ //vendria un error de conexión o un 404 etc
        return response;
    }

}