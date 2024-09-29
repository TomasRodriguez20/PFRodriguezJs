let estudiantes = [];
let cantidadEstudiantes = 0;
let cursosPreviamenteCargados = [];

// al cargar la pagina, obtener los cursos previamente cargados
document.addEventListener('DOMContentLoaded', function() {
    obtenerCursosPreviamenteCargados();
});

function obtenerCursosPreviamenteCargados() {
    fetch('./cursos.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            cursosPreviamenteCargados = data;
            mostrarCursosPreviamenteCargados();
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
}

// mostrar
function mostrarCursosPreviamenteCargados() {
    let listaCursos = document.getElementById('lista-cursos');
    listaCursos.innerHTML = '';

    cursosPreviamenteCargados.forEach(curso => {
        let divCurso = document.createElement('div');
        divCurso.classList.add('curso-item');

        let textoCurso = document.createElement('p');
        textoCurso.textContent = `Curso: ${curso.curso}, Profesor: ${curso.profesor}, Comisión: ${curso.comision}`;
        divCurso.appendChild(textoCurso);

        let listaEstudiantes = document.createElement('ul');
        curso.estudiantes.forEach(est => {
            let liEstudiante = document.createElement('li');
            liEstudiante.textContent = `${est.nombre} ${est.apellido}`;
            listaEstudiantes.appendChild(liEstudiante);
        });

        divCurso.appendChild(listaEstudiantes);
        listaCursos.appendChild(divCurso);
    });
}

// mostrar la sección de carga de estudiantes
document.getElementById('continuar').addEventListener('click', function() {
    document.getElementById('cursos-previamente-cargados').style.display = 'none';
    document.getElementById('profesor-seccion').style.display = 'block';
});


document.getElementById('iniciar-carga').addEventListener('click', function() {
    let profesorApellido = document.getElementById('profesor-apellido').value.trim();
    let curso = document.getElementById('curso').value.trim();
    let comision = document.getElementById('comision').value.trim();
    cantidadEstudiantes = parseInt(document.getElementById('cantidad-estudiantes').value);

    if (validarDatos(profesorApellido, curso, comision, cantidadEstudiantes)) {
        // Guardar datos en localStorage
        localStorage.setItem('profesorApellido', profesorApellido);
        localStorage.setItem('curso', curso);
        localStorage.setItem('comision', comision);

        document.getElementById('profesor-seccion').style.display = 'none';
        document.getElementById('estudiantes-seccion').style.display = 'block';

        mostrarDatosProfesor();
    }
});

//Función para mostrar los datos del profesor, curso y comisión desde localStorage
function mostrarDatosProfesor() {
    let profesorApellido = localStorage.getItem('profesorApellido');
    let curso = localStorage.getItem('curso');
    let comision = localStorage.getItem('comision');

    if (profesorApellido && curso && comision) {
        document.getElementById('profesor-texto').textContent = `Profesor: ${profesorApellido}`;
        document.getElementById('curso-texto').textContent = `Curso: ${curso}`;
        document.getElementById('comision-texto').textContent = `Comisión: ${comision}`;
    } else {
        document.getElementById('profesor-texto').textContent = "Datos del profesor no disponibles.";
        document.getElementById('curso-texto').textContent = "";
        document.getElementById('comision-texto').textContent = "";
    }
}

// Al hacer clic en "Agregar Estudiante"
document.getElementById('agregar-estudiante').addEventListener('click', function() {
    if (estudiantes.length < cantidadEstudiantes) {
        let nombreEstudiante = document.getElementById('nombre-estudiante').value.trim();
        let apellidoEstudiante = document.getElementById('apellido-estudiante').value.trim();

        if (nombreEstudiante.length >= 3 && apellidoEstudiante.length >= 3) {
            let estudianteExistente = estudiantes.find(est => est.nombre.toLowerCase() === nombreEstudiante.toLowerCase() && est.apellido.toLowerCase() === apellidoEstudiante.toLowerCase());

            if (estudianteExistente) {
                Swal.fire({
                    title: `El estudiante ${nombreEstudiante} ${apellidoEstudiante} ya está cargado. ¿Desea reemplazarlo?`,
                    showCancelButton: true,
                    confirmButtonText: 'Reemplazar',
                    cancelButtonText: 'Cancelar',
                    icon: 'warning'
                }).then((result) => {
                    if (result.isConfirmed) {
                        estudiantes = estudiantes.filter(est => est.nombre.toLowerCase() !== nombreEstudiante.toLowerCase() || est.apellido.toLowerCase() !== apellidoEstudiante.toLowerCase());
                        agregarEstudiante(nombreEstudiante, apellidoEstudiante);
                    }
                });
            } else {
                agregarEstudiante(nombreEstudiante, apellidoEstudiante);
            }

        } else {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'El nombre y apellido deben tener al menos 3 letras.',
            });
        }
    } else {
        Swal.fire({
            icon: 'error',
            title: 'Límite alcanzado',
            text: 'Has alcanzado el número máximo de estudiantes.',
        });
    }
});

function agregarEstudiante(nombreEstudiante, apellidoEstudiante) {
    estudiantes.push({ nombre: nombreEstudiante, apellido: apellidoEstudiante });
    document.getElementById('nombre-estudiante').value = "";
    document.getElementById('apellido-estudiante').value = "";

    localStorage.setItem('estudiantes', JSON.stringify(estudiantes));
    mostrarEstudiantes();
}


function mostrarEstudiantes() {
    let listaEstudiantes = document.getElementById('lista-estudiantes');
    listaEstudiantes.innerHTML = ''; 

    estudiantes.forEach((estudiante, index) => {
        let divEstudiante = document.createElement('div');
        divEstudiante.classList.add('estudiante-item');
        
        let estudianteTexto = document.createElement('span');
        estudianteTexto.textContent = `Estudiante ${index + 1}: ${estudiante.nombre} ${estudiante.apellido}`;
        divEstudiante.appendChild(estudianteTexto);

        let botonEditar = document.createElement('button');
        botonEditar.textContent = 'Editar';
        botonEditar.classList.add('btn-editar');
        botonEditar.addEventListener('click', function() {
            editarEstudiante(index);
        });
        divEstudiante.appendChild(botonEditar);

        let botonEliminar = document.createElement('button');
        botonEliminar.textContent = 'Eliminar';
        botonEliminar.classList.add('btn-eliminar');
        botonEliminar.addEventListener('click', function() {
            eliminarEstudiante(index);
        });
        divEstudiante.appendChild(botonEliminar);

        listaEstudiantes.appendChild(divEstudiante);
    });
}

// Función para eliminar un estudiante
function eliminarEstudiante(index) {
    Swal.fire({
        title: '¿Estás seguro de eliminar este estudiante?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            estudiantes.splice(index, 1); // Eliminar el estudiante del array
            localStorage.setItem('estudiantes', JSON.stringify(estudiantes));
            mostrarEstudiantes();
            Swal.fire({
                title: 'Eliminado!',
                text: 'El estudiante ha sido eliminado.',
                icon: 'success'
            });
        }
    });
}

// Función para editar un estudiante
function editarEstudiante(index) {
    let estudiante = estudiantes[index];

    Swal.fire({
        title: 'Editar Estudiante',
        html: `<input id="nuevo-nombre" class="swal2-input" placeholder="Nuevo nombre" value="${estudiante.nombre}">
               <input id="nuevo-apellido" class="swal2-input" placeholder="Nuevo apellido" value="${estudiante.apellido}">`,
        showCancelButton: true,
        confirmButtonText: 'Guardar',
        cancelButtonText: 'Cancelar',
        preConfirm: () => {
            const nuevoNombre = document.getElementById('nuevo-nombre').value.trim();
            const nuevoApellido = document.getElementById('nuevo-apellido').value.trim();

            if (nuevoNombre.length < 3 || nuevoApellido.length < 3) {
                Swal.showValidationMessage('El nombre y el apellido deben tener al menos 3 letras');
                return false;
            }
            return { nuevoNombre, nuevoApellido };
        }
    }).then((result) => {
        if (result.isConfirmed) {
            // Actualizar el estudiante en el array
            estudiantes[index].nombre = result.value.nuevoNombre;
            estudiantes[index].apellido = result.value.nuevoApellido;

            localStorage.setItem('estudiantes', JSON.stringify(estudiantes));

            mostrarEstudiantes();

            Swal.fire({
                title: 'Estudiante actualizado',
                text: `El estudiante ha sido editado exitosamente.`,
                icon: 'success'
            });
        }
    });
}

// Validar los datos ingresados
function validarDatos(profesorApellido, curso, comision, cantidadEstudiantes) {
    if (profesorApellido.length < 3) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'El apellido del profesor debe tener al menos 3 letras.',
        });
        return false;
    }
    if (curso.length < 3) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'El curso debe tener al menos 3 letras.',
        });
        return false;
    }
    if (!/^\d{5}$/.test(comision)) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'La comisión debe ser un número de 5 dígitos.',
        });
        return false;
    }
    if (isNaN(cantidadEstudiantes) || cantidadEstudiantes <= 0 || cantidadEstudiantes > 100) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Ingrese una cantidad válida de estudiantes (1-100).',
        });
        return false;
    }
    return true;
}

// Buscar estudiantes
document.getElementById('buscar-estudiante').addEventListener('click', function() {
    let busqueda = document.getElementById('busqueda').value.trim();
    let criterioBusqueda = document.querySelector('input[name="criterio-busqueda"]:checked').value;

    if (busqueda.length >= 3) {
        let resultados = estudiantes.filter(estudiante => {
            if (criterioBusqueda === 'nombre') {
                return estudiante.nombre.toLowerCase().includes(busqueda.toLowerCase());
            } else if (criterioBusqueda === 'apellido') {
                return estudiante.apellido.toLowerCase().includes(busqueda.toLowerCase());
            }
        });

        mostrarResultadosBusqueda(resultados);
    } else {
        Swal.fire({
            title: 'Error',
            text: 'La búsqueda debe contener al menos 3 letras.',
            icon: 'error'
        });
    }
});

// Función para mostrar los resultados de la búsqueda
function mostrarResultadosBusqueda(resultados) {
    let resultadoBusquedaDiv = document.getElementById('resultado-busqueda');
    resultadoBusquedaDiv.innerHTML = '';

    if (resultados.length > 0) {
        resultados.forEach((estudiante, index) => {
            let divResultado = document.createElement('div');
            divResultado.textContent = `Estudiante ${index + 1}: ${estudiante.nombre} ${estudiante.apellido}`;
            divResultado.classList.add('resultado-item');
            resultadoBusquedaDiv.appendChild(divResultado);
        });
    } else {
        resultadoBusquedaDiv.textContent = 'No se encontraron resultados.';
    }
    
}

