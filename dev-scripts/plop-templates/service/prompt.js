const {notEmpty} = require('../util.js');

module.exports = {
    description: 'generate a service',
    prompts: [{
        type: 'input',
        name: 'pathName',
        message: '文件路径',
        validate: notEmpty('pathName')
    }],
    actions: (data) => {
        let name = data.pathName.split('/');
        name = name[name.length - 1];
        name[0] = name[0].toLocaleUpperCase();
        const actions = [
            {
                type: 'add',
                path: `app/service/${data.pathName}.ts`,
                templateFile: 'dev-scripts/plop-templates/service/index.hbs',
                data: {
                    name
                }
            }
        ];

        return actions;
    }
};