const multiTest = (assertions) => {
    const errors = [];

    assertions.forEach(assertion => {
        try {
            assertion();
        } catch (error) {
            errors.push(error);
        }
    });

    if (errors.length > 0) {
        throw new Error(`${errors.length} out of ${assertions.length} assertions failed:\n${errors.map(e => e.message).join('\n###################################\n')}`);
    }
};

module.exports = multiTest;