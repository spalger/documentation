var namedTypes = {
  'NumberTypeAnnotation': 'number',
  'BooleanTypeAnnotation': 'boolean',
  'ObjectTypeAnnotation': 'Object',
  'StringTypeAnnotation': 'string'
};

var oneToOne = {
  'AnyTypeAnnotation': {
    type: 'AllLiteral'
  }
};

var literalTypes = {
  'StringLiteralTypeAnnotation': 'StringLiteral',
  'NumberLiteralTypeAnnotation': 'NumberLiteral',
  'BooleanLiteralTypeAnnotation': 'BooleanLiteral'
};

function flowDoctrine(type) {

  if (type.type in namedTypes) {
    return {
      type: 'NameExpression',
      name: namedTypes[type.type]
    };
  }

  if (type.type in oneToOne) {
    return oneToOne[type.type];
  }

  if (type.type === 'NullableTypeAnnotation') {
    return {
      type: 'OptionalType',
      expression: flowDoctrine(type.typeAnnotation)
    };
  }

  if (type.type === 'UnionTypeAnnotation') {
    return {
      type: 'UnionType',
      elements: type.types.map(flowDoctrine)
    };
  }

  if (type.type === 'GenericTypeAnnotation') {

    if (type.typeParameters) {
      return {
        type: 'TypeApplication',
        expression: {
          type: 'NameExpression',
          name: type.id.name
        },
        applications: type.typeParameters.params.map(flowDoctrine)
      };
    }

    return {
      type: 'NameExpression',
      name: type.id.name
    };
  }

  if (type.type in literalTypes) {
    return {
      type: literalTypes[type.type],
      name: type.value
    };
  }
}

module.exports = flowDoctrine;
