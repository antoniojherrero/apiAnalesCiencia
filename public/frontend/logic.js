let writer = false
let username = ''

function getProducts() {
    $.ajax({
        type: "GET",
        url: '/api/v1/products',
        headers: {"Authorization": JSON.parse(window.sessionStorage.getItem('usrData')).access_token},
        // dataType: 'json',
        success: function (data) {
            for (prod in data.products) {
                let elem = data.products[prod].product
                $('#productos').append(
                    '<tr id="' + elem.id + '">' +
                    '<td><img src="' + elem.imageUrl + '" width="25" height="25" alt=""></td>' +
                    '<td class="elemName" onclick="readProduct(this);">' + elem.name + '</td>' +
                    (writer ? '<td><input type="button" name="' + elem.name + '" value="Editar" onclick="updateProduct(this);"></td><td><input type="button" name="' + elem.name + '" value="Eliminar" onclick="deleteProduct(this);"></td>' : '') +
                    '</tr>'
                )
            }
        },
        error: function (jqXHR) {
            if (jqXHR.status === 404) {
                $('#products').append('<tr><td>(Vacio)</td></tr>')
            }
        }
    })
    if (writer) {
        $('#prodSection').append(
            '<form>' +
            '<input type="button" id="createProduct" value="Crear" onclick="crearProducto();">' +
            '</form>'
        )
    }
}

function getPersons() {
    $.ajax({
        type: "GET",
        url: '/api/v1/persons',
        headers: {"Authorization": JSON.parse(window.sessionStorage.getItem('usrData')).access_token},
        // dataType: 'json',
        success: function (data) {
            for (person in data.persons) {
                let elem = data.persons[person].person
                $('#personas').append(
                    '<tr id="' + elem.id + '">' +
                    '<td><img src="' + elem.imageUrl + '" width="25" height="25" alt=""></td>' +
                    '<td class="elemName" onclick="readPerson(this);">' + elem.name + '</td>' +
                    (writer ? '<td><input type="button" name="' + elem.name + '" value="Editar" onclick="updatePerson(this);"></td><td><input type="button" name="' + elem.name + '" value="Eliminar" onclick="deletePerson(this);"></td>' : '') +
                    '</tr>'
                )
            }
        },
        error: function (jqXHR) {
            if (jqXHR.status === 404) {
                $('#personas').append('<tr><td>(Vacio)</td></tr>')
            }
        }
    })
    if (writer) {
        $('#perSection').append(
            '<form>' +
            '<input type="button" id="createPerson" value="Crear" onclick="crearPersona();">' +
            '</form>'
        )
    }
}

function getEntities() {
    $.ajax({
        type: "GET",
        url: '/api/v1/entities',
        headers: {"Authorization": JSON.parse(window.sessionStorage.getItem('usrData')).access_token},
        // dataType: 'json',
        success: function (data) {
            for (entity in data.entities) {
                let elem = data.entities[entity].entity
                $('#entidades').append(
                    '<tr id="' + elem.id + '">' +
                    '<td><img src="' + elem.imageUrl + '" width="25" height="25" alt=""></td>' +
                    '<td class="elemName" onclick="readEntity(this);">' + elem.name + '</td>' +
                    (writer ? '<td><input type="button" name="' + elem.name + '" value="Editar" onclick="updateEntity(this);"></td><td><input type="button" name="' + elem.name + '" value="Eliminar" onclick="deleteEntity(this);"></td>' : '') +
                    '</tr>'
                )
            }
        },
        error: function (jqXHR) {
            if (jqXHR.status === 404) {
                $('#entidades').append('<tr><td>(Vacio)</td></tr>')
            }
        }
    })
    if (writer) {
        $('#etySection').append(
            '<form>' +
            '<input type="button" id="createEntity" value="Crear" onclick="crearEntidad();">' +
            '</form>'
        )
    }
}

function readIndex() {
    writer = JSON.parse(window.sessionStorage.getItem('writer'))
    username = JSON.parse(window.sessionStorage.getItem('usrData')).username
    let navForm = document.createElement('form')
    navForm.innerHTML = '<label for="username">Perfil: </label>'
    navForm.innerHTML += '<input type="button" id="username" value="' + username + '" onclick="showProfile();"/> '
    navForm.innerHTML += '<input type="button" id="logout" value="Cerrar Sesión" onclick="LogOut();"/>'
    navForm.innerHTML += (writer ? '<input style="float: right" type="button" id="userMgmt" value="Usuarios" onclick="getUsers();"/>' : '')
    let nav = document.getElementsByTagName('nav')[0]
    nav.innerHTML = ''
    nav.appendChild(navForm)


    let main = document.getElementsByTagName('main')[0]
    main.innerHTML = ''
    main.innerHTML += '<section id="prodSection">' +
        '<table>' +
        '<caption>Productos</caption>' +
        '<tbody id="productos"></tbody>' +
        '</table>' +
        '</section>'
    main.innerHTML += '<section id="perSection">' +
        '<table>' +
        '<caption>Personas</caption>' +
        '<tbody id="personas"></tbody>' +
        '</table>' +
        '</section>'
    main.innerHTML += '<section id="etySection">' +
        '<table>' +
        '<caption>Entidades</caption>' +
        '<tbody id="entidades"></tbody>' +
        '</table>' +
        '</section>'

    getProducts()
    getPersons()
    getEntities()
}

function LogInAjax() {
    let authHeader = null;

    $.post(
        "/access_token",
        $("#form-login").serialize(),
        null
    ).success(function (data, textStatus, request) {
        // => show scopes, users, products, ...
        authHeader = request.getResponseHeader('Authorization');
        let token = authHeader.split(' ')[1];   // Elimina 'Bearer '
        let usrData = JSON.parse(atob(token.split('.')[1]));

        if (usrData.scopes.length === 2) {
            window.sessionStorage.setItem('writer', true)
        } else {
            window.sessionStorage.setItem('writer', false)
        }

        data.id = usrData.uid
        data.username = usrData.sub

        window.sessionStorage.setItem('usrData', JSON.stringify(data))
        readIndex()
        console.log(data)

    }).fail(function (xhr) {
        let message
        if (xhr.responseJSON && xhr.responseJSON.error_description) {
            message = xhr.responseJSON.error_description;
        }
        alert("Error! \n" + message)
    });
}

function LogOut() {
    if (window.confirm('Cerrar la sesión de ' + username + ' ?')) {
        window.sessionStorage.clear()
        window.location.reload()
    }
}

function readElement(elemento) {
    let nav = document.getElementsByTagName('nav')[0]
    nav.innerHTML = ''
    nav.innerHTML = '<input type="button" name="inicio" value="Inicio" onclick="readIndex();">'

    let main = document.getElementsByTagName('main')[0]
    let birthday = new Date(elemento.birthDate)
    let deathday = new Date(elemento.deathDate)
    death = !deathday ? '<h3>Fallecimiento: ' + deathday.getUTCDate() + ' de ' + (deathday.toLocaleString('default', {month: 'long'})) + ' de ' + deathday.getFullYear() + '</h3>' : ''
    main.innerHTML = ''
    main.innerHTML =
        '<section style="width: 40%;">' +
        '<h2>' + elemento.name + '</h2>' +
        '<h3>Nacimiento: ' + birthday.getUTCDate() + ' de ' + birthday.toLocaleString('default', {month: 'long'}) + ' de ' + birthday.getFullYear() + '</h3>' +
        death +
        '<img src="' + elemento.imageUrl + '" alt="' + elemento.name + '" width="300" height="250">' +
        '<div><table id="productos" style="margin: 0px;">' +
        '</table>' +
        '<table id="entidades" style="margin: 0px;">' +
        '</table></div>' +
        '</section>'
    main.innerHTML += '<section style="width: 60%;"><iframe src="' + ((elemento.wikiUrl) ? elemento.wikiUrl : "") + '"  width=700 height=500></section>'

}

function printRelatedProducts(data) {
    if (data.products.length !== 0) {
        for (prod in data.products) {
            let elem = data.products[prod].product
            $('#relProducts').append(
                '<tr id="' + elem.id + '">' +
                '<td><img src="' + elem.imageUrl + '" height="30" width="30"></td>' +
                '<td class="elemName" onclick="readProduct(this)">' + elem.name + '</td>' +
                '</tr>')
        }
    } else {
        $('#relProducts').append('<tr><td>(Vacio)</td></tr>')
    }
}

function printRelatedPersons(data) {
    if (data.persons.length !== 0) {
        for (person in data.persons) {
            let elem = data.persons[person].person
            $('#relPersons').append(
                '<tr id="' + elem.id + '">' +
                '<td><img src="' + elem.imageUrl + '" height="30" width="30"></td>' +
                '<td class="elemName" onclick="readPerson(this)">' + elem.name + '</td>' +
                '</tr>')
        }
    } else {
        $('#relPersons').append('<tr><td>(Vacio)</td></tr>')
    }
}

function printRelatedEntities(data) {
    if (data.entities.length !== 0) {
        for (entity in data.entities) {
            let elem = data.entities[entity].entity
            $('#relEntities').append(
                '<tr id="' + elem.id + '">' +
                '<td><img src="' + elem.imageUrl + '" height="30" width="30"></td>' +
                '<td class="elemName" onclick="readEntity(this)">' + elem.name + '</td>' +
                '</tr>')
        }
    } else {
        $('#relEntities').append('<tr><td>(Vacio)</td></tr>')
    }
}

function readProduct(elem) {
    let elementoId = elem.parentElement.id
    $.ajax({
        type: "GET",
        url: '/api/v1/products/' + elementoId,
        headers: {"Authorization": JSON.parse(window.sessionStorage.getItem('usrData')).access_token},
        success: function (data) {
            readElement(data.product)
            $('main').append('<footer style="float: left">' +
                '<table style="float: left; width=50%;">' +
                '<caption>Personas relacionadas</caption><tbody id="relPersons"></tbody>' +
                '</table>' +
                '<table style="float: left; width: 50%;">' +
                '<caption>Entidades relacionadas</caption><tbody id="relEntities"></tbody>' +
                '</table>' +
                '</footer>')
        }
    })
    $.ajax({
        type: "GET",
        url: '/api/v1/products/' + elementoId + '/persons',
        headers: {"Authorization": JSON.parse(window.sessionStorage.getItem('usrData')).access_token},
        success: function (data) {
            printRelatedPersons(data)
        }
    })
    $.ajax({
        type: "GET",
        url: '/api/v1/products/' + elementoId + '/entities',
        headers: {"Authorization": JSON.parse(window.sessionStorage.getItem('usrData')).access_token},
        success: function (data) {
            printRelatedEntities(data)
        }
    })
}

function readPerson(elem) {
    let elementoId = elem.parentElement.id

    $.ajax({
        type: "GET",
        url: '/api/v1/persons/' + elementoId,
        headers: {"Authorization": JSON.parse(window.sessionStorage.getItem('usrData')).access_token},
        success: function (data) {
            readElement(data.person)
            $('main').append('<footer style="float: left">' +
                '<table style="float: left; width=50%;">' +
                '<caption>Productos relacionados</caption><tbody id="relProducts"></tbody>' +
                '</table>' +
                '<table style="float: left; width: 50%;">' +
                '<caption>Entidades relacionadas</caption><tbody id="relEntities"></tbody>' +
                '</table>' +
                '</footer>')
        }
    })
    $.ajax({
        type: "GET",
        url: '/api/v1/persons/' + elementoId + '/products',
        headers: {"Authorization": JSON.parse(window.sessionStorage.getItem('usrData')).access_token},
        success: function (data) {
            printRelatedProducts(data)
        }
    })
    $.ajax({
        type: "GET",
        url: '/api/v1/persons/' + elementoId + '/entities',
        headers: {"Authorization": JSON.parse(window.sessionStorage.getItem('usrData')).access_token},
        success: function (data) {
            printRelatedEntities(data)
        }
    })
}

function readEntity(elem) {
    let elementoId = elem.parentElement.id

    $.ajax({
        type: "GET",
        url: '/api/v1/entities/' + elementoId,
        headers: {"Authorization": JSON.parse(window.sessionStorage.getItem('usrData')).access_token},
        success: function (data) {
            readElement(data.entity)
            $('main').append('<footer style="float: left">' +
                '<table style="float: left; width=50%;">' +
                '<caption>Personas relacionadas</caption><tbody id="relPersons"></tbody>' +
                '</table>' +
                '<table style="float: left; width: 50%;">' +
                '<caption>Productos relacionados</caption><tbody id="relProducts"></tbody>' +
                '</table>' +
                '</footer>')
        }
    })
    $.ajax({
        type: "GET",
        url: '/api/v1/entities/' + elementoId + '/persons',
        headers: {"Authorization": JSON.parse(window.sessionStorage.getItem('usrData')).access_token},
        success: function (data) {
            printRelatedPersons(data)
        }
    })
    $.ajax({
        type: "GET",
        url: '/api/v1/entities/' + elementoId + '/products',
        headers: {"Authorization": JSON.parse(window.sessionStorage.getItem('usrData')).access_token},
        success: function (data) {
            printRelatedProducts(data)
        }
    })
}

function create(title) {
    let nav = document.getElementsByTagName('nav')[0]
    nav.innerHTML = ''
    nav.innerHTML = '<input type="button" name="cancel" value="Cancel" onclick="readIndex();">'
    let main = document.getElementsByTagName('main')[0]
    main.innerHTML = ''
    let section = document.createElement('section')
    section.style.width = '25%'
    section.style.maxWidth = '50%'
    section.style.marginLeft = '37.5%'
    section.style.textAlign = 'center'
    section.style.borderStyle = 'solid'
    section.style.borderWidth = 'medium'

    section.innerHTML = '<form id="creationForm">' +
        '<fieldset>' +
        '<legend>Crear ' + title + '</legend>' +
        '<label for="name">Nombre: </label>' +
        '<input type="text" id="name" name="Name" value="" required><br><br>' +
        '<label for="birth">Nacimiento: </label>' +
        '<input type="date" id="birth" name="Birth" required><br><br>' +
        '<label for="death">Fallecimiento: </label>' +
        '<input type="date" id="death" name="Death"><br><br>' +
        '<label for="image">URL Imagen: </label>' +
        '<input type="url" id="image" name="Image" required><br><br>' +
        '<label for="wiki">URL wiki: </label>' +
        '<input type="url" id="wiki" name="Wiki" required><br><br>' +
        '</fieldset>' +
        '<input id="btn-enviar" type="submit" value="Enviar">' +
        '</form>'

    main.appendChild(section)
}

function crearProducto() {
    create('Producto')

    $('#creationForm').on('submit', () => {
        editProduct()
    })

    $.ajax({
        type: "GET",
        url: '/api/v1/persons',
        async: false,
        headers: {"Authorization": JSON.parse(window.sessionStorage.getItem('usrData')).access_token},
        // dataType: 'json',
        success: function (data) {
            if (data.persons.length > 0) {
                $('fieldset').append('<h3>Participantes</h3><ul id="peopleList"></ul>')
                for (person in data.persons) {
                    let elemento = data.persons[person].person
                    $('#peopleList').append(
                        '<li id="' + elemento.id + '">' +
                        '<label for="' + elemento.id + '">' + elemento.name + '</label>' +
                        '<input id="' + elemento.id + '" type="checkbox">' +
                        '</li>'
                    )
                }
            }
        }
    })

    $.ajax({
        type: "GET",
        url: '/api/v1/entities',
        async: false,
        headers: {"Authorization": JSON.parse(window.sessionStorage.getItem('usrData')).access_token},
        // dataType: 'json',
        success: function (data) {
            if (data.entities.length > 0) {
                $('fieldset').append('<h3>Entidades colaboradoras</h3><ul id="entitiesList"></ul>')
                for (entity in data.entities) {
                    let elemento = data.entities[entity].entity
                    $('#entitiesList').append(
                        '<li id="' + elemento.id + '">' +
                        '<label for="' + elemento.id + '">' + elemento.name + '</label>' +
                        '<input id="' + elemento.id + '" type="checkbox">' +
                        '</li>'
                    )
                }
            }
        }
    })
}

function crearPersona() {
    create('Persona')

    $('#creationForm').on('submit', () => {
        editPerson()
    })

    $.ajax({
        type: "GET",
        url: '/api/v1/products',
        async: false,
        headers: {"Authorization": JSON.parse(window.sessionStorage.getItem('usrData')).access_token},
        // dataType: 'json',
        success: function (data) {
            if (data.products.length > 0) {
                $('fieldset').append('<h3>Productos</h3><ul id="productsList"></ul>')
                for (product in data.products) {
                    let elemento = data.products[product].product

                    $('#productsList').append(
                        '<li id="' + elemento.id + '">' +
                        '<label for="' + elemento.id + '">' + elemento.name + '</label>' +
                        '<input id="' + elemento.id + '" type="checkbox">' +
                        '</li>'
                    )
                }
            }
        }
    })

    $.ajax({
        type: "GET",
        url: '/api/v1/entities',
        async: false,
        headers: {"Authorization": JSON.parse(window.sessionStorage.getItem('usrData')).access_token},
        // dataType: 'json',
        success: function (data) {
            if (data.entities.length > 0) {
                $('fieldset').append('<h3>Entidades colaboradoras</h3><ul id="entitiesList"></ul>')
                for (entity in data.entities) {
                    let elemento = data.entities[entity].entity
                    $('#entitiesList').append(
                        '<li id="' + elemento.id + '">' +
                        '<label for="' + elemento.id + '">' + elemento.name + '</label>' +
                        '<input id="' + elemento.id + '" type="checkbox">' +
                        '</li>'
                    )
                }
            }
        }
    })
}

function crearEntidad() {
    create('Entidad')

    $('#creationForm').on('submit', () => {
        editEntity()
    })

    $.ajax({
        type: "GET",
        url: '/api/v1/products',
        async: false,
        headers: {"Authorization": JSON.parse(window.sessionStorage.getItem('usrData')).access_token},
        // dataType: 'json',
        success: function (data) {
            if (data.products.length > 0) {
                $('fieldset').append('<h3>Productos</h3><ul id="productsList"></ul>')
                for (product in data.products) {
                    let elemento = data.products[product].product

                    $('#productsList').append(
                        '<li id="' + elemento.id + '">' +
                        '<label for="' + elemento.id + '">' + elemento.name + '</label>' +
                        '<input id="' + elemento.id + '" type="checkbox">' +
                        '</li>'
                    )
                }
            }
        }
    })
    $.ajax({
        type: "GET",
        url: '/api/v1/persons',
        async: false,
        headers: {"Authorization": JSON.parse(window.sessionStorage.getItem('usrData')).access_token},
        // dataType: 'json',
        success: function (data) {
            if (data.persons.length > 0) {
                $('fieldset').append('<h3>Participantes</h3><ul id="peopleList"></ul>')
                for (person in data.persons) {
                    let elemento = data.persons[person].person
                    $('#peopleList').append(
                        '<li id="' + elemento.id + '">' +
                        '<label for="' + elemento.id + '">' + elemento.name + '</label>' +
                        '<input id="' + elemento.id + '" type="checkbox">' +
                        '</li>'
                    )
                }
            }
        }
    })
}

function editRelatedProducts(relatedTo, elem, productsList) {
    let add = (id) => {
        $.ajax({
            type: "PUT",
            url: '/api/v1/' + relatedTo + '/' + elem.id + '/products/add/' + id,
            async: false,
            headers: {"Authorization": 'Bearer ' + JSON.parse(window.sessionStorage.getItem('usrData')).access_token},
        })
    }
    let rem = (id) => {
        $.ajax({
            type: "PUT",
            url: '/api/v1/' + relatedTo + '/' + elem.id + '/products/rem/' + id,
            async: false,
            headers: {"Authorization": 'Bearer ' + JSON.parse(window.sessionStorage.getItem('usrData')).access_token},
        })
    }
    for (item of productsList.getElementsByTagName('li')) {
        if (!elem.products) {
            if (item.getElementsByTagName('input')[0].checked) {
                add(item.id)
            }
        } else {
            if (item.getElementsByTagName('input')[0].checked && !elem.products.includes(+item.id)) {
                add(item.id)
            } else if (!item.getElementsByTagName('input')[0].checked && elem.products.includes(+item.id)) {
                rem(item.id)
            }
        }
    }
}

function editRelatedPersons(relatedTo, elem, peopleList) {
    let add = (id) => {
        $.ajax({
            type: "PUT",
            url: '/api/v1/' + relatedTo + '/' + elem.id + '/persons/add/' + id,
            async: false,
            headers: {"Authorization": 'Bearer ' + JSON.parse(window.sessionStorage.getItem('usrData')).access_token},
        })
    }
    let rem = (id) => {
        $.ajax({
            type: "PUT",
            url: '/api/v1/' + relatedTo + '/' + elem.id + '/persons/rem/' + id,
            async: false,
            headers: {"Authorization": 'Bearer ' + JSON.parse(window.sessionStorage.getItem('usrData')).access_token},
        })
    }
    for (item of peopleList.getElementsByTagName('li')) {
        if (!elem.persons) {
            if (item.getElementsByTagName('input')[0].checked) {
                add(item.id)
            }
        } else {
            if (item.getElementsByTagName('input')[0].checked && !elem.persons.includes(+item.id)) {
                add(item.id)
            } else if (!item.getElementsByTagName('input')[0].checked && elem.persons.includes(+item.id)) {
                rem(item.id)
            }
        }
    }
}

function editRelatedEntities(relatedTo, elem, entitiesList) {
    let add = (id) => {
        $.ajax({
            type: "PUT",
            url: '/api/v1/' + relatedTo + '/' + elem.id + '/entities/add/' + id,
            async: false,
            headers: {"Authorization": 'Bearer ' + JSON.parse(window.sessionStorage.getItem('usrData')).access_token},
        })
    }
    let rem = (id) => {
        $.ajax({
            type: "PUT",
            url: '/api/v1/' + relatedTo + '/' + elem.id + '/entities/rem/' + id,
            async: false,
            headers: {"Authorization": 'Bearer ' + JSON.parse(window.sessionStorage.getItem('usrData')).access_token},
        })
    }
    for (item of entitiesList.getElementsByTagName('li')) {
        if (!elem.entities) {
            if (item.getElementsByTagName('input')[0].checked && !elem.entities) {
                add(item.id)
            }
        } else {
            if (item.getElementsByTagName('input')[0].checked && !elem.entities.includes(+item.id)) {
                add(item.id)
            } else if (!item.getElementsByTagName('input')[0].checked && elem.entities.includes(+item.id)) {
                rem(item.id)
            }
        }
    }
}

function editProduct(etag = null) {
    let fieldset = document.getElementsByTagName('fieldset')[0]
    let peopleList = document.getElementById('peopleList')
    let entitiesList = document.getElementById('entitiesList')

    let producto = {
        name: fieldset.getElementsByTagName('input')[0].value,
        birthDate: fieldset.getElementsByTagName('input')[1].value,
        deathDate: fieldset.getElementsByTagName('input')[2].value,
        imageUrl: fieldset.getElementsByTagName('input')[3].value,
        wikiUrl: fieldset.getElementsByTagName('input')[4].value,
    }

    if (etag) {
        $.ajax({
            type: "PUT",
            url: '/api/v1/products/' + fieldset.id,
            async: false,
            headers: {
                "Authorization": 'Bearer ' + JSON.parse(window.sessionStorage.getItem('usrData')).access_token,
                "if-match": etag
            },
            data: producto,
            // dataType: 'json',
            success: function (data) {
                editRelatedPersons('products', data.product, peopleList)
                editRelatedEntities('products', data.product, entitiesList)
            }
        })

    } else {
        $.ajax({
            type: "POST",
            url: '/api/v1/products',
            headers: {"Authorization": 'Bearer ' + JSON.parse(window.sessionStorage.getItem('usrData')).access_token},
            data: producto,
            // dataType: 'json',
            success: function (data) {
                editRelatedPersons('products', data.product, peopleList)
                editRelatedEntities('products', data.product, entitiesList)
            }
        })
    }
    readIndex()
}

function editPerson(etag = null) {
    let fieldset = document.getElementsByTagName('fieldset')[0]
    let productsList = document.getElementById('productsList')
    let entitiesList = document.getElementById('entitiesList')

    let persona = {
        name: fieldset.getElementsByTagName('input')[0].value,
        birthDate: fieldset.getElementsByTagName('input')[1].value,
        deathDate: fieldset.getElementsByTagName('input')[2].value,
        imageUrl: fieldset.getElementsByTagName('input')[3].value,
        wikiUrl: fieldset.getElementsByTagName('input')[4].value,
    }

    if (etag) {
        $.ajax({
            type: "PUT",
            url: '/api/v1/persons/' + fieldset.id,
            async: false,
            headers: {
                "Authorization": 'Bearer ' + JSON.parse(window.sessionStorage.getItem('usrData')).access_token,
                "if-match": etag
            },
            data: persona,
            // dataType: 'json',
            success: function (data) {
                editRelatedProducts('persons', data.person, productsList)
                editRelatedEntities('persons', data.person, entitiesList)
            }
        })
    } else {
        $.ajax({
            type: "POST",
            url: '/api/v1/persons',
            headers: {"Authorization": 'Bearer ' + JSON.parse(window.sessionStorage.getItem('usrData')).access_token},
            data: persona,
            // dataType: 'json',
            success: function (data) {
                editRelatedProducts('persons', data.person, productsList)
                editRelatedEntities('persons', data.person, entitiesList)
            }
        })
    }
    readIndex()
}

function editEntity(etag = null) {
    let fieldset = document.getElementsByTagName('fieldset')[0]
    let productsList = document.getElementById('productsList')
    let peopleList = document.getElementById('peopleList')

    let entidad = {
        name: fieldset.getElementsByTagName('input')[0].value,
        birthDate: fieldset.getElementsByTagName('input')[1].value,
        deathDate: fieldset.getElementsByTagName('input')[2].value,
        imageUrl: fieldset.getElementsByTagName('input')[3].value,
        wikiUrl: fieldset.getElementsByTagName('input')[4].value,
    }
    if (etag) {
        $.ajax({
            type: "PUT",
            url: '/api/v1/entities/' + fieldset.id,
            async: false,
            headers: {
                "Authorization": 'Bearer ' + JSON.parse(window.sessionStorage.getItem('usrData')).access_token,
                "if-match": etag
            },
            data: entidad,
            // dataType: 'json',
            success: function (data) {
                editRelatedProducts('entities', data.entity, productsList)
                editRelatedPersons('entities', data.entity, peopleList)
            }
        })
    } else {
        $.ajax({
            type: "POST",
            url: '/api/v1/entities',
            headers: {"Authorization": 'Bearer ' + JSON.parse(window.sessionStorage.getItem('usrData')).access_token},
            data: entidad,
            // dataType: 'json',
            success: function (data) {
                editRelatedProducts('entities', data.entity, productsList)
                editRelatedPersons('entities', data.entity, peopleList)
            }
        })
    }
    readIndex()
}

function deleteProduct(elem) {
    let indice = elem.parentElement.parentElement.id

    if (window.confirm('Eliminar definitivamente el producto: ' + elem.name)) {
        $.ajax({
            type: 'DELETE',
            url: '/api/v1/products/' + indice,
            headers: {"Authorization": 'Bearer ' + JSON.parse(window.sessionStorage.getItem('usrData')).access_token},
        })
    }
    readIndex()
}

function deletePerson(elem) {
    let indice = elem.parentElement.parentElement.id

    if (window.confirm('Eliminar definitivamente la persona: ' + elem.name)) {
        $.ajax({
            type: 'DELETE',
            url: '/api/v1/persons/' + indice,
            headers: {"Authorization": 'Bearer ' + JSON.parse(window.sessionStorage.getItem('usrData')).access_token},
        })
    }
    readIndex()
}

function deleteEntity(elem) {
    let indice = elem.parentElement.parentElement.id

    if (window.confirm('Eliminar definitivamente la entidad: ' + elem.name)) {
        $.ajax({
            type: 'DELETE',
            url: '/api/v1/entities/' + indice,
            headers: {"Authorization": 'Bearer ' + JSON.parse(window.sessionStorage.getItem('usrData')).access_token},
        })
    }
    readIndex()
}

function update(elemento) {

    let nav = document.getElementsByTagName('nav')[0]
    nav.innerHTML = ''
    nav.innerHTML = '<input type="button" name="cancel" value="Cancel" onclick="readIndex();">'
    let main = document.getElementsByTagName('main')[0]
    main.innerHTML = ''
    let section = document.createElement('section')
    section.style.width = '25%'
    section.style.maxWidth = '50%'
    section.style.marginLeft = '37.5%'
    section.style.textAlign = 'center'
    section.style.borderStyle = 'solid'
    section.style.borderWidth = 'medium'

    section.innerHTML = '<form id="editForm">' +
        '<fieldset id="' + elemento.id + '">' +
        '<legend>Editar ' + elemento.name + '</legend>' +
        '<label for="name">Nombre: </label>' +
        '<input type="text" id="name" name="Name" value="' + elemento.name + '" required><br><br>' +
        '<label for="birth">Nacimiento: </label>' +
        '<input type="date" id="birth" name="Birth" value="' + elemento.birthDate + '" required><br><br>' +
        '<label for="death">Fallecimiento: </label>' +
        '<input type="date" id="death" name="Death" value="' + elemento.deathDate + '"><br><br>' +
        '<label for="image">URL Imagen: </label>' +
        '<input type="url" id="image" name="Image" value="' + elemento.imageUrl + '" required><br><br>' +
        '<label for="wiki">URL wiki: </label>' +
        '<input type="url" id="wiki" name="Wiki" value="' + elemento.wikiUrl + '" required><br><br>' +
        '</fieldset>' +
        '<input id="btn-enviar" type="submit" value="Enviar">' +
        '</form>'

    main.appendChild(section)
}

function updateProduct(elem) {
    let indice = elem.parentElement.parentElement.id
    let producto
    $.ajax({
        type: "GET",
        url: '/api/v1/products/' + indice,
        async: false,
        headers: {"Authorization": JSON.parse(window.sessionStorage.getItem('usrData')).access_token},
        // dataType: 'json',
        success: function (data, textStatus, request) {
            producto = data.product
            update(producto)
            $('#editForm').on('submit', () => {
                editProduct(request.getResponseHeader('etag'))
            })
        }
    })
    $.ajax({
        type: "GET",
        url: '/api/v1/persons',
        async: false,
        headers: {"Authorization": JSON.parse(window.sessionStorage.getItem('usrData')).access_token},
        // dataType: 'json',
        success: function (data) {
            if (data.persons.length > 0) {
                $('fieldset').append('<h3>Participantes</h3><ul id="peopleList"></ul>')
                for (person in data.persons) {
                    let elemento = data.persons[person].person
                    let checked = ''
                    if (producto.persons) {
                        checked = (producto.persons.includes(elemento.id) ? 'checked' : '')
                    }
                    $('#peopleList').append(
                        '<li id="' + elemento.id + '">' +
                        '<label for="' + elemento.id + '">' + elemento.name + '</label>' +
                        '<input id="' + elemento.id + '" type="checkbox" ' + checked + '>' +
                        '</li>'
                    )
                }
            }
        }
    })

    $.ajax({
        type: "GET",
        url: '/api/v1/entities',
        async: false,
        headers: {"Authorization": JSON.parse(window.sessionStorage.getItem('usrData')).access_token},
        // dataType: 'json',
        success: function (data) {
            if (data.entities.length > 0) {
                $('fieldset').append('<h3>Entidades colaboradoras</h3><ul id="entitiesList"></ul>')
                for (entity in data.entities) {
                    let elemento = data.entities[entity].entity
                    let checked = ''
                    if (producto.entities) {
                        checked = (producto.entities.includes(elemento.id) ? 'checked' : '')
                    }
                    $('#entitiesList').append(
                        '<li id="' + elemento.id + '">' +
                        '<label for="' + elemento.id + '">' + elemento.name + '</label>' +
                        '<input id="' + elemento.id + '" type="checkbox" ' + checked + '>' +
                        '</li>'
                    )
                }
            }
        }
    })

}

function updatePerson(elem) {
    let indice = elem.parentElement.parentElement.id
    let person
    $.ajax({
        type: "GET",
        url: '/api/v1/persons/' + indice,
        async: false,
        headers: {"Authorization": JSON.parse(window.sessionStorage.getItem('usrData')).access_token},
        // dataType: 'json',
        success: function (data, textStatus, request) {
            person = data.person
            update(person)
            $('#editForm').on('submit', () => {
                editPerson(request.getResponseHeader('etag'))
            })
        }
    })

    $.ajax({
        type: "GET",
        url: '/api/v1/products',
        async: false,
        headers: {"Authorization": JSON.parse(window.sessionStorage.getItem('usrData')).access_token},
        // dataType: 'json',
        success: function (data) {
            if (data.products.length > 0) {
                $('fieldset').append('<h3>Productos</h3><ul id="productsList"></ul>')
                for (product in data.products) {
                    let elemento = data.products[product].product
                    let checked = ''
                    if (person.products) {
                        checked = (person.products.includes(elemento.id) ? 'checked' : '')
                    }
                    $('#productsList').append(
                        '<li id="' + elemento.id + '">' +
                        '<label for="' + elemento.id + '">' + elemento.name + '</label>' +
                        '<input id="' + elemento.id + '" type="checkbox" ' + checked + '>' +
                        '</li>'
                    )
                }
            }
        }
    })

    $.ajax({
        type: "GET",
        url: '/api/v1/entities',
        async: false,
        headers: {"Authorization": JSON.parse(window.sessionStorage.getItem('usrData')).access_token},
        // dataType: 'json',
        success: function (data) {
            if (data.entities.length > 0) {
                $('fieldset').append('<h3>Entidades colaboradoras</h3><ul id="entitiesList"></ul>')
                for (entity in data.entities) {
                    let elemento = data.entities[entity].entity
                    let checked = ''
                    if (person.entities) {
                        checked = (person.entities.includes(elemento.id) ? 'checked' : '')
                    }
                    $('#entitiesList').append(
                        '<li id="' + elemento.id + '">' +
                        '<label for="' + elemento.id + '">' + elemento.name + '</label>' +
                        '<input id="' + elemento.id + '" type="checkbox" ' + checked + '>' +
                        '</li>'
                    )
                }
            }
        }
    })
}

function updateEntity(elem) {
    let indice = elem.parentElement.parentElement.id
    let entity
    $.ajax({
        type: "GET",
        url: '/api/v1/entities/' + indice,
        async: false,
        headers: {"Authorization": JSON.parse(window.sessionStorage.getItem('usrData')).access_token},
        // dataType: 'json',
        success: function (data, textStatus, request) {
            entity = data.entity
            update(entity)
            $('#editForm').on('submit', () => {
                editEntity(request.getResponseHeader('etag'))
            })
        }
    })

    $.ajax({
        type: "GET",
        url: '/api/v1/products',
        async: false,
        headers: {"Authorization": JSON.parse(window.sessionStorage.getItem('usrData')).access_token},
        // dataType: 'json',
        success: function (data) {
            if (data.products.length > 0) {
                $('fieldset').append('<h3>Productos</h3><ul id="productsList"></ul>')
                for (product in data.products) {
                    let elemento = data.products[product].product
                    let checked = ''
                    if (entity.products) {
                        checked = (entity.products.includes(elemento.id) ? 'checked' : '')
                    }
                    $('#productsList').append(
                        '<li id="' + elemento.id + '">' +
                        '<label for="' + elemento.id + '">' + elemento.name + '</label>' +
                        '<input id="' + elemento.id + '" type="checkbox" ' + checked + '>' +
                        '</li>'
                    )
                }
            }
        }
    })

    $.ajax({
        type: "GET",
        url: '/api/v1/persons',
        async: false,
        headers: {"Authorization": JSON.parse(window.sessionStorage.getItem('usrData')).access_token},
        // dataType: 'json',
        success: function (data) {
            if (data.persons.length > 0) {
                $('fieldset').append('<h3>Participantes</h3><ul id="peopleList"></ul>')
                for (person in data.persons) {
                    let elemento = data.persons[person].person
                    let checked = ''
                    if (entity.persons) {
                        checked = (entity.persons.includes(elemento.id) ? 'checked' : '')
                    }
                    $('#peopleList').append(
                        '<li id="' + elemento.id + '">' +
                        '<label for="' + elemento.id + '">' + elemento.name + '</label>' +
                        '<input id="' + elemento.id + '" type="checkbox" ' + checked + '>' +
                        '</li>'
                    )
                }
            }
        }
    })
}

function getUsers() {
    let nav = document.getElementsByTagName('nav')[0]
    nav.innerHTML = '<input type="button" id="Inicio" value="Inicio" onclick="readIndex();"/>'
    let main = document.getElementsByTagName('main')[0]
    main.innerHTML = '<table style="border-collapse: collapse;" id="usersTable">' +
        '<tr><th>id</th><th>username</th><th>email</th></tr>' +
        '</table>'

    $.ajax({
        type: "GET",
        url: '/api/v1/users',
        async: false,
        headers: {"Authorization": 'Bearer ' + JSON.parse(window.sessionStorage.getItem('usrData')).access_token},
        // dataType: 'json',
        success: function (data, textStatus, request) {
            let usuarios = data.users
            for (let elem of usuarios) {

                if (elem.user.username !== username) {
                    $('#usersTable').append(
                        '<tr id="' + elem.user.id + '">' +
                        '<td>' + elem.user.id + '</td>' +
                        '<td>' + elem.user.username + '</td>' +
                        '<td>' + elem.user.email + '</td>' +
                        '<td>' + elem.user.role + '</td>' +
                        '<td>' + elem.user.estado + '</td>' +
                        (elem.user.estado === 'unauthorized'
                            ? '<td><input type="button" id="authorize" value="Autorizar" onclick="autorizar(this.parentElement.parentElement);"/></td>'
                            : '<td><input type="button" id="editUser" value="Editar" onclick="updateUser(this.parentElement.parentElement);"/></td>') +
                        '<td><input type="button" id="deleteUser" value="Dar de Baja" onclick="deleteUser(this.parentElement.parentElement)"/></td>' +
                        '</tr>')
                } else {
                    $('main').prepend(
                        '<table><tr>' +
                        '<td>' + elem.user.id + '</td>' +
                        '<td>' + elem.user.username + '</td>' +
                        '<td>' + elem.user.email + '</td>' +
                        '<td>' + elem.user.role + '</td>' +
                        '<td>' + elem.user.estado + '</td>' +
                        '</tr></table><p style="text-align: center; margin: auto">(YOU)</p><br>'
                    )
                }
            }
        }
    })
}

function updateUser(row) {
    let role = row.children[3].innerText
    let estado = row.children[4].innerText
    let nav = document.getElementsByTagName('nav')[0]
    nav.innerHTML = '<input type="button" name="cancel" value="Cancel" onclick="getUsers();">'
    let main = document.getElementsByTagName('main')[0]
    main.innerHTML = ''

    let fieldset = document.createElement('fieldset')
    fieldset.style.width = '25%'
    fieldset.style.maxWidth = '50%'
    fieldset.style.marginLeft = '37.5%'
    fieldset.style.textAlign = 'center'
    fieldset.style.borderStyle = 'solid'
    fieldset.style.borderWidth = 'medium'
    fieldset.setAttribute('id', row.id)
    $.ajax({
        type: "GET",
        url: '/api/v1/users/' + row.id,
        headers: {"Authorization": 'Bearer ' + JSON.parse(window.sessionStorage.getItem('usrData')).access_token},
        // dataType: 'json',
        success: function (data, statusText, response) {
            fieldset.innerHTML = '<legend>Editar ' + row.children[1].innerText + '</legend>' +
                '<label for="role">Role</label>' +
                '<select id="role">' +
                '<option value="writer" ' + (role === 'WRITER' ? 'selected' : '') + ' >WRITER</option>' +
                '<option value="reader" ' + (role === 'READER' ? 'selected' : '') + ' >READER</option>' +
                '</select>' +
                '<label for="estado"></label>' +
                '<select id="estado">' +
                '<option value="active"' + (estado === 'active' ? 'selected' : '') + '>Active</option>' +
                '<option value="inactive"' + (estado === 'inactive' ? 'selected' : '') + '>Inactive</option>' +
                '</select>' +
                '<input type="button" id="save" value="guardar">'
            main.appendChild(fieldset)
            $('#save').on('click', () => {
                editUser(response.getResponseHeader('etag'))
            })
        }
    })
}

function editUser(etag) {
    let fieldset = document.getElementsByTagName('fieldset')[0]
    data = {
        "role": document.getElementById('role').value,
        "estado": document.getElementById('estado').value
    }

    $.ajax({
        type: 'PUT',
        url: '/api/v1/users/' + fieldset.id,
        async: false,
        headers: {
            "Authorization": 'Bearer ' + JSON.parse(window.sessionStorage.getItem('usrData')).access_token,
            "If-Match": etag
        },
        data,
        success: function () {
            getUsers()
        }
    })
}

function autorizar(row) {
    let etag

    $.ajax({
        type: 'GET',
        url: '/api/v1/users/' + row.id,
        async: false,
        headers: {"Authorization": 'Bearer ' + JSON.parse(window.sessionStorage.getItem('usrData')).access_token},
        success: function (data, statusText, request) {
            etag = request.getResponseHeader('etag')
        }
    })

    let data = {"estado": "active"}
    $.ajax({
        type: 'PUT',
        url: '/api/v1/users/' + row.id,
        async: false,
        headers: {
            "Authorization": 'Bearer ' + JSON.parse(window.sessionStorage.getItem('usrData')).access_token,
            "If-Match": etag
        },
        data,
        success: function () {
            getUsers()
        }
    })
}

function deleteUser(row) {
    if (window.confirm('Eliminar definitivamente el usuario: ' + row.children[1].innerText)) {
        $.ajax({
            type: 'DELETE',
            url: '/api/v1/users/' + row.id,
            headers: {"Authorization": 'Bearer ' + JSON.parse(window.sessionStorage.getItem('usrData')).access_token},
        })
    }
    getUsers()
}


function checkIfUserExists() {
    if ($('#newUsername').val() === '') {
        window.alert('Introduzca un nombre de usuario válido')
    } else {
        $.ajax({
            type: 'GET',
            url: '/api/v1/users/username/' + $('#newUsername').val(),
            success: function () {
                window.alert('Username en uso')
            },
            error: function () {
                let username = $('#newUsername').val()
                $('nav').html('<input type="button" id="cancelSignin" value="Cancelar"/>')
                $('main').html(
                    '<section style="margin-left: 30%; width: 40%; border-style: solid">' +
                    '<h4>Registrar nuevo usuario: ' + username + '</h4>' +
                    '<form method="post">' +
                    '<input type="hidden" id="username" name="username" value="' + username + '"/>' +
                    '<label for="name">Nombre: </label>' +
                    '<input type="text" id="name" name="name" placeholder="Nombre"/><br>' +
                    '<br><label for="password">Contraseña: </label>' +
                    '<input type="password" id="password" name="password" placeholder="Palabra clave"/><br>' +
                    '<br><label for="email">Email: </label>' +
                    '<input type="email" id="email" name="email" placeholder="Correo electronico"/><br>' +
                    '<br><label for="birthDate">Fecha de nacimiento: </label>' +
                    '<input type="date" id="birthDate" name="birthDate"/><br>' +
                    '<input type="hidden" id="role" name="role" value="reader"/>' +
                    '<br><input type="button" id="signin" value="Signin" />' +
                    '</form>' +
                    '<p>Un administrador del sistema autorizará el alta de su cuenta</p>' +
                    '</section>'
                )
                $("#signin").click(function () {
                    if (($('#name').val() === '') || ($('#email').val() === '') || ($('#password').val() === '') || ($('#birthDate').val() === '')) {
                        window.alert('Faltan datos')
                    } else {
                        if (window.confirm('Enviar solicitud de registro?')) {
                            $.post(
                                "/api/v1/users",
                                $("form").serialize(),
                                null
                            ).success(function (data) {
                                window.location.reload()
                            })
                        }
                    }
                })
                $("#cancelSignin").click(function () {
                    window.location.reload()
                })
            }
        })
    }
}

function showProfile() {
    $.ajax({
        type: 'GET',
        url: '/api/v1/users/' + JSON.parse(window.sessionStorage.getItem('usrData')).id,
        headers: {"Authorization": 'Bearer ' + JSON.parse(window.sessionStorage.getItem('usrData')).access_token},
        success: function (data) {
            let user = data.user
            $('nav').html(
                '<input type="button" value="Inicio" onclick="readIndex();">'
            )
            $('main').html(
                '<section style="border-style: solid; width: 40%; margin-left: 30%">' +
                '<form id="form-profile">' +
                '<label>Usuario: ' + user.username + '</label><br><br>' +
                '<label>Nombre: ' + user.name + '</label><br><br>' +
                '<label>Fecha de nacimiento: ' + user.birthDate + '</label><br><br>' +
                '<label>Email: ' + user.email + '</label><br>' +
                '<input type="button" id="editProfile" name="editProfile" value="Editar"">' +
                '<input type="button" id="changePasswd" name="changePasswd" value="Cambiar contraseña">' +
                '</form>' +
                '</section>'
            )
            $('#editProfile').click(editProfile)
            $('#changePasswd').click(editPassword)
        }
    })
}

function editProfile() {
    $.ajax({
        type: 'GET',
        url: '/api/v1/users/' + JSON.parse(window.sessionStorage.getItem('usrData')).id,
        headers: {"Authorization": 'Bearer ' + JSON.parse(window.sessionStorage.getItem('usrData')).access_token},
        success: function (data, statusText, request) {
            let user = data.user
            $('main').html(
                '<section style="border-style: solid; width: 40%; margin-left: 30%">' +
                '<form id="form-profile">' +
                '<label>Usuario: ' + user.username + '</label><br><br>' +
                '<label for="name">Nombre: </label>' +
                '<input type="text" id="name" name="name" value="' + user.name + '"><br><br>' +
                '<label for="birthDate">Fecha de nacimiento: </label>' +
                '<input type="date" id="birthDate" name="birthDate" value="' + user.birthDate + '"><br><br>' +
                '<label for="email">Email: </label>' +
                '<input type="text" id="email" name="email" value="' + user.email + '"><br>' +
                '<input type="button" id="saveProfile" name="saveProfile" value="Guardar">' +
                '</form>' +
                '</section>'
            )
            $('#saveProfile').click(function () {
                    $.ajax({
                        type: 'PUT',
                        url: '/api/v1/users/' + user.id,
                        headers: {
                            "Authorization": 'Bearer ' + JSON.parse(window.sessionStorage.getItem('usrData')).access_token,
                            "If-Match": request.getResponseHeader('etag')
                        },
                        data: $('#form-profile').serialize(),
                        success: function () {
                            showProfile()
                        }
                    })
                }
            )
        }
    })
}

function editPassword() {
    $.ajax({
        type: 'GET',
        url: '/api/v1/users/' + JSON.parse(window.sessionStorage.getItem('usrData')).id,
        headers: {"Authorization": 'Bearer ' + JSON.parse(window.sessionStorage.getItem('usrData')).access_token},
        success: function (data, statusText, request) {
            let user = data.user
            $('nav').append('<input type="button" id="cancel-editpasswd" value="Cancelar">')
            $('main').html(
                '<section style="border-style: solid; width: 40%; margin-left: 30%">' +
                '<form id="form-profile">' +
                '<label>Contraseña actual </label>' +
                '<input type="password" id="password" name="password"><br>' +
                '<label>Nueva contraseña </label>' +
                '<input type="password" id="newPasswd"><br>' +
                '<input type="button" id="savePasswd" value="Guardar">' +
                '</form>' +
                '</section>'
            )
            $('#cancel-editpasswd').click(function () {
                showProfile()
            })
            $('#savePasswd').click(function () {
                let data = {
                    "username": user.username,
                    "password": $('#password').val()
                }
                $.post(
                    "/access_token",
                    data,
                    null
                ).success(function () {
                    if ($('#newPasswd').val() === '') {
                        window.alert('Introduce una nueva contraseña')
                    } else {
                        if (window.confirm('Cambiar la contraseña actual?')) {
                            $.ajax({
                                type: 'PUT',
                                url: '/api/v1/users/' + user.id,
                                headers: {
                                    "Authorization": 'Bearer ' + JSON.parse(window.sessionStorage.getItem('usrData')).access_token,
                                    "If-Match": request.getResponseHeader('etag')
                                },
                                data: {"password": $('#newPasswd').val()},
                                success: function () {
                                    showProfile()
                                }
                            })
                        }
                    }
                })
            })
        }
    })
}