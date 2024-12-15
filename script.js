document.addEventListener('DOMContentLoaded', function () {
    loadConsultas();

    document.getElementById('consultaForm').addEventListener('submit', function (event) {
        event.preventDefault();
        addConsulta();
    });

    document.getElementById('search').addEventListener('input', function () {
        searchConsultas(this.value);
    });

    document.getElementById('telefone').addEventListener('input', formatPhone);
    document.getElementById('cep').addEventListener('input', formatCep);
});

function formatPhone(event) {
    let telefone = event.target.value.replace(/\D/g, '');
    telefone = telefone.substring(0, 11); // Limita a 11 dígitos

    if (telefone.length > 2) {
        telefone = `(${telefone.substring(0, 2)}) ${telefone.length > 6 ? telefone.substring(2, 7) : telefone.substring(2, 6)}-${telefone.length > 6 ? telefone.substring(7, 11) : telefone.substring(6, 11)}`;
    }

    event.target.value = telefone;
}

function formatCep(event) {
    let cep = event.target.value.replace(/\D/g, '');
    cep = cep.substring(0, 8); // Limita a 8 dígitos

    if (cep.length > 5) {
        cep = `${cep.substring(0, 5)}-${cep.substring(5, 8)}`;
    }

    event.target.value = cep;
}

function loadConsultas() {
    let consultas = JSON.parse(localStorage.getItem('consultas')) || [];
    let table = document.getElementById('consultasTable').getElementsByTagName('tbody')[0];
    table.innerHTML = '';

    consultas.forEach(function (consulta, index) {
        let row = table.insertRow();
        row.innerHTML = `<td>${consulta.nome}</td><td>${formatDateTime(consulta.data)}</td><td>${consulta.telefone}</td>
                         <td>${consulta.email}</td><td>${consulta.endereco}</td><td>${consulta.cidade}</td>
                         <td>${consulta.cep}</td><td>${consulta.procedimento}</td><td><button onclick="deleteConsulta(${index})">Excluir</button>
                         <button onclick="whatsappLink('${consulta.telefone}')">WhatsApp</button></td>`;
    });
}

function addConsulta() {
    let nome = document.getElementById('nome').value;
    let data = document.getElementById('data').value;
    let telefone = document.getElementById('telefone').value;
    let email = document.getElementById('email').value;
    let endereco = document.getElementById('endereco').value;
    let cidade = document.getElementById('cidade').value;
    let cep = document.getElementById('cep').value;
    let procedimento = document.getElementById('procedimento').value;

    if (!nome || !data || !telefone || !email || !endereco || !cidade || !cep || !procedimento) {
        alert('Preencha todos os campos.');
        return;
    }

    let consultas = JSON.parse(localStorage.getItem('consultas')) || [];
    consultas.push({ nome: nome, data: data, telefone: telefone, email: email, endereco: endereco, cidade: cidade, cep: cep, procedimento: procedimento });
    localStorage.setItem('consultas', JSON.stringify(consultas));

    document.getElementById('consultaForm').reset();
    loadConsultas();
}

function deleteConsulta(index) {
    let consultas = JSON.parse(localStorage.getItem('consultas')) || [];
    consultas.splice(index, 1);
    localStorage.setItem('consultas', JSON.stringify(consultas));
    loadConsultas();
}

function searchConsultas(query) {
    let consultas = JSON.parse(localStorage.getItem('consultas')) || [];
    let filteredConsultas = consultas.filter(function (consulta) {
        return consulta.nome.toLowerCase().includes(query.toLowerCase());
    });
    let table = document.getElementById('consultasTable').getElementsByTagName('tbody')[0];
    table.innerHTML = '';

    filteredConsultas.forEach(function (consulta, index) {
        let row = table.insertRow();
        row.innerHTML = `<td>${consulta.nome}</td><td>${formatDateTime(consulta.data)}</td><td>${consulta.telefone}</td>
                         <td>${consulta.email}</td><td>${consulta.endereco}</td><td>${consulta.cidade}</td>
                         <td>${consulta.cep}</td><td>${consulta.procedimento}</td><td><button onclick="deleteConsulta(${index})">Excluir</button>
                         <button onclick="whatsappLink('${consulta.telefone}')">WhatsApp</button></td>`;
    });
}

function whatsappLink(telefone) {
    let formattedTelefone = telefone.replace(/\D/g, '');
    window.open(`https://wa.me/55${formattedTelefone}`, '_blank');
}

function formatDateTime(datetime) {
    let date = new Date(datetime);
    let day = date.getDate().toString().padStart(2, '0');
    let month = (date.getMonth() + 1).toString().padStart(2, '0');
    let year = date.getFullYear();
    let hours = date.getHours().toString().padStart(2, '0');
    let minutes = date.getMinutes().toString().padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes}`;
}