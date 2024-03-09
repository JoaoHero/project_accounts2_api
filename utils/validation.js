const { json } = require("sequelize");

// Função para validar o e-mail
function email(email) {
    // Validando se o e-mail segue o padrão correto
    const re = /\S+@\S+\.\S+/;

    // Caso encontre o padrão de e-mail correto
    if(re.test(email) === true) {
        // Parar o processamento e retornar um código de sucesso
        return json({
            error: false,
            message: "Email validado"
        });
    }else {
        // Parar o processamento e retornar um código de erro
        return json({
            error: true,
            message: "Email validado"
        });
    };
};

// Função para validar a senha
function password(password) {
    // Validando se a senha é menor que 8 caracteres
    if (password.length < 8) {
        // Parar o processamento e retornar um código de erro
        return json({
            error: true,
            message: "Necessário ter 8 caracteres"
        });
    };

    // Validando se a senha não contem caracteres maiúsculos entre A e Z
    if (!/[A-Z]/.test(password)) {
        // Parar o processamento e retornar um código de erro
        return json({
            error: true,
            message: "Precisa ter pelo menos uma letra maiúscula"
        });
    };

    // Validando se a senha não contem caracteres minúsculos entre A e Z
    if (!/[a-z]/.test(password)) {
        // Parar o processamento e retornar um código de erro
        return json({
            error: true,
            message: "Precisa ter pelo menos uma letra minúscula"
        });
    };

    // Validando se a senha contém pelo menos um dígito numérico
    if (!/\d/.test(password)) {
        // Parar o processamento e retornar um código de erro
        return json({
            error: true,
            message: "Precisa ter pelo menos um número"
        });
    };

    // Validando se a senha contém padrões de números em sequência
    if (/123|234|345|456|567|678|789|012/.test(password)) {
        // Parar o processamento e retornar um código de erro
        return json({
            error: true,
            message: "Não é permitido números em sequências"
        });
    };

    return json({
        // Parar o processamento e retornar um código de sucesso
        error: false,
        message: "Senha validada!" 
    })
};

function cpf(cpf) {
    // Substituindo os pontos e traços para apenas números
    const formatedCpf = cpf.replace(/\./g, "").replace(/\-/g, "");
    // Pegando apenas os primeiros 9 núemros do CPF
    const firstNineNumbers = formatedCpf.substr(0, 9);
    // Pegando apenas os primeiros 10 núemros do CPF
    const firstTenNumbers = formatedCpf.substr(0,10);

    // Iniciando o multiplicador por 10
    let multiplication = 10

    // Declarando a soma dos primeiros nove números como 0
    let multiplicationOfFirstNineNumbers = 0;
    // Declarando a soma dos primeiros dez núemros como 0
    let multiplicationOfFirstTenNumbers = 0;

    // Criando um laço para somar os primeiros 9 números com o multiplicador
    for (let i = 0; i < firstNineNumbers.length; i++) {
        // pegando sempre um número de cada vez
        let number = firstNineNumbers.substr(i, 1);

        // Multiplicando o número vez o multiplicador
        multiplicationOfFirstNineNumbers += number * multiplication;
        // Decrementando o multiplicador para que na proxíma vez que rodar seja um número menor
        multiplication--;
    };

    // Alterador o valor do multiplicador para um novo valor que será necessário
    multiplication = 11

    // Criando um laço para somar os primeiros 10 números com o multiplicador
    for (let i = 0; i < firstTenNumbers.length; i++) {
        // pegando sempre um número de cada vez
        let number = firstTenNumbers.substr(i, 1);

        // Multiplicando o número vez o multiplicador
        multiplicationOfFirstTenNumbers += number * multiplication;
        // Decrementando o multiplicador para que na proxíma vez que rodar seja um número menor
        multiplication--;
    };

    // Resultado da primeira multiplicação pelos 9 primeiros números o resto é 11
    const firstModuleResult = (multiplicationOfFirstNineNumbers * 10) % 11;
    // Resultado da primeira multiplicação pelos 10 primeiros números o resto é 11
    const secondModuleResult = (multiplicationOfFirstTenNumbers * 10) % 11;

    // Validando se o resultado do módulo é igual aos últimos 2 números do cpf
    if((firstModuleResult.toString() + secondModuleResult.toString()) === formatedCpf.substr(9, 2)) {
        // Parar o processamento e retornar um código de sucesso
        return json({
            error: false,
            message: "Cpf validado"
        });

    }else {
        // Parar o processamento e retornar um código de erro
        return json({
            error: true,
            message: "Cpf inválido"
        });
    };
};

module.exports = {
    email,
    password,
    cpf
}