document.addEventListener('DOMContentLoaded', () => {
// https://docs.google.com/presentation/d/e/2PACX-1vRfb7kaUrKRC0HcsbYv5gc7gBfu-dpBeK7U7YRXdBf95cNkWu0B-hxnJmq60iZM0xG7VuWEebeoCCHT/pub?start=false&loop=false&delayms=3000&slide=id.g77de787bcf_0_342

    function limpiarFormulario() {
        document.getElementById("name").value = "";
        document.getElementById("city").value = "";
        document.getElementById("email").value = "";
        document.getElementById("birthday").value = "";
    }
    document.getElementById("btnLimpiar").addEventListener("click", limpiarFormulario);


    function getInputsFormulario() {
        let datosEmpleado = {
            id: String(document.getElementById("idEmpleado").value),
            name: String(document.getElementById("name").value),
            city: String(document.getElementById("city").value),
            email: String(document.getElementById("email").value),
            birthday: String(document.getElementById("birthday").value)
        }
        // console.log("GET INPUT FORMULARIO");
        // console.log(datosEmpleado);
        return datosEmpleado;
    }

// --VALIDACIONES inputs no vacios y fecha correcta -----------------------------------------------------------------------------------------------

    function esFechaValida(fechaNacimiento) {
        if (fechaNacimiento === "") {
            return false;
        } 
        let fecha = new Date(fechaNacimiento);
        fecha.setMinutes(fecha.getMinutes() + fecha.getTimezoneOffset()); // https://es.stackoverflow.com/questions/219147/new-date-en-javascript-me-resta-un-dia
            // console.log("VALIDANDO FECHA")
            // console.log(fecha);
            // console.log(new Date (Date.now()));
            // console.log(fecha.toLocaleDateString());
            // console.log(new Date(Date.now()).toLocaleDateString());
            // console.log(fecha.toLocaleDateString() < new Date(Date.now()).toLocaleDateString());
        let fechaActual = new Date(Date.now());
        fechaActual.setHours(0,0,0,0); // https://desarrolloweb.com/articulos/comparar-fechas-javascript.html
            // console.log(fechaActual);
            // console.log(fechaActual.toLocaleDateString());
            // console.log("FIN VALIDANDO FECHA")
        return fecha < fechaActual;
        // return fecha.toLocaleDateString() < fechaActual.toLocaleDateString();
    }


    function inputsValidos(empleado) {
        let fechaValida = esFechaValida(empleado.birthday);
        if (empleado.city != "" && empleado.email != "" && fechaValida && empleado.name != "") {
            return true;
        }
        return false;
    }

// --- AGREGAR O EDITAR EMPLEADO en el arreglo y en la tabla ------------------------------------------------------------------------------------------
    document.getElementById("btnEnviar").addEventListener("click", (event)=> {
        let empleado = getInputsFormulario();

        if (inputsValidos(empleado)){
            console.log("INPUT VALIDOS")

            if (empleado.id == "") {
                let fecha = new Date(empleado.birthday);
                fecha.setMinutes(fecha.getMinutes() + fecha.getTimezoneOffset());
                empleado.birthday = fecha.toString();
                empleado.id = listaEmpleados.length+1;
                agregarEmpleados([empleado]);
            } else {
                aplicarCambios(empleado);
            }

        } else alert("ERROR! Verifique que se hayan completado todos los campos y que los datos sean correctos");

    });
 

// ---- EDITAR EMPLEADO del arreglo y de la tabla -------------------------------------------------------------------------------------------------------------------------
    function aplicarCambios(empleado) {
        let filaEmpleados = document.querySelectorAll(".tableRow");
        for (let i = 0; i < filaEmpleados.length; i++) {
            if (String(filaEmpleados[i].childNodes[0].innerHTML) === empleado.id) {
                filaEmpleados[i].childNodes[1].innerHTML = empleado.name;
                filaEmpleados[i].childNodes[2].innerHTML = empleado.city;
                filaEmpleados[i].childNodes[3].innerHTML = new Date(empleado.birthday).toLocaleDateString();
                filaEmpleados[i].childNodes[4].innerHTML = empleado.email;
                break;
            }
        }
        limpiarFormulario();
        document.getElementById("idEmpleado").value = "";
        document.getElementById("btnEnviar").innerHTML = "Agregar";
    } 

    function buscarEmpleadoPorId(id) {
        for (let i = 0; i < listaEmpleados.length; i++) {
            if (listaEmpleados[i].id === id) {
                return listaEmpleados[i];
            }
        }
        return null;
    }

    function corregirNroFecha(nro) {
        if (nro > 0 && nro < 10) {
            // getMonth() y getDate() devuelven un solo digito cuando el nro esta entre 1y9. Esto genera errror al cargar una fecha al formulario. Espera 2digitos para el dia y el mes (yyyy-mm-dd)
            return "0" + nro;
        }
        return nro
    }

    function editarEmpleado(event) {
        // console.log("EDITAR EMPLEADO EVENT")
        document.getElementById("btnEnviar").innerHTML = "Editar";
        // console.log(event.target.parentElement.parentElement.parentElement.firstElementChild);
        let idEmpleado = String(event.target.parentElement.parentElement.parentElement.firstElementChild.innerHTML);
        let empleado = buscarEmpleadoPorId(idEmpleado);
        if (empleado != null) {
            /*SE CARGAN LOS VALORES AL FORMULARIO */
            document.getElementById("idEmpleado").value = empleado.id;
            document.getElementById("name").value = empleado.name;
            document.getElementById("city").value = empleado.city;
            document.getElementById("email").value = empleado.email;

            // console.log("CORRECION FECHA");
            // The specified value "Tue Apr 27 1948 10:57:46 GMT-0300 (hora est\u00E1ndar de Argentina)" does not conform to the required format, "yyyy-MM-dd".            
            // console.log(typeof(empleado.birthday)); //string
            let fecha = new Date(empleado.birthday);
            // console.log(typeof(fecha)); //object
            // console.log(fecha);
            // console.log(fecha.getMonth()); //ERROR: devuelve el nro del mes anterior al esperado
            let fechaNacimiento = `${fecha.getFullYear()}-${corregirNroFecha(fecha.getMonth()+1)}-${corregirNroFecha(fecha.getDate())}`;
            // console.log(fechaNacimiento);
            document.getElementById("birthday").value = fechaNacimiento;

            // console.log("FIN CORRECION FECHA");

        }
    }

// ---- ELIMINAR EMPLEADO del arreglo y de la tabla -----------------------------------------------------------------------------------------------------------------------
    function eliminarEmpleado(event) {
        if (window.confirm("¿Esta seguro que desea eliminar esta informacion?")) {
            let idEmpleado = String(event.target.parentElement.parentElement.firstElementChild.innerHTML);
            for (let i = 0; i < listaEmpleados.length; i++) {
                if (listaEmpleados[i].id === idEmpleado) {
                    listaEmpleados.slice(i, 1);
                    break;
                }
            }
            event.target.parentElement.parentElement.remove();
        }
    }

// -----------------------------------------------------------------------------------------------------------------------

    function obtenerBotonEliminar() {
        let button = document.createElement("button");
            button.setAttribute("type", "button");
            button.classList.add("btn", "btn-danger", "mb-2", "btnEliminar");
            button.innerHTML = "Eliminar";
            button.addEventListener("click",eliminarEmpleado);
        return button;
    }

    function obtenerBotonEditar() {
        let a = document.createElement("a");
            a.setAttribute("href", "#formulario");

        let button = document.createElement("button");
            button.setAttribute("type", "button");
            button.classList.add("btn", "btn-dark", "mb-2", "btnEditar");
            button.innerHTML = "Editar";
            a.append(button);
            a.addEventListener("click", editarEmpleado);
            
        return a;
    }

    function obtenerTableRow(empleado) {
        let tableRow = document.createElement("tr");
            tableRow.classList.add("tableRow");

        let tableData_id = document.createElement("td");
            tableData_id.innerHTML = empleado.id;
            tableRow.appendChild(tableData_id);

        let tableData_name = document.createElement("td");
            tableData_name.innerHTML = empleado.name;
            tableRow.appendChild(tableData_name);

        let tableData_city = document.createElement("td");
            tableData_city.innerHTML = empleado.city;
            tableRow.appendChild(tableData_city);

        let tableData_birthday = document.createElement("td");
            tableData_birthday.innerHTML = (new Date(empleado.birthday).toLocaleDateString());
            tableRow.appendChild(tableData_birthday);

        let tableData_email = document.createElement("td");
            tableData_email.innerHTML = empleado.email;
            tableRow.appendChild(tableData_email);

        let tableData_buttons = document.createElement("td");
            tableData_buttons.appendChild(obtenerBotonEditar());
            tableData_buttons.appendChild(obtenerBotonEliminar());
            tableData_buttons.classList.add("table-buttons");
            tableRow.appendChild(tableData_buttons);

        return tableRow;
    }

    function agregarEmpleados(empleados) {
        let tableBody = document.getElementsByTagName("tbody")[0];

        for (let i = 0; i < empleados.length; i++) {
            const empleado = empleados[i];
            listaEmpleados.push(empleado);

            let tableRowEmpleado = obtenerTableRow(empleado);
            tableBody.appendChild(tableRowEmpleado);
        }
    }

    function consumirApi(url, callback) {
        fetch(url)
        .then(response => {
            return response.json();
        })
        .then(json => {
            callback(json);
        })
        .catch(error => {
            console.log(error);
        });
    }


    /******* INICIO PROGRAMA *********/
    const URL = "https://6393e57e11ed187986bf9667.mockapi.io/api/curso/employees";
    let listaEmpleados = [];
    consumirApi(URL, agregarEmpleados);

});
