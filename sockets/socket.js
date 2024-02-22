const { io }= require('../index');
const Band = require('../models/band');
const Bands = require('../models/bands');

const bands= new Bands;

bands.addBand(new Band('Metallica'));
bands.addBand(new Band('Bon Jovi'));
bands.addBand(new Band('Linkin Park'));
bands.addBand(new Band('Aerosmith'));

console.log(bands);

///Mensajes de sockets
io.on('connection', client => {
    console.log('Cliente conectado');
    client.emit('active-bands',bands.getBands());
    
    client.on('disconnect', () => {
        console.log('Cliente desconectado');
    });
    client.on('mensaje',(payload)=>{
        console.log('Mensaje del cliente!!!! ',payload);
    });
   
    client.on('emitir-mensaje',(payload)=>{
        io.emit('nuevo-mensaje',(payload)); //emite a todos
        //client.broadcast.emit('nuevo-mensaje',(payload)); //emite a todos menos al que lo emitio
    });
    client.on('enviando-mensaje',(payload)=>{
        //io.emit('client-message',(payload)); //emite a todos
        console.log('Se esta escuchando el mensaje que envia el cliente, el mensaje que envia es',payload);
        client.broadcast.emit('client-message',(payload)); //emite a todos menos al que lo emitio
    });
    ///Escuchando cuando se añade una banda
    client.on('add-band',(payload)=>{
        //io.emit('client-message',(payload)); //emite a todos
        console.log('banda a añadir',payload);
        
        bands.addBand(new Band(payload.name)); 
        io.emit('active-bands',bands.getBands());
        //client.broadcast.emit('client-message',(payload)); //emite a todos menos al que lo emitio
    });
    ///Escuhando para añadir un voto a la banda
    client.on('add-vote',(payload)=>{
        //io.emit('client-message',(payload)); //emite a tod
        console.log('voto para la banda',payload);
        bands.voteBand(payload.id);
         io.emit('active-bands',bands.getBands()); 
        
        //client.broadcast.emit('client-message',(payload)); //emite a todos menos al que lo emitio
    });
    /////Eliminar banda
    client.on('delete-band',(payload)=>{
        //io.emit('client-message',(payload)); //emite a todos
        console.log('se elimina esta banda con id',payload.id);
       bands.deleteBand(payload.id);
         io.emit('active-bands',bands.getBands()); 
        
        //client.broadcast.emit('client-message',(payload)); //emite a todos menos al que lo emitio
    });
    //io.emit('mensaje',{admin:'Mensaje del administrador'})
  });
/////////////