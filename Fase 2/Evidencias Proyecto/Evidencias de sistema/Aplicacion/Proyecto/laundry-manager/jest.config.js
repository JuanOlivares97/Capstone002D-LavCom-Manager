module.exports = {
    verbose: true,
    reporters: [
        'default',
        [
            'jest-stare',
            {
                resultDir: 'test-results',
                reportTitle: 'Test Results Lavanderia',
                coverageLink: '../coverage/lcov-report/index.html',
                jestStareConfigJson: 'jest-stare.json',
                jestGlobalConfigJson: 'jest.config.json'
            }
        ],
    ]
};