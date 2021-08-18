const express = require('express')
const initDb = require('./db')
const app = express()
const path = require('path');
const dataToSave=require("./excelData")

app.use(express.static(path.join(__dirname, '/public')));
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');



const imenaZupanija=[]
for (let i = 0; i < dataToSave.length; i++) {
    imenaZupanija.push(dataToSave[i].nazivZupanije)
}
    
function getUnique(array){
    var uniqueArray = [];
        
    // Loop through array values
    for(i=0; i < array.length; i++){
        if(uniqueArray.indexOf(array[i]) === -1) {
            uniqueArray.push(array[i]);
        }
    }
    return uniqueArray;
}
const uniqueZupanije = getUnique(imenaZupanija)
console.log(uniqueZupanije)
    

initDb().then(async (db) =>  {
     await db.collection('Mjesta').deleteMany()
     await db.collection('Mjesta').insertMany(dataToSave)

    app.get('/', async (req, res) => {
        const mjesta = await db.collection('Mjesta').find().toArray()
        const zupanijeBrojStanovnika = []

//kreiramo novo polje objekata sa propovima nazivZupanija i ukupan broj stanovnika
//ako naselje sa odredenom zupanijom postoji u polju pribrajamo brojStanovnika postojecem broju
//ako naselje sa odredenom zupanijom ne postoji u polju dodajemo tu zupaniju sa pocetnim brojem stanovnika od toga naselja
        for (const mjesto of mjesta) {
            const postojeciUnosIndex = zupanijeBrojStanovnika
                .findIndex((zupanijaBrojStanovnika) => zupanijaBrojStanovnika.nazivZupanije === mjesto.nazivZupanije)
            if (postojeciUnosIndex > -1) {
                zupanijeBrojStanovnika[postojeciUnosIndex].brojStanovnika += mjesto.brojStanovnika
                continue
            }
            zupanijeBrojStanovnika.push({
                nazivZupanije: mjesto.nazivZupanije,
                brojStanovnika: mjesto.brojStanovnika
            })

            
        }
 

        const sortiraneZup = zupanijeBrojStanovnika.sort((zupanija1, zupanija2) => zupanija2.brojStanovnika - zupanija1.brojStanovnika)
        
        const topTriZupanije = sortiraneZup.slice(0,3)
        const minTriZupanije = sortiraneZup.slice(sortiraneZup.length-3,sortiraneZup.length)
        
        res.send({ topTriZupanije,minTriZupanije,})
        
        
    })
    
    app.get('/test', function(req, res) {
        res.render('index', { title: 'Zupanije', zupanije: uniqueZupanije, naselja: dataToSave})
       
      });

    app.listen(process.env.port || 5000, function () {
        console.log('now listening for requests')
    })
}).catch(err => {
    console.error('Failed to make database connection!')
    console.error(err)
    process.exit(1)
})
