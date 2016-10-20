export function Controller(properties: Object) {
    return (target: Object) => {
        target['_metadata'] = properties;
    }
}

export function Route(properties: Object) {
    return function(target, propertyKey: string, description: PropertyDescriptor) {
        target[propertyKey]._metadata = properties;
    }
}