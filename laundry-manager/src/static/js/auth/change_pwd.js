document.querySelectorAll('#form_nueva_pwd input[type="text"]').forEach((input, index, inputs) => {
    input.addEventListener('input', () => {
        if (input.value.length === 1 && index < inputs.length - 1) {
            inputs[index + 1].focus();
        }
    });

    input.addEventListener('paste', (event) => {
        event.preventDefault();
        const paste = (event.clipboardData || window.clipboardData).getData('text');
        const pasteArray = paste.split('');
        pasteArray.forEach((char, i) => {
            if (index + i < inputs.length) {
                inputs[index + i].value = char;
            }
        });
        inputs[Math.min(index + pasteArray.length, inputs.length - 1)].focus();
    });
});

document.getElementById('form_nueva_pwd').addEventListener('submit', function(event) {
    event.preventDefault();
    const inputs = document.querySelectorAll('#form_nueva_pwd input[type="text"]');
    let code = '';
    inputs.forEach(input => {
        code += input.value;
    });
    const pwd1 = document.querySelector('input[name="pwd1"]').value;
    const pwd2 = document.querySelector('input[name="pwd2"]').value;
    alert(`Código: ${code}\nContraseña: ${pwd1}\nConfirmar contraseña: ${pwd2}`);
});