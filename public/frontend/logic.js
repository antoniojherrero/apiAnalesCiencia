let writer = false

let products = []
let people = []
let entities = []

if(window.sessionStorage.getItem('writer')){ writer=JSON.parse(window.sessionStorage.getItem('writer'))}
if(window.localStorage.getItem('products')){ products=JSON.parse(window.localStorage.getItem('products')) }
if(window.localStorage.getItem('people'))  { people=JSON.parse(window.localStorage.getItem('people')) }
if(window.localStorage.getItem('entities')){ entities=JSON.parse(window.localStorage.getItem('entities')) }

function buildDataSection(data,title){
    let section = document.createElement('section')
    section.innerHTML='<table></table>'
    
    let caption = document.createElement('caption')
    caption.appendChild(document.createTextNode(title))
    let tbody = document.createElement('tbody')
    tbody.setAttribute('id', title.toLowerCase())
    if(data.length==0){
        let tabla = section.getElementsByTagName('table')[0]
        let row = document.createElement('tr')
        let td = document.createElement('td')
        td.appendChild(document.createTextNode('(Vacio)'))
        row.appendChild(td)
        tbody.appendChild(row)
        tabla.appendChild(caption)
        tabla.appendChild(tbody)
        section.appendChild(tabla)
    }
    else{
        for(let i = 0; i<data.length;i++){
            let row = document.createElement('tr')
            row.setAttribute('id', i)
            let tableData = document.createElement('td')
            
            let image = document.createElement('img')
            image.setAttribute("src", data[i].image)
            image.setAttribute("width", 25)
            image.setAttribute("height", 25)
            tableData.appendChild(image)
            row.appendChild(tableData)

            tableData = document.createElement('td')
            tableData.setAttribute('class', 'elemName')
            
            if(data == products){ tableData.addEventListener('click',readProduct) }
            if(data == people){ tableData.addEventListener('click',readPerson)}
            if(data == entities){ tableData.addEventListener('click',readEntity)  }

            let name = document.createTextNode(data[i].name)
            tableData.appendChild(name)
            row.appendChild(tableData)

            if(writer){
                let formCell = document.createElement('td')
                let deleteBtn = document.createElement('input')
                deleteBtn.setAttribute('type','button')
                deleteBtn.setAttribute('value', 'Eliminar')
                let modifyBtn = document.createElement('input')
                modifyBtn.setAttribute('type', 'button')
                modifyBtn.setAttribute('value', 'Editar')
                if(data == products){
                    deleteBtn.addEventListener('click', deleteProduct)
                    modifyBtn.addEventListener('click', updateProduct)
                }
                if(data == people){
                    deleteBtn.addEventListener('click', deletePerson)
                    modifyBtn.addEventListener('click', updatePerson)
                }
                if(data == entities){
                    deleteBtn.addEventListener('click', deleteEntity)
                    modifyBtn.addEventListener('click', updateEntity)
                }
                formCell.appendChild(modifyBtn)
                formCell.appendChild(deleteBtn)
                row.appendChild(formCell)
            }

            tbody.appendChild(row)
        }
        tabla = section.getElementsByTagName('table')[0]
        tabla.appendChild(caption)
        tabla.appendChild(tbody)
    }

    if(writer){
        form = document.createElement('form')
        if(data == products){
            form.innerHTML='<input type="button" name="createProduct" value="Crear" onclick="crearProducto();">'
        }
        if(data == people){
            form.innerHTML='<input type="button" name="createPerson" value="Crear" onclick="crearPersona();">'
        }
        if(data == entities){
            form.innerHTML='<input type="button" name="createEntity" value="Crear" onclick="crearEntidad();">'
        }
        section.appendChild(form)
    }
    return section
}

function readIndex(){
    let loginForm = document.createElement('login')
    if(!writer){
        loginForm.innerHTML = 
        '<label for="user">Usuario</label> '+
        '<input id="user" type="text" name="user"/> '+
        '<label for="passwd">Contraseña</label> '+
        '<input id="passwd" type="password" name="passwd"/> '+
        '<input type="button" name="login" value="Iniciar Sesión" onclick="LogIn();"/>'
    }
    else{
        loginForm.innerHTML = '<input type="button" name="logout" value="Cerrar Sesión" onclick="LogOut();"/>'
    }
    let nav = document.getElementsByTagName('nav')[0]
    nav.innerHTML=''
    nav.appendChild(loginForm)
        
    let main = document.getElementsByTagName('main')[0]
    main.innerHTML=''
    main.appendChild(buildDataSection(products,'Productos'))
    main.appendChild(buildDataSection(people,'Personas'))
    main.appendChild(buildDataSection(entities,'Entidades'))
}

function LogIn() {
    let user = document.getElementById('user').value
    let passwd = document.getElementById('passwd').value
    let encontrado = false
    usuarios = JSON.parse(window.localStorage.getItem('users'))
    for(let usr in usuarios){
      if((usr==user) && (usuarios[usr]==passwd)){
        encontrado=true
        break;
      }
    }
    if(encontrado){
      writer=true
      window.sessionStorage.setItem('writer', writer)
      readIndex()
    }
    else{
      window.alert('Usuario o contraseña incorrectos')
    }
}

function LogOut(){
    writer=false
    window.sessionStorage.setItem('writer', writer)
    readIndex()
}

function readElement(elemento){
    let nav = document.getElementsByTagName('nav')[0]
    nav.innerHTML=''
    nav.innerHTML='<input type="button" name="inicio" value="Inicio" onclick="readIndex();">'

    let main = document.getElementsByTagName('main')[0]
    let birthday = new Date(elemento.birth)
    let deathday = new Date(elemento.death)
    death = !(deathday == 'Invalid Date') ? '<h3>Fallecimiento: '+deathday.getUTCDate()+' de '+(deathday.toLocaleString('default', { month: 'long' }))+' de '+deathday.getFullYear()+'</h3>':''
    main.innerHTML=''
    main.innerHTML=
    '<section style="width: 40%;">'+
        '<h2>'+elemento.name+'</h2>'+
        '<h3>Nacimiento: '+birthday.getUTCDate()+' de '+birthday.toLocaleString('default', { month: 'long' })+' de '+birthday.getFullYear()+'</h3>'+
        death+
        '<img src="'+elemento.image+'" alt="'+elemento.name+'" width="300" height="250">'+
        '<div><table id="productos" style="margin: 0px;">'+
        '</table>'+
        '<table id="entidades" style="margin: 0px;">'+
        '</table></div>'+
    '</section>'
    main.innerHTML+='<section style="width: 60%;"><iframe src="'+elemento.wiki+'" width=700 height=500></section>'

}

function readProduct(){
    let elemento = products[this.parentElement.id]
    
    readElement(elemento)

    let main = document.getElementsByTagName('main')[0]
    let footer = document.createElement('footer')
    let tablaPersonas = document.createElement('table')
    let caption = document.createElement('caption')

    footer.style.float='left'
    tablaPersonas.style.margin="0px"
    caption.innerHTML='Personas'
    tablaPersonas.appendChild(caption)

    let row = document.createElement('tr')
    if(elemento.people.length!=0){
        for(person of elemento.people){
            for(let i = 0; i<people.length; i++){
                if(person == people[i].id){
                    let tableData = document.createElement('td')
                    tableData.style.textAlign='center'
                    tableData.setAttribute('id', i)
                    let personImg = document.createElement('img')
                    personImg.setAttribute('src', people[i].image)
                    personImg.setAttribute('alt', people[i].name)
                    personImg.setAttribute('title', people[i].name)
                    personImg.setAttribute('width', 50)
                    personImg.setAttribute('height', 50)
                    personImg.addEventListener('click', readPerson)
                    personImg.style.cursor = 'pointer'
                    tableData.appendChild(personImg)
                    row.appendChild(tableData)
                    break
                }
            }
        }
    }
    else{
        row.innerHTML+='<td>(Vacío)</td>'
    }
    tablaPersonas.appendChild(row)
    footer.appendChild(tablaPersonas)

    let tablaEntidades = document.createElement('table')
    tablaEntidades.style.margin='0px'
    caption = document.createElement('caption')
    caption.innerHTML='Entidades'
    tablaEntidades.appendChild(caption)
    row = document.createElement('tr')
    if(elemento.entities.length!=0){
        for(entity of elemento.entities){
            for(let i = 0; i<entities.length; i++){
                if(entity == entities[i].id){
                    let tableData = document.createElement('td')
                    tableData.style.textAlign='center'
                    tableData.setAttribute('id', i)
                    let img = document.createElement('img')
                    img.setAttribute('src', entities[i].image)
                    img.setAttribute('alt', entities[i].name)
                    img.setAttribute('title', entities[i].name)
                    img.setAttribute('width', 50)
                    img.setAttribute('height', 50)
                    img.addEventListener('click', readEntity)
                    img.style.cursor = 'pointer'
                    tableData.appendChild(img)
                    row.appendChild(tableData)
                    break
                }
            }
        }
    }
    else{
        row.innerHTML+='<td>(Vacío)</td>'
    }
    tablaEntidades.appendChild(row)
    footer.appendChild(tablaEntidades)

    main.appendChild(footer)
}

function readPerson(){
    let elemento = people[this.parentElement.id]

    readElement(elemento)
}

function readEntity(){
    let elemento = entities[this.parentElement.id]

    readElement(elemento)

    let main = document.getElementsByTagName('main')[0]
    let footer = document.createElement('footer')
    footer.innerHTML='<h2 style="text-align: center;">Personas</h2>'
    if(elemento.people.length!=0){
        let i = 0
        let tablaPersonas = document.createElement('table')
        let row = document.createElement('tr')
        for(person of elemento.people){
            for(item of people){
                if(person == item.id){
                    let tableData = document.createElement('td')
                    tableData.style.textAlign='center'
                    tableData.setAttribute('id', i)
                    let img = document.createElement('img')
                    img.setAttribute('src', item.image)
                    img.setAttribute('alt', item.name)
                    img.setAttribute('title', item.name)
                    img.setAttribute('width', 50)
                    img.setAttribute('height', 50)
                    img.addEventListener('click', readPerson)
                    img.style.cursor = 'pointer'
                    tableData.appendChild(img)
                    row.appendChild(tableData)
                    break
                }
                i+=1
            }
        }
        tablaPersonas.appendChild(row)
        footer.appendChild(tablaPersonas)
    }
    else{
        footer.innerHTML+='<p>(Vacío)</p>'
    }
    main.appendChild(footer)
}

function create(title){
    let nav = document.getElementsByTagName('nav')[0]
    nav.innerHTML=''
    nav.innerHTML='<input type="button" name="cancel" value="Cancel" onclick="readIndex();">'
    let main = document.getElementsByTagName('main')[0]
    main.innerHTML=''
    let section = document.createElement('section')
    section.style.width='25%'
    section.style.maxWidth='50%'
    section.style.marginLeft='37.5%'
    section.style.textAlign='center'
    section.style.borderStyle='solid'
    section.style.borderWidth='medium'
    let funcionSubmit=''
    if(title==='Producto'){
        funcionSubmit='editProduct(this);'
    }
    else if(title==='Persona'){
        funcionSubmit='editPerson(this);'
    }
    else if(title==='Entidad'){
        funcionSubmit='editEntity(this);'
    }
    section.innerHTML='<form id="creationForm" onsubmit="'+funcionSubmit+'">'+
    '<fieldset>'+
    '<legend>Crear '+title+'</legend>'+
    '<label for="name">Nombre: </label>'+
    '<input type="text" id="name" name="Name" value="" required><br><br>'+
    '<label for="birth">Nacimiento: </label>'+
    '<input type="date" id="birth" name="Birth" required><br><br>'+
    '<label for="death">Fallecimiento: </label>'+
    '<input type="date" id="death" name="Death"><br><br>'+
    '<label for="image">URL Imagen: </label>'+
    '<input type="url" id="image" name="Image" required><br><br>'+
    '<label for="wiki">URL wiki: </label>'+
    '<input type="url" id="wiki" name="Wiki" required><br><br>'+
    '</fieldset>'+
    '</form>'
    
    main.appendChild(section)
}

function crearProducto(){
    create('Producto')
    
    let fieldset = document.getElementsByTagName('fieldset')[0]

    fieldset.innerHTML+='<h3 style="text-align: left; color: yellow;">Participantes<h3>'
    let peopleList = document.createElement('ul')
    peopleList.setAttribute('id','peopleList')
    for(person of people){
        let listItem = document.createElement('li')
        listItem.setAttribute('id', person.id)
        let label = document.createElement('label')
        label.setAttribute('for', person.id)
        label.appendChild(document.createTextNode(person.name))
        let checkbox = document.createElement('input')
        checkbox.setAttribute('id', person.id)
        checkbox.setAttribute('type','checkbox')
        listItem.appendChild(label)
        listItem.appendChild(checkbox)
        peopleList.appendChild(listItem)
    }
    fieldset.appendChild(peopleList)

    fieldset.innerHTML+='<h3 style="text-align: left; color: yellow;">Entidades colaboradoras<h3>'
    let entitiesList = document.createElement('ul')
    entitiesList.setAttribute('id','entitiesList')
    for(entity of entities){
        let listItem = document.createElement('li')
        listItem.setAttribute('id', entity.id)
        let label = document.createElement('label')
        label.setAttribute('for', entity.id)
        label.appendChild(document.createTextNode(entity.name))
        let checkbox = document.createElement('input')
        checkbox.setAttribute('id', entity.id)
        checkbox.setAttribute('type','checkbox')
        listItem.appendChild(label)
        listItem.appendChild(checkbox)
        entitiesList.appendChild(listItem)
    }
    fieldset.appendChild(entitiesList)

    fieldset.innerHTML+='<input type="submit" value="Enviar";">'
}

function crearPersona(){
    create('Persona')
    let fieldset = document.getElementsByTagName('fieldset')[0]
    fieldset.innerHTML+='<input type="submit" value="Enviar";">'
}

function crearEntidad(){
    create('Entidad')

    let fieldset = document.getElementsByTagName('fieldset')[0]

    fieldset.innerHTML+='<h3 style="text-align: left; color: yellow;">Participantes<h3>'
    let peopleList = document.createElement('ul')
    peopleList.setAttribute('id','peopleList')
    for(person of people){
        let listItem = document.createElement('li')
        listItem.setAttribute('id', person.id)
        let label = document.createElement('label')
        label.setAttribute('for', person.id)
        label.appendChild(document.createTextNode(person.name))
        let checkbox = document.createElement('input')
        checkbox.setAttribute('id', person.id)
        checkbox.setAttribute('type','checkbox')
        listItem.appendChild(label)
        listItem.appendChild(checkbox)
        peopleList.appendChild(listItem)
    }
    fieldset.appendChild(peopleList)

    fieldset.innerHTML+='<input type="submit" value="Enviar";">'
}

function editProduct(form){
    let fieldset=form.getElementsByTagName('fieldset')[0]
    let peopleList = document.getElementById('peopleList')
    let checkedPeople = []
    for(item of peopleList.getElementsByTagName('li')){
        if(item.getElementsByTagName('input')[0].checked){
            checkedPeople[checkedPeople.length]= +item.id
        }
    }
    let entitiesList = document.getElementById('entitiesList')
    let checkedEntities = []
    for(item of entitiesList.getElementsByTagName('li')){
        if(item.getElementsByTagName('input')[0].checked){
            checkedEntities[checkedEntities.length]= +item.id
        }
    }
    let producto = {
        id: Math.floor(Math.random()*Date.now()/100000000),
        name: fieldset.getElementsByTagName('input')[0].value,
        birth: fieldset.getElementsByTagName('input')[1].value,
        death: fieldset.getElementsByTagName('input')[2].value,
        image: fieldset.getElementsByTagName('input')[3].value,
        wiki: fieldset.getElementsByTagName('input')[4].value,
        people: checkedPeople,
        entities: checkedEntities
    }
    if(fieldset.id){
        producto.id=products[+fieldset.id].id
        products[+fieldset.id] = producto
    }
    else{
        products[products.length] = producto
    }
    window.localStorage.setItem('products', JSON.stringify(products))
}

function editPerson(form){
    let fieldset=form.getElementsByTagName('fieldset')[0]
    persona = {
        id: Math.floor(Math.random()*Date.now()/100000000),
        name: fieldset.getElementsByTagName('input')[0].value,
        birth: fieldset.getElementsByTagName('input')[1].value,
        death: fieldset.getElementsByTagName('input')[2].value,
        image: fieldset.getElementsByTagName('input')[3].value,
        wiki: fieldset.getElementsByTagName('input')[4].value,
    }
    if(fieldset.id){
        persona.id=people[+fieldset.id].id
        people[+fieldset.id] = persona
    }
    else{
        people[people.length] = persona
    }
    window.localStorage.setItem('people', JSON.stringify(people))
}

function editEntity(form){
    let fieldset=form.getElementsByTagName('fieldset')[0]
    let peopleList = document.getElementById('peopleList')
    let checkedPeople = []
    for(item of peopleList.getElementsByTagName('li')){
        if(item.getElementsByTagName('input')[0].checked){
            checkedPeople[checkedPeople.length]= +item.id
        }
    }
    entidad = {
        id: entities[entities.length-1].id+1,
        name: fieldset.getElementsByTagName('input')[0].value,
        birth: fieldset.getElementsByTagName('input')[1].value,
        death: fieldset.getElementsByTagName('input')[2].value,
        image: fieldset.getElementsByTagName('input')[3].value,
        wiki: fieldset.getElementsByTagName('input')[4].value,
        people: checkedPeople,
    }
    if(fieldset.id){
        entidad.id=entities[+fieldset.id].id
        entities[+fieldset.id] = entidad
    }
    else{
        entities[people.length] = entidad
    }
    window.localStorage.setItem('entities', JSON.stringify(entities))
}

function deleteProduct(){
    let indice = +this.parentElement.parentElement.id
    
    if(window.confirm('Eliminar definitivamente el producto: '+products[indice].name)){
        delete products[indice]
        products = products.filter(Boolean)
        window.localStorage.setItem('products', JSON.stringify(products))
    }
    readIndex()
}

function deletePerson(){
    let indice = +this.parentElement.parentElement.id
    
    if(window.confirm('Eliminar definitivamente la persona: '+people[indice].name)){
        delete people[indice]
        people = people.filter(Boolean)
        window.localStorage.setItem('people', JSON.stringify(people))
    }
    readIndex()
}
function deleteEntity(){
    let indice = +this.parentElement.parentElement.id
    
    if(window.confirm('Eliminar definitivamente la entidad: '+entities[indice].name)){
        delete entities[indice]
        entities = entities.filter(Boolean)
        window.localStorage.setItem('entities', JSON.stringify(entities))
    }
    readIndex()
}

function update(elemento,type,indice){
    let nav = document.getElementsByTagName('nav')[0]
    nav.innerHTML=''
    nav.innerHTML='<input type="button" name="cancel" value="Cancel" onclick="readIndex();">'
    let main = document.getElementsByTagName('main')[0]
    main.innerHTML=''
    let section = document.createElement('section')
    section.style.width='25%'
    section.style.maxWidth='50%'
    section.style.marginLeft='37.5%'
    section.style.textAlign='center'
    section.style.borderStyle='solid'
    section.style.borderWidth='medium'
    let funcionSubmit=''
    if(type==='productos'){
        funcionSubmit='editProduct(this);'
    }
    else if(type==='personas'){
        funcionSubmit='editPerson(this);'
    }
    else if(type==='entidades'){
        funcionSubmit='editEntity(this);'
    }
    section.innerHTML='<form id="editForm" onsubmit="'+funcionSubmit+'">'+
    '<fieldset id="'+indice+'">'+
    '<legend>Editar '+elemento.name+'</legend>'+
    '<label for="name">Nombre: </label>'+
    '<input type="text" id="name" name="Name" value="'+elemento.name+'" required><br><br>'+
    '<label for="birth">Nacimiento: </label>'+
    '<input type="date" id="birth" name="Birth" value="'+elemento.birth+'" required><br><br>'+
    '<label for="death">Fallecimiento: </label>'+
    '<input type="date" id="death" name="Death" value="'+elemento.death+'"><br><br>'+
    '<label for="image">URL Imagen: </label>'+
    '<input type="url" id="image" name="Image" value="'+elemento.image+'" required><br><br>'+
    '<label for="wiki">URL wiki: </label>'+
    '<input type="url" id="wiki" name="Wiki" value="'+elemento.wiki+'" required><br><br>'+
    '</fieldset>'+
    '</form>'

    main.appendChild(section)
}

function updateProduct(){
    let indice = +this.parentElement.parentElement.id
    let type = this.parentElement.parentElement.parentElement.id
    let elemento = products[indice]
    update(elemento,type,indice)

    let fieldset = document.getElementsByTagName('fieldset')[0]

    fieldset.innerHTML+='<h3 style="text-align: left; color: yellow;">Participantes</h3>'
    let peopleList = document.createElement('ul')
    peopleList.setAttribute('id','peopleList')
    for(person of people){
        let listItem = document.createElement('li')
        listItem.setAttribute('id', person.id)
        listItem.innerHTML='<label for="'+person.id+'">'+person.name+'</label>'
        let checkbox = document.createElement('input')
        checkbox.setAttribute('id', person.id)
        checkbox.setAttribute('type','checkbox')
        listItem.appendChild(checkbox)
        peopleList.appendChild(listItem)
    }
    fieldset.appendChild(peopleList)
    
    fieldset.innerHTML+='<h3 style="text-align: left; color: yellow;">Entidades colaboradoras</h3>'
    let entitiesList = document.createElement('ul')
    entitiesList.setAttribute('id','entitiesList')
    for(entity of entities){
        let listItem = document.createElement('li')
        listItem.setAttribute('id', entity.id)
        listItem.innerHTML='<label for="'+entity.id+'">'+entity.name+'</label>'
        let checkbox = document.createElement('input')
        checkbox.setAttribute('id', entity.id)
        checkbox.setAttribute('type','checkbox')
        let encontrado = false
        listItem.appendChild(checkbox)
        entitiesList.appendChild(listItem)
    }
    fieldset.appendChild(entitiesList)
    
    fieldset.innerHTML+='<input type="submit" value="Enviar">'
    
    for(item of document.getElementById('peopleList').children){
        for(person of elemento.people){
            if(person==item.children[1].id){
                item.children[1].checked=true
                break
            }
        }
    }
    for(item of document.getElementById('entitiesList').children){
        for(entity of elemento.entities){
            if(entity == item.children[1].id){
                item.children[1].checked=true
                break
            }
        }
    }
}

function updatePerson(){
    let indice = +this.parentElement.parentElement.id
    let type = this.parentElement.parentElement.parentElement.id
    let elemento = people[indice]
    update(elemento,type,indice)
    let fieldset = document.getElementsByTagName('fieldset')[0]
    fieldset.innerHTML+='<input type="submit" value="Enviar";">'
}

function updateEntity(){
    let indice = +this.parentElement.parentElement.id
    let type = this.parentElement.parentElement.parentElement.id
    let elemento = entities[indice]
    update(elemento,type,indice)

    let fieldset = document.getElementsByTagName('fieldset')[0]

    fieldset.innerHTML+='<h3 style="text-align: left; color: yellow;">Participantes</h3>'
    let peopleList = document.createElement('ul')
    peopleList.setAttribute('id','peopleList')
    for(person of people){
        let listItem = document.createElement('li')
        listItem.setAttribute('id', person.id)
        listItem.innerHTML='<label for="'+person.id+'">'+person.name+'</label>'
        let checkbox = document.createElement('input')
        checkbox.setAttribute('id', person.id)
        checkbox.setAttribute('type','checkbox')
        listItem.appendChild(checkbox)
        peopleList.appendChild(listItem)
    }
    fieldset.appendChild(peopleList)

    fieldset.innerHTML+='<input type="submit" value="Enviar">'
    
    for(item of document.getElementById('peopleList').children){
        for(person of elemento.people){
            if(person==item.children[1].id){
                item.children[1].checked=true
                break
            }
        }
    }
}