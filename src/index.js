import _ from 'lodash';
import template from '@babel/template';

const options = {};

module.exports = () => {
  return {
    visitor: {
      ClassDeclaration(path) {
        const ast = templateAst(
          `const ${path.node.id.name} = GObject.registerClass()`
        );
        if (
          path.parent.type !== 'CallExpression' ||
          path.parent.callee?.property?.name !== 'registerClass'
        ) {
          ast.declarations[0].init.arguments.push({ ...path.node });
          path.replaceWith(ast);
        }
      }
    }
  };
};

function templateAst(code, codePath = '') {
  if (Array.isArray(codePath)) {
    codePath = _.flattenDeep(codePath)
      .filter(s => s.length)
      .join('.');
  }
  if (codePath) return _.get(template.ast(code, options), codePath);
  return template.ast(code, options);
}
